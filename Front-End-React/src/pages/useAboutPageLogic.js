import { Award, Building2, ShieldCheck, Stethoscope } from "lucide-react";

const useAboutPageLogic = () => {
  const values = [
    {
      title: "Uncompromised Quality",
      description:
        "We Source Exclusively From ISO 13485 Certified European and International Implant Manufacturers.",
      icon: Award,
    },
    {
      title: "100% Implant Traceability",
      description:
        "Every Product Carries Complete Lot and Serial Number Records For Maximum Patient Safety and Clinical Audits.",
      icon: ShieldCheck,
    },
    {
      title: "Expert Surgical Support",
      description:
        "Our Technical Specialists Support Surgical Teams During Complex Total Joint Arthroplasty Procedures.",
      icon: Stethoscope,
    },
    {
      title: "Local Erbil Inventory",
      description:
        "Our Erbil Warehouse Maintains Immediate Stock To Prevent Surgical Delays in Emergency Trauma Cases.",
      icon: Building2,
    },
  ];

  return {
    values,
  };
};

export default useAboutPageLogic;
