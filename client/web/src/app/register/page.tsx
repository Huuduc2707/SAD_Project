"use client";

import { userApi } from "@/apis/user";
import { Button } from "@/components/ui/button";
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
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Username must be at least 1 character.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  name: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
  phone_number: z.string().min(1, {
    message: "Phone number must be at least 1 character.",
  }),
});

export default function RegisterPage() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: userApi.signup,
    onSuccess(data) {
      toast({
        title: "Registration successful",
        description: `Welcome, ${data.user.name}!`,
      });
      router.replace("/");
    },
    onError(error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <div className="h-[calc(100vh-64px*2)] flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col items-center justify-center w-96 max-w-full gap-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Register</h1>
          <p className="text-sm text-muted-foreground">
            Create an account to access the system
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex gap-2 flex-col"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
              Submit
            </Button>
          </form>
        </Form>
      </div>
      <div className="text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}
