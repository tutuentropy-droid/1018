interface DecorationsProps {
  showConfetti?: boolean;
}

export default function Decorations({ showConfetti = false }: DecorationsProps) {
  const confettiColors = ["#FFB6C1", "#FF9AAF", "#E9D8FD", "#C6F6D5", "#FFCBA4", "#FFD700"];
  const confettiItems = showConfetti
    ? Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: Math.random() * 8 + 6,
      }))
    : [];

  return (
    <>
      <div className="fixed top-10 left-10 text-4xl decor-flower pointer-events-none opacity-60">
        🌸
      </div>
      <div className="fixed top-20 right-16 text-3xl decor-flower pointer-events-none opacity-50">
        🌷
      </div>
      <div className="fixed bottom-24 left-20 text-3xl decor-flower pointer-events-none opacity-50">
        🌺
      </div>
      <div className="fixed bottom-10 right-10 text-4xl decor-flower pointer-events-none opacity-60">
        💐
      </div>
      <div className="fixed top-1/3 left-6 text-2xl decor-flower pointer-events-none opacity-40">
        ✨
      </div>
      <div className="fixed top-1/2 right-8 text-2xl decor-flower pointer-events-none opacity-40">
        💫
      </div>
      <div className="fixed bottom-1/3 left-1/4 text-2xl decor-flower pointer-events-none opacity-30">
        ⭐
      </div>
      <div className="fixed top-1/4 right-1/4 text-xl decor-flower pointer-events-none opacity-30">
        💕
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {confettiItems.map((item) => (
            <div
              key={item.id}
              className="absolute animate-confetti"
              style={{
                left: `${item.left}%`,
                top: "-20px",
                width: `${item.size}px`,
                height: `${item.size}px`,
                backgroundColor: item.color,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                animationDelay: `${item.delay}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
