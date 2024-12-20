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
import { Mail } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSignIn } from "@/hooks/auth/use-sign-in";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const SignIn = () => {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { signin, loading, error } = useSignIn();
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const res = await signin(data);
      if (res) {
        router.push("/dashboard");
      }
    } catch {
      console.log(error);
    }
  };
  return (
    <div className="space-y-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          Don&apos;t have an account{" "}
          <Link
            className="text-primary underline underline-offset-2 hover:text-primary/80"
            href="/auth/signup"
          >
            {loading ? "Loading..." : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
