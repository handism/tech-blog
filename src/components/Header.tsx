// src/components/Header.tsx
'use client';

import { ThemeToggle } from '@/src/components/ThemeToggle';
import { siteConfig, toolsMenuItems } from '@/src/config/site';
import Link from 'next/link';
import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { FaGithub } from 'react-icons/fa';

const menuItems = toolsMenuItems;

/**
 * サイト全体のヘッダー。
 */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // メニューの外側をクリックしたら閉じる処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const focusItem = (index: number) => {
    setIsOpen(true);
    setTimeout(() => {
      itemRefs.current[index]?.focus();
    }, 0);
  };

  const handleButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusItem(menuItems.length - 1);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleItemKeyDown = (e: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      itemRefs.current[(index + 1) % menuItems.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      itemRefs.current[(index - 1 + menuItems.length) % menuItems.length]?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <header>
      <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 relative flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
          <Link href="/" className="text-xl font-bold text-text hover:opacity-80">
            {siteConfig.name}
          </Link>

          <nav className="flex items-center gap-4 md:gap-6 text-sm">
            <Link href="/about" className="text-text/80 hover:text-accent transition-colors">
              About
            </Link>
            <Link href="/sitemap" className="text-text/80 hover:text-accent transition-colors">
              Sitemap
            </Link>
            <Link
              href="/privacy-policy"
              className="text-text/80 hover:text-accent transition-colors"
            >
              Policy
            </Link>

            {/* ドロップダウン部分 */}
            <div className="relative" ref={dropdownRef}>
              <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsOpen(true)}
                onKeyDown={handleButtonKeyDown}
                className="text-text/80 hover:text-accent transition-colors flex items-center gap-1"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls="tools-menu"
              >
                Tools
                <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>

              <div
                onMouseLeave={() => setIsOpen(false)}
                className={`
                  absolute left-0 mt-2 w-48
                  rounded-md border border-border
                  bg-card/95 backdrop-blur-md
                  shadow-xl shadow-black/20
                  transition-all z-50
                  ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
                `}
              >
                <ul id="tools-menu" role="menu" className="py-1">
                  {menuItems.map((item, index) =>
                    item.external ? (
                      <li key={item.href} role="none">
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          ref={(el) => {
                            itemRefs.current[index] = el;
                          }}
                          role="menuitem"
                          tabIndex={isOpen ? 0 : -1}
                          onClick={() => setIsOpen(false)}
                          onKeyDown={(e) => handleItemKeyDown(e, index)}
                          className="block px-4 py-2 text-sm text-text/80 hover:text-accent hover:bg-accent/10 first:rounded-t-md last:rounded-b-md"
                        >
                          {item.label}
                        </a>
                      </li>
                    ) : (
                      <li key={item.href} role="none">
                        <Link
                          href={item.href}
                          ref={(el) => {
                            itemRefs.current[index] = el;
                          }}
                          role="menuitem"
                          tabIndex={isOpen ? 0 : -1}
                          onClick={() => setIsOpen(false)}
                          onKeyDown={(e) => handleItemKeyDown(e, index)}
                          className="block px-4 py-2 text-sm text-text/80 hover:text-accent hover:bg-accent/10 first:rounded-t-md last:rounded-b-md"
                        >
                          {item.label}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>

        {/* アイコン類 */}
        <div className="absolute right-3 top-3 md:static flex items-center gap-1.5 md:gap-2 md:self-auto">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text hover:text-accent transition-colors p-1.5 -mr-1.5 md:p-2 md:mr-0"
            aria-label="GitHub"
          >
            <FaGithub className="w-5 h-5" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
