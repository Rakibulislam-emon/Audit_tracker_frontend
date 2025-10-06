"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

async function loginRequest(url, { arg }) {
   
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "invalid email or password");
  }
  return response.json();
}

export default function LoginForm() {

  const router = useRouter();
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { trigger, isMutating, error } = useSWRMutation(
    "http://localhost:5000/api/users/login",
    loginRequest
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Handle form submission logic here
      const formData = { email, password };
      const result = await trigger(formData);
      console.log("result:", result);
      if (result) {
        const user = {
          _id: result._id,
          name: result.name,
          email: result.email,
          role: result.role,
        };
        console.log(user)
        useAuthStore.getState().login(user, result.token);
        
        router.push(`/dashboard/${user.role}`);
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <p className="text-sm text-destructive mt-1 hidden">
          Please enter a valid email address
        </p>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p className="text-sm text-destructive mt-1 hidden">
          Invalid email or password
        </p>
      </div>

      {/* Login Button */}
      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  );
}
