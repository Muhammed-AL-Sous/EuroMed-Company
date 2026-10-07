import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Header } from "@radix-ui/themes/components/table";
import { Church } from "lucide-react";
import { Form } from "radix-ui";

const CreateHospitalPage = () => {
  return (
    <div>
      {/* ============= Header ============= */}
      <Header className="flex gap-4 items-center text-sky-600">
        <Church size={55} />
        <Text className="font-bold text-2xl">Create a New Hospital</Text>
      </Header>
      {/* ============= Section ============= */}
      <Box className="mx-auto border-none outline-none" maxWidth="900px">
        <Card variant="ghost" className="border-none outline-none">
          <Flex gap="3" direction="column">
            <img className="max-h-80 mx-auto" src="/images/hospital.png" />

            <Box className="max-w-full border border-slate-200 shadow-lg rounded-2xl p-5 ">
              <Form.Root className="w-full">
                <div className="grid grid-cols-3 gap-4">
                  {/* =========== Hospital Name =========== */}
                  <Form.Field className="mb-2.5 grid" name="name">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Hospital Name
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded bg-blackA2 px-2.5 text-[15px] leading-none text-slate-700 shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-slate-700 hover:shadow-[0_0_0_1px_black] focus:shadow-sky-700"
                          type="text"
                          required
                        />
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Hospital Name
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid Hospital Name
                      </Form.Message>
                    </div>
                  </Form.Field>

                  {/* =========== Hospital Type =========== */}
                  <Form.Field className="mb-2.5 grid" name="type">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Hospital Type
                      </Form.Label>
                      <Form.Control asChild>
                        <select
                          id="hospital-type"
                          name="type"
                          className="box-border h-8.75 w-full rounded bg-blackA2 px-2.5 text-[15px] leading-none text-slate-700 shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-slate-700 hover:shadow-[0_0_0_1px_black] border focus:shadow-sky-700 border-none"

                          // value={editForm.type}
                          // onChange={handleEditFormChange}
                          // disabled={isUpdating}
                          // aria-invalid={Boolean(formErrors.type)}
                          // aria-describedby={
                          //   formErrors.type ? "hospital-type-error" : undefined
                          // }
                          //                       className={`
                          //   w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900
                          //   outline-none transition placeholder:text-slate-400
                          //   disabled:cursor-not-allowed disabled:opacity-60
                          //   dark:bg-slate-800 dark:text-slate-100
                          //   ${
                          //     formErrors.type
                          //       ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          //       : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
                          //   }
                          // `}
                        >
                          {/* <option value="">Select hospital type</option> */}

                          <option value="Government">Government</option>

                          <option value="Private">Private</option>
                        </select>
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Hospital Name
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid Hospital Name
                      </Form.Message>
                    </div>
                  </Form.Field>

                  {/* =========== Hospital City =========== */}
                  <Form.Field className="mb-2.5 grid" name="city">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Hospital City
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded bg-blackA2 px-2.5 text-[15px] leading-none text-slate-700 shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-slate-700 hover:shadow-[0_0_0_1px_black] focus:shadow-sky-700 "
                          type="text"
                          required
                        />
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Hospital City
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid Hospital City
                      </Form.Message>
                    </div>
                  </Form.Field>
                </div>

                {/* =============== Submit Button =============== */}
                <Form.Submit asChild>
                  <button className="mt-2.5 cursor-pointer box-border mx-auto flex h-8.75 items-center justify-center rounded bg-white px-3.75 font-medium leading-none text-sky-700 shadow-[0_2px_10px] shadow-blackA4 hover:bg-sky-200 transition-colors focus:shadow-sky-700 ">
                    Create a Hospital
                  </button>
                </Form.Submit>
              </Form.Root>
            </Box>
          </Flex>
        </Card>
      </Box>

      {/* ============= Footer ============= */}
    </div>
  );
};

export default CreateHospitalPage;
