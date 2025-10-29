"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/useAuthStore";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
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
        admin: "/dashboard/admin",
        auditor: "/dashboard/auditor",
        manager: "/dashboard/manager",
        user: "/dashboard/user",
      };
      router.push(roleRoutes[result.role.toLowerCase()] || "/dashboard");
    } catch (err) {
      setServerError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
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
              placeholder="you@example.com"
              disabled={isLoading}
              className={`transition-all duration-200 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
              aria-invalid={!!errors.email}
            />
          )}
        />
        {errors.email && (
          <p
            className="text-sm text-red-600 flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="w-4 h-4" /> {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </Label>
          <a
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
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
                className={`pr-10 transition-all duration-200 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
                aria-invalid={!!errors.password}
              />
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p
            className="text-sm text-red-600 flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="w-4 h-4" /> {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember Me */}
      {/* <div className="flex items-center space-x-2">
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <Checkbox {...field} checked={field.value} disabled={isLoading} />
          )}
        />
        <Label
          htmlFor="rememberMe"
          className="text-sm text-gray-700 cursor-pointer select-none"
        >
          Remember me for 30 days
        </Label>
      </div> */}

      {/* Server Error */}
      {serverError && (
        <div
          className="p-4 bg-red-50 border border-red-200 rounded-lg"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Authentication Failed
              </h3>
              <p className="text-sm text-red-700 mt-1">{serverError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
