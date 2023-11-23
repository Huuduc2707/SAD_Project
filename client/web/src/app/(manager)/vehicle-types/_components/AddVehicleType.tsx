import { vehicleTypeApi } from "@/apis/vehicle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
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

const AddVehicleTypeForm: React.FC<{
  setOpen: (open: boolean) => void;
}> = ({ setOpen }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: vehicleTypeApi.createVehicleType,
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ["vehicle-types"],
      });
      toast({
        title: "Vehicle type created",
        description: `Vehicle type ${data.name} created successfully`,
      });
      setOpen(false);
    },
    onError(error) {
      toast({
        title: "Vehicle type creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      hourly_fee: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({
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
          Create
        </Button>
      </form>
    </Form>
  );
};

export const AddVehicleType: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add vehicle type</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add vehicle</DialogTitle>
          <DialogDescription>
            Add a new vehicle type to your parking lot
          </DialogDescription>
        </DialogHeader>
        <AddVehicleTypeForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
