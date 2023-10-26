export default function FloorPage({
  params,
}: {
  params: { floor_id: string };
}) {
  return <div>Floor {params.floor_id}</div>;
}
