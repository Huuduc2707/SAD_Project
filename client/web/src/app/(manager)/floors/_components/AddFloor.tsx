import { ParkingFloorOut, floorApi } from "@/apis/floor";
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
  floor_index: z.number().int().nonnegative({
    message: "Floor index must be a non-negative integer",
  }),
  floor_name: z.string().min(1, {
    message: "Floor name cannot be empty",
  }),
});

const AddFloorForm: React.FC<{
  setOpen: (open: boolean) => void;
  floors: ParkingFloorOut[] | undefined | null;
}> = ({ setOpen, floors }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: floorApi.createFloor,
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ["floors"],
      });
      toast({
        title: "Floor created",
        description: `Floor ${data.floor_name} created successfully`,
      });
      setOpen(false);
    },
    onError(error) {
      toast({
        title: "Floor creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      floor_index: floors?.length || 0,
      floor_name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex gap-2 flex-col"
      >
        <FormField
          control={form.control}
          name="floor_index"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Floor index</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="floor_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Floor name</FormLabel>
              <FormControl>
                <Input {...field} />
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

export const AddFloor: React.FC<{
  floors: ParkingFloorOut[] | undefined | null;
}> = ({ floors }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add floor</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add floor</DialogTitle>
          <DialogDescription>
            Add a new floor to your parking lot
          </DialogDescription>
        </DialogHeader>
        <AddFloorForm setOpen={setOpen} floors={floors} />
      </DialogContent>
    </Dialog>
  );
};
