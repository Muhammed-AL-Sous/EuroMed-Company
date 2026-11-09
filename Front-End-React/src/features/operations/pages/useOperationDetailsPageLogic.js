import { useLocation, useParams } from "react-router";
import { useGetOperationQuery } from "../OperationsApiSlice";

const useOperationDetailsPageLogic = () => {
  const EMPTY_ITEMS = [];
  const { id } = useParams();
  const location = useLocation();
  const scope = location.pathname.startsWith("/doctor/") ? "doctor" : "admin";

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetOperationQuery({
    id,
    scope,
  });

  const operation = response?.data ?? response;
  const items = Array.isArray(operation?.items) ? operation.items : EMPTY_ITEMS;
  const patient = operation.patient;
  const doctor = operation.doctor;
  const hospital = operation.hospital;
  const operationType = operation.operation_type;

  return {
    id,
    scope,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    operation,
    items,
    patient,
    doctor,
    hospital,
    operationType,
  };
};

export default useOperationDetailsPageLogic;
