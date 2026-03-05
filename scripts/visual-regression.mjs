import { chromium } from 'playwright';
import { mkdirSync, existsSync, copyFileSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const config = {
  baseURL: process.env.VISUAL_BASE_URL || 'http://127.0.0.1:4322',
  route: process.env.VISUAL_ROUTE || '/',
  viewports: [
    { name: 'mobile', width: 360, height: 2400 },
    { name: 'tablet', width: 768, height: 2200 },
    { name: 'desktop', width: 1280, height: 2600 },
    { name: 'wide', width: 1920, height: 2600 },
  ],
  baselineDir: process.env.VISUAL_BASELINE_DIR || 'qa/visual/baseline',
  currentDir: process.env.VISUAL_CURRENT_DIR || 'qa/visual/current',
  diffDir: process.env.VISUAL_DIFF_DIR || 'qa/visual/diff',
  threshold: Number(process.env.VISUAL_PIXEL_THRESHOLD || 0.0015),
};

const runMode = process.argv.includes('--baseline')
  ? 'baseline'
  : process.argv.includes('--compare')
    ? 'compare'
    : 'capture';

const filePath = (entry) => join(process.cwd(), `${entry.width}x${entry.height}.png`);

function ensureDir(target) {
  if (!existsSync(target)) {
    mkdirSync(target, { recursive: true });
  }
}

function readPng(fileName) {
  return PNG.sync.read(readFileSync(fileName));
}

function writePng(fileName, png) {
  writeFileSync(fileName, PNG.sync.write(png));
}

async function run() {
  const warnings = [];

  ensureDir(config.currentDir);
  ensureDir(config.baselineDir);
  ensureDir(config.diffDir);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const viewport of config.viewports) {
    const screenshotName = `home-${viewport.width}x${viewport.height}.png`;
    const currentFile = join(config.currentDir, screenshotName);
    const baselineFile = join(config.baselineDir, screenshotName);
    const diffFile = join(config.diffDir, screenshotName.replace('.png', '.diff.png'));

    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${config.baseURL}${config.route}`, {
      waitUntil: 'networkidle',
    });

    await page.screenshot({
      path: currentFile,
      fullPage: true,
      animations: 'disabled',
    });

    if (runMode === 'baseline') {
      copyFileSync(currentFile, baselineFile);
      console.log(`snapshot baseline saved: ${screenshotName}`);
      continue;
    }

    if (runMode === 'compare') {
      if (!existsSync(baselineFile)) {
        warnings.push(`[missing baseline] ${screenshotName}`);
        continue;
      }

      const baseline = readPng(baselineFile);
      const current = readPng(currentFile);

      if (baseline.width !== current.width || baseline.height !== current.height) {
        warnings.push(`[size mismatch] ${screenshotName} baseline=${baseline.width}x${baseline.height} current=${current.width}x${current.height}`);
        continue;
      }

      const diff = new PNG({ width: baseline.width, height: baseline.height });
      const mismatchedPixels = pixelmatch(
        baseline.data,
        current.data,
        diff.data,
        baseline.width,
        baseline.height,
        {
          threshold: 0.25,
        },
      );

      const maxDiffPixels = Math.round(
        Math.max(1, baseline.width * baseline.height * config.threshold),
      );
      const pct = ((mismatchedPixels / (baseline.width * baseline.height)) * 100).toFixed(2);

      if (mismatchedPixels > maxDiffPixels) {
        writePng(diffFile, diff);
        warnings.push(`[visual regression] ${screenshotName}: ${mismatchedPixels} px (${pct}%)`);
        console.log(`⚠  ${screenshotName} diff=${pct}% diffFile=${diffFile}`);
      } else {
        console.log(`✓  ${screenshotName} within threshold (${pct}%)`);
      }
    } else {
      console.log(`snapshot captured: ${currentFile}`);
    }
  }

  await browser.close();

  if (warnings.length > 0) {
    console.error('\nVisual QA failed:');
    warnings.forEach((line) => console.error(`- ${line}`));
    process.exitCode = 1;
    return;
  }

  console.log(`\nVisual QA complete (${runMode}): ${config.viewports.length} viewport${config.viewports.length === 1 ? '' : 's'}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
