import type { ThemeId } from '@/src/config/themes';

export type PomodoroSound = 'tick' | 'complete';

/**
 * Web Audio API でポモドーロの効果音（秒針のティック音・セッション完了音）を再生する。
 * デザインテーマ（steampunk / terminal / chalkboard / その他）ごとに音色を切り替える。
 */
export function playPomodoroSound(type: PomodoroSound, currentTheme: ThemeId): void {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'tick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (currentTheme === 'steampunk') {
        // カチッという低めの機械式ギアの音
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      } else if (currentTheme === 'terminal') {
        // 8bit風ビープティック
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.006, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      } else if (currentTheme === 'chalkboard') {
        // チョークで点を書くような音
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2200, now);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      } else {
        // デフォルト（モダン・ソフトな音）
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        gain.gain.setValueAtTime(0.006, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'complete') {
      if (currentTheme === 'steampunk') {
        // レトロ真鍮ベルの音
        const freqs = [220, 275, 330, 440];
        freqs.forEach((f, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now);
          const volume = 0.12 / (index + 1);
          gain.gain.setValueAtTime(volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 2.0);
        });
      } else if (currentTheme === 'terminal') {
        // 8bitビープメロディ（ドミソド）
        const playBeep = (freq: number, duration: number, delay: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + delay);
          gain.gain.setValueAtTime(0.08, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + duration + 0.1);
        };
        playBeep(523.25, 0.12, 0); // C5
        playBeep(659.25, 0.12, 0.15); // E5
        playBeep(783.99, 0.12, 0.3); // G5
        playBeep(1046.5, 0.25, 0.45); // C6
      } else if (currentTheme === 'chalkboard') {
        // 学校のチャイム（キーンコーンカーンコーン： Westminster Chime）
        const notes = [
          { f: 329.63, d: 0.6, start: 0 }, // E4
          { f: 261.63, d: 0.6, start: 0.6 }, // C4
          { f: 293.66, d: 0.6, start: 1.2 }, // D4
          { f: 196.0, d: 0.8, start: 1.8 }, // G3
        ];
        notes.forEach((n) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(n.f, now + n.start);
          gain.gain.setValueAtTime(0.12, now + n.start);
          gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + n.start);
          osc.stop(now + n.start + n.d + 0.1);
        });
      } else {
        // デフォルト: 綺麗なクリスタルチャイム
        const playChime = (freq: number, delay: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + delay);
          gain.gain.setValueAtTime(0.08, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.9);
        };
        playChime(880, 0);
        playChime(1320, 0.1);
      }
    }
  } catch (e) {
    console.warn('AudioContext execution failed', e);
  }
}
