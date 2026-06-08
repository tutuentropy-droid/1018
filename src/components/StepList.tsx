import StepCard from "./StepCard";
import { MakeupStep, GameMode } from "@/types";
import { Lightbulb } from "lucide-react";

interface StepListProps {
  shuffledSteps: MakeupStep[];
  expectedStepId: number;
  completedSteps: number[];
  wrongStepId: number | null;
  onStepClick: (stepId: number) => void;
  onUseHint: () => void;
  hintsRemaining: number;
  showHint: boolean;
  gameMode: GameMode;
}

export default function StepList({
  shuffledSteps,
  expectedStepId,
  completedSteps,
  wrongStepId,
  onStepClick,
  onUseHint,
  hintsRemaining,
  showHint,
  gameMode,
}: StepListProps) {
  const totalSteps = shuffledSteps.length;
  const hintStep = shuffledSteps.find((s) => s.id === expectedStepId);
  const isGuided = gameMode === "guided";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-pink-500 flex items-center gap-2">
          <span className="text-2xl">{isGuided ? "🎮" : "🎨"}</span>
          {isGuided ? "请选择下一步" : "自由选择步骤"}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium bg-gradient-to-r from-pink-100 to-lavender-100 px-3 py-1 rounded-full text-pink-500">
            {completedSteps.length} / {totalSteps}
          </span>
          {isGuided && (
            <button
              onClick={onUseHint}
              disabled={hintsRemaining <= 0 || completedSteps.length >= totalSteps}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                hintsRemaining > 0
                  ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200 cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              提示 x{hintsRemaining}
            </button>
          )}
        </div>
      </div>

      <div className="relative mb-5">
        <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden">
          <div
            className={`h-full progress-bar rounded-full transition-all duration-700 ease-out ${
              !isGuided ? "!bg-gradient-to-r from-purple-400 to-pink-400" : ""
            }`}
            style={{ width: `${(completedSteps.length / totalSteps) * 100}%` }}
          />
        </div>
        <div className={`absolute -top-1 right-0 w-5 h-5 bg-white rounded-full border-2 flex items-center justify-center shadow-md ${
          isGuided ? "border-pink-300" : "border-purple-300"
        }`}>
          <span className="text-xs">{isGuided ? "💄" : "🎨"}</span>
        </div>
      </div>

      {isGuided && showHint && hintStep && (
        <div className="mb-3 p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-sm text-yellow-700 animate-fade-in">
          💡 提示：下一步应该是「{hintStep.icon} {hintStep.name}」哦~
        </div>
      )}
      {!isGuided && (
        <div className="mb-3 p-3 rounded-xl bg-purple-50 border border-purple-200 text-sm text-purple-700 animate-fade-in">
          ✨ 自由创作模式：可以任意选择步骤，不受顺序限制，尽情发挥创意吧！
        </div>
      )}

      <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
        {shuffledSteps.map((step) => (
          <StepCard
            key={step.id}
            step={step}
            isCompleted={completedSteps.includes(step.id)}
            isWrong={wrongStepId === step.id}
            onClick={() => onStepClick(step.id)}
            gameMode={gameMode}
          />
        ))}
      </div>
    </div>
  );
}
