'use client';

import React, { useState, useRef, useEffect } from 'react';

const MemphisGenerator = () => {
  const canvasRef = useRef(null);
  const [selectedSize, setSelectedSize] = useState('youtube');
  const [selectedTone, setSelectedTone] = useState('pale');
  const [selectedDensity, setSelectedDensity] = useState('standard');
  const [backgroundMode, setBackgroundMode] = useState('auto'); // 'auto', 'custom', 'transparent'
  const [customBackgroundColor, setCustomBackgroundColor] = useState('#FFF9F3');
  // 関数形式で初期化
  const [currentSeed, setCurrentSeed] = useState(() => Date.now());

  const sizes = {
    youtube: { width: 1280, height: 720, label: 'YouTube サムネイル (1280×720)' },
    instagram: { width: 1080, height: 1080, label: 'Instagram 投稿 (1080×1080)' },
    twitter: { width: 1200, height: 675, label: 'X (Twitter) 投稿 (1200×675)' },
  };

  const densities = {
    simple: { name: 'シンプル', min: 8, max: 15 },
    standard: { name: '標準', min: 20, max: 30 },
    busy: { name: '賑やか', min: 35, max: 50 },
  };

  const colorPalettes = {
    pale: {
      name: 'ペールトーン',
      primary: ['#FFB3C1', '#FFFACD', '#B4E7F5', '#D4C5F9', '#FFB6B9'],
      secondary: ['#C9E4CA', '#FFF4E0', '#E8C4F7', '#C1E1C1', '#FAD2E1'],
      backgrounds: ['#FFF9F3', '#F7F9FB', '#FFF5F7', '#F8F9FF', '#FFFEF7'],
    },
    light: {
      name: 'ライトトーン',
      primary: ['#FFD4E5', '#FFF9B1', '#C4E8F5', '#E5D4FF', '#FFD4D4'],
      secondary: ['#D4F1D4', '#FFEAA7', '#DFD4FF', '#D4F5E8', '#FFE4E8'],
      backgrounds: ['#FFFBF5', '#F5FAFF', '#FFF7FA', '#FAFBFF', '#FFFFF5'],
    },
    bright: {
      name: 'ブライトトーン',
      primary: ['#FF9EBB', '#FFE066', '#66D9EF', '#B98FFF', '#FF8A8A'],
      secondary: ['#8FE8A0', '#FFD93D', '#C78FFF', '#6EDDB8', '#FFA8B8'],
      backgrounds: ['#FFF8F0', '#F0F8FF', '#FFF3F8', '#F8F0FF', '#FFFEF0'],
    },
    vivid: {
      name: 'ビビッドトーン',
      primary: ['#FF6B9D', '#FEC601', '#00D9FF', '#A259FF', '#FF4E50'],
      secondary: ['#00E676', '#FFD600', '#D500F9', '#00BFA5', '#FF1744'],
      backgrounds: ['#FFF5E6', '#E8F4F8', '#FFF0F5', '#F0F8FF', '#FFFACD'],
    },
  };

  const colors = colorPalettes[selectedTone];

  // Seeded random number generator for reproducibility
  const seededRandom = (seed) => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const getRandomColor = (palette, seed) => {
    const index = Math.floor(seededRandom(seed) * palette.length);
    return palette[index];
  };

  const drawMemphisPattern = (ctx, width, height, seed, density, bgMode, customBgColor) => {
    ctx.clearRect(0, 0, width, height);

    // Background
    if (bgMode === 'transparent') {
      // 透明背景の場合は何も描画しない
    } else if (bgMode === 'custom') {
      ctx.fillStyle = customBgColor;
      ctx.fillRect(0, 0, width, height);
    } else {
      // auto mode
      ctx.fillStyle = getRandomColor(colors.backgrounds, seed);
      ctx.fillRect(0, 0, width, height);
    }

    let shapeSeed = seed;

    // Draw shapes based on density
    const densityConfig = densities[density];
    const shapeCount =
      densityConfig.min +
      Math.floor(seededRandom(shapeSeed++) * (densityConfig.max - densityConfig.min + 1));

    for (let i = 0; i < shapeCount; i++) {
      const shapeType = Math.floor(seededRandom(shapeSeed++) * 7);
      const x = seededRandom(shapeSeed++) * width;
      const y = seededRandom(shapeSeed++) * height;
      const size = 30 + seededRandom(shapeSeed++) * 150;
      const rotation = seededRandom(shapeSeed++) * Math.PI * 2;
      const color =
        seededRandom(shapeSeed++) > 0.5
          ? getRandomColor(colors.primary, shapeSeed++)
          : getRandomColor(colors.secondary, shapeSeed++);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = seededRandom(shapeSeed++) > 0.8 ? 4 : 0;

      switch (shapeType) {
        case 0: // Circle
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          if (seededRandom(shapeSeed++) > 0.5) ctx.fill();
          else ctx.stroke();
          break;

        case 1: // Square
          ctx.fillRect(-size / 2, -size / 2, size, size);
          if (ctx.lineWidth > 0) ctx.strokeRect(-size / 2, -size / 2, size, size);
          break;

        case 2: // Triangle
          ctx.beginPath();
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(-size / 2, size / 2);
          ctx.lineTo(size / 2, size / 2);
          ctx.closePath();
          if (seededRandom(shapeSeed++) > 0.5) ctx.fill();
          else ctx.stroke();
          break;

        case 3: // Zigzag line
          ctx.beginPath();
          ctx.lineWidth = 5;
          const segments = 5;
          for (let j = 0; j < segments; j++) {
            ctx.lineTo((j - segments / 2) * 30, (j % 2) * 30 - 15);
          }
          ctx.stroke();
          break;

        case 4: // Wavy line
          ctx.beginPath();
          ctx.lineWidth = 5;
          for (let t = 0; t < Math.PI * 2; t += 0.1) {
            const wx = t * 20 - 60;
            const wy = Math.sin(t * 3) * 20;
            if (t === 0) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }
          ctx.stroke();
          break;

        case 5: // Dots pattern
          for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
              ctx.beginPath();
              ctx.arc(dx * 15, dy * 15, 4, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          break;

        case 6: // Half circle
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI);
          if (seededRandom(shapeSeed++) > 0.5) ctx.fill();
          else ctx.stroke();
          break;
      }

      ctx.restore();
    }
  };

  const generateMemphisSVG = (width, height, seed, density, bgMode, customBgColor) => {
    let shapeSeed = seed;
    let bgColor;

    if (bgMode === 'transparent') {
      bgColor = 'none';
    } else if (bgMode === 'custom') {
      bgColor = customBgColor;
    } else {
      bgColor = getRandomColor(colors.backgrounds, seed);
    }

    let shapes = [];

    const densityConfig = densities[density];
    const shapeCount =
      densityConfig.min +
      Math.floor(seededRandom(shapeSeed++) * (densityConfig.max - densityConfig.min + 1));

    for (let i = 0; i < shapeCount; i++) {
      const shapeType = Math.floor(seededRandom(shapeSeed++) * 7);
      const x = seededRandom(shapeSeed++) * width;
      const y = seededRandom(shapeSeed++) * height;
      const size = 30 + seededRandom(shapeSeed++) * 150;
      const rotation = seededRandom(shapeSeed++) * 360;
      const color =
        seededRandom(shapeSeed++) > 0.5
          ? getRandomColor(colors.primary, shapeSeed++)
          : getRandomColor(colors.secondary, shapeSeed++);

      const strokeColor = color;
      const strokeWidth = seededRandom(shapeSeed++) > 0.8 ? 4 : 0;
      const filled = seededRandom(shapeSeed++) > 0.5;

      let shapeElement = '';

      switch (shapeType) {
        case 0: // Circle
          shapeElement = `<circle cx="${x}" cy="${y}" r="${size / 2}" 
            fill="${filled ? color : 'none'}" 
            stroke="${strokeColor}" 
            stroke-width="${strokeWidth}"/>`;
          break;

        case 1: // Square
          shapeElement = `<rect x="${x - size / 2}" y="${y - size / 2}" 
            width="${size}" height="${size}" 
            fill="${color}" 
            stroke="${strokeColor}" 
            stroke-width="${strokeWidth}"
            transform="rotate(${rotation} ${x} ${y})"/>`;
          break;

        case 2: // Triangle
          const points = `${x},${y - size / 2} ${x - size / 2},${y + size / 2} ${x + size / 2},${y + size / 2}`;
          shapeElement = `<polygon points="${points}" 
            fill="${filled ? color : 'none'}" 
            stroke="${strokeColor}" 
            stroke-width="${strokeWidth}"
            transform="rotate(${rotation} ${x} ${y})"/>`;
          break;

        case 3: // Zigzag line
          let zigzagPath = `M ${x - 75} ${y}`;
          for (let j = 0; j < 5; j++) {
            zigzagPath += ` L ${x - 75 + j * 30} ${y + ((j % 2) * 30 - 15)}`;
          }
          shapeElement = `<path d="${zigzagPath}" 
            fill="none" 
            stroke="${color}" 
            stroke-width="5"
            stroke-linecap="round"
            transform="rotate(${rotation} ${x} ${y})"/>`;
          break;

        case 4: // Wavy line
          let wavyPath = 'M ';
          for (let t = 0; t < Math.PI * 2; t += 0.1) {
            const wx = x + t * 20 - 60;
            const wy = y + Math.sin(t * 3) * 20;
            wavyPath += `${t === 0 ? '' : 'L '}${wx} ${wy} `;
          }
          shapeElement = `<path d="${wavyPath}" 
            fill="none" 
            stroke="${color}" 
            stroke-width="5"
            stroke-linecap="round"/>`;
          break;

        case 5: // Dots pattern
          let dots = '';
          for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
              dots += `<circle cx="${x + dx * 15}" cy="${y + dy * 15}" r="4" fill="${color}"/>`;
            }
          }
          shapeElement = dots;
          break;

        case 6: // Half circle
          shapeElement = `<path d="M ${x - size / 2} ${y} A ${size / 2} ${size / 2} 0 0 1 ${x + size / 2} ${y}" 
            fill="${filled ? color : 'none'}" 
            stroke="${strokeColor}" 
            stroke-width="${strokeWidth}"
            transform="rotate(${rotation} ${x} ${y})"/>`;
          break;
      }

      shapes.push(shapeElement);
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  ${shapes.join('\n  ')}
</svg>`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const size = sizes[selectedSize];
      canvas.width = size.width;
      canvas.height = size.height;
      drawMemphisPattern(
        ctx,
        size.width,
        size.height,
        currentSeed,
        selectedDensity,
        backgroundMode,
        customBackgroundColor
      );
    }
  }, [
    selectedSize,
    selectedTone,
    selectedDensity,
    backgroundMode,
    customBackgroundColor,
    currentSeed,
  ]);

  const generateNew = () => {
    setCurrentSeed(Date.now());
  };

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `memphis-bg-${selectedSize}-${currentSeed}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadSVG = () => {
    const size = sizes[selectedSize];
    const svg = generateMemphisSVG(
      size.width,
      size.height,
      currentSeed,
      selectedDensity,
      backgroundMode,
      customBackgroundColor
    );
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `memphis-bg-${selectedSize}-${currentSeed}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
        fontFamily: '"Outfit", -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <header
          style={{
            textAlign: 'center',
            marginBottom: '50px',
            animation: 'fadeIn 0.6s ease-out',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: '900',
              background: 'linear-gradient(45deg, #FEC601, #FF6B9D, #00D9FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '15px',
              textShadow: '0 4px 20px rgba(0,0,0,0.1)',
              letterSpacing: '-0.02em',
            }}
          >
            Memphis Generator
          </h1>
          <p
            style={{
              fontSize: '1.3rem',
              color: 'rgba(255,255,255,0.95)',
              fontWeight: '500',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            80年代風のカラフルな背景画像を一瞬で生成
          </p>
        </header>

        {/* Main Content */}
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            animation: 'slideUp 0.7s ease-out',
          }}
        >
          {/* Size Selection */}
          <div style={{ marginBottom: '30px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#1A1A1A',
                marginBottom: '15px',
              }}
            >
              📐 サイズを選択
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '15px',
              }}
            >
              {Object.entries(sizes).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSize(key)}
                  style={{
                    padding: '18px 24px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: selectedSize === key ? '3px solid #667eea' : '2px solid #E5E7EB',
                    borderRadius: '12px',
                    background:
                      selectedSize === key
                        ? 'linear-gradient(135deg, #667eea15, #764ba215)'
                        : 'white',
                    color: selectedSize === key ? '#667eea' : '#4B5563',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: selectedSize === key ? 'scale(1.02)' : 'scale(1)',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = selectedSize === key ? 'scale(1.02)' : 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div style={{ marginBottom: '30px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#1A1A1A',
                marginBottom: '15px',
              }}
            >
              🎨 カラートーンを選択
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
              }}
            >
              {Object.entries(colorPalettes).map(([key, { name }]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTone(key)}
                  style={{
                    padding: '18px 24px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: selectedTone === key ? '3px solid #FF6B9D' : '2px solid #E5E7EB',
                    borderRadius: '12px',
                    background:
                      selectedTone === key
                        ? 'linear-gradient(135deg, #FF6B9D15, #FEC60115)'
                        : 'white',
                    color: selectedTone === key ? '#FF6B9D' : '#4B5563',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: selectedTone === key ? 'scale(1.02)' : 'scale(1)',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 157, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = selectedTone === key ? 'scale(1.02)' : 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Density Selection */}
          <div style={{ marginBottom: '30px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#1A1A1A',
                marginBottom: '15px',
              }}
            >
              ⚡ 図形の密度を選択
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '15px',
              }}
            >
              {Object.entries(densities).map(([key, { name }]) => (
                <button
                  key={key}
                  onClick={() => setSelectedDensity(key)}
                  style={{
                    padding: '18px 24px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: selectedDensity === key ? '3px solid #00D9FF' : '2px solid #E5E7EB',
                    borderRadius: '12px',
                    background:
                      selectedDensity === key
                        ? 'linear-gradient(135deg, #00D9FF15, #A259FF15)'
                        : 'white',
                    color: selectedDensity === key ? '#00D9FF' : '#4B5563',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: selectedDensity === key ? 'scale(1.02)' : 'scale(1)',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 217, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = selectedDensity === key ? 'scale(1.02)' : 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Background Color Selection */}
          <div style={{ marginBottom: '30px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#1A1A1A',
                marginBottom: '15px',
              }}
            >
              🖼️ 背景色を設定
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '15px',
                marginBottom: '15px',
              }}
            >
              <button
                onClick={() => setBackgroundMode('auto')}
                style={{
                  padding: '18px 24px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  border: backgroundMode === 'auto' ? '3px solid #A259FF' : '2px solid #E5E7EB',
                  borderRadius: '12px',
                  background:
                    backgroundMode === 'auto'
                      ? 'linear-gradient(135deg, #A259FF15, #FF6B9D15)'
                      : 'white',
                  color: backgroundMode === 'auto' ? '#A259FF' : '#4B5563',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: backgroundMode === 'auto' ? 'scale(1.02)' : 'scale(1)',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 4px 12px rgba(162, 89, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = backgroundMode === 'auto' ? 'scale(1.02)' : 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                自動選択
              </button>

              <button
                onClick={() => setBackgroundMode('custom')}
                style={{
                  padding: '18px 24px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  border: backgroundMode === 'custom' ? '3px solid #A259FF' : '2px solid #E5E7EB',
                  borderRadius: '12px',
                  background:
                    backgroundMode === 'custom'
                      ? 'linear-gradient(135deg, #A259FF15, #FF6B9D15)'
                      : 'white',
                  color: backgroundMode === 'custom' ? '#A259FF' : '#4B5563',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: backgroundMode === 'custom' ? 'scale(1.02)' : 'scale(1)',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 4px 12px rgba(162, 89, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform =
                    backgroundMode === 'custom' ? 'scale(1.02)' : 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                カスタム色
              </button>

              <button
                onClick={() => setBackgroundMode('transparent')}
                style={{
                  padding: '18px 24px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  border:
                    backgroundMode === 'transparent' ? '3px solid #A259FF' : '2px solid #E5E7EB',
                  borderRadius: '12px',
                  background:
                    backgroundMode === 'transparent'
                      ? 'linear-gradient(135deg, #A259FF15, #FF6B9D15)'
                      : 'white',
                  color: backgroundMode === 'transparent' ? '#A259FF' : '#4B5563',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: backgroundMode === 'transparent' ? 'scale(1.02)' : 'scale(1)',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 4px 12px rgba(162, 89, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform =
                    backgroundMode === 'transparent' ? 'scale(1.02)' : 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                透明
              </button>
            </div>

            {backgroundMode === 'custom' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '20px',
                  background: '#F9FAFB',
                  borderRadius: '12px',
                  border: '2px solid #E5E7EB',
                }}
              >
                <label
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#4B5563',
                    minWidth: '100px',
                  }}
                >
                  背景色を選択:
                </label>
                <input
                  type="color"
                  value={customBackgroundColor}
                  onChange={(e) => setCustomBackgroundColor(e.target.value)}
                  style={{
                    width: '80px',
                    height: '50px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                />
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#1A1A1A',
                    fontFamily: 'monospace',
                    background: 'white',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '2px solid #E5E7EB',
                  }}
                >
                  {customBackgroundColor}
                </span>
              </div>
            )}
          </div>

          {/* Canvas Preview */}
          <div
            style={{
              marginBottom: '30px',
              border: '3px solid #F3F4F6',
              borderRadius: '16px',
              overflow: 'hidden',
              background:
                backgroundMode === 'transparent'
                  ? 'repeating-conic-gradient(#E5E7EB 0% 25%, #F9FAFB 0% 50%) 50% / 20px 20px'
                  : '#F9FAFB',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: '600px',
                width: 'auto',
                height: 'auto',
              }}
            />
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
            }}
          >
            <button
              onClick={generateNew}
              style={{
                padding: '18px 32px',
                fontSize: '1.1rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #FEC601, #FF6B9D)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 15px rgba(254, 198, 1, 0.4)',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(254, 198, 1, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(254, 198, 1, 0.4)';
              }}
            >
              🎨 新しく生成
            </button>

            <button
              onClick={downloadPNG}
              style={{
                padding: '18px 32px',
                fontSize: '1.1rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              📥 PNG でダウンロード
            </button>

            <button
              onClick={downloadSVG}
              style={{
                padding: '18px 32px',
                fontSize: '1.1rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #00D9FF, #A259FF)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 15px rgba(0, 217, 255, 0.4)',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 217, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 217, 255, 0.4)';
              }}
            >
              📥 SVG でダウンロード
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{
            textAlign: 'center',
            marginTop: '40px',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.95rem',
          }}
        >
          <p>メンフィスデザイン風の幾何学パターンを自動生成 | 完全サーバレス</p>
        </footer>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;900&display=swap');
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
          }
        `}
      </style>
    </div>
  );
};

export default MemphisGenerator;
