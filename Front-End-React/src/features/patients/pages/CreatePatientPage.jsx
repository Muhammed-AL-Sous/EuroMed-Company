// React
import { useState } from "react";

// External Library
import { Box, Card, Flex, Text } from "@radix-ui/themes";
import {
  Church,
  Save,
  UserRound,
  Phone,
  CalendarArrowUp,
  CalendarDays,
  Transgender,
} from "lucide-react";
import { Form } from "radix-ui";
import { notifySonner } from "../../../lib/notifySonner";

// Api Slice
import { useAddPatientMutation } from "../PatientsApiSlice";

const INPUT_CLASS =
  "box-border w-full rounded-xl border-2 border-sky-700 " +
  "bg-slate-50 px-4 py-2.5 text-sm text-slate-700 " +
  "outline-none transition-colors " +
  "placeholder:text-slate-400 " +
  "focus:border-sky-400 focus:bg-white " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const CreatePatientPage = () => {
  const [createForm, setCreateForm] = useState({
    name: "",
    phone: "",
    age: "",
    date_of_birth: "",
    gender: "",
  });

  const [addPatient, { isLoading: isCreating }] = useAddPatientMutation();

  const handleCreateFormChange = (event) => {
    const { name, value } = event.target;

    setCreateForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmitPatient = async (e) => {
    e.preventDefault();

    try {
      await addPatient(createForm).unwrap();

      setCreateForm({
        name: "",
        phone: "",
        age: "",
        date_of_birth: "",
        gender: "",
      });

      notifySonner("Patient Added Successfully");
    } catch (error) {
      console.error("Failed to add Patient:", error);
      notifySonner(error?.data?.message || "Failed to add Patient", "error");
    }
  };

  return (
    <div>
      {/* ============= Header ============= */}
      <div className="flex gap-4 items-center text-sky-600">
        <Church size={55} />
        <Text className="font-bold text-2xl">Create a New Patient</Text>
      </div>
      {/* ============= Section ============= */}
      <Box className="mx-auto border-none outline-none" maxWidth="900px">
        <Card variant="ghost" className="border-none outline-none">
          <Flex gap="3" direction="column">
            <img
              className="max-h-80 mx-auto"
              src="/images/create_patient.png"
            />

            <Box className="max-w-full border border-slate-200 shadow-lg rounded-2xl p-5 ">
              <Form.Root className="w-full" onSubmit={handleSubmitPatient}>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* =========== Patient Name =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="name"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <UserRound size={16} />
                      Patient Name
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
                        required
                        id="Patient-name"
                        name="name"
                        type="text"
                        value={createForm.name}
                        onChange={handleCreateFormChange}
                        disabled={isCreating}
                        placeholder="Enter Patient name"
                      />
                    </Form.Control>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="valueMissing"
                    >
                      Please Enter The Patient Name
                    </Form.Message>
                    <Form.Message
                      className="text-[13px] text-red-700 opacity-80"
                      match="typeMismatch"
                    >
                      Please Provide a Valid Patient Name
                    </Form.Message>
                  </Form.Field>

                  {/* =========== Patient Phone =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="phone"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Phone size={16} />
                      Patient Phone
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
                        id="Patient-phone"
                        name="phone"
                        type="text"
                        value={createForm.phone}
                        onChange={handleCreateFormChange}
                        disabled={isCreating}
                        placeholder="009647 ..."
                      />
                    </Form.Control>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="valueMissing"
                    >
                      Please Enter The Patient Phone
                    </Form.Message>
                    <Form.Message
                      className="text-[13px] text-red-700 opacity-80"
                      match="typeMismatch"
                    >
                      Please Provide a Valid Patient Phone
                    </Form.Message>
                  </Form.Field>

                  {/* =========== Patient Age =========== */}
                  <Form.Field className="grid content-start gap-1.5" name="age">
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <CalendarArrowUp size={16} />
                      Patient Age
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
                        id="Patient-age"
                        name="age"
                        type="number"
                        value={createForm.age}
                        onChange={handleCreateFormChange}
                        disabled={isCreating}
                        placeholder="Enter Patient Age"
                        max={150}
                        min={5}
                      />
                    </Form.Control>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="valueMissing"
                    >
                      Please Enter The Patient Age
                    </Form.Message>
                    <Form.Message
                      className="text-[13px] text-red-700 opacity-80"
                      match="typeMismatch"
                    >
                      Please Provide a Valid Patient Age
                    </Form.Message>
                  </Form.Field>

                  {/* =========== Patient Date Of Birth =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="date_of_birth"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <CalendarDays size={16} />
                      Patient Date Of Birth
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
                        id="Patient_date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={createForm.date_of_birth}
                        onChange={handleCreateFormChange}
                        disabled={isCreating}
                      />
                    </Form.Control>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="valueMissing"
                    >
                      Please Enter The Patient Date Of Birth
                    </Form.Message>
                    <Form.Message
                      className="text-[13px] text-red-700 opacity-80"
                      match="typeMismatch"
                    >
                      Please Provide a Valid Patient Date Of Birth
                    </Form.Message>
                  </Form.Field>

                  {/* =========== Patient Gender =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="gender"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Transgender size={16} />
                      Patient Gender
                    </Form.Label>
                    <select
                      id="Patient-gender"
                      name="gender"
                      value={createForm.gender}
                      onChange={handleCreateFormChange}
                      disabled={isCreating}
                      className={INPUT_CLASS}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="valueMissing"
                    >
                      Please Enter The Patient Gender
                    </Form.Message>
                    <Form.Message
                      className="text-[13px] text-red-700 opacity-80"
                      match="typeMismatch"
                    >
                      Please Provide a Valid Patient Gender
                    </Form.Message>
                  </Form.Field>
                </div>

                {/* =============== Submit Button =============== */}
                {isCreating ? (
                  <div
                    role="status"
                    aria-label="Creating Patient"
                    className="mx-auto mt-2.5 h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600"
                  />
                ) : (
                  <Form.Submit asChild>
                    <button
                      disabled={isCreating}
                      className="flex mx-auto mt-6 cursor-pointer min-h-10 min-w-44 items-center justify-center gap-2 rounded-lg bg-sky-700 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save size={18} />
                      Create a Patient
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

export default CreatePatientPage;
