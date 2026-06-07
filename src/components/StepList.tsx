import StepCard from "./StepCard";
import { MakeupStep } from "@/types";

interface StepListProps {
  steps: MakeupStep[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (stepId: number) => void;
}

export default function StepList({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: StepListProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-pink-500 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          化妆步骤
        </h2>
        <span className="text-sm text-gray-500 font-medium">
          {completedSteps.length} / {steps.length}
        </span>
      </div>

      <div className="relative mb-5">
        <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden">
          <div
            className="h-full progress-bar rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
          />
        </div>
        <div className="absolute -top-1 right-0 w-5 h-5 bg-white rounded-full border-2 border-pink-300 flex items-center justify-center shadow-md">
          <span className="text-xs text-pink-400">💄</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
        {steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            index={index}
            isActive={step.id === currentStep && !completedSteps.includes(step.id)}
            isCompleted={completedSteps.includes(step.id)}
            isLocked={step.id > currentStep}
            onClick={() => onStepClick(step.id)}
          />
        ))}
      </div>
    </div>
  );
}
