const useCompanyIntroLogic = () => {
  const stats = [
    {
      label: "Product Categories",
      value: "9+",
      description: "Knee, Hip, Plates, Screws, Nails & Cables",
    },
    {
      label: "Partner Brands",
      value: "6+",
      description: "Global Manufacturers (Zimmer , MAXX , etc ...)",
    },
    {
      label: "Orthopedic Surgeons",
      value: "350+",
      description: "Surgeons Served Across Erbil & Iraq",
    },
    {
      label: "Partner Hospitals",
      value: "45+",
      description: "Hospitals & Surgical Centers Supplied",
    },
    {
      label: "Years Experience",
      value: "15+",
      description: "Dedicated Orthopedic Excellence",
    },
  ];
  const highlights = [
    "Uncompromising Medical Quality & ISO Certification",
    "Full Serial & Lot Number Traceability for Every Implant",
    "Comprehensive Inventory Stored in Erbil HQ",
    "Expert Surgical Support & Product Training",
    "Rapid Emergency Delivery to Operating Rooms",
    "Direct Partnerships With European & Global Manufacturers",
  ];
  return {
    stats,
    highlights,
  };
};
export default useCompanyIntroLogic;
