export default function EmptyFace() {
  return (
    <div className="face-float">
      <style>{`
        @keyframes floatY {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }

        @keyframes blinkEye {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }

        @keyframes tearDrop {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(35px); opacity: 0; }
        }

        .face-float {
          animation: floatY 5s ease-in-out infinite;
        }

        .eye-blink {
          transform-origin: center;
          animation: blinkEye 6s infinite;
        }

        .tear {
          animation: tearDrop 2s ease-in infinite;
        }
      `}</style>

      <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
        {/* Face */}
        <circle
          cx="110"
          cy="100"
          r="72"
          fill="#f1f5f9"
          stroke="#c7ddff"
          strokeWidth="3"
        />

        {/* Eyes */}
        <g className="eye-blink">
          <rect x="78" y="88" width="18" height="12" rx="6" fill="#1e3a8a" />
          <rect x="124" y="88" width="18" height="12" rx="6" fill="#1e3a8a" />
        </g>

        {/* Mouth */}
        <path
          d="M86 128c8 10 28 18 48 0"
          stroke="#1e3a8a"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Tears */}
        <ellipse
          className="tear"
          cx="87"
          cy="110"
          rx="6"
          ry="10"
          fill="#60a5fa"
        />
        <ellipse
          className="tear"
          cx="133"
          cy="110"
          rx="6"
          ry="10"
          fill="#60a5fa"
          style={{ animationDelay: "0.9s" }}
        />

        {/* Highlight */}
        <circle cx="94" cy="76" r="4" fill="#ffffff" opacity="0.5" />
      </svg>
    </div>
  );
}
