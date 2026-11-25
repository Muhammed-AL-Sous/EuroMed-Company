import { useLocation, useParams } from "react-router";
import { useGetOperationQuery } from "../OperationsApiSlice";

const EMPTY_ITEMS = [];

const useOperationDetailsPageLogic = () => {
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
  } = useGetOperationQuery({ id, scope }, { skip: !id });

  const operation = response?.data ?? response;

  const items = Array.isArray(operation?.items) ? operation.items : EMPTY_ITEMS;

  const patient = operation?.patient ?? null;
  const doctor = operation?.doctor ?? null;
  const hospital = operation?.hospital ?? null;
  const operationType = operation?.operation_type ?? null;

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
