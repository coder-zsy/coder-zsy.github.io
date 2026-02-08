/**
 * 使用 Oyyi API 将原图与水印图纵向拼接成一张图（原图在上，水印在下）
 * 使用：node imageSynthesisOyyi.js <原图路径> <水印图路径> [输出路径]
 *       输出路径可选，默认在原图同目录下生成「原图名-有水印.扩展名」
 * 依赖：无（仅用 Node 18+ 内置 fetch/FormData/Blob），需联网
 * API：https://oyyi.xyz/docs/image/merge-side-by-side
 */

const path = require('path');
const fs = require('fs');

const API_URL = 'https://oyyi.xyz/api/image/merge-side-by-side';

async function mergeVertical(
  originalPath,
  watermarkPath,
  outputPath,
  opts = {},
) {
  const { padding = 0, outputFormat = 'png' } = opts;

  const originalBuf = fs.readFileSync(originalPath);
  const watermarkBuf = fs.readFileSync(watermarkPath);

  const form = new FormData();
  // 文件顺序：第一个在上（原图）、第二个在下（水印），上下拼接且左右对齐
  form.append('files', new Blob([originalBuf]), path.basename(originalPath));
  form.append('files', new Blob([watermarkBuf]), path.basename(watermarkPath));
  form.append('direction', 'vertical');
  form.append('align', 'left');
  // 纵向时 max=按最大宽度统一，保证水印左上挨原图左下、右上挨原图右下
  form.append('resize_method', 'max');
  form.append('padding', String(padding));
  form.append('output_format', outputFormat);

  const res = await fetch(API_URL, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API 请求失败 ${res.status}: ${text}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outputPath, buf);
  return outputPath;
}

async function main() {
  const originalPath = process.argv[2];
  const watermarkPath = process.argv[3];
  let outputPath = process.argv[4];

  if (!originalPath || !watermarkPath) {
    console.error(
      '用法: node imageSynthesisOyyi.js <原图路径> <水印图路径> [输出路径]',
    );
    process.exit(1);
  }

  if (!fs.existsSync(originalPath)) {
    console.error('原图不存在:', originalPath);
    process.exit(1);
  }
  if (!fs.existsSync(watermarkPath)) {
    console.error('水印图不存在:', watermarkPath);
    process.exit(1);
  }

  if (!outputPath) {
    const dir = path.dirname(originalPath);
    const ext = path.extname(originalPath);
    const base = path.basename(originalPath, ext);
    outputPath = path.join(dir, base + '-有水印' + ext);
  }

  try {
    const ext =
      path.extname(outputPath).toLowerCase().replace('.', '') || 'png';
    await mergeVertical(originalPath, watermarkPath, outputPath, {
      outputFormat: ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : ext,
    });
    console.log('已生成:', outputPath);
  } catch (e) {
    console.error('拼接失败:', e.message);
    process.exit(1);
  }
}

main();
