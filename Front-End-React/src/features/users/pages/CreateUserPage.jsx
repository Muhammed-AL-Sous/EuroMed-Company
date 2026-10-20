// React
import { useCallback, useRef, useState } from "react";

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
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "doctor",
    doctor: {
      name: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  // ========= Refs ========= //
  const passwordRef = useRef(null);
  const passwordConfirmationRef = useRef(null);

  // =============================
  // Toggle Password (Professional Fix)
  // =============================
  const togglePassword = useCallback((e) => {
    // منع سحب التركيز (يمنع اختفاء الكيبورد)
    e.preventDefault();

    const input = passwordRef.current;
    if (!input) return;

    // حفظ مكان المؤشر بدقة قبل التغيير
    const start = input.selectionStart;
    const end = input.selectionEnd;

    setShowPassword((prev) => !prev);

    // إعادة التركيز والمؤشر فوراً (بدون setTimeout إذا استخدمت onMouseDown)
    requestAnimationFrame(() => {
      input.setSelectionRange(start, end);
      input.focus();
    });
  }, []);

  // =============================
  // Toggle Password Confirmation (Professional Fix)
  // =============================
  const togglePasswordConfirmation = useCallback((e) => {
    // منع سحب التركيز (يمنع اختفاء الكيبورد)
    e.preventDefault();

    const input = passwordConfirmationRef.current;
    if (!input) return;

    // حفظ مكان المؤشر بدقة قبل التغيير
    const start = input.selectionStart;
    const end = input.selectionEnd;

    setShowPasswordConfirmation((prev) => !prev);

    // إعادة التركيز والمؤشر فوراً (بدون setTimeout إذا استخدمت onMouseDown)
    requestAnimationFrame(() => {
      input.setSelectionRange(start, end);
      input.focus();
    });
  }, []);

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

  const handleSubmitManufacturer = async (e) => {
    e.preventDefault();

    try {
      await createUser(createForm).unwrap();

      setCreateForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "doctor",
        doctor: {
          name: "",
        },
      });

      notifySonner("User Added Successfully");
    } catch (error) {
      console.error("Failed to add User:", error);
      notifySonner(error?.data?.message || "Failed to add User", "error");
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
              <Form.Root className="w-full" onSubmit={handleSubmitManufacturer}>
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
                        <LockKeyhole size="17px" />
                        Password
                      </Form.Label>
                      <Form.Control asChild>
                        <div className="relative">
                          <input
                            className="box-border h-8.75 w-full rounded px-2.5 text-[14px] leading-none text-slate-700 outline-none selection:text-slate-700 border-2 border-sky-700 focus:border-sky-400"
                            id="user-password"
                            ref={passwordRef}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            inputMode="text"
                            style={{
                              letterSpacing:
                                !showPassword && createForm.password.length > 0
                                  ? "0.2em"
                                  : "normal",
                            }}
                            value={createForm.password}
                            onChange={handleCreateFormChange}
                            disabled={isCreating}
                            placeholder="••••••••"
                            required
                          />
                          <button
                            type="button"
                            onMouseDown={togglePassword}
                            className="absolute top-1/2 -translate-y-1/2 right-4 outline-none"
                            style={{
                              cursor: "pointer",
                              zIndex: 10,
                              color: "#6c757d",
                              fontSize: "18px",
                            }}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The User Password
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid User Password
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
                        <Lock size="17px" />
                        Confirm Password
                      </Form.Label>
                      <Form.Control asChild>
                        <div className="relative">
                          <input
                            className="box-border h-8.75 w-full rounded px-2.5 text-[14px] leading-none text-slate-700 outline-none selection:text-slate-700 border-2 border-sky-700 focus:border-sky-400"
                            id="confirm-user-password"
                            ref={passwordConfirmationRef}
                            name="password_confirmation"
                            type={
                              showPasswordConfirmation ? "text" : "password"
                            }
                            autoComplete="password_confirmation"
                            inputMode="text"
                            style={{
                              letterSpacing:
                                !showPasswordConfirmation &&
                                createForm.password_confirmation.length > 0
                                  ? "0.2em"
                                  : "normal",
                            }}
                            value={createForm.password_confirmation}
                            onChange={handleCreateFormChange}
                            disabled={isCreating}
                            placeholder="••••••••"
                            required
                          />

                          <button
                            type="button"
                            onMouseDown={togglePasswordConfirmation}
                            className="absolute top-1/2 -translate-y-1/2 right-4 outline-none"
                            style={{
                              cursor: "pointer",
                              zIndex: 10,
                              color: "#6c757d",
                              fontSize: "18px",
                            }}
                          >
                            {showPasswordConfirmation ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Confirm User Password
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid Confirm User Password
                      </Form.Message>
                    </div>
                  </Form.Field>

                  {/* =========== Doctor Profile =========== */}
                  <Form.Field className="mb-2.5 grid" name="doctor.name">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] flex gap-0.5 items-center font-medium leading-8.75 text-slate-700">
                        <User size={17} />
                        Doctor Name
                      </Form.Label>

                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded px-2.5 text-[14px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
                          id="doctor-user-profile"
                          name="doctor.name"
                          value={createForm.doctor.name}
                          onChange={handleCreateFormChange}
                          disabled={isCreating}
                          type="text"
                          placeholder="Enter Doctor Name"
                          required
                        />
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Doctor Name
                      </Form.Message>
                    </div>
                  </Form.Field>
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
