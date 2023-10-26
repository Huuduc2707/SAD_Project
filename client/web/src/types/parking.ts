export interface Floor {
  id: number;
  floor_index: number;
  floor_name: string;
}

export interface ParkingBlock {
  id: number;
  block_name: string;
  floor_id: Floor["id"];
  block_vertex: { x: number; y: number }[];
}

export interface ParkingSlot {
  id: number;
  status: "available" | "occupied";
  floor_id: Floor["id"];
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
}

export interface ParkingExit {
  id: number;
  floor_id: Floor["id"];
  x: number;
  y: number;
  exit_type: "entrance" | "exit";
}

export interface VehicleType {
  id: number;
  name: string;
  fee_per_hour: number;
}
