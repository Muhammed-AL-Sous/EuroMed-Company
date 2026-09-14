// import { Search, ShieldAlert, X } from "lucide-react";
// import { useState } from "react";
import { useSearchParams } from "react-router";
import { useGetProductsQuery } from "../features/Products/ProductsApiSlice";
import { useGetSubCategoriesQuery } from "../features/SubCategories/SubCategoriesApiSlice";
const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const subCategoryId = searchParams.get("subcategory_id") || "";

  const search = searchParams.get("search") || "";
  const { data: products = [] } = useGetProductsQuery({
    subcategory_id: subCategoryId,
    search,
  });
  console.log(products);
  const { data: subCategories = [] } = useGetSubCategoriesQuery();

  return (
    <>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          const value = e.target.value;

          setSearchParams((params) => {
            if (value) {
              params.set("search", value);
            } else {
              params.delete("search");
            }

            return params;
          });
        }}
      />
      <select
        value={subCategoryId}
        onChange={(e) => {
          const value = e.target.value;

          setSearchParams((params) => {
            if (value) {
              params.set("subcategory_id", value);
            } else {
              params.delete("subcategory_id");
            }

            return params;
          });
        }}
      >
        <option value="">All Subcategories</option>

        {subCategories.map((subCategory) => (
          <option key={subCategory.id} value={subCategory.id}>
            {subCategory.name}
          </option>
        ))}
      </select>
    </>
  );
};

//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const categories = catData?.categories || [];
//   const brands = brandData?.brands || [];
//   const products = prodData?.products || [];

//   const handleCategoryChange = (catId) => {
//     if (catId) {
//       searchParams.set("category", catId);
//     } else {
//       searchParams.delete("category");
//     }
//     setSearchParams(searchParams);
//   };

//   const handleBrandChange = (brandId) => {
//     if (brandId) {
//       searchParams.set("brand", brandId);
//     } else {
//       searchParams.delete("brand");
//     }
//     setSearchParams(searchParams);
//   };

//   const clearFilters = () => {
//     setSearchParams({});
//     setSearchQuery("");
//     setStatusFilter("");
//   };

//   return (
//     <div className="py-10 bg-slate-50 min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
//         {/* Page Title Header */}
//         <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
//           <div>
//             <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30">
//               Orthopedic Product Catalog
//             </span>
//             <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
//               Surgical Implants & Hardware
//             </h1>
//             <p className="text-slate-300 text-sm mt-1 max-w-xl">
//               Browse total knee and hip arthroplasty systems, trauma locking
//               plates, cannulated screws, and intramedullary nails.
//             </p>
//           </div>
//           <div className="text-right">
//             <span className="text-3xl font-black text-sky-400 font-mono">
//               {products.length}
//             </span>
//             <span className="block text-xs text-slate-400 uppercase font-semibold">
//               Products Available
//             </span>
//           </div>
//         </div>

//         {/* Filter Controls Bar */}
//         <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Search Input */}
//             <div className="relative">
//               <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search name, code, usage..."
//                 className="w-full bg-slate-50 text-slate-900 pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
//               />
//             </div>

//             {/* Category Select */}
//             <div>
//               <select
//                 value={categoryFilter}
//                 onChange={(e) => handleCategoryChange(e.target.value)}
//                 className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-sky-500"
//               >
//                 <option value="">
//                   All Product Categories ({categories.length})
//                 </option>
//                 {categories.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.name} ({c.product_count})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Brand Select */}
//             <div>
//               <select
//                 value={brandFilter}
//                 onChange={(e) => handleBrandChange(e.target.value)}
//                 className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-sky-500"
//               >
//                 <option value="">All Partner Brands ({brands.length})</option>
//                 {brands.map((b) => (
//                   <option key={b.id} value={b.id}>
//                     {b.name} ({b.origin})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Availability Filter */}
//             <div>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-sky-500"
//               >
//                 <option value="">All Availability Statuses</option>
//                 <option value="available">In Stock (Erbil HQ)</option>
//                 <option value="low_stock">Low Stock Alert</option>
//               </select>
//             </div>
//           </div>

