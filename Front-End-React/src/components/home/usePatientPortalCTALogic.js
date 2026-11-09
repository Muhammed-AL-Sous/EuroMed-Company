import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
const usePatientPortalCTALogic = () => {
  const [code, setCode] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState({
    errorsCode: "",
    errorsDate: "",
  });
  const navigate = useNavigate();
  const dateNow = useMemo(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day} / ${month} / ${year}`;
  }, []);
  const patientDetailsValidation = () => {
    const trimmedCode = code.trim();
    const trimmedDate = date.trim();
    const newErrors = {
      errorsCode: "",
      errorsDate: "",
    };

    // Validate Operation Code
    if (!trimmedCode) {
      newErrors.errorsCode = "Please Enter Your Operation Code";
    }

    // Validate Operation Date
    if (!trimmedDate) {
      newErrors.errorsDate = "Please Enter Your Operation Date";
    }

    // Update errors once
    setErrors(newErrors);

    // Return true only if there are no errors
    return !newErrors.errorsCode && !newErrors.errorsDate;
  };
  const handleQuickSubmit = (e) => {
    e.preventDefault();
    const isValid = patientDetailsValidation();
    if (!isValid) return;
    const trimmedCode = code.trim();
    const trimmedDate = date.trim();
    navigate(
      `/operation-details?code=${encodeURIComponent(trimmedCode)}&date=${encodeURIComponent(trimmedDate)}`,
    );
  };
  const handleCodeChange = (e) => {
    const value = e.target.value;
    setCode(value);

    // Remove error when user starts correcting the field
    if (errors.errorsCode) {
      setErrors((prev) => ({
        ...prev,
        errorsCode: "",
      }));
    }
  };
  const handleDateChange = (e) => {
    const value = e.target.value;
    setDate(value);

    // Remove error when user selects a date
    if (errors.errorsDate) {
      setErrors((prev) => ({
        ...prev,
        errorsDate: "",
      }));
    }
  };
  return {
    code,
    date,
    errors,
    dateNow,
    handleQuickSubmit,
    handleCodeChange,
    handleDateChange,
  };
};
export default usePatientPortalCTALogic;
