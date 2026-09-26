import React from 'react';

export const TransportTruckLogo: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => {
  return (
    <svg
      viewBox="0 0 160 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Transport Logo"
    >
      <defs>
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0054a6" />
          <stop offset="100%" stopColor="#003366" />
        </linearGradient>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0072ce" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>

      {/* Dynamic speed swoosh arcs framing the truck */}
      <path
        d="M 5,80 C 15,30 55,8 110,8 C 130,8 145,15 155,25 C 135,16 115,14 90,16 C 50,20 22,42 12,80 Z"
        fill="url(#blueGrad)"
      />
      <path
        d="M 2,86 C 18,50 50,30 92,26 C 118,24 140,29 152,38 C 135,32 110,29 88,32 C 50,37 20,58 8,86 Z"
        fill="url(#skyGrad)"
      />

      {/* Highway / Road perspective lines */}
      <path
        d="M 8,88 L 68,90 L 58,104 L 0,98 Z"
        fill="#0054a6"
      />
      <path
        d="M 12,91 L 64,92 L 56,101 L 4,96 Z"
        fill="#ffffff"
      />
      {/* Road lane dashes */}
      <line x1="18" y1="95" x2="30" y2="96" stroke="#0054a6" strokeWidth="2.5" strokeDasharray="5 3" />
      <line x1="38" y1="97" x2="50" y2="98" stroke="#0054a6" strokeWidth="2.5" />

      {/* Truck Body - Heavy Duty Cab */}
      <g id="truck-cab">
        {/* Cab Main Body */}
        <path
          d="M 72,40 L 110,38 L 126,50 L 132,66 L 132,88 L 72,88 Z"
          fill="#ffffff"
          stroke="#003870"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Front Windshield with sleek sun visor */}
        <path
          d="M 108,41 L 123,51 L 122,64 L 102,64 L 102,41 Z"
          fill="#0054a6"
        />
        {/* Windshield highlight */}
        <path
          d="M 104,44 L 115,44 L 108,61 L 104,61 Z"
          fill="#ffffff"
          fillOpacity="0.4"
        />

        {/* Aerodynamic roof spoiler */}
        <path
          d="M 72,40 C 85,34 100,34 112,38 L 108,42 L 72,42 Z"
          fill="#003870"
        />

        {/* Side door window */}
        <path
          d="M 76,46 L 98,46 L 98,64 L 76,64 Z"
          fill="#0054a6"
        />
        {/* Door handle & line */}
        <line x1="80" y1="70" x2="88" y2="70" stroke="#003870" strokeWidth="2" />
        <line x1="72" y1="44" x2="72" y2="84" stroke="#003870" strokeWidth="1.5" />

        {/* Front Grill & Bumper */}
        <rect
          x="122"
          y="66"
          width="10"
          height="18"
          rx="2"
          fill="#003870"
        />
        {/* Grill horizontal chrome slats */}
        <line x1="123" y1="69" x2="131" y2="69" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="123" y1="73" x2="131" y2="73" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="123" y1="77" x2="131" y2="77" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="123" y1="81" x2="131" y2="81" stroke="#ffffff" strokeWidth="1.5" />

        {/* Headlight */}
        <polygon points="127,82 133,82 131,86 126,86" fill="#facc15" />

        {/* Side step plate */}
        <rect x="74" y="82" width="22" height="4" fill="#64748b" />

        {/* Front Wheel */}
        <circle cx="116" cy="88" r="10" fill="#1e293b" stroke="#003870" strokeWidth="2" />
        <circle cx="116" cy="88" r="5" fill="#94a3b8" />
        <circle cx="116" cy="88" r="2" fill="#0f172a" />

        {/* Rear Wheels */}
        <circle cx="82" cy="88" r="10" fill="#1e293b" stroke="#003870" strokeWidth="2" />
        <circle cx="82" cy="88" r="5" fill="#94a3b8" />
        <circle cx="82" cy="88" r="2" fill="#0f172a" />

        {/* Dual exhaust pipes */}
        <rect x="70" y="32" width="3" height="18" fill="#475569" rx="1" />
        <rect x="67" y="34" width="3" height="16" fill="#64748b" rx="1" />

        {/* Sleek side stripe on cab */}
        <path d="M 72,74 L 122,74 L 120,78 L 72,78 Z" fill="#0072ce" />
      </g>
    </svg>
  );
};
