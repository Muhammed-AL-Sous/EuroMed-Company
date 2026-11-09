import { useAddHospitalMutation } from "../HospitalsApiSlice";
import { notifySonner } from "../../../lib/notifySonner";
import { useState } from "react";

const useCreateHospitalPageLogic = () => {
  const [createForm, setCreateForm] = useState({
    code: "",
    name: "",
    type: "Government",
    city: "",
  });
  const [addHospital, { isLoading: isCreating }] = useAddHospitalMutation();

  const handleCreateFormChange = (event) => {
    const { name, value } = event.target;
    setCreateForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmitHospital = async (e) => {
    e.preventDefault();
    try {
      await addHospital(createForm).unwrap();
      setCreateForm({
        code: "",
        name: "",
        type: "Government",
        city: "",
      });
      notifySonner("Hospital Added Successfully");
    } catch (error) {
      console.error("Failed to add hospital:", error);
      notifySonner(error?.data?.message || "Failed to add hospital", "error");
    }
  };

  return {
    createForm,
    isCreating,
    handleCreateFormChange,
    handleSubmitHospital,
  };
};

export default useCreateHospitalPageLogic;
