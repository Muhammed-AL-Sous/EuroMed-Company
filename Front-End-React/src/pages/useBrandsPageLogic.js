import { useGetManufacturersQuery } from "../features/manufacturers/ManufacturersApiSlice";

const useBrandsPageLogic = () => {
  const { data, isLoading } = useGetManufacturersQuery();

  const brands = data?.manufacturers || [];

  return {
    isLoading,
    brands,
  };
};

export default useBrandsPageLogic;
