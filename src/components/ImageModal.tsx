// src/components/ImageModal.tsx
'use client';

import { useState, useEffect } from 'react';

/**
 * 記事内画像の拡大表示モーダル。
 */
export function ImageModal() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && target.closest('article')) {
        e.preventDefault();
        const img = target as HTMLImageElement;
        // サムネイル等（.not-prose 内）の画像は対象外
        if (img.closest('.not-prose')) return;

        // 記事内の全画像を取得
        const images = Array.from(document.querySelectorAll('article img'))
          .filter((img) => !(img as HTMLImageElement).closest('.not-prose'))
          .map((img) => (img as HTMLImageElement).src);

        const index = images.indexOf(img.src);
        setAllImages(images);
        setCurrentIndex(index);
        setSelectedImage(img.src);
      }
    };

    document.addEventListener('click', handleImageClick);
    return () => document.removeEventListener('click', handleImageClick);
  }, []);

  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        const newIndex = currentIndex - 1;
        setCurrentIndex(newIndex);
        setSelectedImage(allImages[newIndex]);
      } else if (e.key === 'ArrowRight' && currentIndex < allImages.length - 1) {
        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        setSelectedImage(allImages[newIndex]);
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage, currentIndex, allImages]);

  if (!selectedImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={() => setSelectedImage(null)}
    >
      <button
        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
        onClick={() => setSelectedImage(null)}
      >
        ×
      </button>

      {/* 前へボタン */}
      {currentIndex > 0 && (
        <button
          className="absolute left-4 text-white text-5xl hover:text-gray-300 z-10"
          onClick={(e) => {
            e.stopPropagation();
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            setSelectedImage(allImages[newIndex]);
          }}
        >
          ‹
        </button>
      )}

      {/* 次へボタン */}
      {currentIndex < allImages.length - 1 && (
        <button
          className="absolute right-4 text-white text-5xl hover:text-gray-300 z-10"
          onClick={(e) => {
            e.stopPropagation();
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            setSelectedImage(allImages[newIndex]);
          }}
        >
          ›
        </button>
      )}

      <img
        src={selectedImage}
        alt="拡大画像"
        className="max-w-[90%] max-h-[90%] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {/* 画像カウンター */}
      {allImages.length > 1 && (
        <div className="absolute bottom-4 text-white text-sm">
          {currentIndex + 1} / {allImages.length}
        </div>
      )}
    </div>
  );
}
