import { useEffect, useRef } from "react";

const FullScreenOceanWave = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const starsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    let t = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;

      // tạo sao 1 lần
      starsRef.current = Array.from({ length: 120 }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const getProgress = (t) => {
      const cycle = t % 1;
      if (cycle < 0.45) return cycle / 0.45;
      if (cycle < 0.55) return 1;
      return 1 - (cycle - 0.55) / 0.45;
    };

    const drawSky = () => {
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#050b2e");
      sky.addColorStop(1, "#0b2c6a");

      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // sao
      starsRef.current.forEach((s) => {
        const alpha = 0.4 + Math.sin(t * 0.8 + s.phase) * 0.2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });
    };

    const draw = () => {
      t += 0.002;

      ctx.clearRect(0, 0, w, h);

      // 🌌 bầu trời sao
      drawSky();

      // 🌊 sóng biển
      const progress = getProgress(t);
      const waveX = w * 0.5 * progress;

      ctx.beginPath();
      ctx.moveTo(0, 0);

      const foamPath = [];

      for (let y = 0; y <= h; y += 6) {
        const distortion =
          Math.sin(y * 0.025 + t * 3) * 30;
        const x = waveX + distortion;
        ctx.lineTo(x, y);
        foamPath.push({ x, y });
      }

      ctx.lineTo(0, h);
      ctx.closePath();

      const water = ctx.createLinearGradient(0, 0, w, h);
      water.addColorStop(0, "#1242a8");
      water.addColorStop(1, "#1e6fff");

      ctx.fillStyle = water;
      ctx.fill();

      // bọt biển (chỉ mép sóng)
      ctx.beginPath();
      foamPath.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });

      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
    />
  );
};

export default FullScreenOceanWave;
