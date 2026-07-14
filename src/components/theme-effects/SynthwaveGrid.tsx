// src/components/theme-effects/SynthwaveGrid.tsx
/**
 * Synthwave テーマ用の3Dグリッド背景とネオン太陽。
 */
export default function SynthwaveGrid({
  isDark,
  effectsEnabled,
}: {
  isDark: boolean;
  effectsEnabled: boolean;
}) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[-2] overflow-hidden ${isDark ? 'bg-[#0d0d26]' : 'bg-gradient-to-br from-[#fdf2f8] to-[#fae8ff]'}`}
    >
      {/* ネオン太陽 */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-b from-[#ff007f] to-[#ffaa00] opacity-40 blur-md">
        {/* 太陽の横縞カット */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 12px, ${isDark ? '#0d0d26' : '#fae8ff'} 12px, ${isDark ? '#0d0d26' : '#fae8ff'} 16px)`,
          }}
        />
      </div>
      {/* レーザー光線のような放射線背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(112,0,255,0.15),transparent_70%)]" />
      {/* 3Dグリッド */}
      <div className="absolute bottom-0 left-0 w-full h-[40vh] [perspective:200px] overflow-hidden">
        <div
          className="absolute inset-0 w-full h-[200%] origin-top border-t-2 border-[#ff007f]/30"
          style={{
            backgroundImage: isDark
              ? `
                  linear-gradient(to bottom, rgba(255, 0, 127, 0.2) 2px, transparent 2px),
                  linear-gradient(to right, rgba(0, 240, 255, 0.2) 2px, transparent 2px),
                  linear-gradient(to bottom, transparent, rgba(255, 0, 127, 0.3))
                `
              : `
                  linear-gradient(to bottom, rgba(255, 0, 127, 0.1) 2px, transparent 2px),
                  linear-gradient(to right, rgba(14, 165, 233, 0.1) 2px, transparent 2px),
                  linear-gradient(to bottom, transparent, rgba(255, 0, 127, 0.15))
                `,
            backgroundSize: '40px 40px, 40px 40px, 100% 100%',
            backgroundPosition: '0 0, 0 0, 0 0',
            transform: 'rotateX(75deg)',
            animation: effectsEnabled ? 'synthwave-grid-scroll 3s linear infinite' : 'none',
          }}
        />
      </div>
    </div>
  );
}
