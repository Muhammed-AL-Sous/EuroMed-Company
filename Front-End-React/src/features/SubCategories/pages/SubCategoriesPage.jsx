// React & React Router
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

// =========== External Library =========== //
// Radix
import { Card, Text } from "@radix-ui/themes";

// Lucide Icons
import { Search, ShieldAlert, SquarePen, Trash2, X } from "lucide-react";

// Notify Sonner
import { notifySonner } from "./../../../lib/notifySonner";

// Api Slice
import {
  useGetSubCategoriesQuery,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} from "../SubCategoriesApiSlice";

// Utilities
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import Pagination from "../../../components/utility/Pagination";
import EditModal from "../../../components/utility/EditModal";
import DeleteConfirmModal from "../../../components/utility/DeleteConfirmModal";

// Components
import SubCategoriesTable from "../components/common/SubCategoriesTable";

const SubCategoriesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ==================================================
  // Search State
  // ==================================================

  const initialSearch = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const normalizedSearch = debouncedSearch.trim();

  const hasSearch = Boolean(normalizedSearch);

  // ==================================================
  // Delete State
  // ==================================================

  const [selectedDeleteSubCategory, setSelectedDeleteSubCategory] =
    useState(null);

  // ==================================================
  // Edit State
  // ==================================================

  const [selectedEditSubCategory, setSelectedEditSubCategory] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // ==================================================
  // SubCategories Query
  // ==================================================

  const { data, isLoading, isFetching, isError } = useGetSubCategoriesQuery({
    search: normalizedSearch,
    page,
  });

  const subcategories = data?.subcategories ?? [];
  const meta = data?.meta ?? null;

  // ==================================================
  // Delete Mutation
  // ==================================================

  const [deleteSubCategory, { isLoading: isDeleting }] =
    useDeleteSubCategoryMutation();

  // ==================================================
  // Update Mutation
  // ==================================================

  const [updateSubCategory, { isLoading: isUpdating }] =
    useUpdateSubCategoryMutation();

  // ==================================================
  // Sync Search With URL
  // ==================================================

  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";

    if (urlSearch === normalizedSearch) {
      return;
    }

    setSearchParams(
      (params) => {
        if (normalizedSearch) {
          params.set("search", normalizedSearch);
        } else {
          params.delete("search");
        }

        return params;
      },
      { replace: true },
    );
  }, [normalizedSearch, searchParams, setSearchParams]);

  // ==================================================
  // Delete Handlers
  // ==================================================

  const handleOpenDeleteModal = (category) => {
    setSelectedDeleteSubCategory(category);
  };

  const handleDeleteSubCategory = async () => {
    if (!selectedDeleteSubCategory || isDeleting) return;

    try {
      await deleteSubCategory(selectedDeleteSubCategory.id).unwrap();

      setSelectedDeleteSubCategory(null);

      notifySonner("SubCategory Deleted Successfully");
    } catch (error) {
      console.error("Failed to Delete SubCategory:", error);

      notifySonner(
        error?.data?.message || "Failed to Delete SubCategory",
        "error",
      );
    }
  };

  // ==================================================
  // Edit Handlers
  // ==================================================

  const handleOpenEditModal = (subcategory) => {
    setSelectedEditSubCategory(subcategory);
    setFormErrors({});

    setEditForm({
      name: subcategory.name ?? "",
      description: subcategory.description || "",
    });
  };

  const handleCloseEditModal = () => {
    if (isUpdating) {
      return;
    }

    setSelectedEditSubCategory(null);
    setFormErrors({});

    setEditForm({
      name: "",
      description: "",
    });
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;

    setEditForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  };

  const handleUpdateSubCategory = async () => {
    if (!selectedEditSubCategory) {
      return;
    }

    const payload = {
      name: editForm.name.trim(),
      description: editForm.description.trim(),
    };

    // Validation
    const errors = {};

    if (!payload.name) errors.name = "The Name Field is Required";
    if (!payload.description)
      errors.description = "The Description Field is Required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // No real changes
    const hasChanges =
      payload.name !== (selectedEditSubCategory.name ?? "") ||
      payload.description !== (selectedEditSubCategory.description ?? "");

    if (!hasChanges) {
      setSelectedEditSubCategory(null);
      setFormErrors({});
      setEditForm({ name: "", description: "" });
      return;
    }

    // Update
    try {
      await updateSubCategory({
        id: selectedEditSubCategory.id,
        data: payload,
      }).unwrap();

      setSelectedEditSubCategory(null);
      setFormErrors({});
      setEditForm({ name: "", description: "", type: "" });

      notifySonner("SubCategory Updated Successfully");
    } catch (error) {
      console.error("Failed to Update SubCategory:", error);

      notifySonner(
        error?.data?.message || "Failed to Update SubCategory",
        "error",
      );
    }
  };

  // ==================================================
  // Search Handlers
  // ==================================================

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setPage(1);

    setSearchParams(
      (params) => {
        params.delete("search");
        return params;
      },
      { replace: true },
    );
  };

  // ==================================================
  // Pagination
  // ==================================================

  const handlePageChange = (newPage) => {
    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==================================================
  // Render
  // ==================================================

  return (
    <Card variant="ghost">
      {/* ==================================================
          Header
      ================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          p-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        <Text as="div" size="6" weight="bold" className="text-sky-900">
          All SubCategories
        </Text>

        {/* ==================================================
            Search
        ================================================== */}

        <div className="relative w-full md:max-w-md">
          <Search
            className="
              pointer-events-none
              absolute
              left-3.5
              top-1/2
              h-5
              w-5
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search for a subcategory by name..."
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              py-2.5
              pl-11
              pr-10
              text-sm
              text-slate-900
              outline-none
              transition
              focus:border-sky-500
              focus:ring-1
              focus:ring-sky-500
            "
          />

          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                cursor-pointer
                text-slate-400
                transition
                hover:text-red-500
              "
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ==================================================
          Active Search
      ================================================== */}

      {hasSearch && (
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            border-t
            border-slate-100
            px-4
            py-3
            text-xs
          "
        >
          <span className="font-medium text-slate-500">
            Searching for:{" "}
            <span className="font-semibold text-slate-700">
              "{normalizedSearch}"
            </span>
          </span>

          <button
            type="button"
            onClick={clearSearch}
            className="
              flex
              cursor-pointer
              items-center
              gap-1
              font-bold
              text-red-600
              transition
              hover:text-red-700
            "
          >
            <X className="h-4 w-4" />
            Reset
          </button>
        </div>
      )}

      {/* ==================================================
          Content
      ================================================== */}

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState />
      ) : subcategories.length === 0 ? (
        <EmptyState hasSearch={hasSearch} onReset={clearSearch} />
      ) : (
        <>
          <SubCategoriesTable
            subcategories={subcategories}
            onDelete={handleOpenDeleteModal}
            onEdit={handleOpenEditModal}
          />

          <Pagination
            meta={meta}
            onPageChange={handlePageChange}
            disabled={isFetching}
          />
        </>
      )}

      {/* ==================================================
          Delete Confirmation Modal
      ================================================== */}

      <DeleteConfirmModal
        isOpen={!!selectedDeleteSubCategory}
        onClose={() => setSelectedDeleteSubCategory(null)}
        onConfirm={handleDeleteSubCategory}
        isLoading={isDeleting}
        title="Delete SubCategory"
        message="Are You Sure You Want to Delete This SubCategory ?"
        itemLabel={selectedDeleteSubCategory?.name}
        confirmText="Delete"
        cancelText="Cancel"
        icon={Trash2}
      />

      {/* ==================================================
          Edit Modal
      ================================================== */}

      <EditModal
        isOpen={Boolean(selectedEditSubCategory)}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateSubCategory}
        isLoading={isUpdating}
        title="Edit SubCategory"
        itemLabel={selectedEditSubCategory?.name}
        submitText="Save Changes"
        cancelText="Cancel"
        icon={SquarePen}
      >
        {/* ==================================================
            SubCategory Name
        ================================================== */}

        <div className="space-y-1.5">
          <label
            htmlFor="subcategory-name"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            SubCategory Name
          </label>

          <input
            id="subcategory-name"
            name="name"
            type="text"
            value={editForm.name}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter subcategory name"
            aria-invalid={Boolean(formErrors.name)}
            aria-describedby={
              formErrors.name ? "subcategory-name-error" : undefined
            }
            className={`
      w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900
      outline-none transition placeholder:text-slate-400
      disabled:cursor-not-allowed disabled:opacity-60
      dark:bg-slate-800 dark:text-slate-100
      ${
        formErrors.name
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
      }
    `}
          />

          {formErrors.name && (
            <p
              id="subcategory-name-error"
              role="alert"
              className="text-xs font-medium text-red-600"
            >
              {formErrors.name}
            </p>
          )}
        </div>

        {/* ==================================================
            SubCategory description
        ================================================== */}

        <div className="mt-5 space-y-1.5">
          <label
            htmlFor="subcategory-description"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            SubCategory Description
          </label>

          <textarea
            id="subcategory-description"
            name="description"
            value={editForm.description}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter subcategory description"
            aria-invalid={Boolean(formErrors.description)}
            aria-describedby={
              formErrors.description
                ? "subcategory-description-error"
                : undefined
            }
            className={`
      w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900
      outline-none transition placeholder:text-slate-400
      disabled:cursor-not-allowed disabled:opacity-60
      dark:bg-slate-800 dark:text-slate-100
      ${
        formErrors.description
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
      }
    `}
          />
          {formErrors.description && (
            <p
              id="subcategory-description-error"
              role="alert"
              className="text-xs font-medium text-red-600"
            >
              {formErrors.description}
            </p>
          )}
        </div>
      </EditModal>
    </Card>
  );
};