//           {(categoryFilter || brandFilter || searchQuery || statusFilter) && (
//             <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
//               <span className="text-slate-500 font-medium">
//                 Active filters applied
//               </span>
//               <button
//                 onClick={clearFilters}
//                 className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
//               >
//                 <X className="w-4 h-4" /> Reset Filters
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Product Cards Grid */}
//         {isLoading ? (
//           <div className="py-20 text-center">
//             <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//             <p className="text-slate-500 text-sm font-medium">
//               Loading EuroMed product catalog from API...
//             </p>
//           </div>
//         ) : products.length === 0 ? (
//           <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
//             <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto" />
//             <h3 className="text-lg font-bold text-slate-800">
//               No products match your filter criteria
//             </h3>
//             <p className="text-slate-500 text-sm">
//               Try clearing your search query or selecting a different brand or
//               category.
//             </p>
//             <button
//               onClick={clearFilters}
//               className="px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-bold mt-2"
//             >
//               Reset Filters
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {products.map((p) => (
//               <div
//                 key={p.id}
//                 className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
//               >
//                 <div>
//                   {/* Image container */}
//                   <div className="relative h-48 bg-slate-100 overflow-hidden">
//                     <img
//                       src={p.image_url}
//                       alt={p.name}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform"
//                       referrerPolicy="no-referrer"
//                     />
//                     <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-mono font-bold">
//                       {p.code}
//                     </div>
//                     <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 text-xs px-2.5 py-1 rounded-md font-bold border border-slate-200">
//                       {p.brand_name}
//                     </div>
//                   </div>

//                   <div className="p-5 space-y-3">
//                     <div className="flex items-center justify-between text-xs font-semibold text-sky-600">
//                       <span>{p.category_name}</span>
//                       <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
//                         {p.status === "available"
//                           ? "In Stock (Erbil)"
//                           : "Low Stock"}
//                       </span>
//                     </div>

//                     <h3 className="text-lg font-bold text-slate-900 leading-snug">
//                       {p.name}
//                     </h3>
//                     <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
//                       {p.description}
//                     </p>

//                     <div className="pt-2 text-xs text-slate-500 border-t border-slate-100">
//                       <strong className="text-slate-700">Usage:</strong>{" "}
//                       {p.medical_usage}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-5 pt-0">
//                   <button
//                     onClick={() => setSelectedProduct(p)}
//                     className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
//                   >
//                     View Specifications & Sizes
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Product Detail Modal */}
//         {selectedProduct && (
//           <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
//             <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
//               <button
//                 onClick={() => setSelectedProduct(null)}
//                 className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
//               >
//                 <X className="w-5 h-5" />
//               </button>

//               <div className="flex items-center gap-3">
//                 <span className="px-3 py-1 rounded-md bg-sky-100 text-sky-700 text-xs font-bold font-mono">
//                   {selectedProduct.code}
//                 </span>
//                 <span className="text-xs font-bold text-slate-500 uppercase">
//                   {selectedProduct.brand_name} • {selectedProduct.category_name}
//                 </span>
//               </div>

//               <h2 className="text-2xl font-black text-slate-900">
//                 {selectedProduct.name}
//               </h2>

//               <p className="text-slate-600 text-sm leading-relaxed">
//                 {selectedProduct.description}
//               </p>

//               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
//                 <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
//                   Medical Indication
//                 </h4>
//                 <p className="text-xs text-slate-600">
//                   {selectedProduct.medical_usage}
//                 </p>
//               </div>

//               {/* Technical Specs */}
//               {selectedProduct.specifications && (
//                 <div>
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
//                     Technical Specifications
//                   </h4>
//                   <div className="grid grid-cols-2 gap-3 text-xs">
//                     {Object.entries(selectedProduct.specifications).map(
//                       ([key, val]) => (
//                         <div
//                           key={key}
//                           className="bg-white p-2.5 rounded-lg border border-slate-200"
//                         >
//                           <span className="block font-semibold text-slate-500">
//                             {key}
//                           </span>
//                           <span className="font-bold text-slate-900">
//                             {val}
//                           </span>
//                         </div>
//                       ),
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Sizes */}
//               {selectedProduct.available_sizes?.length > 0 && (
//                 <div>
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
//                     Available Sizes in Stock
//                   </h4>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedProduct.available_sizes.map((s, i) => (
//                       <span
//                         key={i}
//                         className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 text-xs font-mono font-bold border border-sky-200"
//                       >
//                         {s}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
//                 <span className="text-xs text-slate-500">
//                   Distributed by EuroMed Erbil HQ
//                 </span>
//                 <button
//                   onClick={() => setSelectedProduct(null)}
//                   className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

export default ProductsPage;
