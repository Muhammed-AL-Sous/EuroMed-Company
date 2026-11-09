import { Box, Card, Em, Flex } from "@radix-ui/themes";
import { Form } from "radix-ui";
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
import useUpdateUserPageLogic from "./useUpdateUserPageLogic.js";

const INPUT_CLASS =
  "box-border w-full rounded-xl border-2 border-sky-700 " +
  "bg-slate-50 px-4 py-2.5 text-sm text-slate-700 " +
  "outline-none transition-colors " +
  "placeholder:text-slate-400 " +
  "focus:border-sky-400 focus:bg-white " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const UpdateUserPage = () => {
  const {
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
  } = useUpdateUserPageLogic();

  return (
    <>
      {/* ============= Header ============= */}
      <div className="flex gap-3 items-center font-bold text-lg sm:text-xl md:text-2xl text-sky-600">
        <UserCog size={35} strokeWidth={2.5} />
        <Em>Edit Account</Em>
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
