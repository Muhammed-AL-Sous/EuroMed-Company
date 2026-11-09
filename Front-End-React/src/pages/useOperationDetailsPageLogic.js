import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useReactToPrint } from "react-to-print";
import { useVerifyPatientOperationMutation } from "../features/patients/PatientOperationApiSlice";

const useOperationDetailsPageLogic = () => {
  const getErrorMessage = (error) =>
    error?.data?.message ||
    "We couldn't find an operation matching the provided information. Please check the operation code and date.";

  const [searchParams] = useSearchParams();
  const urlCode = searchParams.get("code") || "";
  const urlDate = searchParams.get("date") || "";
  const [code, setCode] = useState(urlCode);
  const [date, setDate] = useState(urlDate);
  const [errorMessage, setErrorMessage] = useState("");
  const [operationData, setOperationData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef(null);
  const requestVersion = useRef(0);

  const [verifyPatientOperation, { isLoading }] =
    useVerifyPatientOperationMutation();

  const handleVerify = async (event) => {
    event.preventDefault();
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode || !date || isLoading) return;
    const version = ++requestVersion.current;
    setErrorMessage("");
    setOperationData(null);

    try {
      const response = await verifyPatientOperation({
        code: normalizedCode,
        date,
      }).unwrap();
      if (requestVersion.current !== version) return;
      if (response?.status && response?.data) {
        setOperationData(response.data);
      } else {
        setErrorMessage(response?.message || getErrorMessage(null));
      }
    } catch (error) {
      if (requestVersion.current === version) {
        setErrorMessage(getErrorMessage(error));
      }
    }
  };

  useEffect(() => {
    if (!urlCode.trim() || !urlDate) return;
    const version = ++requestVersion.current;
    const request = verifyPatientOperation({
      code: urlCode.trim().toUpperCase(),
      date: urlDate,
    });

    request
      .unwrap()
      .then((response) => {
        if (requestVersion.current !== version) return;
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
        setErrorMessage(getErrorMessage(error));
      });

    return () => {
      if (requestVersion.current === version) requestVersion.current += 1;
      request.abort();
    };
  }, [urlCode, urlDate, verifyPatientOperation]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: operationData
      ? `Operation-${operationData.patient_access_code}`
      : "Operation-Certificate",
    pageStyle: `
    @page {
      size: A4 portrait;
      margin: 10mm;
    }

    @media print {
      html, body {
        margin: 0;
        padding: 0;
        height: auto;
        overflow: visible;
      }
    }
  `,
  });

  const handleDownloadPdf = async () => {
    if (!printRef.current || !operationData || isDownloading) return;
    setIsDownloading(true);
    setErrorMessage("");
    let objectUrl;

    try {
      const contentHtml = printRef.current.cloneNode(true).outerHTML;
      const stylesheets = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join("\n");
          } catch {
            // Cross-origin stylesheets cannot be read by the browser.
            return "";
          }
        })
        .join("\n");

      const response = await fetch("/api/operations/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html: contentHtml,
          css: stylesheets,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `Operation-${operationData.patient_access_code}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch (error) {
      console.error("PDF generation error:", error);
      setErrorMessage("Failed to download PDF. Please try again.");
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setIsDownloading(false);
    }
  };

  return {
    code,
    setCode,
    date,
    setDate,
    errorMessage,
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
