import { useGetHospitalsQuery } from "../HospitalsApiSlice";

import HospitalTable from "../components/common/HospitalTable";
import { Card, Text } from "@radix-ui/themes";

const HospitalsPage = () => {
  const { data: hospitals } = useGetHospitalsQuery();

  return (
    <>
      <Card variant="classic">
        <Text as="div" size="6" weight="bold" className="text-sky-900 p-4">
          All Hospitals
        </Text>
        <HospitalTable hospitals={hospitals} />
      </Card>
    </>
  );
};

export default HospitalsPage;
