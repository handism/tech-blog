// src/lib/download.ts

/**
 * 指定 URL（data URL / Object URL 等）をファイルとしてダウンロードさせる。
 * Firefox 等でリンクが DOM に接続されていないとクリックが無視されるケースがあるため、一時的に body へ追加する。
 */
export function downloadUrl(href: string, filename: string): void {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Blob をファイルとしてダウンロードさせる。生成した Object URL は解放まで行う。
 * クリック直後に revoke するとブラウザによってはダウンロードが中断されるため、次のタスクで解放する。
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  downloadUrl(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * 文字列をファイルとしてダウンロードさせる。
 */
export function downloadText(content: string, filename: string, mimeType: string): void {
  downloadBlob(new Blob([content], { type: mimeType }), filename);
}
