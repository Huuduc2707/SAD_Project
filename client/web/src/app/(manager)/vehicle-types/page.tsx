"use client";

import { vehicleTypeApi } from "@/apis/vehicle";
import { useQuery } from "@tanstack/react-query";
import { AddVehicleType } from "./_components/AddVehicleType";
import { VehicleTypeCard } from "./_components/VehicleTypeCard";

export default function VehicleTypesPage() {
  const { data } = useQuery({
    queryKey: ["vehicle-types"],
    queryFn: vehicleTypeApi.getListVehicleType,
  });

  return (
    <div className="container">
      <div className="flex py-4 justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Vehicle Types</h2>
          <p className="text-muted-foreground">
            Manage vehicles allowed in your parking lot
          </p>
        </div>
        <AddVehicleType />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data?.map((vehicleType) => (
          <VehicleTypeCard key={vehicleType.id} vehicleType={vehicleType} />
        ))}
      </div>
    </div>
  );
}
