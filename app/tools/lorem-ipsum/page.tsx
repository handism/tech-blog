'use client';

import { useState, useMemo } from 'react';
import { Type, Clipboard, Check, Shuffle } from 'lucide-react';

const LOREM_TEXTS = {
  lorem: {
    name: 'Lorem Ipsum (ラテン語)',
    paragraphs: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
      'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae.',
    ],
    words: [
      'lorem',
      'ipsum',
      'dolor',
      'sit',
      'amet',
      'consectetur',
      'adipiscing',
      'elit',
      'sed',
      'do',
      'eiusmod',
      'tempor',
      'incididunt',
      'ut',
      'labore',
      'et',
      'dolore',
      'magna',
      'aliqua',
      'enim',
      'ad',
      'minim',
      'veniam',
      'quis',
      'nostrud',
      'exercitation',
      'ullamco',
      'laboris',
      'nisi',
      'aliquip',
      'ex',
      'ea',
      'commodo',
      'consequat',
      'duis',
      'aute',
      'irure',
      'reprehenderit',
      'voluptate',
      'velit',
      'esse',
      'cillum',
      'fugiat',
      'nulla',
      'pariatur',
      'excepteur',
      'sint',
      'occaecat',
      'cupidatat',
      'non',
      'proident',
      'sunt',
      'culpa',
      'qui',
      'officia',
      'deserunt',
      'mollit',
      'anim',
      'id',
      'est',
      'laborum',
    ],
  },
  neko: {
    name: '吾輩は猫である (夏目漱石)',
    paragraphs: [
      '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。この書生というのは時々我々を捕えて煮て食うという話である。',
      'しかしその当時は何という考もなかったから別段恐ろしいとも思わなかった。ただ彼の手のひらに載せられてスーと持ち上げられた時、何だかフワフワした感じがあったばかりである。書生の顔の上一つ乗っているのが、いささか心細いばかりであった。',
      'おまけに吾輩の顔のまん中へ、何だか暖かいような、それでいてすこぶるざらざらしたものが時々通り過ぎる。これが書生が飯を食ったあとに、茶碗の底に残った滓を舐める時の舌だとは、のちになってようやく知ったのである。',
      'そのころはただ不思議なものだと思って、別段深い詮索もしなかったが、その後だんだん知恵がついてみると、人間ほど不人情な動物はいないと思うようになった。第一我々の同族を捕えて皮を剥いだり肉を食ったり、それをおのれらの衣食住の用にあてるなどとは言語道断の沙汰である。',
    ],
    sentences: [
      '吾輩は猫である。',
      '名前はまだ無い。',
      'どこで生れたかとんと見当がつかぬ。',
      '何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。',
      '吾輩はここで始めて人間というものを見た。',
      'しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。',
      'この書生というのは時々我々を捕えて煮て食うという話である。',
      'しかしその当時は何という考もなかった。',
      'ただ彼の手のひらに載せられてスーと持ち上げられた時、フワフワした感じがあった。',
    ],
  },
  melos: {
    name: '走れメロス (太宰治)',
    paragraphs: [
      'メロスは激怒した。必ず、かの邪智暴虐の王を除かなければならぬと決意した。メロスには政治がわからぬ。メロスは、村の牧人である。笛を吹き、羊と遊んで暮して来た。けれども邪悪に対しては、人一倍に敏感であった。きょう未明メロスは村を出発し、野を越え山越え、十里はなれた此のシラクスの市にやって来た。',
      'メロスには無二の友があった。セリヌンティウスである。今は此のシラクスの市で、石工をしている。その友を、これから訪ねてみるつもりなのだ。久しく逢わなかったのだから、訪ねて行くのが楽しみである。歩きながらメロスは、市の中の様子に、何か釈然としないものを感じた。',
      'ひっそりしている。もう既に日も落ちて、街の暗いのは当りまえだが、けれども、なんだか、夜のせいばかりでは無く、市全体が、やけに寂しい。のんきなメロスも、だんだん不安になって来た。路で逢った若い衆に、何かあったのかと問いかけた。王は、人を殺します。なぜ殺すのだ。悪心を抱いている、というのでございますが、誰もそんな、悪心を持っていはいたしませぬ。',
    ],
    sentences: [
      'メロスは激怒した。',
      '必ず、かの邪智暴虐の王を除かなければならぬと決意した。',
      'メロスには政治がわからぬ。',
      'メロスは、村の牧人である。',
      '笛を吹き、羊と遊んで暮して来た。',
      'けれども邪悪に対しては、人一倍に敏感であった。',
      'メロスには無二の友があった。',
      'セリヌンティウスである。',
      '久しく逢わなかったのだから、訪ねて行くのが楽しみである。',
    ],
  },
};

