'use client';

import { ArrowLeft, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface ToolPageLayoutProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export default function ToolPageLayout({
  title,
  description,
  icon: Icon,
  children,
}: ToolPageLayoutProps) {
  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm font-bold text-text/60 hover:text-accent transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          ツール一覧に戻る
        </Link>

        <div className="neo-card p-6 md:p-10 bg-card">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10 border-b-3 border-border pb-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl border-3 border-border bg-secondary text-accent shadow-[4px_4px_0px_0px_var(--border)] dark:shadow-[4px_4px_0px_0px_var(--accent)]">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight mb-2">
                {title}
              </h1>
              {description && (
                <p className="text-text/70 text-sm md:text-base font-medium leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Tool Content */}
          <div className="space-y-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
