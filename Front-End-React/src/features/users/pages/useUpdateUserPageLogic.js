import { useRef, useState } from "react";
import {
  useUpdateUserMutation,
  useGetCurrentUserQuery,
} from "../UsersApiSlice";
import { notifySonner } from "../../../lib/notifySonner";

const useUpdateUserPageLogic = () => {
  const { data: currentUser } = useGetCurrentUserQuery();

  const createEmptyEditForm = () => ({
    name: null,
    email: null,
    password: "",
    password_confirmation: "",
  });

  const [editForm, setEditForm] = useState(createEmptyEditForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
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

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditForm((currentForm) => {
      // Normal User Fields
      return {
        ...currentForm,
        [name]: value,
      };
    });
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    if (isUpdating || !currentUser) return;

    // ----------------------------------------------
    // Normalize Input
    // ----------------------------------------------

    const name = (editForm.name ?? currentUser?.name ?? "").trim();
    const email = (editForm.email ?? currentUser?.email ?? "").trim();
    const password = editForm.password;
    const passwordConfirmation = editForm.password_confirmation;

    // ----------------------------------------------
    // Validation
    // ----------------------------------------------

    const errors = {};
    if (!name) {
      errors.name = "The Name Field is Required";
    }
    if (!email) {
      errors.email = "The Email Field is Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password is optional
    if (password || passwordConfirmation) {
      if (!password) {
        errors.password = "The Password Field is Required";
      } else if (password !== passwordConfirmation) {
        errors.password_confirmation =
          "The Password Confirmation does not match";
      }
    }

    // ----------------------------------------------
    // Original Values
    // ----------------------------------------------

    const originalName = currentUser.name ?? "";
    const originalEmail = currentUser.email ?? "";

    // ----------------------------------------------
    // Detect Changes
    // ----------------------------------------------

    const nameChanged = name !== originalName;
    const emailChanged = email !== originalEmail;
    const passwordChanged = Boolean(password);
    const hasChanges = nameChanged || emailChanged || passwordChanged;
    if (!hasChanges) return;

    // ----------------------------------------------
    // Build Payload
    // ----------------------------------------------

    const payload = {};
    if (nameChanged) {
      payload.name = name;
    }
    if (emailChanged) {
      payload.email = email;
    }

    // Send password only if provided
    if (passwordChanged) {
      payload.password = password;
      payload.password_confirmation = passwordConfirmation;
    }

    // ----------------------------------------------
    // Update Request
    // ----------------------------------------------

    try {
      await updateUser({
        id: currentUser.id,
        data: payload,
      }).unwrap();
      notifySonner("User Updated Successfully");
    } catch (error) {
      console.error("Failed to Update User:", error);
      notifySonner(error?.data?.message || "Failed to Update User", "error");
    }
  };

  return {
    currentUser,
    editForm,
    showPassword,
    setShowPassword,
    showPasswordConfirmation,
    setShowPasswordConfirmation,
    isUpdating,
    passwordRef,
    passwordConfirmationRef,
    togglePasswordVisibility,
    handleEditFormChange,
    handleUpdateUser,
  };
};

export default useUpdateUserPageLogic;
