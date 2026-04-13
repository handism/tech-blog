import { siteConfig } from '@/src/config/site';
import { Github } from 'lucide-react';

/**
 * プロフィール（執筆者）カード
 */
export default function ProfileCard() {
  const avatarUrl = `${siteConfig.github}.png`;

  return (
    <div className="p-5 border border-border/60 rounded-3xl bg-card/70 backdrop-blur-md shadow-sm flex flex-col items-center">
      <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-border/60 shadow-sm relative group">
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {}
        <img
          src={avatarUrl}
          alt={`${siteConfig.author}'s avatar`}
          className="object-cover w-full h-full"
        />
      </div>
      <h2 className="font-bold text-xl text-text mb-1">{siteConfig.author}</h2>
      <p className="text-xs text-text/60 text-center mb-4 leading-relaxed">
        {siteConfig.description}
      </p>
      <a
        href={siteConfig.github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm font-medium text-text hover:text-accent transition-colors bg-bg/50 border border-border/40 hover:border-accent/40 px-5 py-2 rounded-full backdrop-blur-sm shadow-sm hover:shadow-md"
      >
        <Github className="w-4 h-4" />
        <span>GitHub</span>
      </a>
    </div>
  );
}