type TextType = keyof typeof LOREM_TEXTS;
type UnitType = 'paragraphs' | 'sentences' | 'words' | 'list';

// 決定論的な疑似乱数生成器 (シード値に基づく)
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function LoremIpsumPage() {
  const [textType, setTextType] = useState<TextType>('lorem');
  const [unit, setUnit] = useState<UnitType>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [htmlMarkup, setHtmlMarkup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [trigger, setTrigger] = useState(0);

  const generatedText = useMemo(() => {
    const activeText = LOREM_TEXTS[textType];
    const items: string[] = [];

    if (unit === 'paragraphs') {
      // パラグラフの生成
      const srcParas = activeText.paragraphs;
      for (let i = 0; i < count; i++) {
        items.push(srcParas[i % srcParas.length]);
      }
      if (htmlMarkup) {
        return items.map((p) => `<p>${p}</p>`).join('\n\n');
      } else {
        return items.join('\n\n');
      }
    } else if (unit === 'sentences') {
      // 一文の生成
      const srcSentences =
        'sentences' in activeText
          ? activeText.sentences
          : activeText.paragraphs.flatMap((p) => p.split(/(?<=[。\?\.])/)); // 簡易分割

      for (let i = 0; i < count; i++) {
        items.push(srcSentences[i % srcSentences.length].trim());
      }
      const text = items.join(textType === 'lorem' ? ' ' : '');
      if (htmlMarkup) {
        return `<p>${text}</p>`;
      } else {
        return text;
      }
    } else if (unit === 'words') {
      // 単語または文字数の生成
      if (textType === 'lorem') {
        const srcWords = LOREM_TEXTS.lorem.words;
        for (let i = 0; i < count; i++) {
          const seed = trigger + i;
          items.push(srcWords[Math.floor(pseudoRandom(seed) * srcWords.length)]);
        }
        // 文頭を大文字にする
        if (items.length > 0) {
          items[0] = items[0].charAt(0).toUpperCase() + items[0].slice(1);
        }
        const text = items.join(' ') + '.';
        if (htmlMarkup) {
          return `<p>${text}</p>`;
        } else {
          return text;
        }
      } else {
        // 日本語の場合は「文字数」として扱う
        const srcAllText = activeText.paragraphs.join('');
        let text = '';
        while (text.length < count) {
          text += srcAllText;
        }
        text = text.slice(0, count);
        // 最後の文字が句点等でない場合は適宜補正
        if (!text.endsWith('。') && !text.endsWith('、') && text.length > 0) {
          text = text.slice(0, count - 1) + '。';
        }
        if (htmlMarkup) {
          return `<p>${text}</p>`;
        } else {
          return text;
        }
      }
    } else if (unit === 'list') {
      // 箇条書き
      const srcSentences =
        'sentences' in activeText
          ? activeText.sentences
          : activeText.paragraphs.flatMap((p) => p.split(/(?<=[。\?\.])/));

      for (let i = 0; i < count; i++) {
        items.push(srcSentences[i % srcSentences.length].trim().replace(/[。\.]$/, ''));
      }

      if (htmlMarkup) {
        return `<ul>\n${items.map((item) => `  <li>${item}</li>`).join('\n')}\n</ul>`;
      } else {
        return items.map((item) => `- ${item}`).join('\n');
      }
    }
    return '';
  }, [textType, unit, count, htmlMarkup, trigger]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-border rounded-lg bg-secondary text-text text-xs font-bold mb-3">
            <Type className="w-3.5 h-3.5" />
            <span>Developer Utilities</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
            Lorem Ipsum & Dummy Text Generator
          </h1>
          <p className="text-text/80 text-sm md:text-base font-medium mt-2">
            デザインやコーディング時の仮テキストとして使えるダミーテキスト（ラテン語、日本語小説）を瞬時に作成します。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左カラム: 設定パネル */}
        <div className="lg:col-span-4 space-y-6">
          <div className="theme-card p-5 md:p-6 space-y-5">
            <h2 className="text-base font-bold text-text border-b-2 border-border pb-2">
              ⚙️ ジェネレーター設定
            </h2>

            {/* テキストソース */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-text/70">テキスト素材</label>
              <select
                value={textType}
                onChange={(e) => {
                  const val = e.target.value as TextType;
                  setTextType(val);
                }}
                className="w-full px-3 py-2 border-2 border-border rounded-xl font-bold bg-card text-text focus:outline-none cursor-pointer text-sm"
              >
                {Object.entries(LOREM_TEXTS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 生成単位 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-text/70">単位</label>
              <div className="grid grid-cols-2 gap-2">
                {(['paragraphs', 'sentences', 'words', 'list'] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => {
                      setUnit(u);
                      if (u === 'words' && textType !== 'lorem' && count < 20) {
                        setCount(100);
                      }
                    }}
                    className={`px-2 py-2 rounded-lg border-2 border-border text-xs font-bold cursor-pointer transition-all ${
                      unit === u
                        ? 'bg-accent text-white shadow-none translate-x-[1px] translate-y-[1px]'
                        : 'bg-card text-text shadow-[2px_2px_0px_0px_var(--border)] dark:shadow-[2px_2px_0px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0'
                    }`}
                  >
                    {u === 'paragraphs' && '段落 (p)'}
                    {u === 'sentences' && '文 (sentence)'}
                    {u === 'words' && (textType === 'lorem' ? '単語 (word)' : '文字数 (char)')}
                    {u === 'list' && 'リスト (li)'}
                  </button>
                ))}
              </div>
            </div>

            {/* 数量 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-text/70">
                数量 ({unit === 'words' && textType !== 'lorem' ? '文字' : '個'})
              </label>
              <input
                type="number"
                min={1}
                max={unit === 'words' && textType !== 'lorem' ? 2000 : 100}
                value={count}
                onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 border-2 border-border rounded-xl font-bold bg-card text-text focus:outline-none text-sm"
              />
            </div>

            {/* HTMLタグの有無 */}
            <label className="flex items-center gap-2.5 cursor-pointer py-1.5">
              <input
                type="checkbox"
                checked={htmlMarkup}
                onChange={(e) => setHtmlMarkup(e.target.checked)}
                className="w-4 h-4 border-2 border-border rounded accent-accent bg-card"
              />
              <span className="text-xs font-extrabold text-text">HTMLタグを含める</span>
            </label>

            {/* 再生成ボタン */}
            <button
              onClick={() => setTrigger((t) => t + 1)}
              className="w-full theme-btn py-2.5 bg-secondary text-text text-sm flex items-center justify-center gap-1.5"
            >
              <Shuffle className="w-4 h-4" />
              ランダムに再生成
            </button>
          </div>
        </div>

        {/* 右カラム: 生成コード出力 */}
        <div className="lg:col-span-8">
          <div className="theme-card p-5 md:p-6 flex flex-col h-full min-h-[480px]">
            <div className="flex justify-between items-center mb-4 border-b-2 border-border pb-3">
              <h2 className="text-base font-bold text-text">✨ 生成されたダミーテキスト</h2>
              {generatedText && (
                <button
                  onClick={handleCopy}
                  className="theme-btn px-4 py-1.5 text-xs bg-accent text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Clipboard className="w-3.5 h-3.5" />
                  )}
                  コピー
                </button>
              )}
            </div>

            <div className="flex-1 min-h-0">
              <textarea
                readOnly
                className="w-full h-full p-4 border-2 border-border rounded-xl font-mono text-sm bg-card text-text focus:outline-none resize-none overflow-y-auto leading-relaxed"
                value={generatedText}
                placeholder="ここにテキストが生成されます。"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
