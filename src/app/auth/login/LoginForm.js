"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/useAuthStore";
import { AlertCircle, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

async function loginRequest(credentials) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Network error. Please try again.",
    }));
    throw new Error(error.message || "Invalid credentials");
  }

  return response.json();
}

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);

    try {
      const result = await loginRequest(data);

      useAuthStore.getState().login(
        {
          _id: result._id,
          name: result.name,
          email: result.email,
          role: result.role,
        },
        result.token
      );

      if (data.rememberMe) localStorage.setItem("auth_token", result.token);

      const roleRoutes = {
        superadmin: "/dashboard/admin",
        admin: "/dashboard/admin",
        auditor: "/dashboard/auditor",
        manager: "/dashboard/manager",
        user: "/dashboard/user",
      };
      router.push(roleRoutes[result.role.toLowerCase()] || "/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setServerError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/demo-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Demo login failed. Please try again later.");
      }

      const result = await response.json();

      useAuthStore.getState().login(
        {
          _id: result._id,
          name: result.name,
          email: result.email,
          role: result.role,
          isReadOnly: true,
        },
        result.token
      );

      const roleRoutes = {
        superadmin: "/dashboard/admin",
        admin: "/dashboard/admin",
        auditor: "/dashboard/auditor",
        manager: "/dashboard/manager",
        user: "/dashboard/user",
      };
      router.push(roleRoutes[result.role.toLowerCase()] || "/dashboard");
    } catch (err) {
      setServerError(err.message || "Demo login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email Address
        </Label>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              type="email"
              id="email"
              placeholder="name@company.com"
              disabled={isLoading}
              className={`h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all duration-200 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500 focus:border-blue-500"
              }`}
              aria-invalid={!!errors.email}
            />
          )}
        />
        {errors.email && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Password
          </Label>
          <a
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                disabled={isLoading}
                className={`h-11 pr-10 bg-slate-50 border-slate-200 focus:bg-white transition-all duration-200 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500 focus:border-blue-500"
                }`}
                aria-invalid={!!errors.password}
              />
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {errors.password.message}
          </p>
        )}
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Authentication Failed
            </h3>
            <p className="text-sm text-red-600 mt-1">{serverError}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Signing in...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Sign In <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </Button>

      {/* Demo Multi-Role Trigger */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-slate-500">Recruiter Access</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={isLoading}
        onClick={handleDemoLogin}
        className="w-full h-11 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-medium flex items-center justify-center gap-2 group shadow-sm bg-blue-50/30"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
        Explore Demo as Super Admin
      </Button>
    </form>
  );
}
