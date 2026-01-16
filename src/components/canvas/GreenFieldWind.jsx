import { useEffect, useRef } from "react";

export default function GreenForestRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const GREEN_MAIN = "#2fd53a";
    const GREEN_DARK = "#28c232";
    const GREEN_LIGHT = "#6be97a";

    // Rain drops (clearer rain)
    const drops = [];
    const DROP_COUNT = 650; // rõ hơn nhưng chưa nặng

    for (let i = 0; i < DROP_COUNT; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: 16 + Math.random() * 18,
        speed: 4.5 + Math.random() * 2.5,
        opacity: 0.28 + Math.random() * 0.25,
        thickness: Math.random() < 0.15 ? 2 : 1,
      });
    }

    // Noise layer (static)
    const noiseCanvas = document.createElement("canvas");
    const noiseCtx = noiseCanvas.getContext("2d");

    const generateNoise = () => {
      noiseCanvas.width = canvas.width;
      noiseCanvas.height = canvas.height;
      const imageData = noiseCtx.createImageData(
        noiseCanvas.width,
        noiseCanvas.height
      );

      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() * 255;
        imageData.data[i] = v;
        imageData.data[i + 1] = v;
        imageData.data[i + 2] = v;
        imageData.data[i + 3] = 14; // giảm noise để mưa nổi hơn
      }

      noiseCtx.putImageData(imageData, 0, 0);
    };

    generateNoise();

    let frame = 0;

    const drawGreenSurface = () => {
      const t = frame * 0.00045;
      const shift = Math.sin(t) * canvas.height * 0.1;

      const gradient = ctx.createLinearGradient(
        0,
        -shift,
        canvas.width,
        canvas.height + shift
      );

      gradient.addColorStop(0, GREEN_LIGHT);
      gradient.addColorStop(0.5, GREEN_MAIN);
      gradient.addColorStop(1, GREEN_DARK);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawRain = () => {
      drops.forEach((d) => {
        ctx.strokeStyle = `rgba(230,245,255,${d.opacity})`;
        ctx.lineWidth = d.thickness;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 1.5, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;

        if (d.y > canvas.height) {
          d.y = -30;
          d.x = Math.random() * canvas.width;
        }
      });
    };

    const animate = () => {
      frame++;

      drawGreenSurface();
      drawRain();

      // overlay noise
      ctx.drawImage(noiseCanvas, 0, 0);

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
        overflow: "hidden",
      }}
    />
  );
}
