import { useState, useRef } from "react";
import { Sparkles, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { MAKEUP_STEPS } from "@/data/steps";
import Avatar from "./Avatar";
import { GameMode, StepRecord, CompletedEffect, CharacterProfile } from "@/types";

interface SummaryCardProps {
  onRestart: () => void;
  gameMode: GameMode;
  stepHistory: StepRecord[];
  completedEffects: CompletedEffect;
  characterProfile?: CharacterProfile;
}

function BeforeAfterSlider({
  completedEffects,
  characterProfile,
}: {
  completedEffects: CompletedEffect;
  characterProfile?: CharacterProfile;
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pct);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    handleMove(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    handleMove(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-pink-500 flex items-center gap-2">
          <span className="text-lg">🔄</span>
          前后对比
        </h3>
        <div className="flex gap-1.5">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500"
            style={{ opacity: sliderPosition > 50 ? 1 : 0.6 }}
          >
            化妆前
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-500"
            style={{ opacity: sliderPosition <= 50 ? 1 : 0.6 }}
          >
            化妆后
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl border-2 border-pink-100 bg-pink-50/50 select-none"
        style={{ touchAction: "none" }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full" style={{ aspectRatio: "400 / 480" }}>
          <div className="absolute inset-0">
            <Avatar effects={{}} isComplete={false} characterProfile={characterProfile} />
          </div>

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <Avatar effects={completedEffects} isComplete={true} characterProfile={characterProfile} />
          </div>

          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-20"
            style={{
              left: `${sliderPosition}%`,
              transform: "translateX(-50%)",
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-pink-200">
              <div className="flex items-center gap-0.5">
                <ChevronLeft className="w-4 h-4 text-pink-400" />
                <ChevronRight className="w-4 h-4 text-pink-400" />
              </div>
            </div>
          </div>

          <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/40 text-white text-xs font-medium backdrop-blur-sm">
            素顏
          </div>
          <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-400 to-lavender-400 text-white text-xs font-medium shadow-md">
            完妝 ✨
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-2">
        👆 拖动中间滑块，对比化妆前后的变化~
      </p>
    </div>
  );
}

export default function SummaryCard({
  onRestart,
  gameMode,
  stepHistory,
  completedEffects,
  characterProfile,
}: SummaryCardProps) {
  const isFreeMode = gameMode === "free";

  return (
    <div className="w-full max-w-lg animate-fade-in-up">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-pink-200 overflow-hidden">
        <div
          className={`p-5 text-center relative overflow-hidden ${
            isFreeMode
              ? "bg-gradient-to-r from-purple-300 via-pink-200 to-lavender-200"
              : "bg-gradient-to-r from-pink-300 via-lavender-200 to-peach-200"
          }`}
        >
          <div className="absolute top-2 left-4 text-3xl animate-float">🌸</div>
          <div className="absolute top-4 right-6 text-2xl animate-float" style={{ animationDelay: "0.5s" }}>
            💄
          </div>
          <div className="absolute bottom-2 left-8 text-2xl animate-float" style={{ animationDelay: "1s" }}>
            ✨
          </div>
          <div className="absolute bottom-3 right-4 text-3xl animate-float" style={{ animationDelay: "1.5s" }}>
            🌷
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white drop-shadow-md">
                {isFreeMode ? "创意妆容完成啦！" : "恭喜你，化妆完成啦！"}
              </h2>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <p className="text-white/90 text-sm font-medium">
              {isFreeMode
                ? "你的独特创作风格超有魅力！🎨"
                : "你已经掌握了完整的日常化妆流程 🎉"}
            </p>
            <div className="mt-2 inline-block px-3 py-1 rounded-full bg-white/30 backdrop-blur-sm text-white text-xs font-bold">
              {isFreeMode ? "🎨 自由创作模式" : "📖 顺序教学模式"}
            </div>
          </div>
        </div>

        <div className="p-5">
          <BeforeAfterSlider
            completedEffects={completedEffects}
            characterProfile={characterProfile}
          />

          <div className="mb-4">
            <h3 className="text-sm font-bold text-pink-500 mb-3 flex items-center gap-2">
              <span className="text-lg">📝</span>
              {isFreeMode ? "你的创作记录" : "化妆流程总结"}
            </h3>
            {isFreeMode ? (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {stepHistory.map((record, idx) => {
                  const step = MAKEUP_STEPS.find((s) => s.id === record.stepId);
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100"
                    >
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{step?.icon}</span>
                          <span className="text-sm font-bold text-gray-700">{record.stepName}</span>
                        </div>
                        {record.product && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {record.product.previewColor && (
                              <div
                                className="w-3 h-3 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: record.product.previewColor }}
                              />
                            )}
                            {record.product.icon && <span className="text-xs">{record.product.icon}</span>}
                            <span className="text-xs text-gray-500 truncate">{record.product.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-xs text-green-500 font-bold">
                        ✓
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {MAKEUP_STEPS.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-mint-50 border border-mint-100"
                  >
                    <span className="text-base">{step.icon}</span>
                    <span className="text-xs font-medium text-gray-700">
                      {step.id}. {step.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className={`rounded-2xl p-4 mb-4 border ${
              isFreeMode
                ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100"
                : "bg-gradient-to-r from-cream-50 to-pink-50 border-pink-100"
            }`}
          >
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className={`font-bold ${isFreeMode ? "text-purple-500" : "text-pink-500"}`}>
                💡 {isFreeMode ? "创作小贴士：" : "温馨提示："}
              </span>
              {isFreeMode
                ? "创意无边界！多尝试不同的产品和顺序搭配，找到最适合你的独特风格。可以试试先画腮红再上底妆的晒伤妆，或者先口红后眼妆的搭配~ 大胆玩妆吧！🎨"
                : "化妆最重要的是适合自己！多加练习，慢慢找到最适合你的风格和产品。记得每天认真卸妆哦~"}
            </p>
          </div>

          <button
            onClick={onRestart}
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 ${
              isFreeMode
                ? "bg-gradient-to-r from-purple-400 via-pink-300 to-lavender-300"
                : "bg-gradient-to-r from-pink-400 via-pink-300 to-lavender-300"
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            {isFreeMode ? "再创作一次" : "再玩一次"}
          </button>
        </div>
      </div>
    </div>
  );
}
