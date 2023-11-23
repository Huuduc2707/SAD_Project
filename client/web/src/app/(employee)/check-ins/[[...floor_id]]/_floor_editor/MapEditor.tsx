import { ParkingSlotOut, floorApi } from "@/apis/floor";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import styles from "./MapEditor.module.css";

const BLOCK_SIZE = 24; // pixels

const SlotBlock: FC<{
  slot: ParkingSlotOut;
  floorId: number;
}> = ({ slot: { id, start_x, start_y, end_x, end_y }, floorId }) => {
  const queryClient = useQueryClient();

  const { mutate: mutateDelete } = useMutation({
    mutationFn: floorApi.deleteSlot,
    onSuccess: () => {
      toast({
        title: "Parking slot deleted",
        description: "Parking slot deleted successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["floors", floorId, "slots"],
      });
    },
    onError(error) {
      toast({
        title: "Parking slot deletion failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onDelete = () => {
    mutateDelete({
      floor_id: floorId,
      slot_id: id,
    });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className="absolute border border-accent bg-background rounded-sm shadow flex items-center justify-center"
          style={{
            top: start_y * BLOCK_SIZE,
            left: start_x * BLOCK_SIZE,
            width: (end_x - start_x) * BLOCK_SIZE,
            height: (end_y - start_y) * BLOCK_SIZE,
          }}
        >
          <span className="text-muted-foreground select-none">{id}</span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onDelete}>Delete Slot</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export const MapEditor: FC<{ floorId: number }> = ({ floorId }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [startXY, setStartXY] = useState<{ x: number; y: number } | null>(null);
  const [endXY, setEndXY] = useState<{ x: number; y: number } | null>(null);

  const { data } = useQuery({
    queryKey: ["floors", floorId, "slots"],
    queryFn: () => floorApi.getListSlots(floorId),
  });

  const queryClient = useQueryClient();

  const { mutate: mutateCreate } = useMutation({
    mutationFn: floorApi.createSlot,
    onSuccess: () => {
      toast({
        title: "Parking slot created",
        description: "Parking slot created successfully",
      });
      setStartXY(null);
      setEndXY(null);
      queryClient.invalidateQueries({
        queryKey: ["floors", floorId, "slots"],
      });
    },
    onError(error) {
      toast({
        title: "Parking slot creation failed",
        description: error.message,
        variant: "destructive",
      });
      setStartXY(null);
      setEndXY(null);
    },
  });

  useEffect(() => {
    let isCreating = false;
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    const onPointerDown = (e: PointerEvent) => {
      // only consider left click
      if (e.button !== 0) return;
      isCreating = true;
      startX = Math.round(e.offsetX / BLOCK_SIZE);
      startY = Math.round(e.offsetY / BLOCK_SIZE);
      setStartXY({ x: startX, y: startY });
      setEndXY({ x: startX, y: startY });
    };
    const onPointerMove = (e: PointerEvent) => {
      requestAnimationFrame(() => {
        if (!isCreating) return;
        endX = Math.round(e.offsetX / BLOCK_SIZE);
        endY = Math.round(e.offsetY / BLOCK_SIZE);
        setEndXY({ x: endX, y: endY });
      });
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!isCreating) return;
      isCreating = false;
      if (startX === endX || startY === endY) {
        setStartXY(null);
        setEndXY(null);
        return;
      }
      mutateCreate({
        floor_id: floorId,
        start_x: startX,
        start_y: startY,
        end_x: endX,
        end_y: endY,
      });
    };

    if (!mapRef.current) return;
    const map = mapRef.current;
    map.addEventListener("pointerdown", onPointerDown);
    map.addEventListener("pointermove", onPointerMove);
    map.addEventListener("pointerup", onPointerUp);
    return () => {
      map.removeEventListener("pointerdown", onPointerDown);
      map.removeEventListener("pointermove", onPointerMove);
      map.removeEventListener("pointerup", onPointerUp);
    };
  }, [mutateCreate, floorId]);

  return (
    <div
      ref={mapRef}
      className={twMerge("w-[1440px] h-[1440px] relative", styles.bg)}
    >
      {/* Existing slots */}
      {data?.map((slot) => (
        <SlotBlock slot={slot} key={slot.id} floorId={floorId} />
      ))}
      {/* Currently creating */}
      {startXY && endXY && (
        <div
          className="bg-accent rounded-sm block"
          style={{
            position: "absolute",
            top: startXY.y * BLOCK_SIZE,
            left: startXY.x * BLOCK_SIZE,
            width: (endXY.x - startXY.x) * BLOCK_SIZE,
            height: (endXY.y - startXY.y) * BLOCK_SIZE,
          }}
        />
      )}
    </div>
  );
};
