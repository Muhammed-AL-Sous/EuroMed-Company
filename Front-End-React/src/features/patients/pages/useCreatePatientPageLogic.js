import { useState } from "react";
import { notifySonner } from "../../../lib/notifySonner";
import { useAddPatientMutation } from "../PatientsApiSlice";

const useCreatePatientPageLogic = () => {
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

  return {
    createForm,
    isCreating,
    handleCreateFormChange,
    handleSubmitPatient,
  };
};

export default useCreatePatientPageLogic;
