// Tells whether the upstream peer-dependency blockers documented in issue #9
// are lifted. Instead of parsing semver ranges by hand, it asks npm to resolve
// the bumped version in a throwaway project: if `npm install --package-lock-only`
// succeeds, the real CI install will succeed too.
import { execFileSync } from 'node:child_process'
import { appendFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Keep in sync with issue #9.
const CHECKS = [
  { key: 'typescript', major: 7, label: 'TypeScript 7', pr: 6, blockedBy: 'typescript-eslint' },
  // Two pull requests ride on this blocker: `eslint` (#11) and `@eslint/js` (#12).
  { key: 'eslint', major: 10, label: 'ESLint 10', pr: 11, blockedBy: 'eslint-plugin-jsx-a11y' },
]

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))

/** @returns {boolean} true when the next major resolves without peer conflicts. */
function resolves(check) {
  const dir = mkdtempSync(join(tmpdir(), `unblock-${check.key}-`))
  try {
    const scratch = structuredClone(pkg)
    const field = scratch.devDependencies?.[check.key] ? 'devDependencies' : 'dependencies'
    scratch[field][check.key] = `^${check.major}.0.0`
    writeFileSync(join(dir, 'package.json'), JSON.stringify(scratch, null, 2))
    execFileSync(
      'npm',
      ['install', '--package-lock-only', '--ignore-scripts', '--no-audit', '--no-fund'],
      { cwd: dir, stdio: 'pipe' },
    )
    return true
  } catch {
    return false
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

const unblocked = []
for (const check of CHECKS) {
  const ok = resolves(check)
  console.log(`${ok ? 'unblocked' : 'blocked  '}  ${check.label} (waiting on ${check.blockedBy})`)
  if (ok) unblocked.push(check.key)
}

// Consumed by .github/workflows/dep-unblock.yml
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `unblocked=${unblocked.join(',')}\n`)
}
