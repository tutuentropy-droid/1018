import { Check, Lock } from "lucide-react";
import { MakeupStep } from "@/types";

interface StepCardProps {
  step: MakeupStep;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  onClick: () => void;
}

export default function StepCard({
  step,
  index,
  isActive,
  isCompleted,
  isLocked,
  onClick,
}: StepCardProps) {
  const getCardStyle = () => {
    if (isCompleted) {
      return "bg-mint-50 border-mint-200 shadow-mint-100";
    }
    if (isActive) {
      return "bg-white border-pink-300 shadow-pink-200 animate-glow";
    }
    if (isLocked) {
      return "bg-gray-50 border-gray-200 opacity-60";
    }
    return "bg-white border-pink-100 hover:border-pink-300 shadow-pink-100 cursor-pointer";
  };

  const getNumberStyle = () => {
    if (isCompleted) {
      return "bg-mint-200 text-mint-300";
    }
    if (isActive) {
      return "bg-gradient-to-br from-pink-300 to-pink-400 text-white";
    }
    if (isLocked) {
      return "bg-gray-200 text-gray-400";
    }
    return "bg-pink-100 text-pink-400";
  };

  return (
    <button
      onClick={onClick}
      disabled={isLocked || isCompleted}
      className={`step-card w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 shadow-md ${getCardStyle()} ${
        isLocked ? "cursor-not-allowed" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getNumberStyle()}`}
        >
          {isCompleted ? (
            <Check className="w-5 h-5 text-mint-300" strokeWidth={3} />
          ) : isLocked ? (
            <Lock className="w-4 h-4" />
          ) : (
            index + 1
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{step.icon}</span>
            <h3
              className={`font-bold text-base truncate ${
                isCompleted
                  ? "text-mint-300"
                  : isActive
                  ? "text-pink-500"
                  : isLocked
                  ? "text-gray-400"
                  : "text-gray-700"
              }`}
            >
              {step.name}
            </h3>
          </div>
          <p
            className={`text-xs truncate ${
              isLocked ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {step.description}
          </p>
        </div>

        {isActive && (
          <div className="flex-shrink-0 w-3 h-3 rounded-full bg-pink-400 animate-pulse" />
        )}
      </div>
    </button>
  );
}
