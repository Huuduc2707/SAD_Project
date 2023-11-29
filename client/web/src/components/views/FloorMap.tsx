import { ParkingSlotOut } from "@/apis/floor";
import { FC, useRef } from "react";
import { twMerge } from "tailwind-merge";
import styles from "./FloorMap.module.css";

const BLOCK_SIZE = 24; // pixels

const SlotBlock: FC<{
  slot: ParkingSlotOut;
}> = ({ slot: { id, start_x, start_y, end_x, end_y, status } }) => {
  return (
    <div
      className="absolute border border-accent bg-background rounded-sm shadow flex items-center justify-center"
      style={{
        top: start_y * BLOCK_SIZE,
        left: start_x * BLOCK_SIZE,
        width: (end_x - start_x) * BLOCK_SIZE,
        height: (end_y - start_y) * BLOCK_SIZE,
        background:
          status === "B" ? "blue" : status === "U" ? "green" : undefined,
      }}
    >
      <span
        className="text-muted-foreground select-none"
        style={{
          color: status !== "E" ? "white" : undefined,
        }}
      >
        {id}
      </span>
    </div>
  );
};

export const FloorMap: FC<{
  slots: ParkingSlotOut[];
  floorId: number;
}> = ({ floorId, slots }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={mapRef}
      className={twMerge(
        "w-[1440px] h-[1440px] relative border-[4px]",
        styles.bg,
      )}
    >
      {/* Existing slots */}
      {slots?.map((slot) => <SlotBlock slot={slot} key={slot.id} />)}
    </div>
  );
};
