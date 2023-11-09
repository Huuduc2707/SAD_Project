import { baseApi } from "./base";

export interface VehicleTypeOut {
  id: number;
  name: string;
  hourly_fee: number;
}

export interface VehicleTypeTypeIn {
  name: string;
  hourly_fee: number;
}

export const vehicleTypeApi = {
  getListVehicleType() {
    return baseApi.get<VehicleTypeOut[]>("/api/vehicle_types");
  },
  createVehicleType(variables: VehicleTypeTypeIn) {
    return baseApi.post<VehicleTypeOut>("/api/vehicle_types", variables);
  },
  updateVehicleType({
    vehicle_type_id,
    ...variables
  }: VehicleTypeTypeIn & { vehicle_type_id: number }) {
    return baseApi.put<VehicleTypeOut>(
      `/api/vehicle_types/${vehicle_type_id}`,
      variables,
    );
  },
  deleteVehicleType({ vehicle_type_id }: { vehicle_type_id: number }) {
    return baseApi.delete(`/api/vehicle_types/${vehicle_type_id}`);
  },
};
