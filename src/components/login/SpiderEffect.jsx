"use client";

import {
  Calendar,
  CheckSquare,
  ClipboardList,
  FileText,
  MapPin,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";

// ──────────────────────────────────────────────────────────────
//  IconWrapper – unchanged (keeps glow / float / hover)
// ──────────────────────────────────────────────────────────────
const IconWrapper = ({
  children,
  isHighlighted = false,
  isHovered = false,
  className = "",
}) => {
  return (
    <div
      className={`
        backdrop-blur-xl rounded-2xl flex items-center justify-center transition-all duration-300 border
        ${
          isHighlighted
            ? "bg-gray-100/80 dark:bg-gray-700/50 border-blue-400/50 shadow-2xl animate-breathing-glow"
            : `bg-white/60 dark:bg-white/5 border-gray-300/60 ${
                !isHovered && "animate-float"
              }`
        }
        ${
          isHovered
            ? "bg-gray-200/80 dark:bg-gray-600/50 border-blue-400/60 scale-110 shadow-2xl"
            : ""
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
//  Core data – the 7 modules shown in the spider
// ──────────────────────────────────────────────────────────────
const auditModules = [
  { id: 1, name: "Users", icon: <User size={24} /> },
  { id: 2, name: "Teams", icon: <Users size={24} /> },
  { id: 3, name: "Sites", icon: <MapPin size={24} /> },
  { id: 4, name: "Programs", icon: <ClipboardList size={24} /> },
  { id: 5, name: "Schedules", icon: <Calendar size={24} /> },
  { id: 6, name: "Observations", icon: <CheckSquare size={24} /> },
  { id: 7, name: "Reports", icon: <FileText size={24} /> },
];

// ──────────────────────────────────────────────────────────────
//  IconGrid – the spider web itself (unchanged logic)
// ──────────────────────────────────────────────────────────────
const IconGrid = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const radius = 160;
  const centralIconRadius = 48;
  const outerIconRadius = 32;
  const svgSize = 400;
  const svgCenter = svgSize / 2;

  return (
    <div className="relative w-[400px] h-[400px]">
      {/* ----- Connecting lines ----- */}
      <svg width={svgSize} height={svgSize} className="absolute top-0 left-0">
        <g>
          {auditModules.map((icon, i) => {
            const nextIndex = (i + 1) % auditModules.length;
            const nextIcon = auditModules[nextIndex];
            const angle1 =
              (-90 + i * (360 / auditModules.length)) * (Math.PI / 180);
            const x1 =
              svgCenter + (radius - outerIconRadius) * Math.cos(angle1);
            const y1 =
              svgCenter + (radius - outerIconRadius) * Math.sin(angle1);
            const angle2 =
              (-90 + nextIndex * (360 / auditModules.length)) * (Math.PI / 180);
            const x2 =
              svgCenter + (radius - outerIconRadius) * Math.cos(angle2);
            const y2 =
              svgCenter + (radius - outerIconRadius) * Math.sin(angle2);
            const isLineActive =
              hoveredId === icon.id || hoveredId === nextIcon.id;

            return (
              <line
                key={`line-${icon.id}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isLineActive ? "#3B82F6" : "#6B7280"}
                strokeWidth="1.5"
                className="transition-all duration-300"
                style={{ opacity: isLineActive ? 0.8 : 0.25 }}
              />
            );
          })}
        </g>
      </svg>

      {/* ----- Central + Outer icons ----- */}
      <div className="absolute top-1/2 left-1/2">
        {/* Central */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2 z-10">
          <IconWrapper isHighlighted={true} className="w-24 h-24">
            <ClipboardList size={32} />
          </IconWrapper>
        </div>

        {/* Outer */}
        {auditModules.map((icon, i) => {
          const angle =
            (-90 + i * (360 / auditModules.length)) * (Math.PI / 180);
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          const isHovered = hoveredId === icon.id;

          return (
            <div
              key={icon.id}
              className="absolute z-10"
              style={{ transform: `translate(${x}px, ${y}px)` }}
              onMouseEnter={() => setHoveredId(icon.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="-translate-x-1/2 -translate-y-1/2 relative">
                <div
                  className={`absolute inset-[-20px] bg-blue-500/20 rounded-full blur-2xl transition-opacity duration-300 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />
                <IconWrapper isHovered={isHovered} className="w-16 h-16">
                  {icon.icon}
                </IconWrapper>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
//  Main exported component – now includes title + tagline
// ──────────────────────────────────────────────────────────────
export default function SpiderEffect() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md space-y-6 p-4">
      {/* ---- Preview title ---- */}
      <h2 className="text-3xl font-bold text-gray-800 text-center">
        What Audit Tracker Does
      </h2>

      {/* ---- Spider web ---- */}
      <IconGrid />

      {/* ---- Short tagline ---- */}
      <p className="text-center text-sm text-gray-600 max-w-xs">
        A connected hub for Users, Teams, Sites, Programs, Schedules, Observations & Reports.
      </p>

      {/* ---- Inline CSS (kept from original) ---- */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }

        @keyframes breathing-glow {
          0% { box-shadow: 0 0 20px rgba(59,130,246,0.3); }
          50% { box-shadow: 0 0 35px 10px rgba(59,130,246,0.1); }
          100% { box-shadow: 0 0 20px rgba(59,130,246,0.3); }
        }
        .animate-breathing-glow { animation: breathing-glow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}