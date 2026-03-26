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

    const drawGrid = () => {
      ctx.strokeStyle = "rgba(99,102,241,0.15)";
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawRobot = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const offsetY = Math.sin(time) * 4;
      ctx.save();
      ctx.translate(0, offsetY);

      /* SHADOW */
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.ellipse(cx, cy + 55, 40, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      /* HEAD */
      ctx.strokeStyle = "#4f46e5";
      ctx.fillStyle = "rgba(37,99,235,0.08)";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.roundRect(cx - 55, cy - 45, 110, 90, 12);
      ctx.fill();
      ctx.stroke();

      /* ANTENNA */
      ctx.beginPath();
      ctx.moveTo(cx, cy - 45);
      ctx.lineTo(cx, cy - 65);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy - 70, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#2563eb";
      ctx.fill();

      /* EYES */
      ctx.fillStyle = "#1e3a8a";
      ctx.fillRect(cx - 30, cy - 10, 18, 10);
      ctx.fillRect(cx + 12, cy - 10, 18, 10);

      /* SCAN LINE IN EYES */
      const scan = (Math.sin(time * 2) * 4) + 4;

      ctx.fillStyle = "#60a5fa";
      ctx.fillRect(cx - 30, cy - 10 + scan, 18, 2);
      ctx.fillRect(cx + 12, cy - 10 + scan, 18, 2);

      /* MOUTH */
      ctx.strokeRect(cx - 20, cy + 10, 40, 10);

      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - 15 + i * 10, cy + 10);
        ctx.lineTo(cx - 15 + i * 10, cy + 20);
        ctx.stroke();
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawGrid();
      drawRobot();

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
    <div
      className="w-80 h-64 mx-auto rounded-2xl 
      bg-gradient-to-br from-blue-600/10 to-indigo-600/10
      backdrop-blur-xl 
      border border-indigo-400/30 
      shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-3 left-4 text-xs text-blue-300">
        Finance AI Assistant
      </div>

      <canvas ref={canvasRef} className="w-full h-full" />

      <div className="absolute bottom-3 right-4 text-xs text-indigo-300">
        AI Ready
      </div>
    </div>
  );
}