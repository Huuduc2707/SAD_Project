import { baseApi } from "./base";
import { ParkingFloorOut } from "./floor";

export interface VehicleTypeFormatOut {
  id: number;
  name: string;
}

export interface VehicleOut {
  id: number;
  plate_number: string;
  vehicle_number: string;
  vehicle_type: VehicleTypeFormatOut;
}

export interface SlotOut {
  id: number;
  floor: ParkingFloorOut;
  start_x: number;
  end_x: number;
  start_y: number;
  end_y: number;
  status: "E" | "B" | "U";
}

export interface ReservationOut {
  id: number;
  vehicle: VehicleOut;
  slot: SlotOut;
  time_booked: string;
  status: "A";
}

export const reservationApi = {
  getListFloor(floor_id: number) {
    return baseApi.get<ReservationOut[]>(`/api/reservations/floor/${floor_id}`);
  },
};
