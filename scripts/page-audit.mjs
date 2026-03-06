import { spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, join, relative } from "node:path";
import net from "node:net";
import { chromium } from "playwright";

const rootDir = process.cwd();
const pagesDir = join(rootDir, "src/pages");
const outputDir = join(rootDir, "docs/audit");
const rawDir = join(outputDir, "raw");
const rawPagesDir = join(rawDir, "pages");
const defaultPort = Number(process.env.AUDIT_PORT || 4322);
const defaultViewportSpec = process.env.AUDIT_VIEWPORTS || "360x2400,1280x2600";
const primaryViewportName = process.env.AUDIT_PRIMARY_VIEWPORT || "desktop";
const routeFilter = process.env.AUDIT_ROUTE_FILTER
  ? new Set(
      process.env.AUDIT_ROUTE_FILTER
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    )
  : null;
const decisionStyleKeys = [
  "display",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "z-index",
  "width",
  "max-width",
  "min-height",
  "height",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "gap",
  "row-gap",
  "column-gap",
  "grid-template-columns",
  "grid-template-rows",
  "flex-direction",
  "justify-content",
  "align-items",
  "background-color",
  "background-image",
  "color",
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  "letter-spacing",
  "text-align",
  "text-transform",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "border-radius",
  "box-shadow",
  "opacity",
  "overflow",
];
const tailwindLikePrefixes = [
  "absolute",
  "bg",
  "block",
  "border",
  "bottom",
  "col",
  "container",
  "decoration",
  "divide",
  "flex",
  "font",
  "gap",
  "grid",
  "group",
  "h",
  "hidden",
  "inline",
  "inset",
  "isolate",
  "items",
  "justify",
  "leading",
  "left",
  "lg",
  "line",
  "list",
  "m",
  "max",
  "md",
  "min",
  "mix",
  "mx",
  "my",
  "not",
  "object",
  "opacity",
  "overflow",
  "p",
  "place",
  "pl",
  "pr",
  "pt",
  "pb",
  "px",
  "py",
  "relative",
  "right",
  "rounded",
  "row",
  "self",
  "shadow",
  "space",
  "sr",
  "start",
  "sticky",
  "text",
  "top",
  "tracking",
  "transition",
  "translate",
  "underline",
  "uppercase",
  "visible",
  "w",
  "whitespace",
  "xl",
  "z",
];
const utilityValueFamilies = [
  "max-w",
  "min-w",
  "max-h",
  "min-h",
  "grid-cols",
  "grid-rows",
  "col-span",
  "row-span",
  "border-t",
  "border-r",
  "border-b",
  "border-l",
  "border-x",
  "border-y",
  "rounded-t",
  "rounded-r",
  "rounded-b",
  "rounded-l",
  "space-x",
  "space-y",
  "top",
  "right",
  "bottom",
  "left",
  "px",
  "py",
  "pt",
  "pr",
  "pb",
  "pl",
  "mx",
  "my",
  "mt",
  "mr",
  "mb",
  "ml",
  "gap",
  "row-gap",
  "col-gap",
  "text",
  "bg",
  "from",
  "to",
  "via",
  "font",
  "leading",
  "tracking",
  "shadow",
  "z",
  "w",
  "h",
];

function parseViewports(spec) {
  return spec
    .split(",")
    .map((chunk, index) => {
      const [width, height] = chunk.split("x").map((value) => Number(value.trim()));
      if (!width || !height) {
        throw new Error(`Invalid AUDIT_VIEWPORTS segment: ${chunk}`);
      }

      return {
        name: index === 0 ? "mobile" : index === 1 ? "desktop" : `viewport-${index + 1}`,
        width,
        height,
      };
    });
}

const viewports = parseViewports(defaultViewportSpec);
const primaryViewport = viewports.find((entry) => entry.name === primaryViewportName) || viewports.at(-1);

function ensureDir(target) {
  if (!existsSync(target)) {
    mkdirSync(target, { recursive: true });
  }
}

function resetDir(target) {
  rmSync(target, { recursive: true, force: true });
  ensureDir(target);
}

function getBaseURL(port) {
  return `http://127.0.0.1:${port}`;
}

function getServerCommand(port) {
  return process.env.AUDIT_SERVER_CMD || `npm run dev -- --host 127.0.0.1 --port ${port}`;
}

async function findAvailablePort(startPort) {
  const tryPort = (port) =>
    new Promise((resolve) => {
      const server = net.createServer();
      server.once("error", () => resolve(false));
      server.once("listening", () => {
        server.close(() => resolve(true));
      });
      server.listen(port, "127.0.0.1");
    });

  let port = startPort;
  while (!(await tryPort(port))) {
    port += 1;
  }

  return port;
}

async function isURLReachable(url) {
  try {
    const response = await fetch(url, { redirect: "manual" });
    return response.ok || response.status === 404;
  } catch {
    return false;
  }
}

async function waitForURL(url, timeoutMs = 30000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isURLReachable(url)) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function startAuditServer(port) {
  const command = getServerCommand(port);
  const server = spawn(command, {
    cwd: rootDir,
    shell: true,
    stdio: "inherit",
  });

  const stop = () => {
    if (!server.killed) {
      server.kill("SIGTERM");
    }
  };

  process.on("exit", stop);
  process.on("SIGINT", () => {
    stop();
    process.exit(130);
  });
  process.on("SIGTERM", () => {
    stop();
    process.exit(143);
  });

  await waitForURL(getBaseURL(port));
  return { server, stop, serverCommand: command };
}

function getAstroPages() {
  return readdirSync(pagesDir)
    .filter((fileName) => fileName.endsWith(".astro"))
    .map((fileName) => {
      const pageName = basename(fileName, ".astro");
      const route = pageName === "index" ? "/" : `/${pageName}`;

      return {
        pageName,
        fileName,
        route,
        filePath: join(pagesDir, fileName),
      };
    })
    .filter((page) => !routeFilter || routeFilter.has(page.route) || routeFilter.has(page.pageName))
    .sort((left, right) => left.route.localeCompare(right.route));
}

