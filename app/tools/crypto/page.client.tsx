'use client';

import { Lock, Hash, Key, Code } from 'lucide-react';
import ToolTabsPage, { type SubTool } from '@/src/components/ToolTabsPage';
import dynamic from 'next/dynamic';

const Base64Codec = dynamic(() => import('@/src/components/tools/crypto/Base64Codec'));
const HashGenerator = dynamic(() => import('@/src/components/tools/crypto/HashGenerator'));
const JwtDecoder = dynamic(() => import('@/src/components/tools/crypto/JwtDecoder'));
const UuidGenerator = dynamic(() => import('@/src/components/tools/crypto/UuidGenerator'));
const PasswordGenerator = dynamic(() => import('@/src/components/tools/crypto/PasswordGenerator'));

const SUB_TOOLS: Record<string, SubTool> = {
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
};

export default function CryptoToolkit() {
  return <ToolTabsPage basePath="/tools/crypto" subTools={SUB_TOOLS} defaultTab="base64" />;
}
