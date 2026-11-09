import { useGetManufacturersQuery } from "../../features/manufacturers/ManufacturersApiSlice";
const useBrandsShowcaseLogic = () => {
  const { data } = useGetManufacturersQuery();
  const Brands = data?.manufacturers || [];
  return {
    Brands,
  };
};
export default useBrandsShowcaseLogic;