function normalizeWhitespace(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function normalizeToken(value) {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeText(value) {
  return normalizeToken(value)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 2);
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash +=
      (hash << 1) +
      (hash << 4) +
      (hash << 7) +
      (hash << 8) +
      (hash << 24);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

function looksLikeTailwindClass(token) {
  if (!token) {
    return false;
  }

  if (token.includes("__") || token.includes("--") || token.startsWith("u-")) {
    return false;
  }

  const baseToken = token.split(":").at(-1);
  if (!baseToken) {
    return false;
  }

  if (baseToken.startsWith("[")) {
    return true;
  }

  return tailwindLikePrefixes.some(
    (prefix) => baseToken === prefix || baseToken.startsWith(`${prefix}-`),
  );
}

function getUtilityFamily(token) {
  const variants = token.includes(":") ? token.split(":").slice(0, -1).join(":") : "";
  const baseToken = token.split(":").at(-1);
  const family =
    utilityValueFamilies.find((prefix) => baseToken === prefix || baseToken.startsWith(`${prefix}-`)) ||
    baseToken.split("-")[0];

  return variants ? `${variants}:${family}` : family;
}

function cloneObject(value) {
  return JSON.parse(JSON.stringify(value));
}

function getPageFamily(pageName) {
  if (pageName === "index") {
    return "home-reference";
  }

  if (pageName === "index_original") {
    return "home-stitch";
  }

  if (["web-design", "local-seo", "lead-generation"].includes(pageName)) {
    return "service";
  }

  if (["privacy", "terms", "cookie-policy"].includes(pageName)) {
    return "legal";
  }

  if (["contact", "thank-you"].includes(pageName)) {
    return "conversion";
  }

  if (pageName === "404") {
    return "system";
  }

  return "marketing";
}

function buildSourceSummary(page) {
  const source = readFileSync(page.filePath, "utf8");
  const titleMatch = source.match(/<title>(.*?)<\/title>/is);
  const sectionMatches = source.match(/<(header|section|footer|main)\b/gi) || [];
  const localTailwindConfig = source.includes("tailwind.config");
  const tailwindCdn = source.includes("cdn.tailwindcss.com");
  const globalCssImport = source.includes('../styles/global.css') || source.includes("../styles/global.css");
  const customClassMatches = source.match(/class="([^"]+)"/g) || [];
  const classTokens = customClassMatches
    .flatMap((entry) => {
      const content = entry.replace(/^class="/, "").replace(/"$/, "");
      return content.split(/\s+/).map((token) => token.trim()).filter(Boolean);
    });
  const customClasses = classTokens.filter((token) => !looksLikeTailwindClass(token));

  return {
    title: titleMatch ? normalizeWhitespace(titleMatch[1]) : page.pageName,
    sourceKind: globalCssImport ? "tokenized" : "stitch-mockup",
    localTailwindConfig,
    tailwindCdn,
    sourceSectionCount: sectionMatches.length,
    uniqueClasses: [...new Set(classTokens)].sort(),
    uniqueCustomClasses: [...new Set(customClasses)].sort(),
  };
}

function collectNodes(node, visit) {
  visit(node);
  for (const child of node.children || []) {
    collectNodes(child, visit);
  }
}

function findTopLevelSections(bodyNode) {
  const sections = [];
  const expandMainContent = (node) => {
    const directSections = (node.children || []).filter((child) =>
      ["section", "article"].includes(child.tag),
    );

    if (directSections.length > 0) {
      return directSections;
    }

    const wrappedSections = [];
    for (const child of node.children || []) {
      if (child.tag !== "div") {
        continue;
      }

      const nestedSections = (child.children || []).filter((nestedChild) =>
        ["section", "article"].includes(nestedChild.tag),
      );

      if (nestedSections.length > 0) {
        wrappedSections.push(...nestedSections);
      }
    }

    return wrappedSections;
  };

  for (const child of bodyNode.children || []) {
    if (["header", "section", "footer", "main"].includes(child.tag)) {
      if (child.tag === "main") {
        const nested = expandMainContent(child);
        if (nested.length > 0) {
          nested.forEach((nestedChild, index) => {
            sections.push({
              ...nestedChild,
              topLevelTag: "main-child",
              topLevelIndex: sections.length + 1,
              mainIndex: index + 1,
            });
          });
          continue;
        }
      }

      sections.push({
        ...child,
        topLevelTag: child.tag,
        topLevelIndex: sections.length + 1,
      });
    }
  }

  return sections;
}

function summarizeNode(node) {
  const stats = {
    elementCount: 0,
    headingCount: 0,
    h1Count: 0,
    h2Count: 0,
    headingTexts: [],
    wordCount: 0,
    linkCount: 0,
    buttonCount: 0,
    imageCount: 0,
    formCount: 0,
    inputCount: 0,
    textareaCount: 0,
    selectCount: 0,
    listCount: 0,
    listItemCount: 0,
    articleCount: 0,
    quoteCount: 0,
    tableCount: 0,
    iconCount: 0,
    detailCount: 0,
    classTokens: new Set(),
    customClasses: new Set(),
    utilityFamilies: new Set(),
    tagCounts: {},
  };

  collectNodes(node, (entry) => {
    stats.elementCount += 1;
    stats.tagCounts[entry.tag] = (stats.tagCounts[entry.tag] || 0) + 1;

    for (const token of entry.classes) {
      stats.classTokens.add(token);
      if (looksLikeTailwindClass(token)) {
        stats.utilityFamilies.add(getUtilityFamily(token));
      } else {
        stats.customClasses.add(token);
      }
    }

    if (/^h[1-6]$/.test(entry.tag)) {
      stats.headingCount += 1;
      if (entry.tag === "h1") stats.h1Count += 1;
      if (entry.tag === "h2") stats.h2Count += 1;
      if (entry.textPreview) {
        stats.headingTexts.push(entry.textPreview);
      }
    }

    if (entry.tag === "a") stats.linkCount += 1;
    if (entry.tag === "button") stats.buttonCount += 1;
    if (entry.tag === "img") stats.imageCount += 1;
    if (entry.tag === "form") stats.formCount += 1;
    if (entry.tag === "input") stats.inputCount += 1;
    if (entry.tag === "textarea") stats.textareaCount += 1;
    if (entry.tag === "select") stats.selectCount += 1;
    if (entry.tag === "ul" || entry.tag === "ol") stats.listCount += 1;
    if (entry.tag === "li") stats.listItemCount += 1;
    if (entry.tag === "article") stats.articleCount += 1;
    if (entry.tag === "blockquote") stats.quoteCount += 1;
    if (entry.tag === "table") stats.tableCount += 1;
    if (entry.classes.includes("material-symbols-outlined")) stats.iconCount += 1;
    if (entry.tag === "details") stats.detailCount += 1;

    if (entry.textPreview) {
      stats.wordCount += tokenizeText(entry.textPreview).length;
    }
  });

  return {
    ...stats,
    headingTexts: [...new Set(stats.headingTexts)].slice(0, 6),
    classTokens: [...stats.classTokens].sort(),
    customClasses: [...stats.customClasses].sort(),
    utilityFamilies: [...stats.utilityFamilies].sort(),
  };
}

function buildStructureFingerprint(node) {
  const tags = [];
  collectNodes(node, (entry) => {
    tags.push(entry.tag);
  });

  return hashString(tags.join(">"));
}

function buildLooseFingerprint(stats) {
  const payload = {
    tags: Object.entries(stats.tagCounts).sort(),
    headingCount: stats.headingCount,
    linkCount: stats.linkCount,
    buttonCount: stats.buttonCount,
    imageCount: stats.imageCount,
    formCount: stats.formCount,
    inputCount: stats.inputCount,
    iconCount: stats.iconCount,
    utilityFamilies: stats.utilityFamilies.slice(0, 16),
    customClasses: stats.customClasses.slice(0, 16),
  };

  return hashString(JSON.stringify(payload));
}

function getFirstHeadingText(node) {
  let firstHeading = "";

  collectNodes(node, (entry) => {
    if (!firstHeading && /^h[1-6]$/.test(entry.tag) && entry.textPreview) {
      firstHeading = entry.textPreview;
    }
  });

  return firstHeading;
}

function findFirstNode(node, predicate) {
  if (predicate(node)) {
    return node;
  }

  for (const child of node.children || []) {
    const match = findFirstNode(child, predicate);
    if (match) {
      return match;
    }
  }

  return null;
}

function collectNodesUntil(node, stopPredicate, bucket = []) {
  if (stopPredicate(node)) {
    return { bucket, stopped: true };
  }

  bucket.push(node);

  for (const child of node.children || []) {
    const result = collectNodesUntil(child, stopPredicate, bucket);
    if (result.stopped) {
      return result;
    }
  }

  return { bucket, stopped: false };
}

function bucketByThreshold(value, thresholds) {
  for (const threshold of thresholds) {
    if (value <= threshold.max) {
      return threshold.label;
    }
  }

  return thresholds.at(-1)?.label || "unknown";
}

function deriveHeroTraits(sectionNode, stats) {
  const traits = [];
  const firstHeadingNode = findFirstNode(sectionNode, (node) => /^h[1-6]$/.test(node.tag));
  const nodesBeforeHeading = collectNodesUntil(
    sectionNode,
    (node) => node !== sectionNode && /^h[1-6]$/.test(node.tag),
  ).bucket;
  const eyebrowTextNode = nodesBeforeHeading.find(
    (node) =>
      node !== sectionNode &&
      !/^h[1-6]$/.test(node.tag) &&
      node.textPreview &&
      tokenizeText(node.textPreview).length > 0 &&
      tokenizeText(node.textPreview).length <= 8,
  );
  const alignment =
    firstHeadingNode?.decisionStyle["text-align"] === "center" ? "centered" : "left-aligned";
  const mediaTrait = stats.imageCount > 0 ? "with-media" : "without-media";
  const eyebrowTrait = eyebrowTextNode ? "with-eyebrow" : "without-eyebrow";
  const heightTrait = `height-${bucketByThreshold(sectionNode.rect.height, [
    { max: 500, label: "short" },
    { max: 900, label: "medium" },
    { max: Number.POSITIVE_INFINITY, label: "tall" },
  ])}`;

  let headingWidthTrait = "heading-width-unknown";
  if (firstHeadingNode && sectionNode.rect.width > 0) {
    const ratio = firstHeadingNode.rect.width / sectionNode.rect.width;
    headingWidthTrait = `heading-width-${bucketByThreshold(ratio, [
      { max: 0.32, label: "narrow" },
      { max: 0.52, label: "medium" },
      { max: Number.POSITIVE_INFINITY, label: "wide" },
    ])}`;
  }

  traits.push(mediaTrait, alignment, eyebrowTrait, heightTrait, headingWidthTrait);

  return traits;
}

function deriveCallToActionTraits(sectionNode, stats) {
  const traits = [];
  const hasAbsoluteBadge = Boolean(
    findFirstNode(
      sectionNode,
      (node) =>
        node !== sectionNode &&
        node.decisionStyle.position === "absolute" &&
        tokenizeText(node.textPreview).length > 0 &&
        tokenizeText(node.textPreview).length <= 6,
    ),
  );
  const framedPanel = Boolean(
    findFirstNode(
      sectionNode,
      (node) =>
        node !== sectionNode &&
        Number.parseFloat(node.decisionStyle["border-top-width"] || "0") >= 4 &&
        Number.parseFloat(node.rect.width || 0) >= sectionNode.rect.width * 0.45,
    ),
  );

  traits.push(hasAbsoluteBadge ? "with-badge" : "without-badge");
  traits.push(framedPanel ? "framed-panel" : "standard-panel");
  traits.push(stats.linkCount > 0 ? "with-link-action" : "button-primary");

  return traits;
}

function deriveSectionTraits(sectionType, sectionNode, stats) {
  if (sectionType === "HeroSection") {
    return deriveHeroTraits(sectionNode, stats);
  }

  if (sectionType === "CallToAction") {
    return deriveCallToActionTraits(sectionNode, stats);
  }

  return [];
}

function detectRepeatedPatterns(sectionNode) {
  const patterns = [];
  const seen = new Set();

  collectNodes(sectionNode, (parent) => {
    const children = parent.children || [];
    if (children.length < 2) {
      return;
    }

    const groups = new Map();
    for (const child of children) {
      const childStats = summarizeNode(child);
      const signature = JSON.stringify({
        tag: child.tag,
        tags: Object.entries(childStats.tagCounts).sort(),
        headingCount: childStats.headingCount,
        linkCount: childStats.linkCount,
        buttonCount: childStats.buttonCount,
        imageCount: childStats.imageCount,
        iconCount: childStats.iconCount,
        childCount: child.children.length,
      });
      const current = groups.get(signature) || [];
      current.push({ child, childStats });
      groups.set(signature, current);
    }

    for (const [signature, instances] of groups.entries()) {
      if (instances.length < 2) {
        continue;
      }

      const sample = instances[0];
      const key = `${parent.path}::${signature}`;
      if (seen.has(key)) {
        continue;
      }

      const kind = classifyPatternKind(sample.child, sample.childStats);
      patterns.push({
        parentPath: parent.path,
        count: instances.length,
        kind,
        samplePath: sample.child.path,
        sampleHeading: getFirstHeadingText(sample.child),
        structureFingerprint: buildStructureFingerprint(sample.child),
        looseFingerprint: buildLooseFingerprint(sample.childStats),
        sampleDecisionStyle: sample.child.decisionStyle,
        sampleCustomClasses: sample.child.classes.filter((token) => !looksLikeTailwindClass(token)),
      });
      seen.add(key);
    }
  });

  return patterns
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.samplePath.localeCompare(right.samplePath);
    })
    .slice(0, 10);
}

