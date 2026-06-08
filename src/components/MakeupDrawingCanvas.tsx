import { useCallback, useState, useMemo } from "react";
import { MakeupStep, ProductOption, CompletedEffect, CharacterProfile } from "@/types";
import { useDrawingInteraction } from "@/hooks/useDrawingInteraction";
import { getColorFromEffect, renderMakeupLayers, LayerRenderContext, getFaceParams } from "@/lib/makeupLayers";
import { getToolIcon } from "@/components/MakeupTools";

interface MakeupDrawingCanvasProps {
  step: MakeupStep;
  selectedProduct: ProductOption | null;
  effects: CompletedEffect;
  characterProfile?: CharacterProfile;
  onComplete: () => void;
  onCancel: () => void;
}

const VIEWBOX_WIDTH = 400;
const VIEWBOX_HEIGHT = 480;

function AvatarSVGInner({
  effects,
  characterProfile,
  strokePoints,
  targetZones,
  productColor,
  toolSize,
  toolPicked,
  currentPos,
}: {
  effects: CompletedEffect;
  characterProfile?: CharacterProfile;
  strokePoints: { x: number; y: number; timestamp: number }[];
  targetZones?: { cx: number; cy: number; rx: number; ry: number }[];
  productColor: string;
  toolSize: number;
  toolPicked: boolean;
  currentPos: { x: number; y: number } | null;
}) {
  const faceShape = characterProfile?.faceShape;
  const face = getFaceParams(faceShape);
  const suffix = "_drawing";

  const baseSkin = (() => {
    const skinTone = characterProfile?.skinTone;
    const map: Record<string, { c1: string; c2: string }> = {
      fair: { c1: "#FFE8D6", c2: "#FFD9B8" },
      natural: { c1: "#FFD9B8", c2: "#F5C49A" },
      wheat: { c1: "#E8B88F", c2: "#D4A373" },
    };
    return skinTone && map[skinTone] ? map[skinTone] : { c1: "#FFE4CC", c2: "#FFCBA4" };
  })();

  const outfit = characterProfile?.outfitStyle;
  const outfitColors = (() => {
    const map: Record<string, { c1: string; c2: string }> = {
      casual: { c1: "#93C5FD", c2: "#60A5FA" },
      dress: { c1: "#F9A8D4", c2: "#EC4899" },
      suit: { c1: "#A5B4FC", c2: "#6366F1" },
      resort: { c1: "#86EFAC", c2: "#22C55E" },
    };
    return outfit && map[outfit] ? map[outfit] : { c1: "#FBCFE8", c2: "#F9A8D4" };
  })();

  const foundationColor1 = getColorFromEffect(effects.foundation, baseSkin.c1);
  const foundationColor2 = getColorFromEffect(effects.foundation, baseSkin.c2, true);
  const primerColor = getColorFromEffect(effects.primer, "#FFF5F0");
  const concealerColor = getColorFromEffect(effects.concealer, baseSkin.c1);
  const powderColor = getColorFromEffect(effects.powder, "#FFF8F0");
  const browsColor = getColorFromEffect(effects.brows, "#5A3A1C");
  const eyeshadowColor1 = getColorFromEffect(effects.eyeshadow, "#FFB6C1");
  const eyeshadowColor2 = getColorFromEffect(effects.eyeshadow, "#FF9AAF", true);
  const eyelinerColor = getColorFromEffect(effects.eyeliner, "#2D1B0E");
  const blushColor1 = getColorFromEffect(effects.blush, "#FFB6C1");
  const blushColor2 = getColorFromEffect(effects.blush, "#FF9AAF", true);
  const lipstickColor1 = getColorFromEffect(effects.lipstick, "#FF6B8A");
  const lipstickColor2 = getColorFromEffect(effects.lipstick, "#E85070", true);

  const layerCtx: LayerRenderContext = {
    effects,
    faceShape,
    gradientSuffix: suffix,
  };

  return (
    <>
      <defs>
        <radialGradient id={`faceGradient${suffix}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={baseSkin.c1} />
          <stop offset="100%" stopColor={baseSkin.c2} />
        </radialGradient>
        <radialGradient id={`foundationGradient${suffix}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={foundationColor1} />
          <stop offset="100%" stopColor={foundationColor2} />
        </radialGradient>
        <linearGradient id={`hairGradient${suffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6B4423" />
          <stop offset="100%" stopColor="#4A2F17" />
        </linearGradient>
        <linearGradient id={`eyeshadowGradient${suffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={eyeshadowColor1} />
          <stop offset="100%" stopColor={eyeshadowColor2} />
        </linearGradient>
        <linearGradient id={`lipstickGradient${suffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lipstickColor1} />
          <stop offset="100%" stopColor={lipstickColor2} />
        </linearGradient>
        <linearGradient id={`blushGradient${suffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={blushColor1} />
          <stop offset="100%" stopColor={blushColor2} />
        </linearGradient>
        <linearGradient id={`outfitGradient${suffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={outfitColors.c1} />
          <stop offset="100%" stopColor={outfitColors.c2} />
        </linearGradient>
        <filter id={`softGlow${suffix}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {outfit === "dress" && (
        <path
          d="M 80 400 Q 100 380 150 385 L 200 370 L 250 385 Q 300 380 320 400 L 340 475 L 60 475 Z"
          fill={`url(#outfitGradient${suffix})`}
          opacity="0.9"
        />
      )}
      {outfit === "casual" && (
        <>
          <path
            d="M 90 395 Q 120 380 200 380 Q 280 380 310 395 L 320 475 L 80 475 Z"
            fill={`url(#outfitGradient${suffix})`}
            opacity="0.9"
          />
          <path
            d="M 160 380 L 200 365 L 240 380 L 230 395 L 200 388 L 170 395 Z"
            fill={outfitColors.c2}
            opacity="0.6"
          />
        </>
      )}
      {outfit === "suit" && (
        <>
          <path
            d="M 85 395 Q 115 380 200 380 Q 285 380 315 395 L 325 475 L 75 475 Z"
            fill={`url(#outfitGradient${suffix})`}
            opacity="0.95"
          />
          <path
            d="M 155 380 L 200 368 L 245 380 L 230 475 L 200 475 L 170 475 Z"
            fill="white"
            opacity="0.9"
          />
          <circle cx="200" cy="410" r="3" fill={outfitColors.c2} />
          <circle cx="200" cy="435" r="3" fill={outfitColors.c2} />
          <circle cx="200" cy="460" r="3" fill={outfitColors.c2} />
        </>
      )}
      {outfit === "resort" && (
        <path
          d="M 70 405 Q 100 382 170 388 L 200 372 L 230 388 Q 300 382 330 405 L 350 475 L 50 475 Z"
          fill={`url(#outfitGradient${suffix})`}
          opacity="0.85"
        />
      )}

      <g>
        <ellipse cx="200" cy="200" rx={face.rx + 35} ry={face.ry + 35} fill={`url(#hairGradient${suffix})`} />
        <path
          d="M 60 220 Q 40 180 60 120 Q 80 60 200 50 Q 320 60 340 120 Q 360 180 340 220"
          fill={`url(#hairGradient${suffix})`}
        />
      </g>

      <g>
        <ellipse cx="200" cy="230" rx={face.rx} ry={face.ry} fill={`url(#faceGradient${suffix})`} />
      </g>

      <g>
        <path
          d="M 85 140 Q 100 80 200 70 Q 300 80 315 140 Q 290 130 250 145 Q 220 160 200 150 Q 180 160 150 145 Q 110 130 85 140"
          fill={`url(#hairGradient${suffix})`}
        />
        <path d="M 90 150 Q 110 130 140 155 Q 130 180 100 190 Q 85 175 90 150" fill="#5A3A1C" />
        <path d="M 310 150 Q 290 130 260 155 Q 270 180 300 190 Q 315 175 310 150" fill="#5A3A1C" />
      </g>

      <g>
        <ellipse cx={200 - face.rx + 8} cy="240" rx="15" ry="25" fill={`url(#faceGradient${suffix})`} />
        <ellipse cx={200 + face.rx - 8} cy="240" rx="15" ry="25" fill={`url(#faceGradient${suffix})`} />
      </g>

      {renderMakeupLayers(layerCtx)}

      <g>
        <ellipse cx="155" cy="225" rx="22" ry="18" fill="white" />
        <ellipse cx="245" cy="225" rx="22" ry="18" fill="white" />
        <circle cx="155" cy="227" r="10" fill="#5D4037" />
        <circle cx="245" cy="227" r="10" fill="#5D4037" />
        <circle cx="155" cy="227" r="5" fill="#2D1B0E" />
        <circle cx="245" cy="227" r="5" fill="#2D1B0E" />
        <circle cx="152" cy="224" r="3" fill="white" />
        <circle cx="242" cy="224" r="3" fill="white" />
      </g>

      <g>
        <path
          d="M 200 240 Q 192 270 188 285 Q 195 295 200 295 Q 205 295 212 285 Q 208 270 200 240"
          fill="none"
          stroke="#D4A574"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {targetZones && toolPicked && (
        <g className="target-zones-layer">
          {targetZones.map((zone, idx) => (
            <ellipse
              key={idx}
              cx={zone.cx}
              cy={zone.cy}
              rx={zone.rx}
              ry={zone.ry}
              fill={productColor}
              opacity={0.15}
              stroke={productColor}
              strokeWidth="2"
              strokeDasharray="6 4"
              className="animate-pulse-slow"
            />
          ))}
        </g>
      )}

      {strokePoints.length > 1 && (
        <g className="strokes-layer" style={{ pointerEvents: "none" }}>
          {strokePoints.map((point, idx) => {
            if (idx === 0) return null;
            const prev = strokePoints[idx - 1];
            const opacity = Math.min(1, 0.3 + 0.4 * (idx / strokePoints.length));
            return (
              <line
                key={idx}
                x1={prev.x}
                y1={prev.y}
                x2={point.x}
                y2={point.y}
                stroke={productColor}
                strokeWidth={toolSize}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={opacity}
              />
            );
          })}
          {strokePoints.map((point, idx) => (
            <circle
              key={`dot-${idx}`}
              cx={point.x}
              cy={point.y}
              r={toolSize / 2}
              fill={productColor}
              opacity={0.25}
            />
          ))}
        </g>
      )}

      {toolPicked && currentPos && (
        <g style={{ pointerEvents: "none" }} className="tool-cursor">
          <circle
            cx={currentPos.x}
            cy={currentPos.y}
            r={toolSize}
            fill="none"
            stroke={productColor}
            strokeWidth="2"
            opacity="0.4"
            strokeDasharray="4 3"
          />
          <g transform={`translate(${currentPos.x - 20}, ${currentPos.y - 50})`}>
            <foreignObject x="0" y="0" width="40" height="50">
              <div style={{ width: "40px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* 工具图标跟随光标 */}
              </div>
            </foreignObject>
          </g>
        </g>
      )}
    </>
  );
}

const TOOL_ANIMATION_MAP: Record<string, string> = {
  brushLarge: "animate-brush-swing",
  brushMedium: "animate-brush-swing",
  brushSmall: "animate-brush-swing",
  brushBlush: "animate-brush-swing",
  concealerBrush: "animate-brush-swing",
  sponge: "animate-sponge-press",
  pencil: "animate-pencil-write",
  eyelinerPen: "animate-pencil-write",
  mascaraWand: "animate-mascara-wiggle",
  lipstick: "animate-lipstick-apply",
  skincarePad: "animate-pad-pat",
};

export default function MakeupDrawingCanvas({
  step,
  selectedProduct,
  effects,
  characterProfile,
  onComplete,
  onCancel,
}: MakeupDrawingCanvasProps) {
  const toolSize = step.drawingTool?.size ?? 20;
  const threshold = step.coverageThreshold ?? 70;
  const [justPicked, setJustPicked] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [cursorScreenPos, setCursorScreenPos] = useState<{ x: number; y: number } | null>(null);

  const handleCoverageReached = useCallback(() => {
    setTimeout(() => onComplete(), 600);
  }, [onComplete]);

  const drawing = useDrawingInteraction({
    viewBoxWidth: VIEWBOX_WIDTH,
    viewBoxHeight: VIEWBOX_HEIGHT,
    targetZones: step.targetZones,
    toolSize,
    coverageThreshold: threshold,
    onCoverageReached: handleCoverageReached,
  });

  const getProductColor = (): string => {
    if (!selectedProduct) return "#FFB6C1";
    return selectedProduct.color || selectedProduct.previewColor || "#FFB6C1";
  };

  const productColor = getProductColor();

  const toolKey = step.toolKey;
  const toolAnimationClass = toolKey ? TOOL_ANIMATION_MAP[toolKey] || "" : "";

  const handleToolPick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setJustPicked(true);
    const newSparkles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 - 40,
      y: Math.random() * 80 - 40,
    }));
    setSparkles(newSparkles);
    setTimeout(() => setJustPicked(false), 600);
    setTimeout(() => setSparkles([]), 800);
    drawing.handleToolAreaMouseDown(e);
  }, [drawing]);

  const handleMouseMoveWithCursor = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    setCursorScreenPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    drawing.handleMouseMove(e);
  }, [drawing]);

  const handleTouchMoveWithCursor = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    const touch = e.touches[0];
    if (touch) {
      const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
      setCursorScreenPos({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    }
    drawing.handleMouseMove(e);
  }, [drawing]);

  const handleMouseUpWithCursor = useCallback(() => {
    drawing.handleMouseUp();
  }, [drawing]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-lg w-full animate-pop">
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-pink-200 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-300 via-lavender-200 to-peach-200 p-4 text-center relative overflow-hidden">
            <h2 className="text-xl font-bold text-white drop-shadow-md mb-1">
              ✨ {step.name}
            </h2>
            <p className="text-white/90 text-sm">
              {step.drawingHint || "拖动工具到正确的位置进行化妆~"}
            </p>
          </div>

          <div className="p-4">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">完成度</span>
                <span className="text-sm font-bold text-pink-500">
                  {drawing.coverage}% / {threshold}%
                </span>
              </div>
              <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    drawing.coverage >= threshold
                      ? "bg-gradient-to-r from-green-400 to-emerald-400"
                      : "bg-gradient-to-r from-pink-400 to-rose-400"
                  }`}
                  style={{ width: `${drawing.coverage}%` }}
                />
              </div>
            </div>

            <div className="relative select-none" style={{ touchAction: "none" }}>
              {!drawing.toolPicked && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl">
                  <div className="text-center relative">
                    <div
                      className={`relative w-24 h-24 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center shadow-xl cursor-pointer tool-hover-scale ${justPicked ? "animate-tool-pickup" : "tool-float-glow"} border-4 border-pink-200`}
                      onMouseDown={handleToolPick}
                      onTouchStart={handleToolPick}
                    >
                      <div className={`${toolAnimationClass}`}>
                        {getToolIcon(toolKey, 64)}
                      </div>
                    </div>
                    {sparkles.map((s) => (
                      <span
                        key={s.id}
                        className="tool-sparkle text-2xl"
                        style={{
                          left: `calc(50% + ${s.x}px)`,
                          top: `calc(40% + ${s.y}px)`,
                        }}
                      >
                        ✨
                      </span>
                    ))}
                    <p className="text-sm font-bold text-pink-600 mt-2">
                      点击拿起 {step.drawingTool?.name || "化妆工具"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">然后在面部拖动涂抹~</p>
                  </div>
                </div>
              )}

              <div className="relative">
                <svg
                  ref={drawing.svgRef}
                  viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                  className="relative w-full max-w-sm mx-auto h-auto drop-shadow-2xl"
                  xmlns="http://www.w3.org/2000/svg"
                  onMouseDown={drawing.handleMouseDown}
                  onMouseMove={handleMouseMoveWithCursor}
                  onMouseUp={handleMouseUpWithCursor}
                  onMouseLeave={handleMouseUpWithCursor}
                  onTouchStart={drawing.handleMouseDown}
                  onTouchMove={handleTouchMoveWithCursor}
                  onTouchEnd={handleMouseUpWithCursor}
                >
                  <AvatarSVGInner
                    effects={effects}
                    characterProfile={characterProfile}
                    strokePoints={drawing.strokePoints}
                    targetZones={step.targetZones}
                    productColor={productColor}
                    toolSize={toolSize}
                    toolPicked={drawing.toolPicked}
                    currentPos={drawing.currentPos}
                  />
                </svg>

                {drawing.toolPicked && cursorScreenPos && (
                  <div
                    className="absolute pointer-events-none z-30 tool-cursor-icon"
                    style={{
                      left: `${cursorScreenPos.x}px`,
                      top: `${cursorScreenPos.y - 50}px`,
                      transform: `translateX(-50%) ${drawing.isDrawing ? "scale(0.85) rotate(-8deg)" : "scale(1)"}`,
                      transition: "transform 0.1s ease",
                    }}
                  >
                    <div className={`${toolAnimationClass}`}>
                      {getToolIcon(toolKey, 50)}
                    </div>
                  </div>
                )}
              </div>

              {drawing.toolPicked && !drawing.isDrawing && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-pink-400/90 text-white text-xs rounded-full shadow-lg animate-bounce-slow">
                  👆 在高亮区域拖动涂抹~
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-3 rounded-2xl font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              {drawing.strokePoints.length > 0 && (
                <button
                  onClick={drawing.resetDrawing}
                  className="flex-1 py-3 rounded-2xl font-bold bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                >
                  🔄 重画
                </button>
              )}
              {drawing.coverage >= threshold && (
                <button
                  onClick={onComplete}
                  className="flex-1 py-3 rounded-2xl font-bold bg-gradient-to-r from-pink-400 via-pink-300 to-lavender-300 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  完成 ✨
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
