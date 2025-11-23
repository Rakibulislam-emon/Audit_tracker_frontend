"use client";

import React from "react";
import LoginForm from "./LoginForm";
import { ShieldCheck, Lock, Activity, Globe } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Branding & Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">AuditTracker</span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-lg space-y-8">
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Enterprise Grade <br />
            <span className="text-blue-500">Audit Management</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Streamline your compliance workflow with our secure, real-time audit
            platform. Designed for modern enterprises that demand excellence.
          </p>

          {/* Feature List */}
          <div className="grid grid-cols-2 gap-6 pt-8">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">SOC 2 Secure</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Bank-grade encryption
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">Real-time Sync</h3>
                <p className="text-sm text-slate-500 mt-1">Instant updates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 flex items-center justify-between text-sm text-slate-500">
          <p>© 2024 Audit Tracker Inc.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">
              Terms
            </span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">
              Contact
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="text-slate-500">
              Please enter your details to sign in.
            </p>
          </div>

          <LoginForm />

          <div className="pt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <a
              href="#"
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