function classifyPatternKind(node, stats) {
  if (node.tag === "a" || node.tag === "button") {
    return "action-item";
  }

  if (stats.buttonCount >= 1 && stats.headingCount >= 1 && stats.wordCount <= 45) {
    return "accordion-item";
  }

  if (stats.imageCount >= 1 && stats.headingCount >= 1) {
    return "image-card";
  }

  if (stats.iconCount >= 1 && stats.headingCount >= 1) {
    return "icon-card";
  }

  if (stats.linkCount >= 1 && stats.headingCount <= 1 && stats.wordCount <= 20) {
    return "nav-item";
  }

  return "repeatable-block";
}

function classifySection(section, pageMeta) {
  const heading = normalizeToken(section.firstHeading);
  const headingPool = normalizeToken(section.stats.headingTexts.join(" "));
  const style = section.rootDecisionStyle;
  const background = style["background-color"] || "";
  const rootClasses = new Set(section.rootClasses);
  const isSticky = rootClasses.has("sticky") || style.position === "sticky";
  const interactionCount = section.stats.linkCount + section.stats.buttonCount;

  if (pageMeta.pageName === "404") {
    return "SystemMessage";
  }

  if (
    section.tag === "header" ||
    section.topLevelTag === "header" ||
    rootClasses.has("site-header")
  ) {
    return "SiteHeader";
  }

  if (
    section.tag === "footer" ||
    section.topLevelTag === "footer" ||
    rootClasses.has("site-footer")
  ) {
    return "SiteFooter";
  }

  if (rootClasses.has("hero") || section.stats.h1Count >= 1) {
    return "HeroSection";
  }

  if (
    rootClasses.has("cred-strip") ||
    (section.stats.headingCount === 0 &&
      section.stats.iconCount >= 4 &&
      interactionCount === 0 &&
      section.patterns.some((pattern) => pattern.count >= 3))
  ) {
    return "CredibilityStrip";
  }

  if (
    rootClasses.has("services") ||
    heading.includes("no fluff just results") ||
    heading.includes("what we manage")
  ) {
    return "ServicesSection";
  }

  if (
    rootClasses.has("process") ||
    heading.includes("process") ||
    heading.includes("built for utility")
  ) {
    return "ProcessSection";
  }

  if (rootClasses.has("final-cta")) {
    return "FinalCtaSection";
  }

  if (pageMeta.family === "legal" && section.contentIndex >= 2) {
    return "LegalContent";
  }

  if (isSticky && interactionCount >= 4 && section.stats.headingCount === 0) {
    return "SectionNav";
  }

  if (
    headingPool.includes("best fit") &&
    (headingPool.includes("poor fit") || headingPool.includes("not the right fit"))
  ) {
    return "ComparisonSplitSection";
  }

  if (section.stats.formCount >= 1 || section.stats.inputCount >= 2) {
    return "FormSection";
  }

  if (
    heading.includes("faq") ||
    heading.includes("getting started") ||
    section.stats.detailCount >= 1 ||
    (section.stats.buttonCount >= 3 && !isSticky && section.stats.wordCount >= 80)
  ) {
    return "FaqSection";
  }

  if (section.patterns.some((pattern) => pattern.kind === "accordion-item")) {
    return "FaqSection";
  }

  if (section.patterns.some((pattern) => pattern.kind === "icon-card" && pattern.count >= 3)) {
    return "IconCardGrid";
  }

  if (section.patterns.some((pattern) => pattern.kind === "image-card" && pattern.count >= 2)) {
    return "ImageCardGrid";
  }

  if (
    interactionCount >= 1 &&
    section.stats.headingCount >= 1 &&
    heading.startsWith("ready") &&
    section.contentIndex >= 3 &&
    section.stats.wordCount <= 190 &&
    section.stats.inputCount === 0
  ) {
    return "CallToAction";
  }

  if (
    interactionCount >= 1 &&
    section.stats.headingCount >= 1 &&
    section.stats.wordCount <= 120 &&
    section.stats.inputCount === 0
  ) {
    return "CallToAction";
  }

  if (
    section.stats.imageCount >= 1 &&
    section.stats.headingCount >= 1 &&
    section.stats.buttonCount <= 2 &&
    !background.includes("0, 0, 0, 0")
  ) {
    return "FeatureSection";
  }

  return "ContentSection";
}

