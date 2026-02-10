// app/privacy-policy/page.tsx
import BlogLayout from '@/src/components/BlogLayout';
import { getAllPosts } from '@/src/lib/posts-server';
import type { Metadata } from 'next';

/**
 * プライバシーポリシーページのメタデータ。
 */
export const metadata: Metadata = {
  title: 'プライバシーポリシー・免責事項',
};

/**
 * プライバシーポリシーページ。
 */
export default async function PrivacyPolicyPage() {
  const posts = await getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <BlogLayout posts={posts} categories={categories}>
      <div className="max-w-none">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-text">
            プライバシーポリシー・免責事項
          </h1>
          <p className="text-sm text-text/60 mt-2">最終更新日: 2026-02-08</p>
        </header>

        <section className="space-y-6 text-text/80 leading-relaxed">
          <h2 className="text-2xl font-semibold text-text">プライバシーポリシー</h2>
          <p>
            当サイト（以下「本サイト」）は、個人情報の保護を重要な責務と考え、以下のとおり
            プライバシーポリシーを定め、適切な取り扱いに努めます。
          </p>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-text">1. 収集する情報</h2>
            <p>本サイトでは、以下の情報を取得する場合があります。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>アクセスログ（IPアドレス、ブラウザ、参照元、閲覧日時など）</li>
              <li>お問い合わせ時に入力された情報（氏名、メールアドレス、内容など）</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-text">2. 利用目的</h2>
            <p>取得した情報は、以下の目的で利用します。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>本サイトの運営・改善</li>
              <li>お問い合わせへの対応</li>
              <li>不正アクセスやスパム等の防止</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-text">3. アクセス解析・Cookie</h2>
            <p>
              本サイトでは、利便性向上や利用状況の把握のためにアクセス解析やCookieを利用することがあります。
              Cookieの受け取りを拒否する場合、ブラウザ設定で無効化できます。
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-text">4. 第三者提供</h2>
            <p>取得した個人情報は、法令に基づく場合を除き、本人の同意なく第三者に提供しません。</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-text">5. 外部リンク</h2>
            <p>
              本サイトには外部サイトへのリンクが含まれる場合があります。リンク先での個人情報の取り扱いについては、
              各外部サイトのプライバシーポリシーをご確認ください。
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-text">6. 改定</h2>
            <p>
              本ポリシーは必要に応じて改定されることがあります。最新の内容は本ページにて公開します。
            </p>
          </div>
        </section>

        <section className="mt-12 space-y-6 text-text/80 leading-relaxed">
          <h2 className="text-2xl font-semibold text-text">免責事項</h2>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-text">1. 情報の正確性について</h3>
            <p>
              本サイトに掲載する情報は、可能な限り正確な内容を提供するよう努めていますが、正確性や安全性を保証するものではありません。
              情報の利用により生じた損害等について、本サイトは一切の責任を負いません。
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-text">2. 予告なしの変更</h3>
            <p>本サイトに掲載している内容は、予告なく変更・削除されることがあります。</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-text">3. 外部リンク</h3>
            <p>
              本サイトから外部サイトへ移動した場合、移動先で提供される情報、サービス等について本サイトは一切の責任を負いません。
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-text">4. 著作権・引用</h3>
            <p>
              本サイトに掲載する文章・画像・コード等の著作権は、特に明記がない限り運営者に帰属します。
              引用の際は、引用範囲を明確にし、適切な出典を明記してください。
            </p>
          </div>
        </section>
      </div>
    </BlogLayout>
  );
}
