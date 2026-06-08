import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Sparkles, Check } from "lucide-react";
import Avatar from "@/components/Avatar";
import Decorations from "@/components/Decorations";
import { useGameStore } from "@/store/useGameStore";
import {
  CharacterProfile,
  SkinTone,
  FaceShape,
  Scene,
  OutfitStyle,
} from "@/types";
import {
  SKIN_TONE_LIST,
  FACE_SHAPE_LIST,
  SCENE_LIST,
  OUTFIT_STYLE_LIST,
} from "@/data";

const STEPS = [
  { key: "skinTone", title: "选择肤色", subtitle: "Step 1/4" },
  { key: "faceShape", title: "选择脸型", subtitle: "Step 2/4" },
  { key: "scene", title: "选择场景", subtitle: "Step 3/4" },
  { key: "outfitStyle", title: "选择服装", subtitle: "Step 4/4" },
];

const SCENE_BG: Record<Scene, string> = {
  commute: "from-blue-50 via-pink-50 to-purple-50",
  date: "from-rose-100 via-pink-100 to-fuchsia-100",
  beach: "from-cyan-100 via-sky-100 to-amber-100",
  meeting: "from-slate-100 via-indigo-50 to-purple-100",
};

interface CharacterCustomizationProps {
  onComplete?: (profile: CharacterProfile) => void;
}