function compareMaps(mapA, mapB) {
  const keys = new Set([...Object.keys(mapA), ...Object.keys(mapB)]);
  let matches = 0;
  let total = 0;

  for (const key of keys) {
    total += 1;
    if ((mapA[key] || 0) === (mapB[key] || 0)) {
      matches += 1;
    }
  }

  return total === 0 ? 1 : matches / total;
}

function similarityFromSets(listA, listB) {
  const setA = new Set(listA);
  const setB = new Set(listB);
  const union = new Set([...setA, ...setB]);
  let matches = 0;

  for (const value of union) {
    if (setA.has(value) && setB.has(value)) {
      matches += 1;
    }
  }

  return union.size === 0 ? 1 : matches / union.size;
}

function compareDecisionStyles(styleA, styleB) {
  const keys = new Set([...Object.keys(styleA), ...Object.keys(styleB)]);
  let matches = 0;
  let total = 0;

  for (const key of keys) {
    total += 1;
    if ((styleA[key] || "") === (styleB[key] || "")) {
      matches += 1;
    }
  }

  return total === 0 ? 1 : matches / total;
}

function scoreSectionSimilarity(left, right) {
  let score = 0;

  if (left.sectionType === right.sectionType) {
    score += 0.35;
  }

  score += compareDecisionStyles(left.rootDecisionStyle, right.rootDecisionStyle) * 0.2;
  score += compareMaps(left.stats.tagCounts, right.stats.tagCounts) * 0.2;
  score += similarityFromSets(left.stats.utilityFamilies, right.stats.utilityFamilies) * 0.1;
  score += similarityFromSets(left.stats.customClasses, right.stats.customClasses) * 0.05;

  const leftPatternKinds = left.patterns.map((pattern) => pattern.kind);
  const rightPatternKinds = right.patterns.map((pattern) => pattern.kind);
  score += similarityFromSets(leftPatternKinds, rightPatternKinds) * 0.1;

  return score;
}

