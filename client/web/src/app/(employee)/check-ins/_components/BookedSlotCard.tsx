import { ParkingFloorOut } from "@/apis/floor";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const BookedSlotCard: React.FC<{
  slotId: number;
  plateNumber: string;
  time: string;
}> = ({ slotId, plateNumber, time }) => {
  return (
    <Card className="border-primary hover:bg-muted">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>Slot ID: {slotId}</CardTitle>
          <CardDescription>Plate number: {plateNumber}</CardDescription>
          <CardDescription>Booking time: {time}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};
