import { ParkingFloorOut, floorApi } from "@/apis/floor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { MapEditor } from "./MapEditor";

const FloorMetadataEditor: FC<{ floor: ParkingFloorOut }> = ({ floor }) => {
  const [name, setName] = useState(floor.floor_name);
  useEffect(() => {
    setName(floor.floor_name);
  }, [floor.floor_name]);

  const queryClient = useQueryClient();

  const { mutate: mutateUpdate, isPending: isUpdatePending } = useMutation({
    mutationFn: floorApi.updateFloor,
    onSuccess() {
      toast({
        title: "Floor updated",
        description: "Floor updated successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["floors"],
      });
    },
    onError(error) {
      toast({
        title: "Floor update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const router = useRouter();

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationFn: floorApi.deleteFloor,
    onSuccess() {
      toast({
        title: "Floor deleted",
        description: "Floor deleted successfully",
      });
      router.replace("/floors");
      queryClient.invalidateQueries({
        queryKey: ["floors"],
      });
    },
    onError(error) {
      toast({
        title: "Floor deletion failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isUpdatePending) return;
    if (!name.trim()) return;
    mutateUpdate({
      floor_id: floor.id,
      floor_name: name.trim(),
      floor_index: floor.floor_index,
    });
  };

  return (
    <form
      className="flex flex-row items-center justify-between gap-4"
      onSubmit={onSubmit}
    >
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isUpdatePending}
      />
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={isPendingDelete}
        onClick={() =>
          mutateDelete({
            floor_id: floor.id,
          })
        }
      >
        Delete Floor
      </Button>
    </form>
  );
};

export const FloorEditor: FC<{ floorId: number }> = ({ floorId }) => {
  const { data, status, error } = useQuery({
    queryKey: ["floors", floorId],
    queryFn: () => floorApi.getFloor({ floor_id: floorId }),
    retry: false,
  });

  if (status === "pending") {
    return (
      <div className="h-[120px] lg:flex-1 w-full min-w-0 flex items-center justify-center">
        <div className="text-2xl font-bold text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[120px] lg:flex-1 w-full min-w-0 flex items-center justify-center">
        <div className="text-2xl font-bold text-destructive">
          {error.message}
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="h-[640px] lg:flex-1 w-full min-w-0 flex flex-col gap-4">
      <FloorMetadataEditor floor={data} />
      <ScrollArea className="w-full min-h-0 flex-1 border rounded-md">
        <MapEditor floorId={floorId} />
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
