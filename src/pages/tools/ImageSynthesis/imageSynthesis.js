/**
 * 将水印图叠加到原图上，生成有水印图片（水印叠在原图右下角）
 * 使用：node imageSynthesis.js <原图路径> <水印图路径> [输出路径]
 *       输出路径可选，默认在原图同目录下生成「原图名-有水印.扩展名」
 * 依赖：npm install sharp
 * 另见：imageSynthesisOyyi.js（无依赖，用 Oyyi API 将原图与水印图纵向拼接）
 */

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

/**
 * 合成：原图 + 水印 -> 输出
 * @param {object} opts - { watermarkRatio: 水印相对原图宽度比例, margin: 边距像素 }
 */
async function composite(originalPath, watermarkPath, outputPath, opts = {}) {
  const { watermarkRatio = 0.25, margin = 20 } = opts;

  const [originalMeta, watermarkMeta] = await Promise.all([
    sharp(originalPath).metadata(),
    sharp(watermarkPath).metadata(),
  ]);

  const w = originalMeta.width;
  const h = originalMeta.height;
  const wmW = watermarkMeta.width;
  const wmH = watermarkMeta.height;

  const maxWmWidth = Math.round(w * watermarkRatio);
  const scale = maxWmWidth < wmW ? maxWmWidth / wmW : 1;
  const targetWmW = Math.round(wmW * scale);
  const targetWmH = Math.round(wmH * scale);

  const watermarkBuffer = await sharp(watermarkPath)
    .resize(targetWmW, targetWmH, { fit: 'inside' })
    .toBuffer();

  const left = w - targetWmW - margin;
  const top = h - targetWmH - margin;

  await sharp(originalPath)
    .composite([
      {
        input: watermarkBuffer,
        left: Math.max(0, left),
        top: Math.max(0, top),
      },
    ])
    .toFile(outputPath);

  return outputPath;
}

async function main() {
  const originalPath = process.argv[2];
  const watermarkPath = process.argv[3];
  let outputPath = process.argv[4];

  if (!originalPath || !watermarkPath) {
    console.error(
      '用法: node imageSynthesis.js <原图路径> <水印图路径> [输出路径]',
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
    await composite(originalPath, watermarkPath, outputPath);
    console.log('已生成:', outputPath);
  } catch (e) {
    console.error('合成失败:', e.message);
    process.exit(1);
  }
}

main();
