"use client";

import { VehicleTypeOut, vehicleTypeApi } from "@/apis/vehicle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Vehicle type name cannot be empty",
  }),
  hourly_fee: z.coerce.number().min(0, {
    message: "Hourly fee cannot be negative",
  }),
});

const VehicleTypeForm: FC<{
  vehicleType: VehicleTypeOut;
}> = ({ vehicleType }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: vehicleTypeApi.updateVehicleType,
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ["vehicle-types"],
      });
      toast({
        title: "Vehicle type updated",
        description: `Vehicle type ${data.name} updated successfully`,
      });
    },
    onError(error) {
      toast({
        title: "Vehicle type update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: vehicleType.name,
      hourly_fee: vehicleType.hourly_fee,
    },
  });

  useEffect(() => {
    form.reset({
      name: vehicleType.name,
      hourly_fee: vehicleType.hourly_fee,
    });
  }, [vehicleType, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({
      vehicle_type_id: vehicleType.id,
      ...values,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex gap-2 flex-col"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle type name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hourly_fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle type fee</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full mt-4"
          disabled={mutation.isPending}
        >
          Update
        </Button>
      </form>
    </Form>
  );
};

const DeleteVehicleTypeButton: FC<{
  vehicleType: VehicleTypeOut;
}> = ({ vehicleType }) => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: vehicleTypeApi.deleteVehicleType,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["vehicle-types"],
      });
      toast({
        title: "Vehicle type deleted",
        description: `Vehicle type ${vehicleType.name} deleted successfully`,
      });
      router.replace("/vehicle-types");
    },
    onError(error) {
      toast({
        title: "Vehicle type delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      variant="destructive"
      className="w-full mt-4"
      disabled={mutation.isPending}
      onClick={() => {
        mutation.mutate({
          vehicle_type_id: vehicleType.id,
        });
      }}
    >
      Delete
    </Button>
  );
};

export default function VehicleTypePage({
  params,
}: {
  params: { vehicle_type_id: string };
}) {
  const { data, status, error } = useQuery({
    queryKey: ["vehicle-types", params.vehicle_type_id],
    queryFn: () =>
      vehicleTypeApi.getVehicleType({
        vehicle_type_id: Number(params.vehicle_type_id),
      }),
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
    <div className="container space-y-4">
      <div className="flex py-4 justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{data.name}</h2>
          <p className="text-muted-foreground">ID {data.id}</p>
        </div>
      </div>
      <Card className="w-full max-w-[350px]">
        <CardHeader>
          <CardTitle>Edit vehicle type</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleTypeForm vehicleType={data} />
        </CardContent>
      </Card>
      <Card className="w-full max-w-[350px]">
        <CardHeader>
          <CardTitle>Delete vehicle type</CardTitle>
          <CardDescription>
            Deleting a vehicle type is irreversible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteVehicleTypeButton vehicleType={data} />
        </CardContent>
      </Card>
    </div>
  );
}
