import React from "react";
import { CompletedEffect, CharacterProfile, FaceShape, OutfitStyle, Scene } from "@/types";
import { renderMakeupLayers, LayerRenderContext, getColorFromEffect } from "@/lib/makeupLayers";
import {
  getSkinToneColors,
  getFaceShapeParams,
  getOutfitColors,
  getSceneDecor,
} from "@/data";

interface AvatarProps {
  effects: CompletedEffect;
  isComplete: boolean;
  characterProfile?: CharacterProfile;
  gradientSuffix?: string;
}

function getOutfitPath(outfit: OutfitStyle | null | undefined, colors: { c1: string; c2: string }) {
  switch (outfit) {
    case "dress":
      return (
        <path
          d="M 80 400 Q 100 380 150 385 L 200 370 L 250 385 Q 300 380 320 400 L 340 475 L 60 475 Z"
          fill="url(#outfitGradient)"
          opacity="0.9"
        />
      );
    case "casual":
      return (
        <>
          <path
            d="M 90 395 Q 120 380 200 380 Q 280 380 310 395 L 320 475 L 80 475 Z"
            fill="url(#outfitGradient)"
            opacity="0.9"
          />
          <path
            d="M 160 380 L 200 365 L 240 380 L 230 395 L 200 388 L 170 395 Z"
            fill={colors.c2}
            opacity="0.6"
          />
        </>
      );
    case "suit":
      return (
        <>
          <path
            d="M 85 395 Q 115 380 200 380 Q 285 380 315 395 L 325 475 L 75 475 Z"
            fill="url(#outfitGradient)"
            opacity="0.95"
          />
          <path
            d="M 155 380 L 200 368 L 245 380 L 230 475 L 200 475 L 170 475 Z"
            fill="white"
            opacity="0.9"
          />
          <circle cx="200" cy="410" r="3" fill={colors.c2} />
          <circle cx="200" cy="435" r="3" fill={colors.c2} />
          <circle cx="200" cy="460" r="3" fill={colors.c2} />
        </>
      );
    case "resort":
      return (
        <>
          <path
            d="M 70 405 Q 100 382 170 388 L 200 372 L 230 388 Q 300 382 330 405 L 350 475 L 50 475 Z"
            fill="url(#outfitGradient)"
            opacity="0.85"
          />
          <path d="M 100 420 Q 130 415 160 425" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
          <path d="M 240 425 Q 270 415 300 420" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
          <circle cx="130" cy="450" r="4" fill="white" opacity="0.6" />
          <circle cx="270" cy="450" r="4" fill="white" opacity="0.6" />
        </>
      );
    default:
      return null;
  }
}