function clusterBySimilarity(items, scoreFn, thresholdFn, exactKeyFn) {
  const clusters = [];

  for (const item of items) {
    let bestCluster = null;
    let bestScore = -1;

    for (const cluster of clusters) {
      const exactMatch =
        exactKeyFn && exactKeyFn(cluster.representative) === exactKeyFn(item) && exactKeyFn(item);
      const score = exactMatch ? 1 : scoreFn(cluster.representative, item);
      const threshold = exactMatch ? 1 : thresholdFn(cluster.representative, item);

      if (score >= threshold && score > bestScore) {
        bestCluster = cluster;
        bestScore = score;
      }
    }

    if (!bestCluster) {
      clusters.push({
        id: `cluster-${clusters.length + 1}`,
        representative: item,
        items: [item],
      });
      continue;
    }

    bestCluster.items.push(item);
  }

  return clusters;
}

function buildSectionClusters(sections) {
  const clusters = clusterBySimilarity(
    sections,
    scoreSectionSimilarity,
    (left, right) => {
      if (left.sectionType === right.sectionType && left.sectionType === "HeroSection") {
        return 0.42;
      }

      if (
        left.sectionType === right.sectionType &&
        ["ComparisonSplitSection", "ServicesSection", "ProcessSection", "CallToAction"].includes(
          left.sectionType,
        )
      ) {
        return left.sectionType === "CallToAction" ? 0.44 : 0.5;
      }

      if (left.sectionType === right.sectionType && left.sectionType !== "ContentSection") {
        return 0.58;
      }

      return 0.74;
    },
    (item) => `${item.sectionType}::${item.structureFingerprint}`,
  );

  return clusters.map((cluster, index) => {
    const sectionType = cluster.representative.sectionType;
    const displayName = getSectionDisplayName(cluster.representative);
    const exactFingerprints = new Set(cluster.items.map((item) => item.structureFingerprint));
    const status =
      exactFingerprints.size === 1 && cluster.items.length > 1
        ? "Exact Match"
        : cluster.items.length > 1
          ? "Variant of Same Component"
          : "Unique";

    return {
      id: `section-${index + 1}`,
      sectionType,
      displayName,
      status,
      representativeId: cluster.representative.auditId,
      items: cluster.items.map((item) => ({
        auditId: item.auditId,
        pageName: item.pageName,
        route: item.route,
        index: item.index,
        sectionType: item.sectionType,
        firstHeading: item.firstHeading,
        variantTraits: item.variantTraits,
        structureFingerprint: item.structureFingerprint,
      })),
    };
  });
}

function scorePatternSimilarity(left, right) {
  let score = 0;

  if (left.kind === right.kind) {
    score += 0.4;
  }

  if (left.looseFingerprint === right.looseFingerprint) {
    score += 0.35;
  }

  if (left.structureFingerprint === right.structureFingerprint) {
    score += 0.15;
  }

  score += compareDecisionStyles(left.sampleDecisionStyle, right.sampleDecisionStyle) * 0.1;

  return score;
}

function buildPatternClusters(patterns) {
  const clusters = clusterBySimilarity(
    patterns,
    scorePatternSimilarity,
    () => 0.72,
    (item) => `${item.kind}::${item.structureFingerprint}`,
  );

  return clusters.map((cluster, index) => {
    const exactFingerprints = new Set(cluster.items.map((item) => item.structureFingerprint));
    const status =
      exactFingerprints.size === 1 && cluster.items.length > 1
        ? "Exact Match"
        : cluster.items.length > 1
          ? "Variant of Same Component"
          : "Unique";

    return {
      id: `pattern-${index + 1}`,
      patternKind: cluster.representative.kind,
      status,
      items: cluster.items.map((item) => ({
        auditId: item.auditId,
        pageName: item.pageName,
        route: item.route,
        sectionAuditId: item.sectionAuditId,
        count: item.count,
        sampleHeading: item.sampleHeading,
      })),
    };
  });
}

function getSectionDisplayName(section) {
  if (
    ["ContentSection", "LegalContent", "FaqSection", "SectionNav", "FeatureSection"].includes(
      section.sectionType,
    ) &&
    section.firstHeading
  ) {
    return `${section.sectionType}: ${section.firstHeading}`;
  }

  return section.sectionType;
}

function getStyleDeltaSummary(items, getStyle) {
  const valuesByProperty = new Map();

  for (const item of items) {
    const style = getStyle(item);
    for (const [property, value] of Object.entries(style)) {
      const current = valuesByProperty.get(property) || new Set();
      current.add(value);
      valuesByProperty.set(property, current);
    }
  }

  return [...valuesByProperty.entries()]
    .filter(([, values]) => values.size > 1)
    .sort((left, right) => right[1].size - left[1].size)
    .slice(0, 18)
    .map(([property, values]) => ({
      property,
      values: [...values].sort(),
    }));
}

