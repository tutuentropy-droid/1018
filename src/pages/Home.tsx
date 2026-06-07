import { useState, useCallback, useMemo } from "react";
import { Sparkles, HelpCircle } from "lucide-react";
import Avatar from "@/components/Avatar";
import StepList from "@/components/StepList";
import TipModal from "@/components/TipModal";
import SummaryCard from "@/components/SummaryCard";
import Decorations from "@/components/Decorations";
import { MAKEUP_STEPS } from "@/data/steps";
import { CompletedEffect, MakeupStep } from "@/types";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [expectedStepId, setExpectedStepId] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [completedEffects, setCompletedEffects] = useState<CompletedEffect>({});
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState("");
  const [currentTipName, setCurrentTipName] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongStepId, setWrongStepId] = useState<number | null>(null);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [showHint, setShowHint] = useState(false);

  const shuffledSteps = useMemo<MakeupStep[]>(() => {
    return shuffleArray(MAKEUP_STEPS);
  }, [started]);

  const isComplete = completedSteps.length === MAKEUP_STEPS.length;

  const handleStepClick = useCallback(
    (stepId: number) => {
      if (completedSteps.includes(stepId)) return;

      if (stepId === expectedStepId) {
        setWrongStepId(null);
        setShowHint(false);
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
      } else {
        setWrongStepId(stepId);
        setTimeout(() => setWrongStepId(null), 600);
      }
    },
    [expectedStepId, completedSteps]
  );

  const handleCloseTip = useCallback(() => {
    setShowTip(false);
    if (expectedStepId < MAKEUP_STEPS.length) {
      setExpectedStepId((prev) => prev + 1);
    }
  }, [expectedStepId]);

  const handleUseHint = useCallback(() => {
    if (hintsRemaining > 0) {
      setHintsRemaining((prev) => prev - 1);
      setShowHint(true);
    }
  }, [hintsRemaining]);

  const handleRestart = useCallback(() => {
    setExpectedStepId(1);
    setCompletedSteps([]);
    setCompletedEffects({});
    setShowConfetti(false);
    setWrongStepId(null);
    setHintsRemaining(3);
    setShowHint(false);
    setStarted(true);
  }, []);

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-pattern-dots">
        <Decorations />

        <div className="relative z-10 text-center animate-fade-in-up max-w-xl">
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

          <p className="text-gray-600 text-lg mb-2">一起来学习正确的化妆顺序吧！</p>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            从打乱的化妆步骤中，按正确顺序依次选择下一步~
            <br />
            选错了会有提示，还有 3 次提示机会可以使用哦！✨
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-sm border border-pink-100">
              <span className="text-lg">🎯</span>
              <span className="text-sm text-gray-600">按正确顺序选择</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-sm border border-pink-100">
              <span className="text-lg">💡</span>
              <span className="text-sm text-gray-600">3次提示机会</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-sm border border-pink-100">
              <span className="text-lg">📚</span>
              <span className="text-sm text-gray-600">11个化妆步骤</span>
            </div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="group relative px-10 py-4 rounded-full bg-gradient-to-r from-pink-400 via-pink-300 to-lavender-300 text-white font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 group-hover:animate-spin" />
              开始挑战
              <Sparkles className="w-6 h-6 group-hover:animate-spin" />
            </span>
          </button>

          <div className="mt-10 flex items-start justify-center gap-4 text-left bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-pink-100">
            <HelpCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-gray-700 mb-1">游戏玩法</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                右侧列表中所有化妆步骤已被打乱，请根据你的化妆知识，
                从「洁面护肤」开始，按正确的化妆顺序依次点击每一步。
                选错了会有震动提醒，实在不知道可以使用提示功能~
              </p>
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

  const currentExpectedStep = MAKEUP_STEPS.find((s) => s.id === expectedStepId);

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
          <p className="text-sm text-gray-500">
            从打乱的步骤中，找出正确的化妆顺序~
            {currentExpectedStep && !showHint && (
              <span className="ml-2 text-pink-400 font-medium">
                （提示：下一步应该是第 {expectedStepId} 步）
              </span>
            )}
          </p>
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
                shuffledSteps={shuffledSteps}
                expectedStepId={expectedStepId}
                completedSteps={completedSteps}
                wrongStepId={wrongStepId}
                onStepClick={handleStepClick}
                onUseHint={handleUseHint}
                hintsRemaining={hintsRemaining}
                showHint={showHint}
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                🎮 从列表中选择下一步正确的化妆步骤吧！
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