// ==================================================
// Loading State
// ==================================================

const LoadingState = ({ message = "Loading hospitals..." }) => {
  return (
    <div
      className="
        flex
        min-h-75
        flex-col
        items-center
        justify-center
        py-20
      "
    >
      <div
        className="
          mb-4
          h-10
          w-10
          animate-spin
          rounded-full
          border-4
          border-sky-600
          border-t-transparent
        "
      />

      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
};

// ==================================================
// Empty State
// ==================================================

const EmptyState = ({ hasSearch, onReset }) => {
  return (
    <div
      className="
        mx-4
        rounded-2xl
        border
        border-slate-200
        bg-transparent
        p-12
        text-center
      "
    >
      <ShieldAlert
        className="
          mx-auto
          h-12
          w-12
          text-slate-400
        "
      />

      <h3 className="mt-3 text-lg font-bold text-slate-800">
        No Hospitals Found
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {hasSearch
          ? "No hospitals match your search criteria."
          : "There are no hospitals available."}
      </p>

      {hasSearch && (
        <button
          type="button"
          onClick={onReset}
          className="
            mt-5
            cursor-pointer
            rounded-xl
            bg-sky-600
            px-4
            py-2
            text-sm
            font-bold
            text-white
            transition
            hover:bg-sky-700
          "
        >
          Reset Search
        </button>
      )}
    </div>
  );
};

// ==================================================
// Error State
// ==================================================

const ErrorState = () => {
  return (
    <div
      className="
        mx-4
        rounded-2xl
        border
        border-red-200
        bg-red-50
        p-12
        text-center
      "
    >
      <ShieldAlert
        className="
          mx-auto
          h-12
          w-12
          text-red-400
        "
      />

      <h3 className="mt-3 text-lg font-bold text-red-800">
        Something went wrong
      </h3>

      <p className="mt-2 text-sm text-red-600">
        Failed to load hospitals. Please try again later.
      </p>
    </div>
  );
};

export default SubCategoriesPage;
