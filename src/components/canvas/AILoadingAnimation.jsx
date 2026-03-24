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

    const particles = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.5 + Math.random(),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      /* =====================
         PARTICLES → AI CORE
      ===================== */
      particles.forEach((p) => {
        const dx = cx - p.x;
        const dy = cy - p.y;

        p.x += dx * 0.01;
        p.y += dy * 0.01;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();

        // reset khi gần core
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
        }
      });

      /* =====================
         ROTATING RING
      ===================== */
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time);

      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 1.5);
      ctx.stroke();

      ctx.restore();

      /* =====================
         AI CORE (PULSE)
      ===================== */
      const pulse = 6 + Math.sin(time * 2) * 2;

      const gradient = ctx.createRadialGradient(cx, cy, 2, cx, cy, 20);

      gradient.addColorStop(0, "rgba(56,189,248,1)");
      gradient.addColorStop(1, "rgba(56,189,248,0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, pulse + 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
      ctx.fillStyle = "#38bdf8";
      ctx.fill();

      /* =====================
         TEXT
      ===================== */
      ctx.font = "14px monospace";
      ctx.fillStyle = "#38bdf8";

      const dots = ".".repeat(Math.floor((time * 2) % 4));
      ctx.fillText(`AI analyzing${dots}`, cx - 60, cy + 60);

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
    <div className="w-80 h-64 mx-auto rounded-xl border border-sky-400/30">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
