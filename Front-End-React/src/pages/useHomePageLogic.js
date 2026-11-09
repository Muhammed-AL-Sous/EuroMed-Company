import { useGetSubCategoriesQuery } from "../features/subCategories/SubCategoriesApiSlice";

const useHomePageLogic = () => {
  const { data } = useGetSubCategoriesQuery();

  const subcategories = data?.subcategories ?? [];

  return {
    subcategories,
  };
};

export default useHomePageLogic;
