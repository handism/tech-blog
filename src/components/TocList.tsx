import type { TocItem } from '@/src/types/post';

interface TocListProps {
  toc: TocItem[];
  activeId: string | null;
}

export default function TocList({ toc, activeId }: TocListProps) {
  return (
    <ul className="space-y-2 text-sm font-bold">
      {toc.map((item) => {
        const indent = (item.level - 1) * 16;
        const isActive = activeId === item.id;
        return (
          <li key={item.id} style={{ paddingLeft: `${indent}px` }}>
            <a
              href={`#${item.id}`}
              className={`block hover:text-accent hover:underline transition-all duration-200 ${
                isActive ? 'text-accent font-extrabold translate-x-1' : 'text-text/80 font-medium'
              }`}
            >
              {isActive && <span className="inline-block mr-1.5 text-accent animate-pulse">●</span>}
              {item.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
