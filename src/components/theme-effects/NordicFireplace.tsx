// src/components/theme-effects/NordicFireplace.tsx
/**
 * Nordic テーマ用の暖炉のゆらぎ背景。
 */
export default function NordicFireplace({
  isDark,
  effectsEnabled,
}: {
  isDark: boolean;
  effectsEnabled: boolean;
}) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[-1] overflow-hidden ${isDark ? 'bg-[#0f0a08]' : 'bg-[#edf2f0]'}`}
    >
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-repeat"
        style={{
          backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="nordicNoise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23nordicNoise)"/%3E%3C/svg%3E')`,
        }}
      />
      {/* 左下の炎 / 暖色（ダークモード） or セージグリーン（ライトモード） */}
      <div
        className={`absolute bottom-[-15%] left-[-15%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr ${
          isDark ? 'from-[#3a1a05] via-[#240b02] to-[#120501]' : 'from-[#faebe1] to-[#e4ede7]'
        } blur-[120px] ${effectsEnabled ? 'fireplace-flame-1' : ''}`}
      />
      {/* 右上の炎 / 暖色（ダークモード） or セージグリーン（ライトモード） */}
      <div
        className={`absolute top-[-15%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl ${
          isDark ? 'from-[#2e0f02] via-[#1a0801] to-[#0f0400]' : 'from-[#e9f2ef] to-[#f4ebe3]'
        } blur-[100px] ${effectsEnabled ? 'fireplace-flame-2' : ''}`}
      />
    </div>
  );
}
