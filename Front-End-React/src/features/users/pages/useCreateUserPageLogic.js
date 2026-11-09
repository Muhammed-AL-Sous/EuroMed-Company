import { useRef, useState } from "react";
import { notifySonner } from "../../../lib/notifySonner";
import { useCreateUserMutation } from "../UsersApiSlice";

const useCreateUserPageLogic = () => {
  const initialCreateForm = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "staff",
    doctor: {
      name: "",
    },
  };

  const [createForm, setCreateForm] = useState(initialCreateForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const passwordRef = useRef(null);
  const passwordConfirmationRef = useRef(null);

  const togglePasswordVisibility = (inputRef, setVisible) => {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    setVisible((previous) => !previous);
    requestAnimationFrame(() => {
      input.focus({
        preventScroll: true,
      });
      if (start !== null && end !== null) {
        input.setSelectionRange(start, end);
      }
    });
  };

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const handleCreateFormChange = (event) => {
    const { name, value } = event.target;
    setCreateForm((currentForm) => {
      if (name === "doctor.name") {
        return {
          ...currentForm,
          doctor: {
            ...currentForm.doctor,
            name: value,
          },
        };
      }
      return {
        ...currentForm,
        [name]: value,
      };
    });
  };

  const handleSubmitUser = async (event) => {
    event.preventDefault();
    if (createForm.password !== createForm.password_confirmation) {
      notifySonner("Passwords Do Not Match", "error");
      return;
    }

    // Basic User Data
    const payload = {
      name: createForm.name.trim(),
      email: createForm.email.trim(),
      password: createForm.password,
      password_confirmation: createForm.password_confirmation,
      role: createForm.role,
    };

    // Add Doctor Profile Only For Doctor Role
    if (createForm.role === "doctor" && createForm.doctor.name.trim() !== "") {
      payload.doctor = {
        name: createForm.doctor.name.trim(),
      };
    }
    try {
      await createUser(payload).unwrap();
      setCreateForm(initialCreateForm);
      setShowPassword(false);
      setShowPasswordConfirmation(false);
      notifySonner("User Added Successfully");
    } catch (error) {
      console.error("Failed to add User:", error);
      const validationErrors = error?.data?.errors;
      const firstError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;
      notifySonner(
        firstError || error?.data?.message || "Failed to add User",
        "error",
      );
    }
  };

  return {
    createForm,
    showPassword,
    setShowPassword,
    showPasswordConfirmation,
    setShowPasswordConfirmation,
    passwordRef,
    passwordConfirmationRef,
    togglePasswordVisibility,
    isCreating,
    handleCreateFormChange,
    handleSubmitUser,
  };
};

export default useCreateUserPageLogic;
