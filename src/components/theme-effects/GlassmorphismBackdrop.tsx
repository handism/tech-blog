// src/components/theme-effects/GlassmorphismBackdrop.tsx
/**
 * Glassmorphism テーマ用の浮遊Blob背景。
 */
export default function GlassmorphismBackdrop({
  isDark,
  effectsEnabled,
}: {
  isDark: boolean;
  effectsEnabled: boolean;
}) {
  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none z-[-1] ${isDark ? 'bg-gradient-to-br from-[#0c0f1d] to-[#05060b]' : 'bg-gradient-to-br from-[#e2e8f0] to-[#f8fafc]'}`}
    >
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-repeat"
        style={{
          backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noiseFilter)"/%3E%3C/svg%3E')`,
        }}
      />
      {/* 浮遊するカラフルなBlob */}
      {effectsEnabled && (
        <>
          <div
            className="absolute top-[20%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-25 blur-[120px] animate-pulse"
            style={{ animationDuration: '8s' }}
          />
          <div
            className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-pink-600 to-rose-600 opacity-20 blur-[130px] animate-pulse"
            style={{ animationDuration: '12s' }}
          />
        </>
      )}
    </div>
  );
}
