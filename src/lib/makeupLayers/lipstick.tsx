import React from "react";
import { LayerRenderContext, getColorFromEffect } from "./common";

export function renderLipstickLayer(ctx: LayerRenderContext): React.ReactNode {
  const active = !!ctx.effects.lipstick;
  const suffix = ctx.gradientSuffix || "";
  const gradientId = `lipstickGradient${suffix}`;
  const color1 = getColorFromEffect(ctx.effects.lipstick, "#FF6B8A");
  const color2 = getColorFromEffect(ctx.effects.lipstick, "#E85070", true);
  const underLipFill = active ? "#E8B4B8" : "#F0B0A8";
  return (
    <>
      <g className="makeup-layer lipstick-under-layer" style={{ opacity: active ? 0.3 : 1 }}>
        <path
          d="M 170 325 Q 185 315 200 320 Q 215 315 230 325 Q 225 340 200 342 Q 175 340 170 325"
          fill={underLipFill}
        />
      </g>
      <g
        className="makeup-layer lipstick-layer"
        style={{ opacity: active ? 1 : 0 }}
        filter={`url(#softGlow${suffix})`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        <path
          d="M 165 322 Q 180 308 200 315 Q 220 308 235 322 Q 230 330 220 326 Q 210 332 200 328 Q 190 332 180 326 Q 170 330 165 322"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M 168 325 Q 185 318 200 322 Q 215 318 232 325 Q 228 345 200 350 Q 172 345 168 325"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M 175 328 Q 185 325 200 328"
          fill="none"
          stroke={color1}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>
    </>
  );
}
