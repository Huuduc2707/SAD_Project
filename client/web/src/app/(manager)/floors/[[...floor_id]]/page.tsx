"use client";

import { floorApi } from "@/apis/floor";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { AddFloor } from "./_components/AddFloor";
import { FloorCard } from "./_components/FloorCard";
import { FloorEditor } from "./_floor_editor/FloorEditor";

export default function FloorsPage({
  params,
}: {
  params: { floor_id: string[] };
}) {
  const { data } = useQuery({
    queryKey: ["floors"],
    queryFn: floorApi.getListFloor,
  });

  const floorId = params.floor_id?.[0];

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

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
        <div className="col-span-full lg:col-span-1 flex overflow-auto lg:overflow-hidden lg:flex-col gap-4">
          {data?.map((floor) => (
            <Link href={`/floors/${floor.id}`} key={floor.id}>
              <FloorCard
                floor={floor}
                selected={floorId === floor.id.toString()}
              />
            </Link>
          ))}
        </div>
        {floorId && (
          <div className="col-span-full lg:col-span-3 flex gap-4">
            <Separator orientation="vertical" className="hidden lg:block" />
            <FloorEditor floorId={Number(floorId)} />
          </div>
        )}
      </div>
    </div>
  );
}
