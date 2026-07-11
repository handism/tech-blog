'use client';

import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  dragActiveText?: string;
  className?: string;
}

export default function FileDropZone({
  onFileSelect,
  accept = 'image/*',
  title = 'ファイルをドラッグ＆ドロップ',
  subtitle = 'またはクリックしてファイルを選択',
  description,
  icon,
  dragActiveText = 'そのままドロップ！',
  className = '',
}: FileDropZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    if (!accept) return true;

    const acceptedTypes = accept.split(',').map((t) => t.trim().toLowerCase());
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    const isMatch = acceptedTypes.some((type) => {
      if (type === 'image/*') {
        return fileType.startsWith('image/');
      }
      if (type.startsWith('.')) {
        return fileName.endsWith(type);
      }
      if (type.includes('*')) {
        const [prefix] = type.split('/');
        return fileType.startsWith(`${prefix}/`);
      }
      return fileType === type;
    });

    if (!isMatch) {
      alert(
        `形式が正しくありません。選択されたファイルは許可されていません。 (対応形式: ${accept})`
      );
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        theme-card border-dashed border-3 flex flex-col items-center justify-center text-center p-8 md:p-10 cursor-pointer transition-all duration-200 min-h-[220px] select-none
        ${
          dragActive
            ? 'border-accent bg-accent/10 scale-[1.01]'
            : 'border-border/60 hover:border-accent hover:bg-secondary/40'
        }
        ${className}
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {dragActive ? (
        <div className="flex flex-col items-center animate-pulse">
          {icon || <Upload className="w-12 h-12 text-accent mb-4" />}
          <h3 className="font-extrabold text-lg text-accent">{dragActiveText}</h3>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="p-4 bg-secondary/50 rounded-full mb-4 border-2 border-border/20">
            {icon || <Upload className="w-10 h-10 text-text/50" />}
          </div>
          <h3 className="font-extrabold text-base mb-1.5 text-text">{title}</h3>
          <p className="text-xs text-text/60 font-medium">{subtitle}</p>
          {description && (
            <p className="text-[10px] text-text/40 font-medium mt-2 max-w-[80%] leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
