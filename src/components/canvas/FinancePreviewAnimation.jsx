import { useEffect, useRef } from "react";

export default function FinanceRobotAnimation() {
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

    const drawRobot = (eyesOpen) => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      /* =====================
         GLOW AROUND ROBOT
      ===================== */
      if (eyesOpen) {
        const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120);

        glow.addColorStop(0, "rgba(57,255,20,0.25)");
        glow.addColorStop(1, "rgba(57,255,20,0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, 120, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = "#39ff14";
      ctx.fillStyle = "rgba(57,255,20,0.05)";
      ctx.lineWidth = 2;

      // head
      ctx.beginPath();
      ctx.roundRect(cx - 55, cy - 45, 110, 90, 10);
      ctx.fill();
      ctx.stroke();

      // antenna
      ctx.beginPath();
      ctx.moveTo(cx, cy - 45);
      ctx.lineTo(cx, cy - 65);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy - 70, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#39ff14";
      ctx.fill();

      // side panels
      ctx.strokeRect(cx - 65, cy - 20, 10, 30);
      ctx.strokeRect(cx + 55, cy - 20, 10, 30);

      /* =====================
         EYES
      ===================== */
      if (eyesOpen) {
        ctx.shadowColor = "#39ff14";
        ctx.shadowBlur = 25;

        ctx.fillStyle = "#39ff14";
        ctx.fillRect(cx - 30, cy - 10, 18, 10);
        ctx.fillRect(cx + 12, cy - 10, 18, 10);

        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = "#14532d";
        ctx.fillRect(cx - 30, cy - 5, 18, 2);
        ctx.fillRect(cx + 12, cy - 5, 18, 2);
      }

      /* =====================
         MOUTH
      ===================== */
      ctx.strokeRect(cx - 20, cy + 10, 40, 10);

      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - 15 + i * 10, cy + 10);
        ctx.lineTo(cx - 15 + i * 10, cy + 20);
        ctx.stroke();
      }
    };

    const animate = () => {
      // clear canvas (KHÔNG vẽ background → trong suốt)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const eyesOpen = Math.sin(time) > 0;

      drawRobot(eyesOpen);

      time += 0.05;

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="w-80 h-64 mx-auto">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
