import React, { useState, useCallback, useRef } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Upload, Download, Maximize, ImageIcon } from 'lucide-react';

// トリミング後の画像を生成するユーティリティ関数
const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  format: 'png' | 'webp'
): Promise<string> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No 2d context');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL(`image/${format}`);
};

export default function ImageTrimmingApp() {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(16 / 9);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [format, setFormat] = useState<'png' | 'webp'>('png');

  // ファイル読み込み
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImage(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  // ダウンロード実行
  const downloadResult = async () => {
    if (!image || !croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(image, croppedAreaPixels, format);
    const link = document.createElement('a');
    link.download = `trimmed-image.${format}`;
    link.href = croppedImage;
    link.click();
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-50 text-gray-800">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ImageIcon className="w-8 h-8 text-blue-500" /> Image Trimmer
        </h1>
        <p className="text-gray-500 mt-2">画像をアップロードして、自由な位置でトリミング</p>
      </header>

      <main className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {image ? (
          <div className="flex flex-col md:flex-row">
            {/* トリミングエリア */}
            <div className="relative w-full h-[400px] md:w-2/3 bg-black">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* コントロールパネル */}
            <div className="p-6 w-full md:w-1/3 flex flex-col gap-6 border-l">
              <section>
                <label className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Maximize className="w-4 h-4" /> アスペクト比
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '16:9', val: 16 / 9 },
                    { label: '4:3', val: 4 / 3 },
                    { label: '1:1', val: 1 / 1 },
                  ].map((ratio) => (
                    <button
                      key={ratio.label}
                      onClick={() => setAspect(ratio.val)}
                      className={`py-2 text-sm rounded-lg border transition ${
                        aspect === ratio.val
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="text-sm font-semibold mb-2 block">ズーム</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </section>

              <section>
                <label className="text-sm font-semibold mb-3 block">保存形式</label>
                <div className="flex gap-4">
                  {['png', 'webp'].map((f) => (
                    <label key={f} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="format"
                        checked={format === f}
                        onChange={() => setFormat(f as 'png' | 'webp')}
                        className="text-blue-500 focus:ring-blue-500"
                      />
                      <span className="uppercase text-sm font-medium">{f}</span>
                    </label>
                  ))}
                </div>
              </section>

              <div className="mt-auto flex flex-col gap-2">
                <button
                  onClick={downloadResult}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
                >
                  <Download className="w-5 h-5" /> ダウンロード
                </button>
                <button
                  onClick={() => setImage(null)}
                  className="text-sm text-gray-400 hover:text-red-500 transition"
                >
                  別の画像をアップロード
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 m-8 rounded-xl">
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
              id="upload-input"
            />
            <label
              htmlFor="upload-input"
              className="flex flex-col items-center cursor-pointer hover:opacity-70 transition"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <span className="font-medium">画像を選択して開始</span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBPに対応</span>
            </label>
          </div>
        )}
      </main>
    </div>
  );
}
