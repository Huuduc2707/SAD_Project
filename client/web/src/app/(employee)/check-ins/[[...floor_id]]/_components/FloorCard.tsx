import { ParkingFloorOut } from "@/apis/floor";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const FloorCard: React.FC<{
  floor: ParkingFloorOut;
  selected: boolean;
}> = ({ floor, selected }) => {
  return (
    <Card className={selected ? "border-primary" : "hover:bg-muted"}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>{floor.floor_name}</CardTitle>
          <CardDescription>Floor #{floor.floor_index}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};
