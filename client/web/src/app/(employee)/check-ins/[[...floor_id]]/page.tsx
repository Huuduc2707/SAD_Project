"use client";

import { floorApi } from "@/apis/floor";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FloorCard } from "./_components/FloorCard";
import { FloorEditor } from "./_floor_editor/FloorEditor";
import { FloorMap } from "@/components/views/FloorMap";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GetFloorDetail = ({ floor_id }: { floor_id: number }) => {
  const { data } = useQuery({
    queryKey: ["floors", floor_id, "slots"],
    queryFn: () => floorApi.getListSlots(floor_id),
  });

  return data && <FloorMap floorId={floor_id} slots={data} />;
};

export default function CheckInsPage({
  params,
}: {
  params: { floor_id: string[] };
}) {
  const { data } = useQuery({
    queryKey: ["floors"],
    queryFn: floorApi.getListFloor,
  });

  // useState floorId
  const [floorId, setFloorId] = useState<number | null>(null);

  const chooseFloor = (newvalue: string) => {
    setFloorId(Number(newvalue));
  };

  return (
    <div className="container">
      <div className="flex py-4 justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Floors</h2>
          <p className="text-muted-foreground">
            Manage floors in your parking lot
          </p>
        </div>
        <Select value={String(floorId)} onValueChange={chooseFloor}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {data?.map((floor) => {
              return (
                <SelectItem key={floor.id} value={`${floor.id}`}>
                  {floor.floor_name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
        {floorId && (
          <div className="col-span-full lg:col-span-3 flex gap-4">
            {/* <Separator orientation="vertical" className="hidden lg:block" /> */}
            <GetFloorDetail floor_id={floorId} />
          </div>
        )}
      </div>
    </div>
  );
}
