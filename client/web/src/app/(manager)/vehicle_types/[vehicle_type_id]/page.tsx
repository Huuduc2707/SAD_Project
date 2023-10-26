export default function VehicleTypePage({
  params,
}: {
  params: { vehicle_type_id: string };
}) {
  return <div>Vehicle type {params.vehicle_type_id}</div>;
}