export default function Avatar({
  effects,
  isComplete,
  characterProfile,
  gradientSuffix = "",
}: AvatarProps) {
  const skinTone = characterProfile?.skinTone;
  const faceShape = characterProfile?.faceShape as FaceShape | null | undefined;
  const scene = characterProfile?.scene as Scene | null | undefined;
  const outfit = characterProfile?.outfitStyle as OutfitStyle | null | undefined;

  const baseSkin = getSkinToneColors(skinTone);
  const faceParams = getFaceShapeParams(faceShape);
  const outfitColors = getOutfitColors(outfit);
  const sceneDecor = getSceneDecor(scene);
  const showOutfit = !!outfit;

  const lipstickColor1 = getColorFromEffect(effects.lipstick, "#FF6B8A");
  const eyeshadowColor1 = getColorFromEffect(effects.eyeshadow, "#FFB6C1");

  const layerCtx: LayerRenderContext = {
    effects,
    faceShape,
    gradientSuffix,
  };

  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-pink-200 via-lavender-100 to-peach-100 opacity-60 blur-2xl animate-pulse-slow" />

      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-5xl animate-float pointer-events-none z-10">
        {sceneDecor ? sceneDecor.top : isComplete ? "👑" : effects.skincare ? "💖" : "✨"}
      </div>

      <svg
        viewBox="0 0 400 480"
        className="relative w-full max-w-sm h-auto drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`faceGradient${gradientSuffix}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={baseSkin.c1} />
            <stop offset="100%" stopColor={baseSkin.c2} />
          </radialGradient>
          <linearGradient id={`hairGradient${gradientSuffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6B4423" />
            <stop offset="100%" stopColor="#4A2F17" />
          </linearGradient>
          <linearGradient id={`outfitGradient${gradientSuffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={outfitColors.c1} />
            <stop offset="100%" stopColor={outfitColors.c2} />
          </linearGradient>
          <filter id={`softGlow${gradientSuffix}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {showOutfit && (
          <g className="makeup-layer outfit-layer" style={{ opacity: 1 }}>
            {(() => {
              const rendered = getOutfitPath(outfit, outfitColors);
              if (!rendered) return null;
              const withFixedGradients = React.Children.map(rendered, (child) => {
                if (!React.isValidElement(child)) return child;
                if (child.props.fill === "url(#outfitGradient)") {
                  return React.cloneElement(child as React.ReactElement<any>, {
                    fill: `url(#outfitGradient${gradientSuffix})`,
                  });
                }
                return child;
              });
              return withFixedGradients;
            })()}
          </g>
        )}

        <g className="makeup-layer hair-back-layer">
          <ellipse
            cx="200"
            cy="200"
            rx={faceParams.rx + 35}
            ry={faceParams.ry + 35}
            fill={`url(#hairGradient${gradientSuffix})`}
          />
          <path
            d="M 60 220 Q 40 180 60 120 Q 80 60 200 50 Q 320 60 340 120 Q 360 180 340 220"
            fill={`url(#hairGradient${gradientSuffix})`}
          />
        </g>

        <g className="makeup-layer face-base-layer">
          <ellipse
            cx="200"
            cy="230"
            rx={faceParams.rx}
            ry={faceParams.ry}
            fill={`url(#faceGradient${gradientSuffix})`}
          />
        </g>

        <g className="makeup-layer hair-front-layer">
          <path
            d="M 85 140 Q 100 80 200 70 Q 300 80 315 140 Q 290 130 250 145 Q 220 160 200 150 Q 180 160 150 145 Q 110 130 85 140"
            fill={`url(#hairGradient${gradientSuffix})`}
          />
          <path d="M 90 150 Q 110 130 140 155 Q 130 180 100 190 Q 85 175 90 150" fill="#5A3A1C" />
          <path d="M 310 150 Q 290 130 260 155 Q 270 180 300 190 Q 315 175 310 150" fill="#5A3A1C" />
        </g>

        <g className="makeup-layer ears-layer">
          <ellipse
            cx={200 - faceParams.rx + 8}
            cy="240"
            rx="15"
            ry="25"
            fill={`url(#faceGradient${gradientSuffix})`}
          />
          <ellipse
            cx={200 + faceParams.rx - 8}
            cy="240"
            rx="15"
            ry="25"
            fill={`url(#faceGradient${gradientSuffix})`}
          />
        </g>

        {renderMakeupLayers(layerCtx)}

        <g className="makeup-layer eyes-layer">
          <ellipse cx="155" cy="225" rx="22" ry="18" fill="white" />
          <ellipse cx="245" cy="225" rx="22" ry="18" fill="white" />
          <circle cx="155" cy="227" r="10" fill="#5D4037" />
          <circle cx="245" cy="227" r="10" fill="#5D4037" />
          <circle cx="155" cy="227" r="5" fill="#2D1B0E" />
          <circle cx="245" cy="227" r="5" fill="#2D1B0E" />
          <circle cx="152" cy="224" r="3" fill="white" />
          <circle cx="242" cy="224" r="3" fill="white" />
        </g>

        <g className="makeup-layer nose-layer">
          <path
            d="M 200 240 Q 192 270 188 285 Q 195 295 200 295 Q 205 295 212 285 Q 208 270 200 240"
            fill="none"
            stroke="#D4A574"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <ellipse cx="192" cy="292" rx="5" ry="4" fill="#D4A574" opacity="0.4" />
          <ellipse cx="208" cy="292" rx="5" ry="4" fill="#D4A574" opacity="0.4" />
        </g>

        {isComplete && (
          <g className="makeup-layer complete-sparkles-layer" style={{ opacity: 1 }}>
            <g className="animate-sparkle" style={{ transformOrigin: "60px 100px" }}>
              <path d="M 60 90 L 63 100 L 73 103 L 63 106 L 60 116 L 57 106 L 47 103 L 57 100 Z" fill="#FFD700" />
            </g>
            <g
              className="animate-sparkle"
              style={{ transformOrigin: "340px 120px", animationDelay: "0.5s" }}
            >
              <path
                d="M 340 110 L 343 120 L 353 123 L 343 126 L 340 136 L 337 126 L 327 123 L 337 120 Z"
                fill={lipstickColor1}
              />
            </g>
            <g
              className="animate-sparkle"
              style={{ transformOrigin: "80px 350px", animationDelay: "0.3s" }}
            >
              <path
                d="M 80 340 L 83 350 L 93 353 L 83 356 L 80 366 L 77 356 L 67 353 L 77 350 Z"
                fill="#E9D8FD"
              />
            </g>
            <g
              className="animate-sparkle"
              style={{ transformOrigin: "320px 370px", animationDelay: "0.7s" }}
            >
              <path
                d="M 320 360 L 323 370 L 333 373 L 323 376 L 320 386 L 317 376 L 307 373 L 317 370 Z"
                fill={eyeshadowColor1}
              />
            </g>
          </g>
        )}

        {sceneDecor && !isComplete && (
          <g className="makeup-layer scene-decor-layer" style={{ opacity: 0.9 }}>
            <text x="320" y="420" fontSize="28">
              {sceneDecor.bottom}
            </text>
          </g>
        )}
      </svg>

      {isComplete && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-pink-400 to-lavender-200 rounded-full text-white font-bold text-lg shadow-lg animate-bounce-slow">
          化妆完成！✨
        </div>
      )}
    </div>
  );
}
