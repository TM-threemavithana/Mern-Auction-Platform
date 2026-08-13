import { useState } from "react";

const LotImageZoom = ({ src, alt }) => {
  const [zooming, setZooming] = useState(false); const [position, setPosition] = useState({ x: 50, y: 50 });
  const updatePosition = (event) => { const rect = event.currentTarget.getBoundingClientRect(); setPosition({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 }); };
  if (!src) return <div className="grid aspect-square place-items-center rounded-xl bg-slate-100 text-sm text-slate-500">Image unavailable</div>;
  return <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white"><button type="button" onMouseEnter={() => setZooming(true)} onMouseLeave={() => setZooming(false)} onMouseMove={updatePosition} onFocus={() => setZooming(true)} onBlur={() => setZooming(false)} onClick={() => setZooming((value) => !value)} className="block w-full cursor-zoom-in touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-inset" aria-label="Inspect image; hover or tap to zoom"><img src={src} alt={alt} className="aspect-square h-auto w-full object-contain p-5"/>{zooming && <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-white bg-no-repeat sm:block" style={{ backgroundImage: `url(${src})`, backgroundPosition: `${position.x}% ${position.y}%`, backgroundSize: "250%" }}/>}<span className="absolute bottom-3 left-3 rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-white">{zooming ? "Tap or move away to close" : "Hover or tap to zoom"}</span></button></div>;
};
export default LotImageZoom;
