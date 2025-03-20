import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.js";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "react-router-dom";
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
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(6),
});

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      setErrorMessage(err.response?.data?.message || "Something went wrong");
    },
  });

  function onSubmit(values) {
    loginMutation(values);
  }

  return (
    <Form {...form}>
      <div className="mx-auto flex h-screen w-full max-w-lg flex-1 flex-col justify-center gap-4">
        <div className="">
          <h1 className="text-5xl font-medium">Log In</h1>
          <p className="text-gray-300">Please enter your details</p>
        </div>
        {errorMessage && (
          <div className="h-5 text-center text-red-300">{errorMessage}</div>
        )}
        {/* {successMessage && (
          <div className="h-5 text-center text-white">{successMessage}</div>
        )} */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg tracking-tight">
                  Username
                </FormLabel>
                <FormControl>
                  <Input placeholder="" autoComplete="username" {...field} />
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg tracking-tight">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isPending}
            className="relative w-full"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
        <Link to={"/signup"} className="hover:underline">
          Don't have an account? Signup
        </Link>
      </div>
    </Form>
  );
};

export default LoginPage;
