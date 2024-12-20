"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSignUp } from "@/hooks/auth/use-sign-up";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const SignUp = () => {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { error, loading, signup } = useSignUp();
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const res = await signup(data);
      if (res) {
        router.push("/dashboard");
      }
      console.log(data);
    } catch {
      console.log(error);
    }
  };
  return (
    <div className="space-y-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="peer pe-9"
                      placeholder="User Name"
                      {...field}
                    />
                    <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                      <User size={16} strokeWidth={2} aria-hidden="true" />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="peer pe-9"
                      placeholder="Email"
                      {...field}
                    />
                    <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                      <Mail size={16} strokeWidth={2} aria-hidden="true" />
                    </div>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {/* password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className="peer pe-9"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* submit */}
          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <div>
        <p className="text-center text-muted-foreground">
          Already have an account?{" "}
          <Link
            className="text-primary underline underline-offset-2 hover:text-primary/80"
            href="/auth/signin"
          >
            {loading ? "Loading..." : "Sign Un"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

// Dependencies: pnpm install lucide-react
