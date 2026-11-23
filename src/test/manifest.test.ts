// Guards what Chrome inspects before it offers to install the site as an app:
// a manifest carrying a name, a start URL, a display mode and 192/512 icons.
// None of it is visible on the page, so a regression would go unnoticed until
// someone tries to install the site and finds the option missing.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

type ManifestIcon = { src: string; sizes: string; type?: string; purpose?: string }

// Vitest runs from the project root; `import.meta.url` is not a file URL under
// the jsdom environment, so paths are resolved from the working directory.
const root = process.cwd()
const readText = (relativePath: string) => readFileSync(resolve(root, relativePath), 'utf8')

const manifest = JSON.parse(readText('public/manifest.json')) as {
  name?: string
  short_name?: string
  start_url?: string
  scope?: string
  display?: string
  prefer_related_applications?: boolean
  icons?: ManifestIcon[]
}

const html = readText('index.html')

/** Width and height straight out of the PNG IHDR chunk, no decoder involved. */
function pngSize(icon: string) {
  const bytes = readFileSync(resolve(root, 'public', icon))
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
}

describe('installable app manifest', () => {
  it('is linked from the document head, base-relative', () => {
    expect(html).toMatch(/<link rel="manifest" href="%BASE_URL%manifest\.json"/)
    expect(html).toContain('name="apple-mobile-web-app-capable" content="yes"')
  })

  it('declares the fields Chrome requires', () => {
    expect(manifest.name ?? manifest.short_name).toBeTruthy()
    expect(manifest.short_name).toBeTruthy()
    expect(manifest.start_url).toBeTruthy()
    expect(['fullscreen', 'standalone', 'minimal-ui']).toContain(manifest.display)
    expect(manifest.prefer_related_applications).not.toBe(true)
  })

  it('stays installable under any base path', () => {
    // Both the preview (/mello-framer/) and production (/mello/) serve the same
    // build, so the manifest must not hard-code either prefix.
    for (const value of [manifest.start_url, manifest.scope]) {
      expect(value).toBe('./')
    }
    for (const icon of manifest.icons ?? []) {
      expect(icon.src.startsWith('/')).toBe(false)
    }
  })

  it('ships the 192px and 512px icons Chrome looks for', () => {
    const icons = manifest.icons ?? []
    const any = icons.filter((icon) => icon.purpose !== 'maskable')
    const sizes = any.flatMap((icon) => pngSize(icon.src).width)

    expect(sizes).toContain(192)
    expect(sizes).toContain(512)
    // A maskable icon keeps its artwork inside the safe zone so Android can crop
    // it to whatever shape the launcher wants.
    expect(icons.some((icon) => icon.purpose === 'maskable')).toBe(true)
  })

  it('keeps every icon square and matching its declared size', () => {
    for (const icon of manifest.icons ?? []) {
      const { width, height } = pngSize(icon.src)
      expect({ src: icon.src, width, height }).toEqual({
        src: icon.src,
        width,
        height: width,
      })
      expect(`${width}x${height}`).toBe(icon.sizes)
    }
  })
})
