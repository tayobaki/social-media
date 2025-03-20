import { useState, useTransition } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.js";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Link } from "react-router-dom";

const formSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const SignupPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { mutate: signUpMutation, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      setErrorMessage(err.response?.data?.message || "Something went wrong");
      console.log(err);
    },
  });

  function onSubmit(values) {
    signUpMutation(values);
  }

  return (
    <Form {...form}>
      <div className="mx-auto flex h-screen w-full max-w-lg flex-1 flex-col justify-center gap-4">
        <div className="">
          <h1 className="text-5xl font-medium">Sign up</h1>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg tracking-tight">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder=""
                    autoComplete="email"
                    {...field}
                  />
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
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> // Show the loader when pending
            ) : (
              "Submit"
            )}
          </Button>
        </form>
        <Link to={"/login"} className="hover:underline">
          Already have an account? Login
        </Link>
      </div>
    </Form>
  );
};

export default SignupPage;
