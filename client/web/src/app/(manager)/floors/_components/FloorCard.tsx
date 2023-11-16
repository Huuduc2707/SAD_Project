import { ParkingFloorOut } from "@/apis/floor";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { twJoin } from "tailwind-merge";

export const FloorCard: React.FC<{ floor: ParkingFloorOut }> = ({ floor }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>{floor.floor_name}</CardTitle>
          <CardDescription>Floor #{floor.floor_index}</CardDescription>
        </div>
      </CardHeader>
      <CardFooter>
        <Link
          href={`/floors/${floor.id}`}
          className={twJoin(buttonVariants({ variant: "outline" }), "w-full")}
        >
          View floor
        </Link>
      </CardFooter>
    </Card>
  );
};
