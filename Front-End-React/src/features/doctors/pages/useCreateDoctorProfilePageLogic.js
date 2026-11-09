import { useState } from "react";
import { notifySonner } from "../../../lib/notifySonner";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../users/UsersApiSlice";

const useCreateDoctorProfilePageLogic = () => {
  const [createForm, setCreateForm] = useState({
    user_id: "",
    name: "",
  });
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

  return {
    createForm,
    setCreateForm,
    isCreating,
    getUserRole,
    availableUsers,
    errors,
    setErrors,
    handleCreateFormChange,
    handleSubmitDoctor,
  };
};

export default useCreateDoctorProfilePageLogic;
