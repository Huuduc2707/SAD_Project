import { floorApi } from "@/apis/floor";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";

export const FloorEditor: FC<{ floorId: string }> = ({ floorId }) => {
  useQuery({
    queryKey: ["floors", floorId, "slots"],
    queryFn: () => floorApi.getListSlots(Number(floorId)),
  });
  return <div className="h-[640px] flex-1">{floorId}</div>;
};
