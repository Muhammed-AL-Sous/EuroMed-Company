// React
import { useState } from "react";

// Contact API Slice
import { useSendContactMessageMutation } from "../features/contacts/ContactApiSlice";

const INITIAL_FORM = {
  name: "",
  phone: "",
  email: "",
  subject: "Product Inquiry / Hospital Supply",
  message: "",
};

const useContactPageLogic = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [sendContactMessage, { isLoading: isSending }] =
    useSendContactMessageMutation();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    try {
      await sendContactMessage(form).unwrap();

      setSubmitted(true);
      setForm(INITIAL_FORM);
    } catch (error) {
      if (error?.status === 429) {
        setErrorMessage("Too many requests. Please try again later.");
        return;
      }

      setErrorMessage(
        error?.data?.message ||
          "Unable to send your message. Please try again.",
      );
    }
  };
  return {
    form,
    submitted,
    errorMessage,
    isSending,
    handleChange,
    handleSubmit,
  };
};

export default useContactPageLogic;
