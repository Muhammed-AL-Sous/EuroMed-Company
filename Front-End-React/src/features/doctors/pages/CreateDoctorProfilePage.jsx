// React
import { useState } from "react";

// External Library
import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Form } from "radix-ui";
import { Check, ChevronDown, Church } from "lucide-react";
import { notifySonner } from "../../../lib/notifySonner";
import * as Select from "@radix-ui/react-select";

// Api Slice
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../users/UsersApiSlice";

const CreateDoctorProfilePage = () => {
  const [createForm, setCreateForm] = useState({
    user_id: "",
    name: "",
  });

  // ==================================================
  // Users Query
  // ==================================================

  const { data, refetch } = useGetUsersQuery();

  const [updateUser, { isLoading: isCreating }] = useUpdateUserMutation();

  const users = Array.isArray(data?.users) ? data.users : [];

  const getUserRole = (user) => {
    if (typeof user.role === "string") {
      return user.role;
    }

    return (
      user.role?.role_name ?? user.role?.name ?? user.roles?.[0]?.name ?? ""
    );
  };

  const availableUsers = users.filter((user) => {
    const role = getUserRole(user);

    return (
      (role === "staff" || role === "admin" || role === "doctor") &&
      user.has_doctor_profile === false
    );
  });

  const [errors, setErrors] = useState({});

  const handleCreateFormChange = (event) => {
    const { name, value } = event.target;

    setCreateForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmitDoctor = async (event) => {
    event.preventDefault();

    // Validate Selected User
    if (!createForm.user_id) {
      setErrors((prev) => ({
        ...prev,
        user_id: "Please Select a User",
      }));
      return;
    }

    // Validate Doctor Name
    const doctorName = createForm.name.trim();

    if (!doctorName) {
      notifySonner("Please Enter Doctor Name", "error");
      return;
    }

    // Ensure User Is Eligible
    const selectedUser = availableUsers.find(
      (user) => String(user.id) === String(createForm.user_id),
    );

    if (!selectedUser) {
      notifySonner(
        "Selected User Is Not Eligible For a Doctor Profile",
        "error",
      );
      return;
    }

    // User Update Payload
    const payload = {
      role: "doctor",
      doctor: {
        name: doctorName,
      },
    };

    try {
      // Change Role + Create Doctor Profile
      await updateUser({
        id: selectedUser.id,
        data: payload,
      }).unwrap();

      // Reset Form
      setCreateForm({
        user_id: "",
        name: "",
      });

      setErrors({});

      // Refresh Users List
      refetch();

      notifySonner("Doctor Profile Created Successfully");
    } catch (error) {
      console.error("Failed to Create Doctor Profile:", error);

      const validationErrors = error?.data?.errors;

      const firstError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;

      notifySonner(
        firstError || error?.data?.message || "Failed to Create Doctor Profile",
        "error",
      );
    }
  };

  return (
    <div>
      {/* ============= Header ============= */}
      <div className="flex gap-4 items-center text-sky-600">
        <Church size={55} />
        <Text className="font-bold text-2xl">Create a New Doctor</Text>
      </div>
      {/* ============= Section ============= */}
      <Box className="mx-auto border-none outline-none" maxWidth="900px">
        <Card variant="ghost" className="border-none outline-none">
          <Flex gap="3" direction="column">
            <img
              className="max-h-80 mx-auto"
              src="/images/Create_Doctor_Profile.png"
            />

            <Box className="max-w-full border border-slate-200 shadow-lg rounded-2xl p-5 ">
              <Form.Root className="w-full" onSubmit={handleSubmitDoctor}>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                  {/* =========== Doctor Name =========== */}
                  <Form.Field className="mb-2.5 grid" name="name">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Doctor Name
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded bg-blackA2 px-2.5 text-[14px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
                          required
                          id="Doctor-name"
                          name="name"
                          type="text"
                          value={createForm.name}
                          onChange={handleCreateFormChange}
                          disabled={isCreating}
                          placeholder="Enter Doctor name"
                        />
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Doctor Name
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid Doctor Name
                      </Form.Message>
                    </div>
                  </Form.Field>

                  {/* =========== Select User =========== */}
                  <Form.Field className="mb-2.5 grid" name="select-user">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Select User
                      </Form.Label>

                      <Select.Root
                        value={createForm.user_id || "none"}
                        disabled={isCreating}
                        onValueChange={(value) => {
                          const user_id = value === "none" ? "" : value;

                          setCreateForm((prev) => ({
                            ...prev,
                            user_id,
                          }));

                          setErrors((prev) => ({
                            ...prev,
                            user_id: undefined,
                          }));
                        }}
                      >
                        <Select.Trigger
                          aria-label="Filter by user"
                          className="
                                          inline-flex
                                          min-w-55
                                          items-center
                                          justify-between
                                          bg-slate-50
                                          gap-3
                                          rounded-xl
                                          px-4
                                          py-2
                                          text-sm
                                          text-slate-700
                                          transition-colors
                                          hover:bg-white
                                          outline-none border-2 border-sky-700 focus:border-sky-400
                                          focus:ring-1
                                          focus:ring-sky-500
                                          data-placeholder:text-slate-500"
                        >
                          <Select.Value placeholder="Select User" />

                          <Select.Icon>
                            <ChevronDown size={18} className="text-slate-500" />
                          </Select.Icon>
                        </Select.Trigger>

                        <Select.Portal>
                          <Select.Content
                            position="popper"
                            sideOffset={6}
                            className="
                z-50
                max-h-64
                min-w-55
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-lg
                animate-in
                fade-in-0
                zoom-in-95
              "
                          >
                            <Select.Viewport className="p-1.5">
                              <Select.Item
                                value="none"
                                className="
                    relative
                    flex
                    cursor-pointer
                    select-none
                    items-center
                    rounded-lg
                    py-2.5
                    pl-3
                    pr-9
                    text-sm
                  text-slate-700
                    outline-none
                  data-highlighted:bg-sky-50
                  data-highlighted:text-sky-700
                  data-[state=checked]:bg-sky-50
                    data-[state=checked]:font-medium
                  "
                              >
                                <Select.ItemText>Select a User</Select.ItemText>

                                <Select.ItemIndicator className="absolute right-3">
                                  <Check size={16} className="text-sky-600" />
                                </Select.ItemIndicator>
                              </Select.Item>

                              {/* <Select.Separator className="my-1.5 h-px bg-slate-100" /> */}

                              {(Array.isArray(availableUsers)
                                ? availableUsers
                                : []
                              ).map((user) => (
                                <Select.Item
                                  key={user.id}
                                  value={String(user.id)}
                                  className="
                      relative
                      flex
                      cursor-pointer
                      select-none
                      items-center
                      rounded-lg
                      py-2.5
                      pl-3
                      pr-9
                      text-sm
                    text-slate-700
                      outline-none
                    data-highlighted:bg-sky-50
                    data-highlighted:text-sky-700
                    data-[state=checked]:bg-sky-50
                      data-[state=checked]:font-medium
                    "
                                >
                                  <Select.ItemText>{user.name}</Select.ItemText>

                                  <Select.ItemIndicator className="absolute right-3">
                                    <Check size={16} className="text-sky-600" />
                                  </Select.ItemIndicator>
                                </Select.Item>
                              ))}
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>

                      {errors.user_id && (
                        <p className="mt-2 text-xs font-bold text-red-700">
                          {errors.user_id}
                        </p>
                      )}
                    </div>
                  </Form.Field>

                  {createForm.user_id &&
                    getUserRole(
                      availableUsers.find(
                        (user) =>
                          String(user.id) === String(createForm.user_id),
                      ) ?? {},
                    ) === "staff" && (
                      <Text size="2" color="amber" className="mt-2">
                        This user's role will be changed from Staff to Doctor
                        when the profile is created.
                      </Text>
                    )}
                </div>

                {/* =============== Submit Button =============== */}
                {isCreating ? (
                  <div
                    role="status"
                    aria-label="Creating Doctor"
                    className="mx-auto mt-2.5 h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600"
                  />
                ) : (
                  <Form.Submit asChild>
                    <button
                      disabled={isCreating}
                      className="mt-4.5 cursor-pointer box-border mx-auto flex h-8.75 items-center justify-center rounded bg-white px-3.75 font-medium leading-none text-sky-700 shadow-[0_2px_10px] shadow-blackA4 hover:bg-sky-200 transition-colors focus:shadow-sky-700"
                    >
                      Create a Doctor
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

export default CreateDoctorProfilePage;
