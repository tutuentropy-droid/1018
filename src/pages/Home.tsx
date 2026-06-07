import { useState, useCallback } from "react";
import { Sparkles } from "lucide-react";
import Avatar from "@/components/Avatar";
import StepList from "@/components/StepList";
import TipModal from "@/components/TipModal";
import SummaryCard from "@/components/SummaryCard";
import Decorations from "@/components/Decorations";
import { MAKEUP_STEPS } from "@/data/steps";
import { CompletedEffect } from "@/types";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [completedEffects, setCompletedEffects] = useState<CompletedEffect>({});
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState("");
  const [currentTipName, setCurrentTipName] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const isComplete = completedSteps.length === MAKEUP_STEPS.length;

  const handleStepClick = useCallback(
    (stepId: number) => {
      if (stepId !== currentStep || completedSteps.includes(stepId)) return;

      const step = MAKEUP_STEPS.find((s) => s.id === stepId);
      if (!step) return;

      setCompletedSteps((prev) => [...prev, stepId]);
      setCompletedEffects((prev) => ({ ...prev, [step.effectKey]: true }));
      setCurrentTip(step.tip);
      setCurrentTipName(step.name);
      setShowTip(true);

      if (stepId === MAKEUP_STEPS.length) {
        setTimeout(() => setShowConfetti(true), 500);
      }
    },
    [currentStep, completedSteps]
  );

  const handleCloseTip = useCallback(() => {
    setShowTip(false);
    if (currentStep < MAKEUP_STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const handleRestart = useCallback(() => {
    setCurrentStep(1);
    setCompletedSteps([]);
    setCompletedEffects({});
    setShowConfetti(false);
    setStarted(true);
  }, []);

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-pattern-dots">
        <Decorations />

        <div className="relative z-10 text-center animate-fade-in-up">
          <div className="mb-8">
            <div className="inline-block p-6 rounded-full bg-gradient-to-br from-pink-200 via-lavender-100 to-peach-100 shadow-2xl mb-6">
              <span className="text-7xl block animate-float">💄</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow-cute">
            <span className="bg-gradient-to-r from-pink-500 via-pink-400 to-lavender-400 bg-clip-text text-transparent">
              小仙女化妆课堂
            </span>
          </h1>

          <p className="text-gray-600 text-lg mb-2">一起学习完整的日常化妆流程吧~</p>
          <p className="text-gray-400 text-sm mb-10">点击化妆步骤，看妆容一步步变化！✨</p>

          <button
            onClick={() => setStarted(true)}
            className="group relative px-10 py-4 rounded-full bg-gradient-to-r from-pink-400 via-pink-300 to-lavender-300 text-white font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 group-hover:animate-spin" />
              开始化妆
              <Sparkles className="w-6 h-6 group-hover:animate-spin" />
            </span>
          </button>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {MAKEUP_STEPS.slice(0, 6).map((step, i) => (
              <div
                key={step.id}
                className="flex flex-col items-center gap-1 opacity-70 animate-float"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <span className="text-3xl">{step.icon}</span>
                <span className="text-xs text-gray-500">{step.name}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-1 opacity-70 animate-float" style={{ animationDelay: "1.2s" }}>
              <span className="text-3xl">...</span>
              <span className="text-xs text-gray-500">更多步骤</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-pattern-dots">
        <Decorations showConfetti={showConfetti} />

        <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in-up">
          <div className="w-72 md:w-80">
            <Avatar effects={completedEffects} isComplete={true} />
          </div>
          <SummaryCard onRestart={handleRestart} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden bg-pattern-dots">
      <Decorations />

      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="text-center mb-6 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-pink-500 via-pink-400 to-lavender-400 bg-clip-text text-transparent">
              💄 小仙女化妆课堂
            </span>
          </h1>
          <p className="text-sm text-gray-500">按顺序点击步骤，完成精致妆容~</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          <div className="flex justify-center lg:sticky lg:top-8">
            <div className="w-full max-w-sm animate-fade-in">
              <Avatar effects={completedEffects} isComplete={false} />
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 md:p-6 shadow-xl border-2 border-pink-100">
              <StepList
                steps={MAKEUP_STEPS}
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepClick={handleStepClick}
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                💡 提示：请按照顺序依次点击高亮的步骤卡片
              </p>
            </div>
          </div>
        </div>
      </div>

      {showTip && (
        <TipModal
          tip={currentTip}
          stepName={currentTipName}
          onClose={handleCloseTip}
        />
      )}
    </div>
  );
}