function buildClassInventory(pageAudits) {
  const globalClasses = new Map();

  for (const page of pageAudits) {
    const pageClasses = new Map();

    for (const viewport of page.viewports) {
      collectNodes(viewport.body, (node) => {
        for (const token of node.classes) {
          pageClasses.set(token, (pageClasses.get(token) || 0) + 1);
          globalClasses.set(token, (globalClasses.get(token) || 0) + 1);
        }
      });
    }

    page.classInventory = [...pageClasses.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(([token, count]) => ({
        token,
        count,
        kind: looksLikeTailwindClass(token) ? "utility" : "custom",
        family: looksLikeTailwindClass(token) ? getUtilityFamily(token) : "custom",
      }));
  }

  return [...globalClasses.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([token, count]) => ({
      token,
      count,
      kind: looksLikeTailwindClass(token) ? "utility" : "custom",
      family: looksLikeTailwindClass(token) ? getUtilityFamily(token) : "custom",
    }));
}

function renderPageMap(pageAudits) {
  const lines = [
    "# Page Map",
    "",
    "| Page | Route | Family | Source | Top-level sections | Notes |",
    "| --- | --- | --- | --- | --- | --- |",
  ];

  for (const page of pageAudits) {
    const sectionSummary = page.primarySections
      .map((section) => `${section.index}. ${section.sectionType}`)
      .join("<br>");
    const notes = [
      page.sourceSummary.sourceKind,
      page.sourceSummary.tailwindCdn ? "Tailwind CDN" : "No Tailwind CDN",
      page.pageName === "index" ? "Canonical converted page" : null,
      page.pageName === "index_original" ? "Converted precedent source" : null,
    ]
      .filter(Boolean)
      .join("; ");

    lines.push(
      `| \`${page.pageName}\` | \`${page.route}\` | ${page.family} | ${page.sourceSummary.sourceKind} | ${sectionSummary} | ${notes} |`,
    );
  }

  return `${lines.join("\n")}\n`;
}

function renderSectionMatrix(sectionClusters, pageAudits) {
  const lines = ["# Section Matrix", ""];
  const pageByName = new Map(pageAudits.map((page) => [page.pageName, page]));

  for (const cluster of sectionClusters) {
    lines.push(`## ${cluster.displayName} (${cluster.status})`);
    lines.push("");

    for (const item of cluster.items.sort((left, right) => {
      if (left.pageName !== right.pageName) {
        return left.pageName.localeCompare(right.pageName);
      }

      return left.index - right.index;
    })) {
      const page = pageByName.get(item.pageName);
      const section = page.primarySections.find((entry) => entry.auditId === item.auditId);
      const heading = section.firstHeading ? ` - ${section.firstHeading}` : "";
      const patternSummary = section.patterns.length
        ? `; patterns: ${section.patterns.map((pattern) => `${pattern.kind} x${pattern.count}`).join(", ")}`
        : "";
      const variantSummary = section.variantTraits.length
        ? `; variants: ${section.variantTraits.join(", ")}`
        : "";
      lines.push(
        `- [ ] \`${item.pageName}\` section ${item.index} at \`${item.route}\`${heading}${variantSummary}${patternSummary}`,
      );
    }

    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function renderStyleDeltas(sectionClusters, pageAudits, patternClusters) {
  const lines = ["# Style Deltas", ""];
  const sectionLookup = new Map();
  const patternLookup = new Map();

  for (const page of pageAudits) {
    for (const section of page.primarySections) {
      sectionLookup.set(section.auditId, section);
    }

    for (const pattern of page.patterns) {
      patternLookup.set(pattern.auditId, pattern);
    }
  }

  for (const cluster of sectionClusters.filter((entry) => entry.items.length > 1)) {
    const sections = cluster.items.map((item) => sectionLookup.get(item.auditId)).filter(Boolean);
    const deltas = getStyleDeltaSummary(sections, (item) => item.rootDecisionStyle);
    lines.push(`## ${cluster.displayName}`);
    lines.push("");

    if (deltas.length === 0) {
      lines.push("- No root-level style deltas detected in the tracked decision properties.");
      lines.push("");
      continue;
    }

    for (const delta of deltas) {
      lines.push(`- \`${delta.property}\`: ${delta.values.join(" | ")}`);
    }

    lines.push("");
  }

  lines.push("# Pattern Deltas");
  lines.push("");

  for (const cluster of patternClusters.filter((entry) => entry.items.length > 1)) {
    const patterns = cluster.items.map((item) => patternLookup.get(item.auditId)).filter(Boolean);
    const deltas = getStyleDeltaSummary(patterns, (item) => item.sampleDecisionStyle);
    lines.push(`## ${cluster.patternKind}`);
    lines.push("");

    if (deltas.length === 0) {
      lines.push("- No sample-item style deltas detected in the tracked decision properties.");
      lines.push("");
      continue;
    }

    for (const delta of deltas) {
      lines.push(`- \`${delta.property}\`: ${delta.values.join(" | ")}`);
    }

    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function chooseCanonicalSection(sectionClusters, sectionLookup) {
  const canonicalChoices = new Map();

  for (const cluster of sectionClusters) {
    const sections = cluster.items.map((item) => sectionLookup.get(item.auditId)).filter(Boolean);
    const indexSection = sections.find((section) => section.pageName === "index");
    const indexOriginalSection = sections.find((section) => section.pageName === "index_original");
    canonicalChoices.set(
      cluster.id,
      indexSection || indexOriginalSection || sections[0] || null,
    );
  }

  return canonicalChoices;
}

function renderChecklist(sectionClusters, patternClusters, pageAudits) {
  const lines = ["# Consolidation Checklist", ""];
  const sectionLookup = new Map();
  const patternLookup = new Map();

  for (const page of pageAudits) {
    for (const section of page.primarySections) {
      sectionLookup.set(section.auditId, section);
    }

    for (const pattern of page.patterns) {
      patternLookup.set(pattern.auditId, pattern);
    }
  }

  const canonicalSections = chooseCanonicalSection(sectionClusters, sectionLookup);

  for (const cluster of sectionClusters) {
    const canonical = canonicalSections.get(cluster.id);
    const sections = cluster.items.map((item) => sectionLookup.get(item.auditId)).filter(Boolean);
    const rootStyleDeltas = getStyleDeltaSummary(sections, (item) => item.rootDecisionStyle);

    lines.push(`## ${cluster.displayName}`);
    lines.push("");
    lines.push(
      `- [ ] Define the canonical \`${cluster.displayName}\` boundary using \`${canonical?.pageName || "unknown"}\` section ${canonical?.index || "?"}.`,
    );
    lines.push("- [ ] Decide whether this becomes one shared component or a component with variants.");
    if (canonical?.variantTraits?.length) {
      lines.push(`- [ ] Canonical variant traits: ${canonical.variantTraits.join(", ")}.`);
    }

    if (rootStyleDeltas.length > 0) {
      lines.push("- [ ] Resolve these root-level style decisions before extraction:");
      for (const delta of rootStyleDeltas.slice(0, 8)) {
        lines.push(`- [ ] ${delta.property}: ${delta.values.join(" vs ")}`);
      }
    }

    for (const section of sections.sort((left, right) => {
      if (left.pageName !== right.pageName) {
        return left.pageName.localeCompare(right.pageName);
      }

      return left.index - right.index;
    })) {
      const canonicalLabel =
        canonical && canonical.auditId === section.auditId ? " (canonical candidate)" : "";
      const variantSummary = section.variantTraits.length
        ? `; variants: ${section.variantTraits.join(", ")}`
        : "";
      lines.push(
        `- [ ] Consolidate \`${section.pageName}\` section ${section.index} at \`${section.route}\`${canonicalLabel}${variantSummary}.`,
      );
    }

    lines.push("");
  }

  lines.push("# Repeatable Patterns");
  lines.push("");

  for (const cluster of patternClusters) {
    const patterns = cluster.items.map((item) => patternLookup.get(item.auditId)).filter(Boolean);
    const deltas = getStyleDeltaSummary(patterns, (item) => item.sampleDecisionStyle);
    lines.push(`## ${cluster.patternKind}`);
    lines.push("");
    lines.push(`- [ ] Decide whether \`${cluster.patternKind}\` should become a reusable child component.`);

    if (deltas.length > 0) {
      lines.push("- [ ] Resolve sample-item style deltas:");
      for (const delta of deltas.slice(0, 6)) {
        lines.push(`- [ ] ${delta.property}: ${delta.values.join(" vs ")}`);
      }
    }

    for (const pattern of patterns.sort((left, right) => {
      if (left.pageName !== right.pageName) {
        return left.pageName.localeCompare(right.pageName);
      }

      return left.sectionIndex - right.sectionIndex;
    })) {
      lines.push(
        `- [ ] Review \`${pattern.pageName}\` section ${pattern.sectionIndex} pattern \`${pattern.kind}\` x${pattern.count}.`,
      );
    }

    lines.push("");
  }

  lines.push("# Page-Level Priorities");
  lines.push("");
  lines.push("- [ ] Collapse `privacy`, `terms`, and `cookie-policy` into one shared legal template.");
  lines.push("- [ ] Use `index` as the canonical converted reference for header, hero, CTA, and footer decisions.");
  lines.push("- [ ] Treat `index_original` as the stitch-to-tokenized precedent when deciding how to normalize the remaining stitch pages.");
  lines.push("- [ ] Defer `404` until shared marketing and legal templates are consolidated.");
  lines.push("");

  return `${lines.join("\n")}\n`;
}

async function captureRenderedPage(page, browser, sourceSummary, runtimeBaseURL) {
  const audit = {
    pageName: page.pageName,
    route: page.route,
    filePath: relative(rootDir, page.filePath),
    family: getPageFamily(page.pageName),
    sourceSummary,
    viewports: [],
  };

  for (const viewport of viewports) {
    const browserPage = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
    });

    await browserPage.goto(`${runtimeBaseURL}${page.route}`, { waitUntil: "networkidle" });
    await browserPage.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
          scroll-behavior: auto !important;
        }
      `,
    });

    const snapshot = await browserPage.evaluate(
      ({ trackedKeys }) => {
        const interestingAttributes = [
          "href",
          "src",
          "alt",
          "type",
          "name",
          "role",
          "aria-label",
          "aria-expanded",
          "aria-controls",
          "placeholder",
          "for",
        ];
        const styleCache = new Map();
        const styleProfiles = {};
        let profileCount = 0;

        function normalizeText(value) {
          return (value || "").replace(/\s+/g, " ").trim();
        }

        function getElementIndex(element) {
          if (!element.parentElement) {
            return 1;
          }

          const siblings = [...element.parentElement.children].filter(
            (sibling) => sibling.tagName === element.tagName,
          );

          return siblings.indexOf(element) + 1;
        }

        function getPath(element, parentPath) {
          const tag = element.tagName.toLowerCase();
          const segment = `${tag}[${getElementIndex(element)}]`;
          return parentPath ? `${parentPath} > ${segment}` : segment;
        }

        function getAttributes(element) {
          const attributes = {};
          for (const name of interestingAttributes) {
            const value = element.getAttribute(name);
            if (value !== null) {
              attributes[name] = value;
            }
          }
          return attributes;
        }

        function getOwnText(element) {
          return normalizeText(
            [...element.childNodes]
              .filter((node) => node.nodeType === Node.TEXT_NODE)
              .map((node) => node.textContent || "")
              .join(" "),
          );
        }

        function getStyleProfile(element) {
          const computedStyle = getComputedStyle(element);
          const profile = {};
          for (const property of [...computedStyle]) {
            profile[property] = computedStyle.getPropertyValue(property);
          }

          const cacheKey = JSON.stringify(profile);
          let profileId = styleCache.get(cacheKey);
          if (!profileId) {
            profileId = `sp-${++profileCount}`;
            styleCache.set(cacheKey, profileId);
            styleProfiles[profileId] = profile;
          }

          const decisionStyle = {};
          for (const property of trackedKeys) {
            decisionStyle[property] = profile[property] || "";
          }

          return { profileId, decisionStyle };
        }

        function collect(element, parentPath = "", depth = 0) {
          const { profileId, decisionStyle } = getStyleProfile(element);
          const path = getPath(element, parentPath);
          const rect = element.getBoundingClientRect();
          const children = [...element.children].map((child) => collect(child, path, depth + 1));
          const classes = [...element.classList];
          const textPreview = normalizeText(element.innerText || element.textContent || "").slice(0, 240);
          const ownText = getOwnText(element);
          const visible =
            rect.width > 0 &&
            rect.height > 0 &&
            decisionStyle.display !== "none" &&
            decisionStyle.visibility !== "hidden" &&
            Number(decisionStyle.opacity || "1") > 0;

          return {
            path,
            tag: element.tagName.toLowerCase(),
            depth,
            idAttr: element.id || "",
            classes,
            attributes: getAttributes(element),
            textPreview,
            ownText,
            visible,
            rect: {
              x: Number(rect.x.toFixed(2)),
              y: Number(rect.y.toFixed(2)),
              width: Number(rect.width.toFixed(2)),
              height: Number(rect.height.toFixed(2)),
            },
            styleProfileId: profileId,
            decisionStyle,
            children,
          };
        }

        const body = collect(document.body);
        return {
          url: window.location.href,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          documentTitle: document.title,
          styleProfiles,
          body,
        };
      },
      { trackedKeys: [...decisionStyleKeys, "visibility"] },
    );

    await browserPage.close();
    audit.viewports.push({
      name: viewport.name,
      width: viewport.width,
      height: viewport.height,
      ...snapshot,
    });
  }

  const primary = audit.viewports.find((entry) => entry.name === primaryViewport.name) || audit.viewports.at(-1);
  let contentIndex = 0;
  const sections = findTopLevelSections(primary.body).map((sectionNode, index) => {
    const stats = summarizeNode(sectionNode);
    const patterns = detectRepeatedPatterns(sectionNode);
    const isContentSection =
      !["header", "footer"].includes(sectionNode.tag) &&
      !["header", "footer"].includes(sectionNode.topLevelTag);

    if (isContentSection) {
      contentIndex += 1;
    }

    return {
      auditId: `${page.pageName}::section-${index + 1}`,
      pageName: page.pageName,
      route: page.route,
      index: index + 1,
      contentIndex: isContentSection ? contentIndex : 0,
      path: sectionNode.path,
      tag: sectionNode.tag,
      topLevelTag: sectionNode.topLevelTag,
      firstHeading: getFirstHeadingText(sectionNode),
      rootClasses: sectionNode.classes,
      rootDecisionStyle: cloneObject(sectionNode.decisionStyle),
      structureFingerprint: buildStructureFingerprint(sectionNode),
      looseFingerprint: buildLooseFingerprint(stats),
      nodeSnapshot: sectionNode,
      stats,
      patterns,
    };
  });

  audit.primarySections = sections.map((section) => {
    const sectionType = classifySection(section, audit);
    const { nodeSnapshot, ...serializableSection } = section;
    return {
      ...serializableSection,
      sectionType,
      variantTraits: deriveSectionTraits(sectionType, nodeSnapshot, section.stats),
    };
  });
  audit.patterns = audit.primarySections.flatMap((section) =>
    section.patterns.map((pattern, index) => ({
      auditId: `${section.auditId}::pattern-${index + 1}`,
      pageName: page.pageName,
      route: page.route,
      sectionAuditId: section.auditId,
      sectionIndex: section.index,
      sectionType: section.sectionType,
      ...pattern,
    })),
  );

  return audit;
}

async function main() {
  ensureDir(outputDir);
  resetDir(rawDir);
  resetDir(rawPagesDir);

  const pages = getAstroPages();
  const sourceSummaries = new Map(pages.map((page) => [page.pageName, buildSourceSummary(page)]));
  const port = await findAvailablePort(defaultPort);
  const runtimeBaseURL = getBaseURL(port);
  const { stop, serverCommand } = await startAuditServer(port);

  try {
    const browser = await chromium.launch({ headless: true });
    const pageAudits = [];

    for (const page of pages) {
      const audit = await captureRenderedPage(
        page,
        browser,
        sourceSummaries.get(page.pageName),
        runtimeBaseURL,
      );
      pageAudits.push(audit);
      writeFileSync(
        join(rawPagesDir, `${page.pageName}.json`),
        JSON.stringify(audit, null, 2),
      );
    }

    await browser.close();

    const globalClassInventory = buildClassInventory(pageAudits);
    const sectionClusters = buildSectionClusters(
      pageAudits.flatMap((page) => page.primarySections),
    );
    const patternClusters = buildPatternClusters(pageAudits.flatMap((page) => page.patterns));

    const manifest = {
      generatedAt: new Date().toISOString(),
      baseURL: runtimeBaseURL,
      serverCommand,
      viewports,
      pages: pageAudits.map((page) => ({
        pageName: page.pageName,
        route: page.route,
        family: page.family,
        filePath: page.filePath,
        sourceSummary: page.sourceSummary,
        sections: page.primarySections.map((section) => ({
          auditId: section.auditId,
          index: section.index,
          sectionType: section.sectionType,
          firstHeading: section.firstHeading,
          path: section.path,
          patterns: section.patterns.map((pattern) => ({
            kind: pattern.kind,
            count: pattern.count,
            samplePath: pattern.samplePath,
          })),
        })),
      })),
      sectionClusters,
      patternClusters,
      globalClassInventory,
    };

    writeFileSync(join(rawDir, "manifest.json"), JSON.stringify(manifest, null, 2));
    writeFileSync(
      join(rawDir, "class-inventory.json"),
      JSON.stringify(
        {
          generatedAt: manifest.generatedAt,
          global: globalClassInventory,
          pages: pageAudits.map((page) => ({
            pageName: page.pageName,
            route: page.route,
            classes: page.classInventory,
          })),
        },
        null,
        2,
      ),
    );
    writeFileSync(join(outputDir, "01-page-map.md"), renderPageMap(pageAudits));
    writeFileSync(join(outputDir, "02-section-matrix.md"), renderSectionMatrix(sectionClusters, pageAudits));
    writeFileSync(join(outputDir, "03-style-deltas.md"), renderStyleDeltas(sectionClusters, pageAudits, patternClusters));
    writeFileSync(
      join(outputDir, "04-consolidation-checklist.md"),
      renderChecklist(sectionClusters, patternClusters, pageAudits),
    );

    console.log(`Audit complete. Reports written to ${relative(rootDir, outputDir)}`);
  } finally {
    stop();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
