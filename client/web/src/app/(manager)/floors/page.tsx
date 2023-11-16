"use client";

import { floorApi } from "@/apis/floor";
import { useQuery } from "@tanstack/react-query";
import { AddFloor } from "./_components/AddFloor";
import { FloorCard } from "./_components/FloorCard";

export default function FloorsPage() {
  const { data } = useQuery({
    queryKey: ["floors"],
    queryFn: floorApi.getListFloor,
  });

  return (
    <div className="container">
      <div className="flex py-4 justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Floors</h2>
          <p className="text-muted-foreground">
            Manage floors in your parking lot
          </p>
        </div>
        <AddFloor floors={data} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data?.map((floor) => <FloorCard key={floor.id} floor={floor} />)}
      </div>
    </div>
  );
}
