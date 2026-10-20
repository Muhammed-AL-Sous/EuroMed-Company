// React
import { useRef, useState } from "react";

// External Libraries
// Radix UI
import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Form } from "radix-ui";

// Lucide React Library
import {
  Church,
  LockKeyhole,
  Mail,
  UserRoundPlus,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

// Notify Sonner
import { notifySonner } from "../../../lib/notifySonner";

// Api Slice
import { useCreateUserMutation } from "../UsersApiSlice";

const CreateUserPage = () => {
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

  // ========= Refs ========= //
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

  return (
    <div>
      {/* ============= Header ============= */}
      <div className="flex gap-4 items-center text-sky-600">
        <Church size={55} />
        <Text className="font-bold text-2xl">Create a New User</Text>
      </div>
      {/* ============= Section ============= */}
      <Box className="mx-auto border-none outline-none" maxWidth="900px">
        <Card variant="ghost" className="border-none outline-none">
          <Flex gap="3" direction="column">
            <img className="max-h-80 mx-auto" src="/images/create_user.png" />

            <Box className="max-w-full border border-slate-200 shadow-lg rounded-2xl p-5 ">
              <Form.Root className="w-full" onSubmit={handleSubmitUser}>
                <div className="grid sm:grid-cols-1 md:grid-cols-2  gap-4">
                  {/* =========== User Name =========== */}
                  <Form.Field className="mb-2.5 grid" name="name">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] flex gap-0.5 items-center font-medium leading-8.75 text-slate-700">
                        <UserRoundPlus size="17px" />
                        User Name
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded bg-blackA2 px-2.5 text-[14px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
                          required
                          id="user-name"
                          name="name"
                          type="text"
                          value={createForm.name}
                          onChange={handleCreateFormChange}
                          disabled={isCreating}
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
                    </div>
                  </Form.Field>

                  {/* =========== User Email =========== */}
                  <Form.Field className="mb-2.5 grid" name="email">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] flex gap-0.5 items-center font-medium leading-8.75 text-slate-700">
                        <Mail size="17px" />
                        Email
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded px-2.5 text-[14px] leading-none text-slate-700 outline-none selection:text-slate-700 border-2 border-sky-700 focus:border-sky-400"
                          id="user-email"
                          name="email"
                          type="email"
                          value={createForm.email}
                          onChange={handleCreateFormChange}
                          disabled={isCreating}
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
                    </div>
                  </Form.Field>

                  {/* =========== User PassWord =========== */}

                  <Form.Field className="mb-2.5 grid" name="password">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] flex gap-0.5 items-center font-medium leading-8.75 text-slate-700">
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
                            required
                            value={createForm.password}
                            onChange={handleCreateFormChange}
                            disabled={isCreating}
                            placeholder="••••••••"
                            className="box-border h-8.75 w-full rounded px-2.5 pr-12 text-[14px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
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
                            togglePasswordVisibility(
                              passwordRef,
                              setShowPassword,
                            )
                          }
                          disabled={isCreating}
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
                    </div>
                  </Form.Field>

                  {/* =========== Confirm User Password =========== */}

                  <Form.Field
                    className="mb-2.5 grid"
                    name="password_confirmation"
                  >
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] flex gap-0.5 items-center font-medium leading-8.75 text-slate-700">
                        <Lock size={17} />
                        Confirm Password
                      </Form.Label>

                      <div className="relative">
                        <Form.Control asChild>
                          <input
                            ref={passwordConfirmationRef}
                            id="confirm-user-password"
                            name="password_confirmation"
                            type={
                              showPasswordConfirmation ? "text" : "password"
                            }
                            autoComplete="new-password"
                            required
                            value={createForm.password_confirmation}
                            onChange={handleCreateFormChange}
                            disabled={isCreating}
                            placeholder="••••••••"
                            className="box-border h-8.75 w-full rounded px-2.5 pr-12 text-[14px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
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
                          disabled={isCreating}
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
                    </div>
                  </Form.Field>

                  {/* =========== User Role =========== */}
                  <div className="mb-2.5 flex flex-col">
                    <label
                      htmlFor="user-role"
                      className="text-[15px] flex gap-0.5 items-center font-medium leading-8.75 text-slate-700"
                    >
                      <User size={17} />
                      User Role
                    </label>

                    <select
                      id="user-role"
                      name="role"
                      value={createForm.role}
                      onChange={(event) => {
                        const selectedRole = event.currentTarget.value;

                        setCreateForm((currentForm) => ({
                          ...currentForm,
                          role: selectedRole,
                        }));
                      }}
                      disabled={isCreating}
                      required
                      className="box-border h-8.75 w-full rounded px-2.5 text-[14px] text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
                    >
                      <option value="staff">Staff</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {/* =========== Doctor Profile =========== */}
                  {createForm.role === "doctor" && (
                    <Form.Field className="mb-2.5 grid" name="doctor.name">
                      <div className="flex flex-col">
                        <Form.Label className="text-[15px] flex gap-0.5 items-center font-medium leading-8.75 text-slate-700">
                          <User size={17} />
                          Doctor Name
                        </Form.Label>

                        <Form.Control asChild>
                          <input
                            className="box-border mb-1 h-8.75 w-full rounded px-2.5 text-[14px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
                            id="doctor-user-profile"
                            name="doctor.name"
                            value={createForm.doctor.name}
                            onChange={handleCreateFormChange}
                            disabled={isCreating}
                            type="text"
                            placeholder="Enter Doctor Name"
                            maxLength={255}
                          />
                        </Form.Control>

                        <Text className="text-gray-600 mx-auto text-center font-bold text-[11px]" >
                          Optional : Leave Empty to Create The Doctor Account
                          Without a Profile.
                        </Text>
                      </div>
                    </Form.Field>
                  )}
                </div>

                {/* =============== Submit Button =============== */}
                {isCreating ? (
                  <div
                    role="status"
                    aria-label="Creating manufacturer"
                    className="mx-auto mt-2.5 h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600"
                  />
                ) : (
                  <Form.Submit asChild>
                    <button
                      disabled={isCreating}
                      className="mt-4.5 cursor-pointer box-border mx-auto flex h-8.75 items-center justify-center rounded bg-white px-3.75 font-medium leading-none text-sky-700 shadow-[0_2px_10px] shadow-blackA4 hover:bg-sky-200 transition-colors focus:shadow-sky-700"
                    >
                      Create a User
                    </button>
                  </Form.Submit>
                )}
              </Form.Root>
            </Box>
          </Flex>
        </Card>
      </Box>
    </div>
  );
};

export default CreateUserPage;
