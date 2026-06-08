import React from "react";
import { LayerRenderContext, getColorFromEffect, getFaceParams } from "./common";
import { FaceShape } from "@/types";

export function renderBlushLayer(ctx: LayerRenderContext): React.ReactNode {
  const opacity = ctx.effects.blush ? 1 : 0;
  const suffix = ctx.gradientSuffix || "";
  const gradientId = `blushGradient${suffix}`;
  const color1 = getColorFromEffect(ctx.effects.blush, "#FFB6C1");
  const color2 = getColorFromEffect(ctx.effects.blush, "#FF9AAF", true);
  const face = getFaceParams(ctx.faceShape);
  const shape = ctx.faceShape;
  const rx = shape === "round" ? 24 : 28;
  const ry = shape === "square" ? 14 : 18;
  const rxInner = shape === "round" ? 12 : 15;
  const ryInner = shape === "square" ? 6 : 8;
  return (
    <g className="makeup-layer blush-layer" style={{ opacity }}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>
      <ellipse cx={face.cheekCx1} cy={face.cheekCy} rx={rx} ry={ry} fill={`url(#${gradientId})`} opacity="0.55" />
      <ellipse cx={face.cheekCx2} cy={face.cheekCy} rx={rx} ry={ry} fill={`url(#${gradientId})`} opacity="0.55" />
      <ellipse cx={face.cheekCx1} cy={face.cheekCy - 3} rx={rxInner} ry={ryInner} fill={color2} opacity="0.4" />
      <ellipse cx={face.cheekCx2} cy={face.cheekCy - 3} rx={rxInner} ry={ryInner} fill={color2} opacity="0.4" />
    </g>
  );
}
