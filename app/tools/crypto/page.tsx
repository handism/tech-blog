// app/tools/crypto/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Hash, Key, Code } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';
import Base64Codec from '@/src/components/tools/crypto/Base64Codec';
import HashGenerator from '@/src/components/tools/crypto/HashGenerator';
import JwtDecoder from '@/src/components/tools/crypto/JwtDecoder';
import UuidGenerator from '@/src/components/tools/crypto/UuidGenerator';
import PasswordGenerator from '@/src/components/tools/crypto/PasswordGenerator';

type SubToolKey = 'base64' | 'hash-generator' | 'jwt-decoder' | 'uuid' | 'password-generator';

const SUB_TOOLS = {
  base64: {
    label: 'Base64 Codec',
    description: 'テキストやファイルの Base64 エンコード・デコード処理を行います。',
    icon: Lock,
    component: Base64Codec,
  },
  'hash-generator': {
    label: 'Hash Generator',
    description: 'MD5, SHA-1, SHA-256, SHA-512 などの暗号ハッシュ値を瞬時に生成します。',
    icon: Hash,
    component: HashGenerator,
  },
  'jwt-decoder': {
    label: 'JWT Decoder',
    description: 'JSON Web Token (JWT) のヘッダー、ペイロード、署名を解析・検証します。',
    icon: Key,
    component: JwtDecoder,
  },
  uuid: {
    label: 'UUID Generator',
    description: '開発や検証に使えるランダムなUUID (v4) を一括生成します。',
    icon: Code,
    component: UuidGenerator,
  },
  'password-generator': {
    label: 'Password Gen',
    description: '長さや使用文字種をカスタマイズして、安全なランダムパスワードを生成します。',
    icon: Key,
    component: PasswordGenerator,
  },
} as const;

function CryptoToolkitContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // クエリパラメータの tab を取得（デフォルトは base64）
  const currentTab = (searchParams.get('tab') || 'base64') as SubToolKey;
  const activeTab: SubToolKey = currentTab in SUB_TOOLS ? currentTab : 'base64';

  const activeTool = SUB_TOOLS[activeTab];
  const ActiveComponent = activeTool.component;

  const handleTabChange = (tab: SubToolKey) => {
    router.push(`/tools/crypto?tab=${tab}`);
  };

  return (
    <ToolPageLayout
      title={activeTool.label}
      description={activeTool.description}
      icon={activeTool.icon}
    >
      <div className="space-y-8">
        {/* サブツールの切り替えタブ */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none border-b-2 border-border/20 -mx-4 px-4 md:mx-0 md:px-0">
          {(Object.keys(SUB_TOOLS) as SubToolKey[]).map((key) => {
            const tool = SUB_TOOLS[key];
            const isActive = activeTab === key;
            const Icon = tool.icon;

            return (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`
                  px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap border-2 border-border transition-all flex items-center gap-1.5 cursor-pointer
                  ${
                    isActive
                      ? 'bg-accent text-white translate-x-[1px] translate-y-[1px] shadow-none'
                      : 'bg-card text-text shadow-[2.5px_2.5px_0px_0px_var(--border)] dark:shadow-[2.5px_2.5px_0px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--border)] dark:hover:shadow-[4px_4px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>

        {/* アクティブなサブツールのレンダリング */}
        <div className="min-h-[400px]">
          <ActiveComponent />
        </div>
      </div>
    </ToolPageLayout>
  );
}

export default function CryptoToolkit() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center font-bold text-text/60">
          読み込み中...
        </div>
      }
    >
      <CryptoToolkitContent />
    </Suspense>
  );
}
