import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useReactToPrint } from "react-to-print";
import { useVerifyPatientOperationMutation } from "../features/patients/PatientOperationApiSlice";
import reportCss from "./OperationReport.css?inline";

const getErrorMessage = (error) =>
  error?.data?.message ||
  "We couldn't find an operation matching the provided information. Please check the operation code and date.";

const collectStyles = () =>
  Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch {
        return "";
      }
    })
    .join("\n");

const useOperationDetailsPageLogic = () => {
  const [searchParams] = useSearchParams();
  const urlCode = searchParams.get("code") || "";
  const urlDate = searchParams.get("date") || "";
  const [code, setCode] = useState(urlCode);
  const [date, setDate] = useState(urlDate);
  const [errorMessage, setErrorMessage] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [operationData, setOperationData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef(null);
  const requestVersion = useRef(0);
  const downloadLock = useRef(false);
  const [verifyPatientOperation, { isLoading }] =
    useVerifyPatientOperationMutation();

  const handleVerify = async (event) => {
    event.preventDefault();
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode || !date || isLoading) return;
    const version = ++requestVersion.current;
    setErrorMessage("");
    setPdfError("");
    setOperationData(null);
    try {
      const response = await verifyPatientOperation({
        code: normalizedCode,
        date,
      }).unwrap();
      if (requestVersion.current !== version) return;
      if (response?.status && response?.data) setOperationData(response.data);
      else setErrorMessage(response?.message || getErrorMessage(null));
    } catch (error) {
      if (requestVersion.current === version)
        setErrorMessage(getErrorMessage(error));
    }
  };

  useEffect(() => {
    const normalizedCode = urlCode.trim().toUpperCase();

    if (!normalizedCode || !urlDate) return;

    const version = ++requestVersion.current;

    const request = verifyPatientOperation({
      code: normalizedCode,
      date: urlDate,
    });

    request
      .unwrap()
      .then((response) => {
        if (requestVersion.current !== version) return;

        setPdfError("");

        if (response?.status && response?.data) {
          setOperationData(response.data);
          setErrorMessage("");
        } else {
          setOperationData(null);
          setErrorMessage(response?.message || getErrorMessage(null));
        }
      })
      .catch((error) => {
        if (requestVersion.current !== version) return;

        setOperationData(null);
        setPdfError("");
        setErrorMessage(getErrorMessage(error));
      });

    return () => {
      if (requestVersion.current === version) {
        requestVersion.current += 1;
      }

      request.abort();
    };
  }, [urlCode, urlDate, verifyPatientOperation]);

  const documentTitle = operationData
    ? `Operation-${operationData.patient_access_code}`
    : "Operation-Certificate";

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle,
    pageStyle: reportCss,
    onPrintError: () =>
      setPdfError("Failed to print the report. Please try again."),
  });

  const handleDownloadPdf = async () => {
    if (!printRef.current || !operationData || downloadLock.current) return;
    downloadLock.current = true;
    setIsDownloading(true);
    setPdfError("");
    const version = requestVersion.current;
    let objectUrl;
    let anchor;
    try {
      const clone = printRef.current.cloneNode(true);
      clone.classList.add("pdf-export");
      clone.querySelectorAll("img").forEach((img) => {
        img.loading = "eager";
      });
      const response = await fetch("/api/operations/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
        },
        body: JSON.stringify({
          html: clone.outerHTML,
          css: `${collectStyles()}\n${reportCss}`,
        }),
      });
      if (
        !response.ok ||
        !response.headers.get("content-type")?.includes("application/pdf")
      ) {
        throw new Error("Invalid PDF response");
      }
      const blob = await response.blob();
      if (requestVersion.current !== version) return;
      objectUrl = URL.createObjectURL(blob);
      anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `${documentTitle}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
    } catch (error) {
      console.error("PDF generation error:", error);
      if (requestVersion.current === version)
        setPdfError("Failed to download PDF. Please try again.");
    } finally {
      anchor?.remove();
      if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
      downloadLock.current = false;
      setIsDownloading(false);
    }
  };

  return {
    code,
    setCode,
    date,
    setDate,
    errorMessage,
    pdfError,
    operationData,
    isDownloading,
    printRef,
    isLoading,
    handleVerify,
    handlePrint,
    handleDownloadPdf,
  };
};

export default useOperationDetailsPageLogic;
