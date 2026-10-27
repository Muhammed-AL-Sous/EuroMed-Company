import { useRef, useState } from "react";

// External Libraries
// Radix UI
import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Form } from "radix-ui";

// Lucide React Library
import {
  LockKeyhole,
  Mail,
  UserRoundPlus,
  Lock,
  Eye,
  EyeOff,
  Save,
  UserCog,
} from "lucide-react";

import {
  useUpdateUserMutation,
  useGetCurrentUserQuery,
} from "../UsersApiSlice";

// Notifications
import { notifySonner } from "../../../lib/notifySonner";

const INPUT_CLASS =
  "box-border w-full rounded-xl border-2 border-sky-700 " +
  "bg-slate-50 px-4 py-2.5 text-sm text-slate-700 " +
  "outline-none transition-colors " +
  "placeholder:text-slate-400 " +
  "focus:border-sky-400 focus:bg-white " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const UpdateUserPage = () => {
  const { data: currentUser } = useGetCurrentUserQuery();

  const createEmptyEditForm = () => ({
    name: null,
    email: null,
    password: "",
    password_confirmation: "",
  });

  // ==================================================
  // Edit State
  // ==================================================
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
      input.focus({ preventScroll: true });

      if (start !== null && end !== null) {
        input.setSelectionRange(start, end);
      }
    });
  };

  // ==================================================
  // Edit Form Change
  // ==================================================

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

  // ==================================================
  // Update User
  // ==================================================

  const handleUpdateUser = async () => {
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

  return (
    <>
      {/* ============= Header ============= */}
      <div className="flex gap-3 items-center text-sky-600">
        <UserCog size={35} strokeWidth={2.5} />
        <Text className="font-bold text-2xl">Edit Account</Text>
      </div>
      {/* ============= Section ============= */}
      <Box className="mx-auto border-none outline-none" maxWidth="900px">
        <Card variant="ghost" className="border-none outline-none">
          <Flex gap="3" direction="column">
            <Box className="max-w-full border border-slate-200 shadow-lg rounded-2xl p-5">
              <Form.Root className="w-full" onSubmit={handleUpdateUser}>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 space-y-4">
                  {/* =========== User Name =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="name"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <UserRoundPlus size="17px" />
                      User Name
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
                        required
                        id="user-name"
                        name="name"
                        type="text"
                        value={editForm.name ?? currentUser?.name ?? ""}
                        onChange={handleEditFormChange}
                        disabled={isUpdating}
                        placeholder="Enter User Name"
                      />
                    </Form.Control>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="valueMissing"
                    >
                      Please Enter The User Name
                    </Form.Message>
                    <Form.Message
                      className="text-[13px] text-red-700 opacity-80"
                      match="typeMismatch"
                    >
                      Please Provide a Valid User Name
                    </Form.Message>
                  </Form.Field>

                  {/* =========== User Email =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="email"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Mail size="17px" />
                      Email
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
                        id="user-email"
                        name="email"
                        type="email"
                        value={editForm.email ?? currentUser?.email ?? ""}
                        onChange={handleEditFormChange}
                        disabled={isUpdating}
                        placeholder="Enter User Email"
                        required
                      />
                    </Form.Control>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="valueMissing"
                    >
                      Please Enter The User Email
                    </Form.Message>
                    <Form.Message
                      className="text-[13px] text-red-700 opacity-80"
                      match="typeMismatch"
                    >
                      Please Provide a Valid User Email
                    </Form.Message>
                  </Form.Field>

                  {/* =========== User PassWord =========== */}

                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="password"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <LockKeyhole size={17} />
                      Password
                    </Form.Label>

                    <div className="relative">
                      <Form.Control asChild>
                        <input
                          ref={passwordRef}
                          id="user-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          minLength={8}
                          value={editForm.password}
                          onChange={handleEditFormChange}
                          disabled={isUpdating}
                          placeholder="••••••••"
                          className={INPUT_CLASS}
                        />
                      </Form.Control>

                      <button
                        type="button"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() =>
                          togglePasswordVisibility(passwordRef, setShowPassword)
                        }
                        disabled={isUpdating}
                        className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer text-slate-500 hover:text-sky-600"
                      >
                        {showPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="valueMissing"
                    >
                      Please Enter The User Password
                    </Form.Message>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="tooShort"
                    >
                      Password Must Contain At Least 8 Characters
                    </Form.Message>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match={(value) =>
                        value.length > 0 &&
                        (!/\p{L}/u.test(value) || !/\p{N}/u.test(value))
                      }
                    >
                      Password Must Contain At Least One Letter And One Number
                    </Form.Message>
                  </Form.Field>

                  {/* =========== Confirm User Password =========== */}

                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="password_confirmation"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Lock size={17} />
                      Confirm Password
                    </Form.Label>

                    <div className="relative">
                      <Form.Control asChild>
                        <input
                          ref={passwordConfirmationRef}
                          id="confirm-user-password"
                          name="password_confirmation"
                          type={showPasswordConfirmation ? "text" : "password"}
                          autoComplete="new-password"
                          value={editForm.password_confirmation}
                          onChange={handleEditFormChange}
                          disabled={isUpdating}
                          placeholder="••••••••"
                          className={INPUT_CLASS}
                        />
                      </Form.Control>

                      <button
                        type="button"
                        aria-label={
                          showPasswordConfirmation
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        aria-pressed={showPasswordConfirmation}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() =>
                          togglePasswordVisibility(
                            passwordConfirmationRef,
                            setShowPasswordConfirmation,
                          )
                        }
                        disabled={isUpdating}
                        className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer text-slate-500 hover:text-sky-600"
                      >
                        {showPasswordConfirmation ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="valueMissing"
                    >
                      Please Confirm Your Password
                    </Form.Message>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match={(value, formData) =>
                        value.length > 0 && value !== formData.get("password")
                      }
                    >
                      Passwords Do Not Match
                    </Form.Message>
                  </Form.Field>
                </div>

                {/* =============== Submit Button =============== */}
                {isUpdating ? (
                  <div
                    role="status"
                    aria-label="Creating manufacturer"
                    className="mx-auto mt-2.5 h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600"
                  />
                ) : (
                  <Form.Submit asChild>
                    <button
                      disabled={isUpdating}
                      className="flex mx-auto mt-6 cursor-pointer min-h-10 min-w-44 items-center justify-center gap-2 rounded-lg bg-sky-700 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save size={18} />
                      Edit Account
                    </button>
                  </Form.Submit>
                )}
              </Form.Root>
            </Box>
          </Flex>
        </Card>
      </Box>
    </>
  );
};

export default UpdateUserPage;