export default function CharacterCustomization({ onComplete }: CharacterCustomizationProps) {
  const navigate = useNavigate();
  const setCharacterProfile = useGameStore((s) => s.setCharacterProfile);
  const setStarted = useGameStore((s) => s.setStarted);

  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<CharacterProfile>({
    skinTone: null,
    faceShape: null,
    scene: null,
    outfitStyle: null,
  });

  const stepConfig = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const isLastStep = currentStep === STEPS.length - 1;

  const getSceneBgClass = () => {
    if (profile.scene) return SCENE_BG[profile.scene];
    return "from-pink-50 via-rose-50 to-purple-50";
  };

  const handleSelect = (value: SkinTone | FaceShape | Scene | OutfitStyle) => {
    const key = stepConfig.key as keyof CharacterProfile;
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (isLastStep) {
      if (onComplete) {
        onComplete(profile);
      }
      setCharacterProfile(profile);
      setStarted(true);
      navigate("/");
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate("/");
    }
  };

  const getCurrentValue = () => {
    const key = stepConfig.key as keyof CharacterProfile;
    return profile[key];
  };

  const canProceed = getCurrentValue() !== null;

  const renderStepContent = () => {
    switch (stepConfig.key) {
      case "skinTone":
        return (
          <div className="grid grid-cols-3 gap-4">
            {SKIN_TONE_LIST.map((option) => {
              const selected = profile.skinTone === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`relative flex flex-col items-center gap-3 p-5 rounded-3xl transition-all duration-300 ${
                    selected
                      ? "bg-white shadow-xl ring-4 ring-pink-300 scale-105"
                      : "bg-white/70 hover:bg-white hover:shadow-lg hover:scale-102"
                  }`}
                >
                  {selected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-lavender-400 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className="w-16 h-16 rounded-full shadow-inner ring-2 ring-white"
                    style={{
                      background: `linear-gradient(135deg, ${option.color1}, ${option.color2})`,
                    }}
                  />
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-sm font-semibold text-gray-700">{option.name}</span>
                </button>
              );
            })}
          </div>
        );

      case "faceShape":
        return (
          <div className="grid grid-cols-3 gap-4">
            {FACE_SHAPE_LIST.map((option) => {
              const selected = profile.faceShape === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`relative flex flex-col items-center gap-3 p-5 rounded-3xl transition-all duration-300 ${
                    selected
                      ? "bg-white shadow-xl ring-4 ring-pink-300 scale-105"
                      : "bg-white/70 hover:bg-white hover:shadow-lg hover:scale-102"
                  }`}
                >
                  {selected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-lavender-400 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-lavender-100 flex items-center justify-center">
                    {option.id === "round" && (
                      <svg viewBox="0 0 60 60" className="w-12 h-12">
                        <ellipse cx="30" cy="30" rx="22" ry="24" fill="#FFD9B8" stroke="#E8B894" strokeWidth="1.5" />
                      </svg>
                    )}
                    {option.id === "oval" && (
                      <svg viewBox="0 0 60 60" className="w-12 h-12">
                        <ellipse cx="30" cy="30" rx="18" ry="26" fill="#FFD9B8" stroke="#E8B894" strokeWidth="1.5" />
                      </svg>
                    )}
                    {option.id === "square" && (
                      <svg viewBox="0 0 60 60" className="w-12 h-12">
                        <rect x="10" y="10" width="40" height="40" rx="8" ry="10" fill="#FFD9B8" stroke="#E8B894" strokeWidth="1.5" />
                      </svg>
                    )}
                  </div>
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-sm font-semibold text-gray-700">{option.name}</span>
                  <span className="text-xs text-gray-500 text-center leading-relaxed">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        );

      case "scene":
        return (
          <div className="grid grid-cols-2 gap-4">
            {SCENE_LIST.map((option) => {
              const selected = profile.scene === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`relative flex flex-col items-center gap-3 p-5 rounded-3xl transition-all duration-300 ${
                    selected
                      ? "bg-white shadow-xl ring-4 ring-pink-300 scale-105"
                      : "bg-white/70 hover:bg-white hover:shadow-lg hover:scale-102"
                  }`}
                >
                  {selected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-lavender-400 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-100 to-lavender-100 flex items-center justify-center text-3xl shadow-inner">
                    {option.icon}
                  </div>
                  <span className="text-base font-bold text-gray-700">{option.name}</span>
                  <span className="text-xs text-gray-500 text-center leading-relaxed">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        );

      case "outfitStyle":
        return (
          <div className="grid grid-cols-2 gap-4">
            {OUTFIT_STYLE_LIST.map((option) => {
              const selected = profile.outfitStyle === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`relative flex flex-col items-center gap-3 p-5 rounded-3xl transition-all duration-300 ${
                    selected
                      ? "bg-white shadow-xl ring-4 ring-pink-300 scale-105"
                      : "bg-white/70 hover:bg-white hover:shadow-lg hover:scale-102"
                  }`}
                >
                  {selected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-lavender-400 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-100 to-lavender-100 flex items-center justify-center text-3xl shadow-inner">
                    {option.icon}
                  </div>
                  <span className="text-base font-bold text-gray-700">{option.name}</span>
                  <span className="text-xs text-gray-500 text-center leading-relaxed">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  const renderProfileSummary = () => {
    const parts: string[] = [];
    if (profile.skinTone) {
      const opt = SKIN_TONE_LIST.find((o) => o.id === profile.skinTone);
      if (opt) parts.push(`${opt.icon}${opt.name}`);
    }
    if (profile.faceShape) {
      const opt = FACE_SHAPE_LIST.find((o) => o.id === profile.faceShape);
      if (opt) parts.push(`${opt.icon}${opt.name}`);
    }
    if (profile.scene) {
      const opt = SCENE_LIST.find((o) => o.id === profile.scene);
      if (opt) parts.push(`${opt.icon}${opt.name}`);
    }
    if (profile.outfitStyle) {
      const opt = OUTFIT_STYLE_LIST.find((o) => o.id === profile.outfitStyle);
      if (opt) parts.push(`${opt.icon}${opt.name}`);
    }
    return parts;
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${getSceneBgClass()} relative overflow-hidden bg-pattern-dots`}>
      <Decorations />

      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full">
        <header className="text-center mb-6 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-pink-500 via-pink-400 to-lavender-400 bg-clip-text text-transparent">
              ✨ 角色定制
            </span>
          </h1>
          <p className="text-sm text-gray-500">定制你的专属形象，打造完美妆容~</p>
        </header>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-500">{stepConfig.subtitle}</span>
            <span className="text-xs text-pink-400 font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/60 overflow-hidden">
            <div
              className="h-full rounded-full progress-bar transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 flex justify-center items-start animate-fade-in">
            <div className="w-full max-w-xs">
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-4 shadow-lg border border-white">
                <Avatar effects={{}} isComplete={false} characterProfile={profile} />

                {renderProfileSummary().length > 0 && (
                  <div className="mt-4 bg-white/60 backdrop-blur-sm rounded-2xl p-3 border border-pink-100">
                    <p className="text-xs font-bold text-gray-600 mb-2">已选择：</p>
                    <div className="flex flex-wrap gap-1.5">
                      {renderProfileSummary().map((text, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full bg-white text-xs text-gray-600 shadow-sm border border-pink-100"
                        >
                          {text}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 md:p-6 shadow-xl border-2 border-pink-100">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  <span className="bg-gradient-to-r from-pink-500 to-lavender-400 bg-clip-text text-transparent">
                    {stepConfig.title}
                  </span>
                </h2>
                <p className="text-sm text-gray-500">
                  {stepConfig.key === "skinTone" && "选择最贴近你的肤色，底妆会更自然服帖~"}
                  {stepConfig.key === "faceShape" && "不同脸型适合不同的腮红和修容位置哦！"}
                  {stepConfig.key === "scene" && "妆容风格会根据场景来推荐~"}
                  {stepConfig.key === "outfitStyle" && "服装和妆容的搭配很重要呢！"}
                </p>
              </div>

              {renderStepContent()}

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/80 text-gray-600 font-medium hover:bg-white hover:shadow-md transition-all duration-300 border border-pink-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {currentStep === 0 ? "返回首页" : "上一步"}
                </button>

                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={`flex items-center gap-1.5 px-6 py-2.5 rounded-full font-bold text-white shadow-lg transition-all duration-300 ${
                    canProceed
                      ? "bg-gradient-to-r from-pink-400 via-pink-300 to-lavender-300 hover:shadow-xl hover:scale-105 active:scale-95"
                      : "bg-gray-300 cursor-not-allowed opacity-60"
                  }`}
                >
                  {isLastStep ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      开始化妆
                      <Sparkles className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      下一步
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
