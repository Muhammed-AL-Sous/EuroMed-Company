import ProductImageUpload from "../components/utility/ProductImageUpload";
import ProductsTable from "../components/common/ProductsTable";
import Pagination from "../../../components/utility/Pagination";
import DeleteConfirmModal from "../../../components/utility/DeleteConfirmModal";
import EditModal from "../../../components/utility/EditModal";
import * as Select from "@radix-ui/react-select";
import { Card, Text } from "@radix-ui/themes";
import {
  Check,
  ChevronDown,
  Search,
  ShieldAlert,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import useProductsDashboardPageLogic from "./useProductsDashboardPageLogic.js";

const ProductsDashboardPage = () => {
  const {
    setSelectedImage,
    setRemoveExistingImage,
    topRef,
    searchInput,
    manufacturerId,
    subCategoryId,
    categoryId,
    normalizedSearch,
    hasSearch,
    subCategoriesResponse,
    categoriesResponse,
    manufacturersResponse,
    isLoading,
    isFetching,
    isError,
    products,
    meta,
    selectedDeleteProduct,
    selectedEditProduct,
    editForm,
    formErrors,
    isDeleting,
    isUpdating,
    handleSearchChange,
    clearSearch,
    handleSubCategoryChange,
    handleManufacturerChange,
    clearFilters,
    hasActiveFilters,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteProduct,
    handleOpenEditModal,
    handleCloseEditModal,
    handleEditFormChange,
    handleUpdateProduct,
    handlePageChange,
  } = useProductsDashboardPageLogic();

  // ==================================================
  // Render
  // ==================================================

  return (
    <Card variant="ghost">
      <div ref={topRef} className="scroll-mt-24" />
      {/* ==================================================
          Header
      ================================================== */}
      <Text as="div" size="6" weight="bold" className="text-sky-900">
        All Products
      </Text>

      <div
        className="
          flex
          flex-col
          w-full
          flex-wrap
          p-4
          gap-2
          md:flex-row
          md:items-center
          md:justify-center"
      >
        {/* ==================================================
            Search
        ================================================== */}
        <div className="relative flex-1 md:min-w-md xl:min-w-auto">
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
            placeholder="Search for a product by name or code ..."
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              py-2.5
              pl-11
              pr-10
              text-[11px]
              sm:text-sm
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

        {/* ==================================================
          Filters
      ================================================== */}
        {/* Subcategory */}

        <Select.Root
          value={subCategoryId || "all"}
          onValueChange={(value) =>
            handleSubCategoryChange(value === "all" ? "" : value)
          }
        >
          <Select.Trigger
            aria-label="Filter by subcategory"
            className="
          inline-flex
          min-w-55
          items-center
          justify-between
          gap-3
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          px-4
          py-2.5
          text-sm
          text-slate-700
          outline-none
          transition-colors
          hover:bg-white
          focus:border-sky-500
          focus:ring-1
          focus:ring-sky-500
          data-placeholder:text-slate-500
        "
          >
            <Select.Value placeholder="All Subcategories" />

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
                  value="all"
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
                  <Select.ItemText>All Subcategories</Select.ItemText>

                  <Select.ItemIndicator className="absolute right-3">
                    <Check size={16} className="text-sky-600" />
                  </Select.ItemIndicator>
                </Select.Item>

                {(Array.isArray(subCategoriesResponse)
                  ? subCategoriesResponse
                  : []
                ).map((subcategory) => (
                  <Select.Item
                    key={subcategory.id}
                    value={String(subcategory.id)}
                    className="relative flex cursor-pointer select-none items-center rounded-lg py-2.5 pl-3 pr-9 text-sm text-slate-700 outline-none data-highlighted:bg-sky-50 data-highlighted:text-sky-700 data-[state=checked]:bg-sky-50 data-[state=checked]:font-medium"
                  >
                    <Select.ItemText>{subcategory.name}</Select.ItemText>

                    <Select.ItemIndicator className="absolute right-3">
                      <Check size={16} className="text-sky-600" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        {/* Manufacturer */}

        <Select.Root
          value={manufacturerId || "all"}
          onValueChange={(value) =>
            handleManufacturerChange(value === "all" ? "" : value)
          }
        >
          <Select.Trigger
            aria-label="Filter by manufacturer"
            className="
          inline-flex
          min-w-55
          items-center
          justify-between
          gap-3
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          px-4
          py-2.5
          text-sm
          text-slate-700
          outline-none
          transition-colors
          hover:bg-white
          focus:border-sky-500
          focus:ring-1
          focus:ring-sky-500
          data-placeholder:text-slate-500
        "
          >
            <Select.Value placeholder="All Manufacturers" />

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
                  value="all"
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
                  <Select.ItemText>All Manufacturers</Select.ItemText>

                  <Select.ItemIndicator className="absolute right-3">
                    <Check size={16} className="text-sky-600" />
                  </Select.ItemIndicator>
                </Select.Item>

                {(Array.isArray(manufacturersResponse)
                  ? manufacturersResponse
                  : []
                ).map((manufacturer) => (
                  <Select.Item
                    key={manufacturer.id}
                    value={String(manufacturer.id)}
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
                    <Select.ItemText>{manufacturer.name}</Select.ItemText>

                    <Select.ItemIndicator className="absolute right-3">
                      <Check size={16} className="text-sky-600" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        {/* Clear Filters */}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="
              flex
              items-center
              justify-center
              gap-1.5
              rounded-xl
              px-4
              py-2.5
              text-xs
              font-semibold
              text-red-600
              border
              border-red-200
              transition
              hover:bg-red-50
              cursor-pointer
            "
          >
            <X className="h-4 w-4" />
          </button>
        )}
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
      ) : products.length === 0 ? (
        <EmptyState
          hasSearch={
            hasSearch ||
            Boolean(subCategoryId) ||
            Boolean(manufacturerId) ||
            Boolean(categoryId)
          }
          onReset={clearFilters}
        />
      ) : (
        <>
          <ProductsTable
            products={products}
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
          Delete Product Modal
      ================================================== */}

      <DeleteConfirmModal
        isOpen={Boolean(selectedDeleteProduct)}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteProduct}
        isLoading={isDeleting}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        itemLabel={selectedDeleteProduct?.name}
        confirmText="Delete"
        cancelText="Cancel"
        icon={Trash2}
      />

      {/* ==================================================
          Edit Product Modal
      ================================================== */}

      <EditModal
        isOpen={Boolean(selectedEditProduct)}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateProduct}
        isLoading={isUpdating}
        title="Edit Product"
        itemLabel={selectedEditProduct?.name}
        submitText="Save Changes"
        cancelText="Cancel"
        icon={SquarePen}
      >
        {/* ==================================================
            Product Code
        ================================================== */}

        <div className="space-y-1.5">
          <label
            htmlFor="product-code"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Product Code
          </label>

          <input
            id="product-code"
            name="code"
            type="text"
            value={editForm.code}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter product code"
            aria-invalid={Boolean(formErrors.code)}
            className={`
              w-full
              rounded-xl
              border
              bg-slate-50
              px-4
              py-2.5
              text-sm
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:bg-slate-800
              dark:text-slate-100
              ${
                formErrors.code
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
              }
            `}
          />

          {formErrors.code && (
            <p
              role="alert"
              className="
                text-xs
                font-medium
                text-red-600
              "
            >
              {formErrors.code}
            </p>
          )}
        </div>

        {/* ==================================================
            Product Name
        ================================================== */}

        <div className="mt-5 space-y-1.5">
          <label
            htmlFor="product-name"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Product Name
          </label>

          <input
            id="product-name"
            name="name"
            type="text"
            value={editForm.name}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter product name"
            aria-invalid={Boolean(formErrors.name)}
            className={`
              w-full
              rounded-xl
              border
              bg-slate-50
              px-4
              py-2.5
              text-sm
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:bg-slate-800
              dark:text-slate-100
              ${
                formErrors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
              }
            `}
          />

          {formErrors.name && (
            <p
              role="alert"
              className="
                text-xs
                font-medium
                text-red-600
              "
            >
              {formErrors.name}
            </p>
          )}
        </div>

        {/* ==================================================
            Description
        ================================================== */}

        <div className="mt-5 space-y-1.5">
          <label
            htmlFor="product-description"
            className="
              text-sm
              font-semibold
              text-slate-200
            "
          >
            Description
          </label>

          <textarea
            id="product-description"
            name="description"
            value={editForm.description}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter product description"
            rows={4}
            className="
              w-full
              resize-none
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-2.5
              text-sm
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-[#0084d1]
              focus:ring-1
              focus:ring-[#0084d1]
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-100
            "
          />
        </div>

        {/* ==================================================
            Product Image
        ================================================== */}
        <div className="">
          <label className="text-sm font-semibold text-slate-200">
            Product Image
          </label>

          <ProductImageUpload
            key={selectedEditProduct?.id}
            initialImageUrl={selectedEditProduct?.image_url ?? ""}
            disabled={isUpdating}
            onChange={(file) => {
              setSelectedImage(file);

              if (file) {
                setRemoveExistingImage(false);
              }
            }}
            onRemove={() => {
              setRemoveExistingImage(true);
            }}
          />
        </div>

        {/* ==================================================
            Manufacturer
        ================================================== */}

        <div className="mt-5 space-y-1.5">
          <label
            htmlFor="product-manufacturer"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Manufacturer
          </label>

          <select
            id="product-manufacturer"
            name="manufacturer_id"
            value={String(editForm.manufacturer_id)}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            aria-invalid={Boolean(formErrors.manufacturer_id)}
            className={`
              w-full
              rounded-xl
              border
              bg-slate-50
              px-4
              py-2.5
              text-sm
              text-slate-900
              outline-none
              transition
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:bg-slate-800
              dark:text-slate-100
              ${
                formErrors.manufacturer_id
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
              }
            `}
          >
            <option value="">Select Manufacturer</option>

            {(Array.isArray(manufacturersResponse)
              ? manufacturersResponse
              : []
            ).map((manufacturer) => (
              <option key={manufacturer.id} value={String(manufacturer.id)}>
                {manufacturer.name}
              </option>
            ))}
          </select>

          {formErrors.manufacturer_id && (
            <p
              role="alert"
              className="
                text-xs
                font-medium
                text-red-600
              "
            >
              {formErrors.manufacturer_id}
            </p>
          )}
        </div>

        {/* ==================================================
           SubCategory
        ================================================== */}

        <div className="mt-5 space-y-1.5">
          <label
            htmlFor="product-subcategory"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            SubCategory
          </label>

          <select
            id="product-subcategory"
            name="subcategory_id"
            value={String(editForm.subcategory_id)}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            aria-invalid={Boolean(formErrors.subcategory_id)}
            className={`
              w-full
              rounded-xl
              border
              bg-slate-50
              px-4
              py-2.5
              text-sm
              text-slate-900
              outline-none
              transition
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:bg-slate-800
              dark:text-slate-100
              ${
                formErrors.subcategory_id
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
              }
            `}
          >
            <option value="">Select SubCategory</option>

            {(Array.isArray(subCategoriesResponse)
              ? subCategoriesResponse
              : []
            ).map((subcategory) => (
              <option key={subcategory.id} value={String(subcategory.id)}>
                {subcategory.name}
              </option>
            ))}
          </select>

          {formErrors.subcategory_id && (
            <p
              role="alert"
              className="
                text-xs
                font-medium
                text-red-600
              "
            >
              {formErrors.subcategory_id}
            </p>
          )}
        </div>

        {/* ==================================================
           Category
        ================================================== */}

        <div className="mt-5 space-y-1.5">
          <label
            htmlFor="product-category"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Category
          </label>

          <select
            id="product-category"
            name="category_id"
            value={String(editForm.category_id)}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            aria-invalid={Boolean(formErrors.category_id)}
            className={`
              w-full
              rounded-xl
              border
              bg-slate-50
              px-4
              py-2.5
              text-sm
              text-slate-900
              outline-none
              transition
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:bg-slate-800
              dark:text-slate-100
              ${
                formErrors.category_id
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
              }
            `}
          >
            <option value="">Select Category</option>

            {(Array.isArray(categoriesResponse) ? categoriesResponse : []).map(
              (category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ),
            )}
          </select>

          {formErrors.category_id && (
            <p
              role="alert"
              className="
                text-xs
                font-medium
                text-red-600
              "
            >
              {formErrors.category_id}
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

const LoadingState = ({ message = "Loading products..." }) => {
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

      <h3
        className="
          mt-3
          text-lg
          font-bold
          text-slate-800
        "
      >
        No Products Found
      </h3>

      <p
        className="
          mt-2
          text-sm
          text-slate-500
        "
      >
        {hasSearch
          ? "No products match your search criteria."
          : "There are no products available."}
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
          Reset Filters
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

      <h3
        className="
          mt-3
          text-lg
          font-bold
          text-red-800
        "
      >
        Something went wrong
      </h3>

      <p
        className="
          mt-2
          text-sm
          text-red-600
        "
      >
        Failed to load products. Please try again later.
      </p>
    </div>
  );
};

export default ProductsDashboardPage;
