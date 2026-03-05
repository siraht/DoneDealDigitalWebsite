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
  sectionThreshold: Number(process.env.VISUAL_SECTION_THRESHOLD || 0.0008),
};

const runMode = process.argv.includes('--baseline')
  ? 'baseline'
  : process.argv.includes('--compare')
    ? 'compare'
    : 'capture';

const runSectionAudit = process.argv.includes('--sections') || process.argv.includes('--audit');
const runStrictAudit = process.argv.includes('--strict');
const sectionThreshold = runStrictAudit
  ? Math.min(config.sectionThreshold, 0.0004)
  : config.sectionThreshold;

const sectionAuditTargets = [
  { key: 'header', selector: '.site-header' },
  { key: 'hero', selector: '.hero' },
  { key: 'credibility', selector: '.cred-strip' },
  { key: 'services', selector: '.services' },
  { key: 'process', selector: '.process' },
  { key: 'final-cta', selector: '.final-cta' },
  { key: 'footer', selector: '.site-footer' },
];

function sectionFileName(entry, section) {
  return `home-${entry.width}x${entry.height}-${section.key}.png`;
}

function sectionDiffFileName(entry, section) {
  return `home-${entry.width}x${entry.height}-${section.key}.diff.png`;
}

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
  const sectionWarnings = [];
  const sectionDiffs = [];

  ensureDir(config.currentDir);
  ensureDir(config.baselineDir);
  ensureDir(config.diffDir);
  ensureDir(join(config.currentDir, 'sections'));
  ensureDir(join(config.baselineDir, 'sections'));
  ensureDir(join(config.diffDir, 'sections'));

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const viewport of config.viewports) {
    const screenshotName = `home-${viewport.width}x${viewport.height}.png`;
    const currentFile = join(config.currentDir, screenshotName);
    const baselineFile = join(config.baselineDir, screenshotName);
    const diffFile = join(config.diffDir, screenshotName.replace('.png', '.diff.png'));
    const sectionBaselineDir = join(config.baselineDir, 'sections');
    const sectionCurrentDir = join(config.currentDir, 'sections');
    const sectionDiffDir = join(config.diffDir, 'sections');
    const viewportLabel = `${viewport.width}x${viewport.height}`;

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

      if (runSectionAudit || runStrictAudit) {
        for (const section of sectionAuditTargets) {
          const locator = page.locator(section.selector);
          const count = await locator.count();

          if (count === 0) {
            sectionWarnings.push(`[missing section for baseline] ${section.key} @ ${screenshotName}`);
            continue;
          }

          const sectionCurrentFile = join(sectionCurrentDir, sectionFileName(viewport, section));
          const sectionBaselineFile = join(sectionBaselineDir, sectionFileName(viewport, section));

          await locator.first().screenshot({
            path: sectionCurrentFile,
            animations: 'disabled',
          });
          copyFileSync(sectionCurrentFile, sectionBaselineFile);
          console.log(`section baseline saved: ${viewportLabel} ${section.key}`);
        }
      }

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

      if (runSectionAudit || runStrictAudit) {
        for (const section of sectionAuditTargets) {
          const locator = page.locator(section.selector);
          const count = await locator.count();

          if (count === 0) {
            sectionWarnings.push(`[missing section] ${section.key} @ ${screenshotName}`);
            continue;
          }

          const sectionCurrentFile = join(sectionCurrentDir, sectionFileName(viewport, section));
          const sectionBaselineFile = join(sectionBaselineDir, sectionFileName(viewport, section));
          const sectionDiffFile = join(sectionDiffDir, sectionDiffFileName(viewport, section));

          await locator.first().screenshot({
            path: sectionCurrentFile,
            animations: 'disabled',
          });

          if (!existsSync(sectionBaselineFile)) {
            sectionWarnings.push(`[missing section baseline] ${section.key} @ ${screenshotName}`);
            continue;
          }

          const sectionBaseline = readPng(sectionBaselineFile);
          const sectionCurrent = readPng(sectionCurrentFile);

          if (sectionBaseline.width !== sectionCurrent.width || sectionBaseline.height !== sectionCurrent.height) {
            sectionWarnings.push(
              `[section size mismatch] ${section.key} ${screenshotName} baseline=${sectionBaseline.width}x${sectionBaseline.height} current=${sectionCurrent.width}x${sectionCurrent.height}`,
            );
            continue;
          }

          const sectionDiff = new PNG({ width: sectionBaseline.width, height: sectionBaseline.height });
          const sectionMismatches = pixelmatch(
            sectionBaseline.data,
            sectionCurrent.data,
            sectionDiff.data,
            sectionBaseline.width,
            sectionBaseline.height,
            {
              threshold: 0.25,
            },
          );

          const maxSectionDiffPixels = Math.round(
            Math.max(1, sectionBaseline.width * sectionBaseline.height * sectionThreshold),
          );
          const sectionPct = ((sectionMismatches / (sectionBaseline.width * sectionBaseline.height)) * 100).toFixed(2);

          if (sectionMismatches > maxSectionDiffPixels || runStrictAudit) {
            sectionDiffs.push({
              viewport: viewportLabel,
              selector: section.key,
              mismatches: sectionMismatches,
              pct: Number(sectionPct),
              withinThreshold: sectionMismatches <= maxSectionDiffPixels,
              maxAllowed: maxSectionDiffPixels,
            });
          }

          if (sectionMismatches > maxSectionDiffPixels) {
            writePng(sectionDiffFile, sectionDiff);
            sectionWarnings.push(
              `[section visual regression] ${section.key} @ ${screenshotName}: ${sectionMismatches} px (${sectionPct}%)`,
            );
            console.log(`⚠  section ${section.key} diff=${sectionPct}% diffFile=${sectionDiffFile}`);
          } else {
            console.log(`✓  section ${section.key} within threshold (${sectionPct}%)`);
          }
        }
      }
    } else {
      console.log(`snapshot captured: ${currentFile}`);

      if (runSectionAudit || runStrictAudit) {
        for (const section of sectionAuditTargets) {
          const locator = page.locator(section.selector);
          if (await locator.count() === 0) {
            console.log(`section missing while capturing: ${section.key}`);
            continue;
          }

          await locator.first().screenshot({
            path: join(sectionCurrentDir, sectionFileName(viewport, section)),
            animations: 'disabled',
          });
        }
      }
    }
  }

  await browser.close();

  if (runStrictAudit && sectionDiffs.length > 0) {
    console.log('\nSection drift audit summary:');
    sectionDiffs.forEach((entry) => {
      if (entry.withinThreshold) {
        console.log(`✓ ${entry.viewport} ${entry.selector}: ${entry.pct}% (max ${entry.maxAllowed})`);
      } else {
        console.log(`✗ ${entry.viewport} ${entry.selector}: ${entry.pct}% (max ${entry.maxAllowed})`);
      }
    });
  }

  if (warnings.length > 0) {
    console.error('\nVisual QA failed:');
    warnings.forEach((line) => console.error(`- ${line}`));
    process.exitCode = 1;
    return;
  }

  if (sectionWarnings.length > 0) {
    console.error('\nSection visual QA failed:');
    sectionWarnings.forEach((line) => console.error(`- ${line}`));
    process.exitCode = 1;
    return;
  }

  const modeSummary = [
    `\nVisual QA complete (${runMode}): ${config.viewports.length} viewport${config.viewports.length === 1 ? '' : 's'}`,
    runSectionAudit || runStrictAudit
      ? 'Section audit: enabled'
      : 'Section audit: skipped',
  ].join('\n');
  console.log(modeSummary);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
