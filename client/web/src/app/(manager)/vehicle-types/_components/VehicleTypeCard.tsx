import { VehicleTypeOut } from "@/apis/vehicle";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const VehicleTypeCard: React.FC<{
  vehicleType: VehicleTypeOut;
}> = ({ vehicleType }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>{vehicleType.name}</CardTitle>
          <CardDescription>ID: {vehicleType.id}</CardDescription>
          <CardDescription>Fee: {vehicleType.hourly_fee}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};
