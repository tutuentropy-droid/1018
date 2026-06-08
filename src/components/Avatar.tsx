import Scene3D from "./three/Scene3D";
import { CompletedEffect, CharacterProfile } from "@/types";

interface AvatarProps {
  effects: CompletedEffect;
  isComplete: boolean;
  characterProfile?: CharacterProfile;
  gradientSuffix?: string;
}

export default function Avatar({
  effects,
  isComplete,
  characterProfile,
}: AvatarProps) {
  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-pink-200 via-lavender-100 to-peach-100 opacity-60 blur-2xl animate-pulse-slow" />

      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-5xl animate-float pointer-events-none z-10">
        {isComplete ? "👑" : effects.skincare ? "💖" : "✨"}
      </div>

      <div
        className="relative w-full drop-shadow-2xl rounded-3xl overflow-hidden border-4 border-pink-100 bg-gradient-to-b from-pink-50/50 to-lavender-50/50"
        style={{ minHeight: "480px", aspectRatio: "400 / 480" }}
      >
        <Scene3D
          effects={effects}
          isComplete={isComplete}
          characterProfile={characterProfile}
          interactive={true}
        />
      </div>

      {isComplete && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-pink-400 to-lavender-200 rounded-full text-white font-bold text-lg shadow-lg animate-bounce-slow whitespace-nowrap">
          化妆完成！✨
        </div>
      )}
    </div>
  );
}
