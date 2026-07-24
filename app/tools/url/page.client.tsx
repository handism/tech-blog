'use client';

import { Link as LinkIcon, ShieldAlert } from 'lucide-react';
import ToolTabsPage, { type SubTool } from '@/src/components/ToolTabsPage';
import dynamic from 'next/dynamic';

const UrlCodec = dynamic(() => import('@/src/components/tools/url/UrlCodec'));
const UrlParser = dynamic(() => import('@/src/components/tools/url/UrlParser'));
const UtmBuilder = dynamic(() => import('@/src/components/tools/url/UtmBuilder'));
const UserAgentParser = dynamic(() => import('@/src/components/tools/url/UserAgentParser'));

const SUB_TOOLS: Record<string, SubTool> = {
  'url-codec': {
    label: 'URL Codec',
    description:
      'URLのクエリパラメータなどに用いる文字列のパーセントエンコード・デコード処理を行います。',
    icon: LinkIcon,
    component: UrlCodec,
  },
  'url-parser': {
    label: 'URL Parser',
    description:
      '長いURLやクエリパラメータをきれいに分解し、値の編集・追加・削除を行って新しいURLを再生成します。',
    icon: LinkIcon,
    component: UrlParser,
  },
  'utm-builder': {
    label: 'UTM Builder',
    description:
      'Google Analytics等でのアクセス解析に用いるカスタムキャンペーンパラメータ（UTM）を追加したURLを作成します。',
    icon: LinkIcon,
    component: UtmBuilder,
  },
  'user-agent': {
    label: 'User Agent',
    description:
      'ブラウザが送信するユーザーエージェント（UA）文字列を解析し、OS・ブラウザ・エンジンを調べられます。',
    icon: ShieldAlert,
    component: UserAgentParser,
  },
};

export default function UrlToolkit() {
  return <ToolTabsPage basePath="/tools/url" subTools={SUB_TOOLS} defaultTab="url-codec" />;
}
