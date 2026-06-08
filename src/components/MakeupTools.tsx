import React from "react";

interface ToolIconProps {
  size?: number;
  className?: string;
}

const BrushFoundation: React.FC<ToolIconProps> = ({ size = 64, className = "" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
    <defs>
      <linearGradient id="brushHandleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B6914" />
        <stop offset="50%" stopColor="#D4A853" />
        <stop offset="100%" stopColor="#8B6914" />
      </linearGradient>
      <linearGradient id="brushMetalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#A0A0A0" />
        <stop offset="50%" stopColor="#E8E8E8" />
        <stop offset="100%" stopColor="#A0A0A0" />
      </linearGradient>
      <linearGradient id="brushBristleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2D1810" />
        <stop offset="30%" stopColor="#4A2C1E" />
        <stop offset="100%" stopColor="#1A0F08" />
      </linearGradient>
    </defs>
    <rect x="40" y="55" width="20" height="40" rx="3" fill="url(#brushHandleGrad)" />
    <rect x="38" y="50" width="24" height="10" rx="2" fill="url(#brushMetalGrad)" />
    <ellipse cx="50" cy="30" rx="22" ry="28" fill="url(#brushBristleGrad)" />
    <ellipse cx="50" cy="28" rx="18" ry="22" fill="#3D2416" opacity="0.5" />
    <path d="M 30 35 Q 32 45 38 50" stroke="#5A3828" strokeWidth="1" fill="none" opacity="0.6" />
    <path d="M 70 35 Q 68 45 62 50" stroke="#5A3828" strokeWidth="1" fill="none" opacity="0.6" />
    <ellipse cx="50" cy="8" rx="10" ry="6" fill="#F5E6D3" opacity="0.6" />
  </svg>
);

const BeautySponge: React.FC<ToolIconProps> = ({ size = 64, className = "" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
    <defs>
      <radialGradient id="spongeGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFD4C4" />
        <stop offset="40%" stopColor="#FFB8A0" />
        <stop offset="100%" stopColor="#E8957A" />
      </radialGradient>
      <radialGradient id="spongeHighlight" cx="30%" cy="25%" r="40%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
    </defs>
    <path
      d="M 50 10 Q 75 15 80 45 Q 82 75 65 90 Q 50 98 35 90 Q 18 75 20 45 Q 25 15 50 10"
      fill="url(#spongeGrad)"
    />
    <path
      d="M 50 10 Q 75 15 80 45 Q 82 75 65 90 Q 50 98 35 90 Q 18 75 20 45 Q 25 15 50 10"
      fill="url(#spongeHighlight)"
    />
    <ellipse cx="35" cy="35" rx="3" ry="4" fill="#FFA080" opacity="0.4" />
    <ellipse cx="60" cy="50" rx="4" ry="3" fill="#FFA080" opacity="0.4" />
    <ellipse cx="45" cy="65" rx="3" ry="3" fill="#FFA080" opacity="0.4" />
    <ellipse cx="55" cy="75" rx="3" ry="3" fill="#FFA080" opacity="0.4" />
    <ellipse cx="38" cy="55" rx="2" ry="2" fill="#FFA080" opacity="0.3" />
  </svg>
);

const BrushLarge: React.FC<ToolIconProps> = ({ size = 64, className = "" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
    <defs>
      <linearGradient id="lBrushHandleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C9A86C" />
        <stop offset="50%" stopColor="#E8C989" />
        <stop offset="100%" stopColor="#C9A86C" />
      </linearGradient>
      <linearGradient id="lBrushMetalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#888888" />
        <stop offset="50%" stopColor="#D8D8D8" />
        <stop offset="100%" stopColor="#888888" />
      </linearGradient>
      <radialGradient id="lBrushBristleGrad" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#8B4513" />
        <stop offset="60%" stopColor="#5C2E0C" />
        <stop offset="100%" stopColor="#3A1C05" />
      </radialGradient>
    </defs>
    <rect x="42" y="60" width="16" height="38" rx="4" fill="url(#lBrushHandleGrad)" />
    <rect x="39" y="54" width="22" height="10" rx="3" fill="url(#lBrushMetalGrad)" />
    <ellipse cx="50" cy="28" rx="28" ry="28" fill="url(#lBrushBristleGrad)" />
    <ellipse cx="50" cy="26" rx="22" ry="22" fill="#6B3410" opacity="0.4" />
    <circle cx="50" cy="8" r="8" fill="#F0E0C8" opacity="0.5" />
  </svg>
);

const BrushSmall: React.FC<ToolIconProps> = ({ size = 64, className = "" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
    <defs>
      <linearGradient id="sBrushHandleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2C1810" />
        <stop offset="50%" stopColor="#5A3828" />
        <stop offset="100%" stopColor="#2C1810" />
      </linearGradient>
      <linearGradient id="sBrushMetalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#B8860B" />
        <stop offset="50%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
    </defs>
    <rect x="44" y="52" width="12" height="46" rx="3" fill="url(#sBrushHandleGrad)" />
    <rect x="42" y="46" width="16" height="10" rx="2" fill="url(#sBrushMetalGrad)" />
    <ellipse cx="50" cy="28" rx="14" ry="22" fill="#2D1810" />
    <ellipse cx="50" cy="26" rx="10" ry="16" fill="#4A2C1E" opacity="0.5" />
    <ellipse cx="50" cy="12" rx="5" ry="4" fill="#E8D0B0" opacity="0.5" />
  </svg>
);

const BrushBlush: React.FC<ToolIconProps> = ({ size = 64, className = "" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
    <defs>
      <linearGradient id="blBrushHandleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DEB887" />
        <stop offset="50%" stopColor="#F5DEB3" />
        <stop offset="100%" stopColor="#DEB887" />
      </linearGradient>
      <linearGradient id="blBrushMetalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C0C0C0" />
        <stop offset="50%" stopColor="#F0F0F0" />
        <stop offset="100%" stopColor="#C0C0C0" />
      </linearGradient>
      <radialGradient id="blBrushBristleGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#D2691E" />
        <stop offset="60%" stopColor="#8B4513" />
        <stop offset="100%" stopColor="#5C2E0C" />
      </radialGradient>
    </defs>
    <rect x="43" y="58" width="14" height="40" rx="4" fill="url(#blBrushHandleGrad)" />
    <rect x="40" y="52" width="20" height="10" rx="3" fill="url(#blBrushMetalGrad)" />
    <ellipse cx="50" cy="30" rx="24" ry="26" fill="url(#blBrushBristleGrad)" />
    <ellipse cx="50" cy="28" rx="18" ry="20" fill="#A0522D" opacity="0.4" />
    <ellipse cx="50" cy="10" rx="8" ry="6" fill="#FFB6C1" opacity="0.5" />
  </svg>
);

const ConcealerBrush: React.FC<ToolIconProps> = ({ size = 64, className = "" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
    <defs>
      <linearGradient id="cBrushHandleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1C1C1C" />
        <stop offset="50%" stopColor="#3A3A3A" />
        <stop offset="100%" stopColor="#1C1C1C" />
      </linearGradient>
      <linearGradient id="cBrushMetalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8B7355" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#8B7355" />
      </linearGradient>
    </defs>
    <rect x="45" y="50" width="10" height="48" rx="2" fill="url(#cBrushHandleGrad)" />
    <rect x="43" y="44" width="14" height="10" rx="2" fill="url(#cBrushMetalGrad)" />
    <path d="M 40 44 Q 50 10 60 44 Z" fill="#2D1810" />
    <path d="M 43 43 Q 50 18 57 43 Z" fill="#4A2C1E" opacity="0.6" />
  </svg>
);

const BrowPencil: React.FC<ToolIconProps> = ({ size = 64, className = "" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
    <defs>
      <linearGradient id="pencilBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8B6914" />
        <stop offset="30%" stopColor="#D4A853" />
        <stop offset="70%" stopColor="#D4A853" />
        <stop offset="100%" stopColor="#8B6914" />
      </linearGradient>
      <linearGradient id="pencilTipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F5DEB3" />
        <stop offset="100%" stopColor="#DEB887" />
      </linearGradient>
    </defs>
    <rect x="42" y="28" width="16" height="65" rx="2" fill="url(#pencilBodyGrad)" />
    <rect x="40" y="25" width="20" height="6" rx="1" fill="#5C4033" />
    <path d="M 42 28 L 50 5 L 58 28 Z" fill="url(#pencilTipGrad)" />
    <path d="M 46 20 L 50 5 L 54 20 Z" fill="#4A3728" />
    <path d="M 48 12 L 50 5 L 52 12 Z" fill="#2C1810" />
    <rect x="42" y="82" width="16" height="12" rx="1" fill="#2C2C2C" />
  </svg>
);

const EyelinerPen: React.FC<ToolIconProps> = ({ size = 64, className = "" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
    <defs>
      <linearGradient id="linerBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1C1C1C" />
        <stop offset="30%" stopColor="#3A3A3A" />
        <stop offset="70%" stopColor="#3A3A3A" />
        <stop offset="100%" stopColor="#1C1C1C" />
      </linearGradient>
    </defs>
    <rect x="43" y="25" width="14" height="70" rx="3" fill="url(#linerBodyGrad)" />
    <rect x="41" y="22" width="18" height="5" rx="1" fill="#C0C0C0" />
    <path d="M 43 25 L 50 2 L 57 25 Z" fill="#2C2C2C" />
    <path d="M 47 15 L 50 2 L 53 15 Z" fill="#1C1C1C" />
    <circle cx="50" cy="3" r="2" fill="#0C0C0C" />
    <rect x="44" y="85" width="12" height="10" rx="2" fill="#C0C0C0" />
    <ellipse cx="50" cy="90" rx="4" ry="3" fill="#E8E8E8" opacity="0.6" />
  </svg>
);

const MascaraWand: React.FC<ToolIconProps> = ({ size = 64, className = "" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
    <defs>
      <linearGradient id="mascaraHandleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2C1810" />
        <stop offset="50%" stopColor="#5A3828" />
        <stop offset="100%" stopColor="#2C1810" />
      </linearGradient>
      <linearGradient id="mascaraWandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#C0C0C0" />
        <stop offset="100%" stopColor="#808080" />
      </linearGradient>
    </defs>
    <rect x="44" y="55" width="12" height="42" rx="3" fill="url(#mascaraHandleGrad)" />
    <rect x="46" y="48" width="8" height="12" fill="url(#mascaraWandGrad)" />
    <ellipse cx="50" cy="28" rx="8" ry="22" fill="#1C1C1C" />
    <g stroke="#0C0C0C" strokeWidth="2" strokeLinecap="round">
      <line x1="42" y1="12" x2="38" y2="8" />
      <line x1="44" y1="18" x2="38" y2="16" />
      <line x1="44" y1="24" x2="38" y2="24" />
      <line x1="44" y1="30" x2="38" y2="32" />
      <line x1="44" y1="36" x2="38" y2="40" />
      <line x1="58" y1="12" x2="62" y2="8" />
      <line x1="56" y1="18" x2="62" y2="16" />
      <line x1="56" y1="24" x2="62" y2="24" />
      <line x1="56" y1="30" x2="62" y2="32" />
      <line x1="56" y1="36" x2="62" y2="40" />
    </g>
  </svg>
);

const Lipstick: React.FC<ToolIconProps> = ({ size = 64, className = "" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
    <defs>
      <linearGradient id="lipstickGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF6B8A" />
        <stop offset="50%" stopColor="#E85070" />
        <stop offset="100%" stopColor="#C43050" />
      </linearGradient>
      <linearGradient id="lipstickTubeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1C1C1C" />
        <stop offset="30%" stopColor="#3A3A3A" />
        <stop offset="70%" stopColor="#3A3A3A" />
        <stop offset="100%" stopColor="#1C1C1C" />
      </linearGradient>
      <linearGradient id="lipstickCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="50%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#D4AF37" />
      </linearGradient>
    </defs>
    <rect x="40" y="55" width="20" height="42" rx="3" fill="url(#lipstickTubeGrad)" />
    <rect x="38" y="50" width="24" height="8" rx="2" fill="url(#lipstickCapGrad)" />
    <rect x="42" y="25" width="16" height="30" rx="2" fill="url(#lipstickGrad)" />
    <path d="M 42 25 Q 50 5 58 25 Z" fill="url(#lipstickGrad)" />
    <path d="M 45 22 Q 50 10 55 22 Z" fill="#FF8BA0" opacity="0.5" />
    <ellipse cx="50" cy="15" rx="3" ry="2" fill="#FFB0C0" opacity="0.6" />
  </svg>
);

const SkincarePad: React.FC<ToolIconProps> = ({ size = 64, className = "" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
    <defs>
      <radialGradient id="padGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#F5F5F5" />
        <stop offset="100%" stopColor="#E0E0E0" />
      </radialGradient>
      <radialGradient id="padLiquidGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#B8E6FF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#7EC8E3" stopOpacity="0.3" />
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="50" rx="38" ry="35" fill="url(#padGrad)" />
    <ellipse cx="50" cy="48" rx="32" ry="28" fill="url(#padLiquidGrad)" />
    <g stroke="#D8D8D8" strokeWidth="0.5" fill="none" opacity="0.5">
      <path d="M 25 40 Q 35 38 45 42" />
      <path d="M 55 42 Q 65 38 75 40" />
      <path d="M 30 55 Q 40 53 50 57" />
      <path d="M 55 57 Q 65 53 72 55" />
      <path d="M 35 65 Q 45 63 55 67" />
    </g>
    <ellipse cx="40" cy="40" rx="3" ry="2" fill="#A0D8EF" opacity="0.4" />
    <ellipse cx="60" cy="50" rx="2" ry="2" fill="#A0D8EF" opacity="0.4" />
    <ellipse cx="50" cy="60" rx="2.5" ry="2" fill="#A0D8EF" opacity="0.4" />
  </svg>
);

export const TOOL_ICONS: Record<string, React.FC<ToolIconProps>> = {
  sponge: BeautySponge,
  brushLarge: BrushLarge,
  brushMedium: BrushFoundation,
  brushSmall: BrushSmall,
  brushBlush: BrushBlush,
  concealerBrush: ConcealerBrush,
  pencil: BrowPencil,
  eyelinerPen: EyelinerPen,
  mascaraWand: MascaraWand,
  lipstick: Lipstick,
  skincarePad: SkincarePad,
};

export const getToolIcon = (
  toolKey: string | undefined,
  size?: number,
  className?: string
): React.ReactNode => {
  if (!toolKey) return null;
  const IconComponent = TOOL_ICONS[toolKey];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
};

export {
  BrushFoundation,
  BeautySponge,
  BrushLarge,
  BrushSmall,
  BrushBlush,
  ConcealerBrush,
  BrowPencil,
  EyelinerPen,
  MascaraWand,
  Lipstick,
  SkincarePad,
};
