import { useQuery } from "@tanstack/react-query";

export default function FloorPage({
  params,
}: {
  params: { floor_id: string };
}) {
  useQuery({
    queryKey: ["floors", params.floor_id],
  });

  return (
    <div className="container">
      <div className="flex py-4 justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{}</h2>
          <p className="text-muted-foreground">
          </p>
        </div>
      </div>
    </div>
  );
}
