import { useEffect, useRef } from "react";

export default function AILoadingAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resize();
    window.addEventListener("resize", resize);

    let animationId;
    let time = 0;

    const particles = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
    }));

    const messages = [
      "Analyzing transactions",
      "Detecting patterns",
      "Generating insights",
      "Forecasting balance",
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      /* PARTICLES */
      particles.forEach((p) => {
        const dx = cx - p.x;
        const dy = cy - p.y;

        p.x += dx * 0.01;
        p.y += dy * 0.01;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#2563eb";
        ctx.fill();

        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
        }
      });

      /* ROTATING RING */
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time);

      ctx.strokeStyle = "#4f46e5";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 1.5);
      ctx.stroke();

      ctx.restore();

      /* CORE */
      const pulse = 6 + Math.sin(time * 2) * 2;

      const gradient = ctx.createRadialGradient(cx, cy, 2, cx, cy, 25);
      gradient.addColorStop(0, "rgba(37,99,235,1)");
      gradient.addColorStop(1, "rgba(37,99,235,0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, pulse + 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
      ctx.fillStyle = "#4f46e5";
      ctx.fill();

      /* TEXT */
      ctx.font = "13px monospace";
      ctx.fillStyle = "#93c5fd";

      const dots = ".".repeat(Math.floor((time * 2) % 4));
      const msg = messages[Math.floor((time / 2) % messages.length)];

      ctx.fillText(`${msg}${dots}`, cx - 75, cy + 60);

      time += 0.03;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className="w-80 h-64 mx-auto rounded-2xl 
      bg-gradient-to-br from-blue-600/10 to-indigo-600/10
      backdrop-blur-xl 
      border border-indigo-400/30 
      shadow-lg relative overflow-hidden"
    >
      {/* header */}
      <div className="absolute top-3 left-4 text-xs text-blue-300">
        AI Processing Engine
      </div>

      {/* progress bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-indigo-400/20 w-full">
        <div className="h-full w-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 animate-[progress_2s_linear_infinite]" />
      </div>

      <canvas ref={canvasRef} className="w-full h-full" />

      <div className="absolute bottom-3 right-4 text-xs text-indigo-300">
        Processing data...
      </div>

      <style>
        {`
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}
      </style>
    </div>
  );
}
