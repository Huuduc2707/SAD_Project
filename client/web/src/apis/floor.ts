import { baseApi } from "./base";

export interface ParkingFloorOut {
  id: number;
  floor_index: number;
  floor_name: string;
}

export interface ParkingFloorIn {
  floor_index: number;
  floor_name: string;
}

export interface ParkingSlotOut {
  id: number;
  start_x: number;
  end_x: number;
  start_y: number;
  end_y: number;
  status: "E" | "B" | "U";
}

export interface ParkingSlotIn {
  start_x: number;
  end_x: number;
  start_y: number;
  end_y: number;
}

export const floorApi = {
  getListFloor() {
    return baseApi.get<ParkingFloorOut[]>("/api/floors");
  },
  createFloor(variables: ParkingFloorIn) {
    return baseApi.post<ParkingFloorOut>("/api/floors", variables);
  },
  getFloor({ floor_id }: { floor_id: number }) {
    return baseApi.get<ParkingFloorOut>(`/api/floors/${floor_id}`);
  },
  updateFloor({
    floor_id,
    ...variables
  }: ParkingFloorIn & { floor_id: number }) {
    return baseApi.put<ParkingFloorOut>(`/api/floors/${floor_id}`, variables);
  },
  deleteFloor({ floor_id }: { floor_id: number }) {
    return baseApi.delete(`/api/floors/${floor_id}`);
  },
  getListSlots(floor_id: number) {
    return baseApi.get<ParkingSlotOut[]>(`/api/floors/${floor_id}/slots`);
  },
  createSlot({ floor_id, ...variables }: ParkingSlotIn & { floor_id: number }) {
    return baseApi.post<ParkingSlotOut>(
      `/api/floors/${floor_id}/slots`,
      variables
    );
  },
  updateSlot({
    floor_id,
    slot_id,
    ...variables
  }: ParkingSlotIn & { floor_id: number; slot_id: number }) {
    return baseApi.put<ParkingSlotOut>(
      `/api/floors/${floor_id}/slots/${slot_id}`,
      variables
    );
  },
  deleteSlot({ floor_id, slot_id }: { floor_id: number; slot_id: number }) {
    return baseApi.delete(`/api/floors/${floor_id}/slots/${slot_id}`);
  },
};
