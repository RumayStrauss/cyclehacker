import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const ROOT = process.cwd();
const IGNORE_DIRS = new Set(['node_modules', 'dist', 'build', '.expo', '.git', 'coverage']);
const TEXT_EXTS = new Set(['.ts', '.tsx', '.md']);
const EM_DASH = '—';

// These files legitimately hold the literal character to check against
// (this script's own constant, and the content schema test asserting no
// tip contains it), so they are not themselves "UI copy or documentation".
const SELF_IGNORE_FILES = new Set([
  'scripts/check-no-em-dash.ts',
  'packages/insight-content/src/__tests__/content-schema.test.ts',
]);

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (IGNORE_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, files);
    } else if (TEXT_EXTS.has(extname(full))) {
      files.push(full);
    }
  }
  return files;
}

const offenders: { file: string; line: number }[] = [];

for (const file of walk(ROOT)) {
  const relativePath = file.slice(ROOT.length + 1);
  if (SELF_IGNORE_FILES.has(relativePath)) continue;

  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, index) => {
    if (line.includes(EM_DASH)) {
      offenders.push({ file, line: index + 1 });
    }
  });
}

if (offenders.length > 0) {
  console.error('Em dash found (not allowed in UI copy or documentation):');
  for (const { file, line } of offenders) {
    console.error(`  ${file}:${line}`);
  }
  process.exit(1);
}

console.log('No em dashes found.');
