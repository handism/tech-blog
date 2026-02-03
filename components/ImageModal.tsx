// components/ImageModal.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function ImageModal() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // 記事内の画像をクリックしたらモーダル表示
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && target.closest('article')) {
        e.preventDefault();
        const img = target as HTMLImageElement;
        setSelectedImage(img.src);
      }
    };

    document.addEventListener('click', handleImageClick);
    return () => document.removeEventListener('click', handleImageClick);
  }, []);

  useEffect(() => {
    // モーダル表示中はスクロール無効化
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedImage]);

  if (!selectedImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={() => setSelectedImage(null)}
    >
      <button
        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
        onClick={() => setSelectedImage(null)}
      >
        ×
      </button>
      <img
        src={selectedImage}
        alt="拡大画像"
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
