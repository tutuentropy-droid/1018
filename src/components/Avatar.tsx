import { CompletedEffect } from "@/types";

interface AvatarProps {
  effects: CompletedEffect;
  isComplete: boolean;
}

export default function Avatar({ effects, isComplete }: AvatarProps) {
  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-pink-200 via-lavender-100 to-peach-100 opacity-60 blur-2xl animate-pulse-slow" />
      
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-5xl animate-float pointer-events-none z-10">
        {isComplete ? "👑" : effects.skincare ? "💖" : "✨"}
      </div>

      <svg
        viewBox="0 0 400 450"
        className="relative w-full max-w-sm h-auto drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="faceGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFE4CC" />
            <stop offset="100%" stopColor="#FFCBA4" />
          </radialGradient>
          <radialGradient id="foundationGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFD9B8" />
            <stop offset="100%" stopColor="#F5C49A" />
          </radialGradient>
          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6B4423" />
            <stop offset="100%" stopColor="#4A2F17" />
          </linearGradient>
          <linearGradient id="eyeshadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFB6C1" />
            <stop offset="100%" stopColor="#E6A0B5" />
          </linearGradient>
          <linearGradient id="lipstickGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF6B8A" />
            <stop offset="100%" stopColor="#E85070" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 头发 - 后层 */}
        <g className="makeup-layer" style={{ opacity: 1 }}>
          <ellipse cx="200" cy="200" rx="155" ry="175" fill="url(#hairGradient)" />
          <path
            d="M 60 220 Q 40 180 60 120 Q 80 60 200 50 Q 320 60 340 120 Q 360 180 340 220"
            fill="url(#hairGradient)"
          />
        </g>

        {/* 脸部 - 基础肤色 */}
        <g className="makeup-layer" style={{ opacity: 1 }}>
          <ellipse cx="200" cy="230" rx="125" ry="145" fill="url(#faceGradient)" />
        </g>

        {/* 头发 - 刘海 */}
        <g className="makeup-layer" style={{ opacity: 1 }}>
          <path
            d="M 85 140 Q 100 80 200 70 Q 300 80 315 140 Q 290 130 250 145 Q 220 160 200 150 Q 180 160 150 145 Q 110 130 85 140"
            fill="url(#hairGradient)"
          />
          <path
            d="M 90 150 Q 110 130 140 155 Q 130 180 100 190 Q 85 175 90 150"
            fill="#5A3A1C"
          />
          <path
            d="M 310 150 Q 290 130 260 155 Q 270 180 300 190 Q 315 175 310 150"
            fill="#5A3A1C"
          />
        </g>

        {/* 耳朵 */}
        <g className="makeup-layer" style={{ opacity: 1 }}>
          <ellipse cx="78" cy="240" rx="15" ry="25" fill="url(#faceGradient)" />
          <ellipse cx="322" cy="240" rx="15" ry="25" fill="url(#faceGradient)" />
        </g>

        {/* 护肤效果 - 光泽 */}
        <g className="makeup-layer" style={{ opacity: effects.skincare ? 1 : 0 }}>
          <ellipse cx="160" cy="200" rx="25" ry="15" fill="white" opacity="0.4" />
          <ellipse cx="240" cy="200" rx="25" ry="15" fill="white" opacity="0.4" />
          <circle cx="155" cy="195" r="5" fill="white" opacity="0.6" />
          <circle cx="245" cy="195" r="5" fill="white" opacity="0.6" />
        </g>

        {/* 妆前乳效果 - 提亮 */}
        <g className="makeup-layer" style={{ opacity: effects.primer ? 1 : 0 }}>
          <ellipse cx="200" cy="230" rx="125" ry="145" fill="#FFF5F0" opacity="0.2" />
        </g>

        {/* 粉底液效果 */}
        <g className="makeup-layer" style={{ opacity: effects.foundation ? 1 : 0 }}>
          <ellipse cx="200" cy="230" rx="125" ry="145" fill="url(#foundationGradient)" opacity="0.85" />
        </g>

        {/* 遮瑕效果 - 遮盖瑕疵 */}
        <g className="makeup-layer" style={{ opacity: effects.concealer ? 1 : 0 }}>
          <ellipse cx="155" cy="260" rx="22" ry="12" fill="#FFE4CC" opacity="0.7" />
          <ellipse cx="245" cy="260" rx="22" ry="12" fill="#FFE4CC" opacity="0.7" />
          <circle cx="280" cy="290" r="8" fill="#FFE4CC" opacity="0.8" />
        </g>

        {/* 散粉定妆 - 柔焦效果 */}
        <g className="makeup-layer" style={{ opacity: effects.powder ? 1 : 0 }}>
          <ellipse cx="200" cy="230" rx="125" ry="145" fill="#FFF8F0" opacity="0.15" />
        </g>

        {/* 眉毛 */}
        <g className="makeup-layer" style={{ opacity: effects.brows ? 1 : 0.2 }} filter={effects.brows ? undefined : "url(#softGlow)"}>
          <path
            d="M 125 185 Q 145 170 175 175 Q 155 182 125 195 Z"
            fill={effects.brows ? "#5A3A1C" : "#8B6F5C"}
            strokeWidth="2"
          />
          <path
            d="M 275 185 Q 255 170 225 175 Q 245 182 275 195 Z"
            fill={effects.brows ? "#5A3A1C" : "#8B6F5C"}
            strokeWidth="2"
          />
          {effects.brows && (
            <>
              <path d="M 128 188 L 140 180" stroke="#4A2F17" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 135 186 L 150 178" stroke="#4A2F17" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 145 183 L 160 176" stroke="#4A2F17" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 272 188 L 260 180" stroke="#4A2F17" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 265 186 L 250 178" stroke="#4A2F17" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 255 183 L 240 176" stroke="#4A2F17" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}
        </g>

        {/* 眼影 */}
        <g className="makeup-layer" style={{ opacity: effects.eyeshadow ? 1 : 0 }}>
          <ellipse cx="155" cy="215" rx="30" ry="18" fill="url(#eyeshadowGradient)" opacity="0.7" />
          <ellipse cx="245" cy="215" rx="30" ry="18" fill="url(#eyeshadowGradient)" opacity="0.7" />
          <ellipse cx="155" cy="220" rx="20" ry="10" fill="#FF9AAF" opacity="0.5" />
          <ellipse cx="245" cy="220" rx="20" ry="10" fill="#FF9AAF" opacity="0.5" />
          <circle cx="140" cy="212" r="3" fill="white" opacity="0.6" />
          <circle cx="260" cy="212" r="3" fill="white" opacity="0.6" />
        </g>

        {/* 眼睛 - 基础 */}
        <g className="makeup-layer" style={{ opacity: 1 }}>
          <ellipse cx="155" cy="225" rx="22" ry="18" fill="white" />
          <ellipse cx="245" cy="225" rx="22" ry="18" fill="white" />
          <circle cx="155" cy="227" r="10" fill="#5D4037" />
          <circle cx="245" cy="227" r="10" fill="#5D4037" />
          <circle cx="155" cy="227" r="5" fill="#2D1B0E" />
          <circle cx="245" cy="227" r="5" fill="#2D1B0E" />
          <circle cx="152" cy="224" r="3" fill="white" />
          <circle cx="242" cy="224" r="3" fill="white" />
        </g>

        {/* 眼线 - 上眼睑睫毛根部 */}
        <g className="makeup-layer" style={{ opacity: effects.eyeliner ? 1 : 0 }}>
          <path
            d="M 135 212 Q 145 207 155 208 Q 165 207 175 212"
            fill="none"
            stroke="#2D1B0E"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 135 212 Q 133 213 132 215"
            fill="none"
            stroke="#2D1B0E"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 175 212 Q 182 211 188 207 Q 192 204 195 202"
            fill="none"
            stroke="#2D1B0E"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 225 212 Q 235 207 245 208 Q 255 207 265 212"
            fill="none"
            stroke="#2D1B0E"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 265 212 Q 267 213 268 215"
            fill="none"
            stroke="#2D1B0E"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 225 212 Q 218 211 212 207 Q 208 204 205 202"
            fill="none"
            stroke="#2D1B0E"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* 睫毛膏 - 睫毛 */}
        <g className="makeup-layer" style={{ opacity: effects.mascara ? 1 : 0 }}>
          <path d="M 135 210 L 132 200" stroke="#2D1B0E" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 142 208 L 140 196" stroke="#2D1B0E" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 150 206 L 150 193" stroke="#2D1B0E" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 158 206 L 160 193" stroke="#2D1B0E" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 166 208 L 170 196" stroke="#2D1B0E" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 173 210 L 178 200" stroke="#2D1B0E" strokeWidth="2.5" strokeLinecap="round" />
          
          <path d="M 227 210 L 222 200" stroke="#2D1B0E" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 234 208 L 230 196" stroke="#2D1B0E" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 242 206 L 240 193" stroke="#2D1B0E" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 250 206 L 250 193" stroke="#2D1B0E" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 258 208 L 260 196" stroke="#2D1B0E" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 265 210 L 268 200" stroke="#2D1B0E" strokeWidth="2.5" strokeLinecap="round" />
          
          <path d="M 140 240 L 138 248" stroke="#2D1B0E" strokeWidth="2" strokeLinecap="round" />
          <path d="M 155 243 L 155 252" stroke="#2D1B0E" strokeWidth="2" strokeLinecap="round" />
          <path d="M 170 240 L 172 248" stroke="#2D1B0E" strokeWidth="2" strokeLinecap="round" />
          <path d="M 230 240 L 228 248" stroke="#2D1B0E" strokeWidth="2" strokeLinecap="round" />
          <path d="M 245 243 L 245 252" stroke="#2D1B0E" strokeWidth="2" strokeLinecap="round" />
          <path d="M 260 240 L 262 248" stroke="#2D1B0E" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* 腮红 */}
        <g className="makeup-layer" style={{ opacity: effects.blush ? 1 : 0 }}>
          <ellipse cx="115" cy="275" rx="28" ry="18" fill="#FFB6C1" opacity="0.55" />
          <ellipse cx="285" cy="275" rx="28" ry="18" fill="#FFB6C1" opacity="0.55" />
          <ellipse cx="115" cy="272" rx="15" ry="8" fill="#FF9AAF" opacity="0.4" />
          <ellipse cx="285" cy="272" rx="15" ry="8" fill="#FF9AAF" opacity="0.4" />
        </g>

        {/* 鼻子 */}
        <g className="makeup-layer" style={{ opacity: 1 }}>
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

        {/* 嘴巴 - 基础 */}
        <g className="makeup-layer" style={{ opacity: effects.lipstick ? 0.3 : 1 }}>
          <path
            d="M 170 325 Q 185 315 200 320 Q 215 315 230 325 Q 225 340 200 342 Q 175 340 170 325"
            fill={effects.lipstick ? "#E8B4B8" : "#F0B0A8"}
          />
        </g>

        {/* 口红 */}
        <g className="makeup-layer" style={{ opacity: effects.lipstick ? 1 : 0 }} filter="url(#softGlow)">
          <path
            d="M 165 322 Q 180 308 200 315 Q 220 308 235 322 Q 230 330 220 326 Q 210 332 200 328 Q 190 332 180 326 Q 170 330 165 322"
            fill="url(#lipstickGradient)"
          />
          <path
            d="M 168 325 Q 185 318 200 322 Q 215 318 232 325 Q 228 345 200 350 Q 172 345 168 325"
            fill="url(#lipstickGradient)"
          />
          <path
            d="M 175 328 Q 185 325 200 328"
            fill="none"
            stroke="#FF8FA3"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>

        {/* 完成后闪光特效 */}
        {isComplete && (
          <g className="makeup-layer" style={{ opacity: 1 }}>
            <g className="animate-sparkle" style={{ transformOrigin: "60px 100px" }}>
              <path d="M 60 90 L 63 100 L 73 103 L 63 106 L 60 116 L 57 106 L 47 103 L 57 100 Z" fill="#FFD700" />
            </g>
            <g className="animate-sparkle" style={{ transformOrigin: "340px 120px", animationDelay: "0.5s" }}>
              <path d="M 340 110 L 343 120 L 353 123 L 343 126 L 340 136 L 337 126 L 327 123 L 337 120 Z" fill="#FFB6C1" />
            </g>
            <g className="animate-sparkle" style={{ transformOrigin: "80px 350px", animationDelay: "0.3s" }}>
              <path d="M 80 340 L 83 350 L 93 353 L 83 356 L 80 366 L 77 356 L 67 353 L 77 350 Z" fill="#E9D8FD" />
            </g>
            <g className="animate-sparkle" style={{ transformOrigin: "320px 370px", animationDelay: "0.7s" }}>
              <path d="M 320 360 L 323 370 L 333 373 L 323 376 L 320 386 L 317 376 L 307 373 L 317 370 Z" fill="#98FB98" />
            </g>
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
