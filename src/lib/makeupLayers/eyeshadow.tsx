import React from "react";
import { LayerRenderContext, getColorFromEffect } from "./common";

export function renderEyeshadowLayer(ctx: LayerRenderContext): React.ReactNode {
  const opacity = ctx.effects.eyeshadow ? 1 : 0;
  const suffix = ctx.gradientSuffix || "";
  const gradientId = `eyeshadowGradient${suffix}`;
  const color1 = getColorFromEffect(ctx.effects.eyeshadow, "#FFB6C1");
  const color2 = getColorFromEffect(ctx.effects.eyeshadow, "#FF9AAF", true);
  return (
    <g className="makeup-layer eyeshadow-layer" style={{ opacity }}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>
      <ellipse cx="155" cy="215" rx="30" ry="18" fill={`url(#${gradientId})`} opacity="0.7" />
      <ellipse cx="245" cy="215" rx="30" ry="18" fill={`url(#${gradientId})`} opacity="0.7" />
      <ellipse cx="155" cy="220" rx="20" ry="10" fill={color2} opacity="0.5" />
      <ellipse cx="245" cy="220" rx="20" ry="10" fill={color2} opacity="0.5" />
      <circle cx="140" cy="212" r="3" fill="white" opacity="0.6" />
      <circle cx="260" cy="212" r="3" fill="white" opacity="0.6" />
    </g>
  );
}
