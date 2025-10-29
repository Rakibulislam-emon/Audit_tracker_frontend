"use client";

import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";

// Audit process steps for our visualization
const auditProcessSteps = [
  { id: 1, name: "Plan Audit", icon: "📋", color: "from-blue-500 to-cyan-500" },
  { id: 2, name: "Assign Team", icon: "👥", color: "from-green-500 to-emerald-500" },
  { id: 3, name: "Collect Data", icon: "📊", color: "from-purple-500 to-violet-500" },
  { id: 4, name: "Review Findings", icon: "🔍", color: "from-amber-500 to-orange-500" },
  { id: 5, name: "Generate Report", icon: "📈", color: "from-red-500 to-pink-500" },
  { id: 6, name: "Track Compliance", icon: "✅", color: "from-teal-500 to-green-500" }
];

export default function LoginPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Auto-animate the audit process
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % auditProcessSteps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-200/10 rounded-full blur-3xl animate-pulse-slow delay-500" />
      </div>

      {/* Main content grid */}
      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center justify-center">
        
        {/* Audit Process Visualization - Left Side */}
        <div className="hidden lg:flex flex-col items-center justify-center w-full px-8">
          <div className="max-w-2xl w-full space-y-8">
            {/* Header */}
            <div className="space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-700">Live Audit Dashboard</span>
              </div>
              <h2 className="text-5xl font-bold  tracking-tight bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                See Your Audit Process Come Alive
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Track, manage, and visualize your entire audit workflow in one seamless platform
              </p>
            </div>

            {/* Interactive Process Visualization */}
            <div 
              className="relative  p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-2xl shadow-blue-500/10"
              onMouseEnter={() => setIsAnimating(false)}
              onMouseLeave={() => setIsAnimating(true)}
            >
              {/* Connection Lines */}
              <svg className="absolute  inset-0 w-full h-full pointer-events-none">
                {auditProcessSteps.map((_, index) => {
                  if (index === auditProcessSteps.length - 1) return null;
                  
                  const isActive = index <= activeStep;
                  return (
                    <line
                      key={`line-${index}`}
                      x1={`${(index * 20) + 10}%`}
                      y1="50%"
                      x2={`${((index + 1) * 20) + 10}%`}
                      y2="50%"
                      stroke={isActive ? "url(#gradient-active)" : "#e5e7eb"}
                      strokeWidth="3"
                      className="transition-all  duration-500 ease-out"
                    />
                  );
                })}
                <defs>
                  <linearGradient id="gradient-active" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Process Steps */}
              <div className="relative flex justify-between items-center">
                {auditProcessSteps.map((step, index) => {
                  const isActive = index <= activeStep;
                  const isCurrent = index === activeStep;
                  
                  return (
                    <div key={step.id} className="relative flex flex-col items-center">
                      <button
                        onClick={() => setActiveStep(index)}
                        className={`relative group transition-all duration-500 ease-out ${
                          isCurrent ? 'scale-110' : 'scale-100'
                        }`}
                      >
                        {/* Animated Ring */}
                        <div className={`absolute -inset-4  rounded-full bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                          isCurrent ? 'animate-ping' : ''
                        }`} />
                        
                        {/* Step Circle */}
                        <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-semibold backdrop-blur-sm border-2 transition-all duration-500 ease-out ${
                          isActive 
                            ? `bg-gradient-to-br ${step.color} text-white border-transparent shadow-lg`
                            : 'bg-white/90 text-gray-400 border-gray-200 shadow-sm'
                        }`}>
                          {step.icon}
                          
                          {/* Progress Indicator */}
                          {isActive && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                          )}
                        </div>
                      </button>
                      
                      {/* Step Label */}
                      <div className={`mt-4 text-center transition-all duration-500 ${
                        isActive ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-2'
                      }`}>
                        <div className={`text-sm font-semibold ${
                          isActive ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.name}
                        </div>
                        {isCurrent && (
                          <div className="text-xs text-blue-600 font-medium mt-1 animate-pulse">
                            In Progress
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Data Preview */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-900">Live Activity</span>
                  <span className="text-xs text-blue-700 bg-blue-200/50 px-2 py-1 rounded-full">
                    {auditProcessSteps[activeStep]?.name}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tasks Completed</span>
                    <span className="font-semibold text-gray-900">{(activeStep / auditProcessSteps.length * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(activeStep / auditProcessSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Card - Right Side */}
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
            {/* Enhanced Header with Audit Context */}
            <div className="pt-12 pb-8 px-8 space-y-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50/30">
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
                  <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-blue-100 transition-transform duration-300 group-hover:scale-110">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Audit Tracker
                </h1>
                <p className="text-sm text-gray-600">Secure access to your audit dashboard</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="px-8 pb-8">
              <LoginForm />
            </div>

            {/* Enhanced Footer */}
            <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-100">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  New to Audit Tracker?{" "}
                  <a
                    href="#demo"
                    onClick={(e) => e.preventDefault()}
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  >
                    Request Demo
                  </a>
                </p>
                <p className="text-xs text-gray-500">
                  Enterprise-grade security & compliance
                </p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center space-y-2">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <span>🔒 SOC 2 Compliant</span>
              <span>⚡ Real-time Sync</span>
              <span>🌐 Global Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}