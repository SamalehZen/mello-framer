// One-off image pipeline: emits AVIF and WebP siblings for the raster assets
// that ship as JPEG/PNG, so the markup can serve modern formats with the
// originals as a fallback. Run with `node scripts/optimize-images.mjs`.
import sharp from 'sharp'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const targets = [
  'src/assets/img/matcha-1280.png',
  'src/assets/img/matcha-512.png',
  'src/assets/img/product-strawberry.jpg',
  'src/assets/img/product-cherry.jpg',
  ...readdirSync('src/assets/img/visit')
    .filter((f) => f.endsWith('.jpg'))
    .map((f) => join('src/assets/img/visit', f)),
]

for (const file of targets) {
  const base = file.replace(/\.(png|jpe?g)$/i, '')
  const image = sharp(file)
  await image.clone().avif({ quality: 50, effort: 6 }).toFile(`${base}.avif`)
  await image.clone().webp({ quality: 80, effort: 6 }).toFile(`${base}.webp`)
  console.log('optimised', base)
}
