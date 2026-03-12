import { useMemo } from "react";

function stringToColor(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  const s = 65;
  const l = 55;
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function createAvatarDataUrl(initial, bgColor, size, textColor = "#ffffff") {
  const fontSize = Math.round(size * 0.46);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
    <rect width='100%' height='100%' rx='50%' ry='50%' fill='${bgColor}' />
    <text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-family='Arial, Helvetica, sans-serif' font-size='${fontSize}' font-weight='600' fill='${textColor}'>${initial}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function Avatar({
  name = "",
  photoURL = null,
  size = 150,
  className = "",
}) {
  const initial = (name && name.trim()[0]?.toUpperCase()) || "U";

  const src = useMemo(() => {
    if (photoURL) return photoURL;
    const bg = stringToColor(name || "user");
    return createAvatarDataUrl(initial, bg, size);
  }, [name, photoURL, size, initial]);

  return (
    <img
      src={src}
      alt={name || initial}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
