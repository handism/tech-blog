import { siteConfig } from '@/src/config/site';
import { Github } from 'lucide-react';

/**
 * プロフィール（執筆者）カード
 */
export default function ProfileCard() {
  const avatarUrl = `${siteConfig.github}.png`;

  return (
    <div className="neo-card p-5 flex flex-col items-center">
      <div className="w-24 h-24 mb-4 rounded-2xl overflow-hidden border-3 border-border shadow-[3px_3px_0px_0px_var(--border)] dark:shadow-[3px_3px_0px_0px_var(--accent)] relative group">
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <img
          src={avatarUrl}
          alt={`${siteConfig.author}'s avatar`}
          className="object-cover w-full h-full"
        />
      </div>
      <h2 className="font-extrabold text-xl text-text mb-1">{siteConfig.author}</h2>
      <p className="text-xs text-text/80 font-medium text-center mb-4 leading-relaxed">
        {siteConfig.description}
      </p>
      <a
        href={siteConfig.github}
        target="_blank"
        rel="noopener noreferrer"
        className="neo-btn flex items-center gap-2 px-5 py-2 text-sm font-bold text-text"
      >
        <Github className="w-4 h-4" />
        <span>GitHub</span>
      </a>
    </div>
  );
}
