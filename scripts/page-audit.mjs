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
import { PNG } from "pngjs";

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
const subtreeStyleKeys = [
  "display",
  "position",
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
const semanticStopWords = new Set([
  "about",
  "after",
  "all",
  "and",
  "are",
  "but",
  "for",
  "from",
  "here",
  "into",
  "just",
  "more",
  "most",
  "not",
  "our",
  "out",
  "that",
  "the",
  "their",
  "them",
  "they",
  "this",
  "what",
  "when",
  "with",
  "your",
  "you",
]);
const similarityDetectorWeights = {
  typeHint: 0.07,
  structure: 0.15,
  layout: 0.18,
  rootStyle: 0.07,
  subtreeStyle: 0.17,
  classes: 0.08,
  semantics: 0.06,
  patterns: 0.04,
  visual: 0.18,
};
const componentSimilarityWeights = {
  typeHint: 0.1,
  structure: 0.14,
  layout: 0.18,
  rootStyle: 0.1,
  subtreeStyle: 0.17,
  classes: 0.13,
  semantics: 0.05,
  patterns: 0.03,
  visual: 0.1,
};
const validationPageNames = [
  "about",
  "case-studies",
  "contact",
  "cookie-policy",
  "faq",
  "index",
  "index_original",
  "lead-generation",
  "local-seo",
  "privacy",
  "terms",
  "thank-you",
  "web-design",
];
const validationFamilies = [
  {
    name: "SiteHeader",
    members: validationPageNames.map((pageName) => `${pageName}::section-1`),
  },
  {
    name: "HeroSection",
    members: validationPageNames.map((pageName) => `${pageName}::section-2`),
  },
  {
    name: "SiteFooter",
    members: [
      ["about", 9],
      ["case-studies", 7],
      ["contact", 4],
      ["cookie-policy", 4],
      ["faq", 9],
      ["index", 7],
      ["index_original", 7],
      ["lead-generation", 10],
      ["local-seo", 10],
      ["privacy", 4],
      ["terms", 4],
      ["thank-you", 4],
      ["web-design", 10],
    ].map(([pageName, index]) => `${pageName}::section-${index}`),
  },
  {
    name: "CredibilityStrip",
    members: ["index::section-3", "index_original::section-3"],
  },
  {
    name: "ServicesSection",
    members: ["index::section-4", "index_original::section-4", "lead-generation::section-5"],
  },
  {
    name: "ProcessSection",
    members: ["index::section-5", "index_original::section-5", "web-design::section-5"],
  },
  {
    name: "ComparisonSplitSection",
    members: [
      "lead-generation::section-3",
      "local-seo::section-3",
      "web-design::section-3",
    ],
  },
  {
    name: "CallToAction",
    members: [
      "about::section-8",
      "case-studies::section-6",
      "faq::section-8",
      "index_original::section-6",
      "lead-generation::section-9",
      "local-seo::section-9",
      "web-design::section-9",
    ],
  },
  {
    name: "LegalContent",
    members: [
      "cookie-policy::section-3",
      "privacy::section-3",
      "terms::section-3",
    ],
  },
  {
    name: "FaqSection",
    members: [
      "faq::section-3",
      "faq::section-4",
      "faq::section-5",
      "faq::section-6",
      "faq::section-7",
    ],
  },
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

function sortObjectEntries(value) {
  return Object.fromEntries(
    Object.entries(value).sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return left[0].localeCompare(right[0]);
    }),
  );
}

function addCount(store, key, amount = 1) {
  if (!key || amount <= 0) {
    return;
  }

  store.set(key, (store.get(key) || 0) + amount);
}

function roundToStep(value, step = 4) {
  if (!Number.isFinite(value)) {
    return value;
  }

  return Math.round(value / step) * step;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function ratioSimilarity(left, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return 0;
  }

  const high = Math.max(left, right, 1);
  const low = Math.max(0, Math.min(left, right));
  return low / high;
}

function normalizeStyleValue(property, value) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) {
    return "";
  }

  if (property === "font-family") {
    return normalized
      .split(",")[0]
      .replace(/["']/g, "")
      .trim()
      .toLowerCase();
  }

  if (/^-?\d+(\.\d+)?px$/.test(normalized)) {
    return `${roundToStep(Number.parseFloat(normalized))}px`;
  }

  if (normalized.startsWith("rgb")) {
    return normalized.replace(/\s+/g, "");
  }

  return normalized.toLowerCase();
}

function tokenizeSemanticText(value) {
  return tokenizeText(value).filter((token) => !semanticStopWords.has(token));
}

function objectValuesSum(value) {
  return Object.values(value || {}).reduce((sum, entry) => sum + Number(entry || 0), 0);
}

function weightedJaccard(mapA, mapB) {
  const keys = new Set([...Object.keys(mapA || {}), ...Object.keys(mapB || {})]);
  let minSum = 0;
  let maxSum = 0;

  for (const key of keys) {
    const left = Number(mapA?.[key] || 0);
    const right = Number(mapB?.[key] || 0);
    minSum += Math.min(left, right);
    maxSum += Math.max(left, right);
  }

  return maxSum === 0 ? 1 : minSum / maxSum;
}

function cosineSimilarity(mapA, mapB) {
  const keys = new Set([...Object.keys(mapA || {}), ...Object.keys(mapB || {})]);
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const key of keys) {
    const left = Number(mapA?.[key] || 0);
    const right = Number(mapB?.[key] || 0);
    dot += left * right;
    normA += left * left;
    normB += right * right;
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function bucketRatio(value, thresholds) {
  return bucketByThreshold(clamp(value, 0, 1), thresholds);
}

function classifyNodeRole(node) {
  if (/^h[1-6]$/.test(node.tag)) {
    return "heading";
  }

  if (["img", "picture", "svg", "video", "canvas"].includes(node.tag)) {
    return "media";
  }

  if (["a", "button"].includes(node.tag)) {
    return "action";
  }

  if (["form", "input", "textarea", "select"].includes(node.tag)) {
    return "form";
  }

  if (["ul", "ol", "li", "dl", "dt", "dd"].includes(node.tag)) {
    return "list";
  }

  if (["details", "summary"].includes(node.tag)) {
    return "accordion";
  }

  if (node.classes.includes("material-symbols-outlined")) {
    return "icon";
  }

  if (tokenizeText(node.textPreview).length > 0) {
    return "text";
  }

  return "container";
}

function shouldTrackLayoutNode(sectionNode, node) {
  if (node === sectionNode || !node.visible) {
    return false;
  }

  const sectionArea = Math.max(sectionNode.rect.width * sectionNode.rect.height, 1);
  const nodeArea = Math.max(node.rect.width * node.rect.height, 0);
  const role = classifyNodeRole(node);

  if (["heading", "media", "action", "form", "accordion"].includes(role)) {
    return true;
  }

  if (role === "text" && tokenizeText(node.ownText || node.textPreview).length >= 3) {
    return true;
  }

  if (role === "list" && node.children.length > 0) {
    return true;
  }

  return nodeArea / sectionArea >= 0.025 && node.children.length > 0;
}

function buildLayoutSignature(sectionNode) {
  const tokens = new Map();
  const roleCounts = new Map();
  const candidates = [];
  const sectionWidth = Math.max(sectionNode.rect.width, 1);
  const sectionHeight = Math.max(sectionNode.rect.height, 1);

  collectNodes(sectionNode, (node) => {
    if (!shouldTrackLayoutNode(sectionNode, node)) {
      return;
    }

    const nodeArea = node.rect.width * node.rect.height;
    candidates.push({
      node,
      role: classifyNodeRole(node),
      nodeArea,
    });
  });

  for (const entry of candidates
    .sort((left, right) => right.nodeArea - left.nodeArea || left.node.path.localeCompare(right.node.path))
    .slice(0, 40)) {
    const { node, role } = entry;
    const centerX = ((node.rect.x - sectionNode.rect.x) + node.rect.width / 2) / sectionWidth;
    const centerY = ((node.rect.y - sectionNode.rect.y) + node.rect.height / 2) / sectionHeight;
    const widthRatio = node.rect.width / sectionWidth;
    const heightRatio = node.rect.height / sectionHeight;
    const token = [
      role,
      `x-${bucketRatio(centerX, [
        { max: 0.2, label: "far-start" },
        { max: 0.4, label: "start" },
        { max: 0.6, label: "mid" },
        { max: 0.8, label: "end" },
        { max: Number.POSITIVE_INFINITY, label: "far-end" },
      ])}`,
      `y-${bucketRatio(centerY, [
        { max: 0.18, label: "top" },
        { max: 0.38, label: "upper" },
        { max: 0.62, label: "middle" },
        { max: 0.82, label: "lower" },
        { max: Number.POSITIVE_INFINITY, label: "bottom" },
      ])}`,
      `w-${bucketRatio(widthRatio, [
        { max: 0.18, label: "xs" },
        { max: 0.36, label: "sm" },
        { max: 0.64, label: "md" },
        { max: Number.POSITIVE_INFINITY, label: "lg" },
      ])}`,
      `h-${bucketRatio(heightRatio, [
        { max: 0.08, label: "xs" },
        { max: 0.18, label: "sm" },
        { max: 0.34, label: "md" },
        { max: Number.POSITIVE_INFINITY, label: "lg" },
      ])}`,
      node.decisionStyle["text-align"] === "center" ? "ta-center" : "ta-normal",
    ].join("::");

    addCount(tokens, token);
    addCount(roleCounts, role);
  }

  return {
    layoutTokens: sortObjectEntries(Object.fromEntries(tokens)),
    roleCounts: sortObjectEntries(Object.fromEntries(roleCounts)),
  };
}

function buildSemanticSignature(sectionNode) {
  const headingTokens = new Map();
  const bodyTokens = new Map();

  collectNodes(sectionNode, (node) => {
    const sourceText = node.ownText || node.textPreview;
    if (!sourceText) {
      return;
    }

    const tokens = tokenizeSemanticText(sourceText);
    if (tokens.length === 0) {
      return;
    }

    const target = /^h[1-6]$/.test(node.tag) ? headingTokens : bodyTokens;
    const multiplier = /^h[1-6]$/.test(node.tag) ? 2 : 1;

    for (const token of tokens) {
      addCount(target, token, multiplier);
    }
  });

  return {
    headingTokens: sortObjectEntries(Object.fromEntries(headingTokens)),
    bodyTokens: sortObjectEntries(Object.fromEntries(bodyTokens)),
  };
}

function buildClassSignature(sectionNode) {
  const classTokens = new Map();
  const utilityFamilies = new Map();
  const customClasses = new Map();

  collectNodes(sectionNode, (node) => {
    for (const token of node.classes) {
      addCount(classTokens, token);
      if (looksLikeTailwindClass(token)) {
        addCount(utilityFamilies, getUtilityFamily(token));
      } else {
        addCount(customClasses, token);
      }
    }
  });

  return {
    classTokens: sortObjectEntries(Object.fromEntries(classTokens)),
    utilityFamilies: sortObjectEntries(Object.fromEntries(utilityFamilies)),
    customClasses: sortObjectEntries(Object.fromEntries(customClasses)),
  };
}

function buildStyleSignature(sectionNode) {
  const styleValues = new Map();
  const propertyCounts = new Map();

  collectNodes(sectionNode, (node) => {
    for (const property of subtreeStyleKeys) {
      const normalized = normalizeStyleValue(property, node.decisionStyle[property] || "");
      if (!normalized) {
        continue;
      }

      addCount(styleValues, `${property}:${normalized}`);
      addCount(propertyCounts, property);
    }
  });

  return {
    styleValues: sortObjectEntries(Object.fromEntries(styleValues)),
    propertyCounts: sortObjectEntries(Object.fromEntries(propertyCounts)),
  };
}

function buildPatternSignature(patterns) {
  const kindCounts = new Map();
  for (const pattern of patterns) {
    addCount(kindCounts, pattern.kind, pattern.count);
  }

  return sortObjectEntries(Object.fromEntries(kindCounts));
}

function getSectionCompatibleGroup(sectionType) {
  if (["CallToAction", "FinalCtaSection"].includes(sectionType)) {
    return "cta";
  }

  return sectionType;
}

function computeSectionSignatures(sectionNode, stats, patterns) {
  const layout = buildLayoutSignature(sectionNode);
  const semantics = buildSemanticSignature(sectionNode);
  const classes = buildClassSignature(sectionNode);
  const styles = buildStyleSignature(sectionNode);

  return {
    layoutTokens: layout.layoutTokens,
    roleCounts: layout.roleCounts,
    headingTokens: semantics.headingTokens,
    bodyTokens: semantics.bodyTokens,
    classTokens: classes.classTokens,
    utilityFamilies: classes.utilityFamilies,
    customClasses: classes.customClasses,
    styleValues: styles.styleValues,
    stylePropertyCounts: styles.propertyCounts,
    patternKinds: buildPatternSignature(patterns),
    summary: {
      layoutTokenCount: objectValuesSum(layout.layoutTokens),
      uniqueSemanticTokens:
        Object.keys(semantics.headingTokens).length + Object.keys(semantics.bodyTokens).length,
      styleValueCount: objectValuesSum(styles.styleValues),
      classTokenCount: objectValuesSum(classes.classTokens),
      utilityFamilyCount: objectValuesSum(classes.utilityFamilies),
      patternCount: objectValuesSum(buildPatternSignature(patterns)),
      textWordCount: stats.wordCount,
    },
  };
}

function decodePng(buffer) {
  return PNG.sync.read(buffer);
}

function samplePixel(png, sampleX, sampleY, sampleWidth, sampleHeight) {
  const srcX = Math.min(
    png.width - 1,
    Math.max(0, Math.floor(((sampleX + 0.5) / sampleWidth) * png.width)),
  );
  const srcY = Math.min(
    png.height - 1,
    Math.max(0, Math.floor(((sampleY + 0.5) / sampleHeight) * png.height)),
  );
  const offset = (srcY * png.width + srcX) * 4;
  const alpha = png.data[offset + 3] / 255;
  const r = 255 + (png.data[offset] - 255) * alpha;
  const g = 255 + (png.data[offset + 1] - 255) * alpha;
  const b = 255 + (png.data[offset + 2] - 255) * alpha;

  return { r, g, b };
}

function buildGrayscaleGrid(png, width, height) {
  const values = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const { r, g, b } = samplePixel(png, x, y, width, height);
      values.push(Math.round(r * 0.299 + g * 0.587 + b * 0.114));
    }
  }

  return values;
}

function buildDHash(grid, width, height) {
  let hash = "";

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width - 1; x += 1) {
      const left = grid[y * width + x];
      const right = grid[y * width + x + 1];
      hash += left > right ? "1" : "0";
    }
  }

  return hash;
}

function buildColorHistogram(png, binsPerChannel = 4) {
  const histogram = new Map();

  for (let index = 0; index < png.data.length; index += 4) {
    const alpha = png.data[index + 3] / 255;
    const r = Math.round(255 + (png.data[index] - 255) * alpha);
    const g = Math.round(255 + (png.data[index + 1] - 255) * alpha);
    const b = Math.round(255 + (png.data[index + 2] - 255) * alpha);
    const rBucket = Math.min(binsPerChannel - 1, Math.floor((r / 256) * binsPerChannel));
    const gBucket = Math.min(binsPerChannel - 1, Math.floor((g / 256) * binsPerChannel));
    const bBucket = Math.min(binsPerChannel - 1, Math.floor((b / 256) * binsPerChannel));
    addCount(histogram, `${rBucket}-${gBucket}-${bBucket}`);
  }

  return sortObjectEntries(Object.fromEntries(histogram));
}

function buildBrightnessHistogram(grid, bins = 8) {
  const histogram = new Map();

  for (const value of grid) {
    const bucket = Math.min(bins - 1, Math.floor((value / 256) * bins));
    addCount(histogram, `b-${bucket}`);
  }

  return sortObjectEntries(Object.fromEntries(histogram));
}

function buildVisualSignature(buffer) {
  const png = decodePng(buffer);
  const thumbnailGrid = buildGrayscaleGrid(png, 24, 24);
  const hashGrid = buildGrayscaleGrid(png, 9, 8);
  const averageBrightness =
    thumbnailGrid.reduce((sum, value) => sum + value, 0) / Math.max(thumbnailGrid.length, 1);

  return {
    width: png.width,
    height: png.height,
    aspectRatio: Number((png.width / Math.max(png.height, 1)).toFixed(4)),
    dHash: buildDHash(hashGrid, 9, 8),
    thumbnailGrid,
    averageBrightness: Number(averageBrightness.toFixed(2)),
    brightnessHistogram: buildBrightnessHistogram(thumbnailGrid),
    colorHistogram: buildColorHistogram(png),
  };
}

function compareGrayscaleGrids(gridA, gridB) {
  if (!gridA?.length || !gridB?.length || gridA.length !== gridB.length) {
    return 0;
  }

  let totalDelta = 0;
  for (let index = 0; index < gridA.length; index += 1) {
    totalDelta += Math.abs(gridA[index] - gridB[index]);
  }

  return 1 - totalDelta / (gridA.length * 255);
}

function compareHashes(hashA, hashB) {
  if (!hashA || !hashB || hashA.length !== hashB.length) {
    return 0;
  }

  let mismatches = 0;
  for (let index = 0; index < hashA.length; index += 1) {
    if (hashA[index] !== hashB[index]) {
      mismatches += 1;
    }
  }

  return 1 - mismatches / hashA.length;
}

function compareVisualSignatures(left, right) {
  if (!left || !right) {
    return 0;
  }

  const gridScore = compareGrayscaleGrids(left.thumbnailGrid, right.thumbnailGrid);
  const hashScore = compareHashes(left.dHash, right.dHash);
  const colorScore = weightedJaccard(left.colorHistogram, right.colorHistogram);
  const brightnessScore = weightedJaccard(left.brightnessHistogram, right.brightnessHistogram);
  const aspectScore = ratioSimilarity(left.aspectRatio, right.aspectRatio);

  return gridScore * 0.35 + hashScore * 0.25 + colorScore * 0.2 + brightnessScore * 0.1 + aspectScore * 0.1;
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

function getNumericStyleValue(style, property) {
  return Number.parseFloat(style?.[property] || "0") || 0;
}

function isTransparentBackground(style) {
  const value = normalizeWhitespace(style?.["background-color"] || "");
  return !value || value === "rgba(0, 0, 0, 0)" || value === "transparent";
}

function getNodeLabel(node) {
  return getFirstHeadingText(node) || normalizeWhitespace(node.ownText || node.textPreview || "").slice(0, 80);
}

function isContentlessNodeStats(stats) {
  return (
    stats.wordCount === 0 &&
    stats.headingCount === 0 &&
    stats.iconCount === 0 &&
    stats.imageCount === 0 &&
    stats.linkCount === 0 &&
    stats.buttonCount === 0 &&
    stats.inputCount === 0 &&
    stats.textareaCount === 0 &&
    stats.selectCount === 0
  );
}

function buildRepeatedPatternGroups(sectionNode) {
  const groups = [];
  const seen = new Set();

  collectNodes(sectionNode, (parent) => {
    const children = parent.children || [];
    if (children.length < 2) {
      return;
    }

    const childGroups = new Map();
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
      const current = childGroups.get(signature) || [];
      current.push({ child, childStats });
      childGroups.set(signature, current);
    }

    for (const [signature, instances] of childGroups.entries()) {
      if (instances.length < 2) {
        continue;
      }

      const sample = instances[0];
      const key = `${parent.path}::${signature}`;
      if (seen.has(key)) {
        continue;
      }

      groups.push({
        parentPath: parent.path,
        count: instances.length,
        kind: classifyPatternKind(sample.child, sample.childStats),
        signature,
        sampleNode: sample.child,
        sampleStats: sample.childStats,
        instances,
      });
      seen.add(key);
    }
  });

  return groups
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.sampleNode.path.localeCompare(right.sampleNode.path);
    })
    .slice(0, 16);
}

function detectRepeatedPatterns(sectionNode) {
  return buildRepeatedPatternGroups(sectionNode).map((group) => ({
    parentPath: group.parentPath,
    count: group.count,
    kind: group.kind,
    samplePath: group.sampleNode.path,
    sampleHeading: getFirstHeadingText(group.sampleNode),
    structureFingerprint: buildStructureFingerprint(group.sampleNode),
    looseFingerprint: buildLooseFingerprint(group.sampleStats),
    sampleDecisionStyle: group.sampleNode.decisionStyle,
    sampleCustomClasses: group.sampleNode.classes.filter((token) => !looksLikeTailwindClass(token)),
  }));
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

function classifyComponentKind(node, stats, context = {}) {
  const parentSectionType = context.parentSectionType || "";
  const wordCount = tokenizeText(node.textPreview).length;
  const hasHeading = stats.headingCount >= 1;
  const formControlCount = stats.inputCount + stats.textareaCount + stats.selectCount;
  const backgroundFilled = !isTransparentBackground(node.decisionStyle);
  const borderWidth =
    getNumericStyleValue(node.decisionStyle, "border-top-width") +
    getNumericStyleValue(node.decisionStyle, "border-right-width") +
    getNumericStyleValue(node.decisionStyle, "border-bottom-width") +
    getNumericStyleValue(node.decisionStyle, "border-left-width");
  const hasBoxShadow = normalizeWhitespace(node.decisionStyle["box-shadow"] || "") !== "none";
  const paddedButton =
    getNumericStyleValue(node.decisionStyle, "padding-top") >= 12 &&
    getNumericStyleValue(node.decisionStyle, "padding-left") >= 20;

  if (node.tag === "a" || node.tag === "button") {
    if (parentSectionType === "SiteHeader") {
      return "HeaderNavLink";
    }

    if (["SiteFooter", "SectionNav"].includes(parentSectionType)) {
      return "NavLink";
    }

    if (backgroundFilled || borderWidth > 0 || hasBoxShadow || paddedButton) {
      return "Button";
    }

    return "TextLink";
  }

  if (parentSectionType === "SiteFooter" && node.tag === "li" && wordCount <= 24) {
    return "FooterLinkItem";
  }

  if (parentSectionType === "FormSection" && formControlCount === 1) {
    return "FormField";
  }

  if (parentSectionType === "FormSection" && formControlCount >= 2) {
    return "FormFieldRow";
  }

  if (parentSectionType === "CredibilityStrip" && wordCount > 0) {
    return "CredibilityItem";
  }

  if (parentSectionType === "HeroSection" && stats.iconCount >= 1 && !hasHeading && wordCount <= 12) {
    return "HeroChecklistItem";
  }

  if (parentSectionType === "HeroSection" && !hasHeading && wordCount <= 6) {
    return "HeroEyebrow";
  }

  if (parentSectionType === "SiteFooter" && hasHeading) {
    return "FooterColumnHeading";
  }

  if (parentSectionType === "SiteFooter" && wordCount > 0) {
    return "FooterMeta";
  }

  if (parentSectionType === "LegalContent" && stats.iconCount >= 1 && borderWidth > 0) {
    return "LegalInfoRow";
  }

  if (parentSectionType === "LegalContent" && node.tag === "li" && wordCount > 0) {
    return "LegalBulletItem";
  }

  if (parentSectionType === "LegalContent" && (hasHeading || wordCount >= 10)) {
    return "LegalTextBlock";
  }

  if (
    node.tag === "details" ||
    stats.detailCount >= 1 ||
    (stats.buttonCount >= 1 && hasHeading && wordCount <= 45)
  ) {
    return "AccordionItem";
  }

  if (parentSectionType === "ComparisonSplitSection") {
    if (node.tag === "li") {
      return "ComparisonListItem";
    }

    if (hasHeading || stats.iconCount >= 1) {
      return "ComparisonPanel";
    }
  }

  if (parentSectionType === "ProcessSection" && hasHeading) {
    return "ProcessStep";
  }

  if (stats.imageCount >= 1 && hasHeading) {
    return "ImageCard";
  }

  if (stats.iconCount >= 1 && hasHeading) {
    return "IconCard";
  }

  if (node.tag === "li" && wordCount <= 24) {
    return "ListItem";
  }

  if (hasHeading && node.rect.height >= 72) {
    return "ContentCard";
  }

  if (parentSectionType === "ContentSection" && borderWidth > 0 && wordCount > 0) {
    return "FeatureItem";
  }

  return "RepeatableBlock";
}

function deriveComponentTraits(componentKind, node, stats) {
  const traits = [];
  const backgroundFilled = !isTransparentBackground(node.decisionStyle);
  const borderWidth =
    getNumericStyleValue(node.decisionStyle, "border-top-width") +
    getNumericStyleValue(node.decisionStyle, "border-right-width") +
    getNumericStyleValue(node.decisionStyle, "border-bottom-width") +
    getNumericStyleValue(node.decisionStyle, "border-left-width");
  const hasBoxShadow = normalizeWhitespace(node.decisionStyle["box-shadow"] || "") !== "none";
  const textAlign = node.decisionStyle["text-align"] === "center" ? "centered" : "left-aligned";
  const uppercase =
    normalizeWhitespace(node.decisionStyle["text-transform"] || "") === "uppercase"
      ? "uppercase"
      : "sentence-case";

  if (["Button", "HeaderNavLink", "NavLink", "TextLink"].includes(componentKind)) {
    traits.push(backgroundFilled ? "filled" : borderWidth > 0 ? "outlined" : "text-only");
    traits.push(
      `height-${bucketByThreshold(node.rect.height, [
        { max: 28, label: "xs" },
        { max: 44, label: "sm" },
        { max: 64, label: "md" },
        { max: Number.POSITIVE_INFINITY, label: "lg" },
      ])}`,
    );
    traits.push(stats.iconCount > 0 ? "with-icon" : "without-icon");
    traits.push(uppercase);
    return traits;
  }

  if (componentKind === "FormField") {
    const controlType = stats.textareaCount > 0 ? "textarea" : stats.selectCount > 0 ? "select" : "input";
    traits.push(controlType);
    traits.push(borderWidth > 0 ? "outlined" : "borderless");
    traits.push(backgroundFilled ? "filled" : "transparent");
    return traits;
  }

  if (componentKind === "FormFieldRow") {
    traits.push(`controls-${stats.inputCount + stats.textareaCount + stats.selectCount}`);
    traits.push(node.decisionStyle.display === "grid" ? "grid" : "stack");
    return traits;
  }

  if (
    [
      "IconCard",
      "ImageCard",
      "ComparisonPanel",
      "ProcessStep",
      "ContentCard",
      "RepeatableBlock",
      "CredibilityItem",
      "HeroEyebrow",
      "HeroChecklistItem",
      "FooterMeta",
      "FooterColumnHeading",
      "LegalInfoRow",
      "LegalBulletItem",
      "LegalTextBlock",
      "FeatureItem",
    ].includes(componentKind)
  ) {
    traits.push(borderWidth > 0 ? "bordered" : "borderless");
    traits.push(hasBoxShadow ? "shadowed" : "flat");
    traits.push(textAlign);
    traits.push(stats.headingCount > 0 ? "with-heading" : "without-heading");
    return traits;
  }

  if (["ComparisonListItem", "ListItem", "AccordionItem", "FooterLinkItem"].includes(componentKind)) {
    traits.push(stats.iconCount > 0 ? "with-icon" : "without-icon");
    traits.push(textAlign);
    return traits;
  }

  return traits;
}

function shouldIncludeRepeatedComponentCandidate(node, stats, componentKind) {
  if (!node.visible || node.rect.width < 24 || node.rect.height < 12) {
    return false;
  }

  if (isContentlessNodeStats(stats)) {
    return false;
  }

  if (
    [
      "HeaderNavLink",
      "NavLink",
      "Button",
      "TextLink",
      "FooterLinkItem",
      "AccordionItem",
      "ComparisonPanel",
      "ComparisonListItem",
      "ProcessStep",
      "ImageCard",
      "IconCard",
      "ContentCard",
      "ListItem",
      "FormField",
      "FormFieldRow",
      "CredibilityItem",
      "HeroEyebrow",
      "HeroChecklistItem",
      "FooterMeta",
      "FooterColumnHeading",
      "LegalInfoRow",
      "LegalBulletItem",
      "LegalTextBlock",
      "FeatureItem",
    ].includes(componentKind)
  ) {
    return true;
  }

  if (componentKind === "RepeatableBlock") {
    return (
      stats.headingCount >= 1 ||
      stats.wordCount >= 3 ||
      stats.linkCount + stats.buttonCount >= 1 ||
      stats.iconCount >= 1 ||
      stats.imageCount >= 1
    );
  }

  return false;
}

function isStandaloneActionCandidate(node, sectionType) {
  if (!["a", "button", "details"].includes(node.tag) || !node.visible) {
    return false;
  }

  if (node.tag === "details") {
    return true;
  }

  if (["SiteHeader", "SiteFooter", "SectionNav"].includes(sectionType)) {
    return false;
  }

  const backgroundFilled = !isTransparentBackground(node.decisionStyle);
  const borderWidth =
    getNumericStyleValue(node.decisionStyle, "border-top-width") +
    getNumericStyleValue(node.decisionStyle, "border-right-width") +
    getNumericStyleValue(node.decisionStyle, "border-bottom-width") +
    getNumericStyleValue(node.decisionStyle, "border-left-width");
  const hasBoxShadow = normalizeWhitespace(node.decisionStyle["box-shadow"] || "") !== "none";
  const padded =
    getNumericStyleValue(node.decisionStyle, "padding-top") >= 10 &&
    getNumericStyleValue(node.decisionStyle, "padding-left") >= 18;

  return backgroundFilled || borderWidth > 0 || hasBoxShadow || padded;
}

function buildComponentCandidates(sectionNode, sectionMeta) {
  const repeatedGroups = buildRepeatedPatternGroups(sectionNode);
  const componentCandidates = [];
  const seenNodeIds = new Set();

  repeatedGroups.forEach((group, groupIndex) => {
    group.instances.forEach(({ child, childStats }, instanceIndex) => {
      const componentKind = classifyComponentKind(child, childStats, {
        parentSectionType: sectionMeta.sectionType,
      });

      if (!shouldIncludeRepeatedComponentCandidate(child, childStats, componentKind)) {
        return;
      }

      if (seenNodeIds.has(child.auditNodeId)) {
        return;
      }

      const nestedPatterns = detectRepeatedPatterns(child);
      componentCandidates.push({
        auditId: `${sectionMeta.auditId}::component-g${groupIndex + 1}-i${instanceIndex + 1}`,
        pageName: sectionMeta.pageName,
        route: sectionMeta.route,
        sectionAuditId: sectionMeta.auditId,
        sectionIndex: sectionMeta.index,
        sectionType: sectionMeta.sectionType,
        componentKind,
        source: "repeated-group",
        groupKind: group.kind,
        parentPath: group.parentPath,
        path: child.path,
        auditNodeId: child.auditNodeId,
        tag: child.tag,
        label: getNodeLabel(child),
        rootClasses: child.classes,
        rootDecisionStyle: cloneObject(child.decisionStyle),
        structureFingerprint: buildStructureFingerprint(child),
        looseFingerprint: buildLooseFingerprint(childStats),
        stats: childStats,
        patterns: nestedPatterns,
        signatures: computeSectionSignatures(child, childStats, nestedPatterns),
        variantTraits: deriveComponentTraits(componentKind, child, childStats),
        nodeSnapshot: child,
      });
      seenNodeIds.add(child.auditNodeId);
    });
  });

  collectNodes(sectionNode, (node) => {
    if (!isStandaloneActionCandidate(node, sectionMeta.sectionType) || seenNodeIds.has(node.auditNodeId)) {
      return;
    }

    const stats = summarizeNode(node);
    const componentKind = classifyComponentKind(node, stats, {
      parentSectionType: sectionMeta.sectionType,
    });
    const nestedPatterns = detectRepeatedPatterns(node);

    componentCandidates.push({
      auditId: `${sectionMeta.auditId}::component-standalone-${componentCandidates.length + 1}`,
      pageName: sectionMeta.pageName,
      route: sectionMeta.route,
      sectionAuditId: sectionMeta.auditId,
      sectionIndex: sectionMeta.index,
      sectionType: sectionMeta.sectionType,
      componentKind,
      source: "standalone",
      groupKind: componentKind,
      parentPath: node.path.split(" > ").slice(0, -1).join(" > "),
      path: node.path,
      auditNodeId: node.auditNodeId,
      tag: node.tag,
      label: getNodeLabel(node),
      rootClasses: node.classes,
      rootDecisionStyle: cloneObject(node.decisionStyle),
      structureFingerprint: buildStructureFingerprint(node),
      looseFingerprint: buildLooseFingerprint(stats),
      stats,
      patterns: nestedPatterns,
      signatures: computeSectionSignatures(node, stats, nestedPatterns),
      variantTraits: deriveComponentTraits(componentKind, node, stats),
      nodeSnapshot: node,
    });
    seenNodeIds.add(node.auditNodeId);
  });

  return componentCandidates.sort((left, right) => left.path.localeCompare(right.path));
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
  let overlap = 0;
  let total = 0;

  for (const key of keys) {
    const left = Number(mapA[key] || 0);
    const right = Number(mapB[key] || 0);
    overlap += Math.min(left, right);
    total += Math.max(left, right);
  }

  return total === 0 ? 1 : overlap / total;
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

function compareSemanticSignatures(left, right) {
  const headingScore =
    weightedJaccard(left.signatures.headingTokens, right.signatures.headingTokens) * 0.65 +
    cosineSimilarity(left.signatures.headingTokens, right.signatures.headingTokens) * 0.35;
  const bodyScore =
    weightedJaccard(left.signatures.bodyTokens, right.signatures.bodyTokens) * 0.55 +
    cosineSimilarity(left.signatures.bodyTokens, right.signatures.bodyTokens) * 0.45;

  return headingScore * 0.55 + bodyScore * 0.45;
}

function compareClassSignatures(left, right) {
  return (
    weightedJaccard(left.signatures.utilityFamilies, right.signatures.utilityFamilies) * 0.45 +
    weightedJaccard(left.signatures.classTokens, right.signatures.classTokens) * 0.35 +
    weightedJaccard(left.signatures.customClasses, right.signatures.customClasses) * 0.2
  );
}

function compareLayoutSignatures(left, right) {
  return (
    weightedJaccard(left.signatures.layoutTokens, right.signatures.layoutTokens) * 0.75 +
    weightedJaccard(left.signatures.roleCounts, right.signatures.roleCounts) * 0.25
  );
}

function compareSubtreeStyles(left, right) {
  return (
    weightedJaccard(left.signatures.styleValues, right.signatures.styleValues) * 0.75 +
    weightedJaccard(left.signatures.stylePropertyCounts, right.signatures.stylePropertyCounts) * 0.25
  );
}

function comparePatternSignatures(left, right) {
  const leftTotal = objectValuesSum(left.signatures.patternKinds);
  const rightTotal = objectValuesSum(right.signatures.patternKinds);

  if (leftTotal === 0 && rightTotal === 0) {
    return 0.35;
  }

  if (leftTotal === 0 || rightTotal === 0) {
    return 0;
  }

  return weightedJaccard(left.signatures.patternKinds, right.signatures.patternKinds);
}

function compareStructure(left, right) {
  const exactScore = left.structureFingerprint === right.structureFingerprint ? 1 : 0;
  const looseScore = left.looseFingerprint === right.looseFingerprint ? 1 : 0;
  const tagScore = compareMaps(left.stats.tagCounts, right.stats.tagCounts);
  const sizeScore = ratioSimilarity(left.stats.elementCount, right.stats.elementCount);

  return exactScore * 0.35 + looseScore * 0.2 + tagScore * 0.3 + sizeScore * 0.15;
}

function scoreSectionSimilarityDetailed(left, right) {
  const typeHint =
    left.sectionType === right.sectionType
      ? 1
      : getSectionCompatibleGroup(left.sectionType) === getSectionCompatibleGroup(right.sectionType)
        ? 0.55
        : 0;
  const structure = compareStructure(left, right);
  const layout = compareLayoutSignatures(left, right);
  const rootStyle = compareDecisionStyles(left.rootDecisionStyle, right.rootDecisionStyle);
  const subtreeStyle = compareSubtreeStyles(left, right);
  const classes = compareClassSignatures(left, right);
  const semantics = compareSemanticSignatures(left, right);
  const patterns = comparePatternSignatures(left, right);
  const visual = compareVisualSignatures(left.visualSignature, right.visualSignature);
  const combined =
    typeHint * similarityDetectorWeights.typeHint +
    structure * similarityDetectorWeights.structure +
    layout * similarityDetectorWeights.layout +
    rootStyle * similarityDetectorWeights.rootStyle +
    subtreeStyle * similarityDetectorWeights.subtreeStyle +
    classes * similarityDetectorWeights.classes +
    semantics * similarityDetectorWeights.semantics +
    patterns * similarityDetectorWeights.patterns +
    visual * similarityDetectorWeights.visual;

  return {
    typeHint: Number(typeHint.toFixed(4)),
    structure: Number(structure.toFixed(4)),
    layout: Number(layout.toFixed(4)),
    rootStyle: Number(rootStyle.toFixed(4)),
    subtreeStyle: Number(subtreeStyle.toFixed(4)),
    classes: Number(classes.toFixed(4)),
    semantics: Number(semantics.toFixed(4)),
    patterns: Number(patterns.toFixed(4)),
    visual: Number(visual.toFixed(4)),
    combined: Number(combined.toFixed(4)),
  };
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

function getPairKey(leftId, rightId) {
  return [leftId, rightId].sort().join("::");
}

function buildSectionPairScores(sections) {
  const rows = [];
  const lookup = new Map();

  for (let leftIndex = 0; leftIndex < sections.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < sections.length; rightIndex += 1) {
      const left = sections[leftIndex];
      const right = sections[rightIndex];
      const scores = scoreSectionSimilarityDetailed(left, right);
      const row = {
        leftAuditId: left.auditId,
        rightAuditId: right.auditId,
        leftPageName: left.pageName,
        rightPageName: right.pageName,
        leftSectionType: left.sectionType,
        rightSectionType: right.sectionType,
        ...scores,
      };
      rows.push(row);
      lookup.set(getPairKey(left.auditId, right.auditId), row);
    }
  }

  return { rows, lookup };
}

function buildValidationDataset(sectionLookup) {
  const positives = [];
  const seenPositive = new Set();
  const membership = new Map();

  for (const family of validationFamilies) {
    for (const member of family.members) {
      if (sectionLookup.has(member)) {
        membership.set(member, family.name);
      }
    }
  }

  for (const family of validationFamilies) {
    const members = family.members.filter((member) => sectionLookup.has(member));
    for (let leftIndex = 0; leftIndex < members.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < members.length; rightIndex += 1) {
        const key = getPairKey(members[leftIndex], members[rightIndex]);
        if (seenPositive.has(key)) {
          continue;
        }

        positives.push({
          label: "positive",
          family: family.name,
          leftAuditId: members[leftIndex],
          rightAuditId: members[rightIndex],
        });
        seenPositive.add(key);
      }
    }
  }

  const negatives = [];
  const sections = [...sectionLookup.values()].sort((left, right) => left.auditId.localeCompare(right.auditId));
  for (let leftIndex = 0; leftIndex < sections.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < sections.length; rightIndex += 1) {
      const left = sections[leftIndex];
      const right = sections[rightIndex];
      const leftFamily = membership.get(left.auditId);
      const rightFamily = membership.get(right.auditId);
      if (!leftFamily || !rightFamily || leftFamily === rightFamily) {
        continue;
      }

      if (left.sectionType === right.sectionType && left.sectionType !== "ContentSection") {
        continue;
      }

      negatives.push({
        label: "negative",
        family: `${leftFamily} vs ${rightFamily}`,
        leftAuditId: left.auditId,
        rightAuditId: right.auditId,
      });
    }
  }

  negatives.sort((left, right) => {
    const leftKey = `${left.leftAuditId}::${left.rightAuditId}`;
    const rightKey = `${right.leftAuditId}::${right.rightAuditId}`;
    return leftKey.localeCompare(rightKey);
  });

  return positives.concat(negatives.slice(0, positives.length));
}

function findBestThreshold(samples, accessor) {
  const values = [...new Set(samples.map((sample) => accessor(sample)).sort((left, right) => right - left))];
  let best = {
    threshold: 0.5,
    f1: -1,
    precision: 0,
    recall: 0,
    truePositive: 0,
    falsePositive: 0,
    falseNegative: 0,
    trueNegative: 0,
  };

  for (const threshold of values) {
    let truePositive = 0;
    let falsePositive = 0;
    let falseNegative = 0;
    let trueNegative = 0;

    for (const sample of samples) {
      const predictedPositive = accessor(sample) >= threshold;
      const actualPositive = sample.label === "positive";

      if (predictedPositive && actualPositive) truePositive += 1;
      if (predictedPositive && !actualPositive) falsePositive += 1;
      if (!predictedPositive && actualPositive) falseNegative += 1;
      if (!predictedPositive && !actualPositive) trueNegative += 1;
    }

    const precision =
      truePositive + falsePositive === 0 ? 0 : truePositive / (truePositive + falsePositive);
    const recall =
      truePositive + falseNegative === 0 ? 0 : truePositive / (truePositive + falseNegative);
    const f1 =
      precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

    if (f1 > best.f1 || (f1 === best.f1 && threshold > best.threshold)) {
      best = {
        threshold,
        f1,
        precision,
        recall,
        truePositive,
        falsePositive,
        falseNegative,
        trueNegative,
      };
    }
  }

  return {
    threshold: Number(best.threshold.toFixed(4)),
    f1: Number(best.f1.toFixed(4)),
    precision: Number(best.precision.toFixed(4)),
    recall: Number(best.recall.toFixed(4)),
    truePositive: best.truePositive,
    falsePositive: best.falsePositive,
    falseNegative: best.falseNegative,
    trueNegative: best.trueNegative,
  };
}

function evaluateDetectors(sectionPairScores, sectionLookup) {
  const dataset = buildValidationDataset(sectionLookup)
    .map((sample) => {
      const pair = sectionPairScores.lookup.get(getPairKey(sample.leftAuditId, sample.rightAuditId));
      return pair ? { ...sample, scores: pair } : null;
    })
    .filter(Boolean);
  const detectorKeys = [
    "typeHint",
    "structure",
    "layout",
    "rootStyle",
    "subtreeStyle",
    "classes",
    "semantics",
    "patterns",
    "visual",
    "combined",
  ];
  const detectors = {};

  for (const key of detectorKeys) {
    const positiveScores = dataset
      .filter((sample) => sample.label === "positive")
      .map((sample) => sample.scores[key]);
    const negativeScores = dataset
      .filter((sample) => sample.label === "negative")
      .map((sample) => sample.scores[key]);
    const summary = findBestThreshold(dataset, (sample) => sample.scores[key]);
    detectors[key] = {
      ...summary,
      averagePositive: Number(
        (
          positiveScores.reduce((sum, value) => sum + value, 0) / Math.max(positiveScores.length, 1)
        ).toFixed(4),
      ),
      averageNegative: Number(
        (
          negativeScores.reduce((sum, value) => sum + value, 0) / Math.max(negativeScores.length, 1)
        ).toFixed(4),
      ),
    };
  }

  const familyCoverage = validationFamilies
    .map((family) => {
      const members = family.members.filter((member) => sectionLookup.has(member));
      const familyPairs = [];
      for (let leftIndex = 0; leftIndex < members.length; leftIndex += 1) {
        for (let rightIndex = leftIndex + 1; rightIndex < members.length; rightIndex += 1) {
          const pair = sectionPairScores.lookup.get(getPairKey(members[leftIndex], members[rightIndex]));
          if (pair) {
            familyPairs.push(pair);
          }
        }
      }

      const combinedThreshold = detectors.combined.threshold;
      const matchedCount = familyPairs.filter((pair) => pair.combined >= combinedThreshold).length;

      return {
        family: family.name,
        pairCount: familyPairs.length,
        averageCombined: Number(
          (
            familyPairs.reduce((sum, pair) => sum + pair.combined, 0) / Math.max(familyPairs.length, 1)
          ).toFixed(4),
        ),
        matchedCount,
        matchedPct: Number(
          ((matchedCount / Math.max(familyPairs.length, 1)) * 100).toFixed(1),
        ),
      };
    })
    .filter((entry) => entry.pairCount > 0);

  return {
    datasetSize: dataset.length,
    positives: dataset.filter((sample) => sample.label === "positive").length,
    negatives: dataset.filter((sample) => sample.label === "negative").length,
    detectors,
    familyCoverage,
    samples: dataset.map((sample) => ({
      label: sample.label,
      family: sample.family,
      leftAuditId: sample.leftAuditId,
      rightAuditId: sample.rightAuditId,
      scores: sample.scores,
    })),
  };
}

function getSectionPairScore(sectionPairScores, left, right) {
  if (left.auditId === right.auditId) {
    return null;
  }

  return sectionPairScores.lookup.get(getPairKey(left.auditId, right.auditId)) || null;
}

function buildSectionClusters(sections, sectionPairScores, detectorEvaluation) {
  const combinedThreshold = detectorEvaluation.detectors.combined.threshold;
  const clusters = clusterBySimilarity(
    sections,
    (left, right) => getSectionPairScore(sectionPairScores, left, right)?.combined || 0,
    (left, right) => {
      const compatibleGroupMatch =
        getSectionCompatibleGroup(left.sectionType) === getSectionCompatibleGroup(right.sectionType);

      if (left.sectionType !== right.sectionType && !compatibleGroupMatch) {
        return 1.01;
      }

      let threshold = combinedThreshold;

      if (left.sectionType === right.sectionType && left.sectionType === "HeroSection") {
        threshold -= 0.08;
      }

      if (left.sectionType === right.sectionType && left.sectionType === "ContentSection") {
        threshold += 0.16;
      }

      if (
        left.sectionType === right.sectionType &&
        ["ComparisonSplitSection", "ServicesSection", "ProcessSection", "CallToAction"].includes(
          left.sectionType,
        )
      ) {
        threshold -= left.sectionType === "CallToAction" ? 0.04 : 0.03;
      }

      if (left.sectionType === right.sectionType && left.sectionType !== "ContentSection") {
        threshold -= 0.02;
      }

      if (compatibleGroupMatch) {
        threshold -= 0.01;
      }

      return Number(clamp(threshold, 0.36, 0.82).toFixed(4));
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
        representativeScores:
          item.auditId === cluster.representative.auditId
            ? null
            : getSectionPairScore(sectionPairScores, cluster.representative, item),
      })),
    };
  });
}

function getComponentCompatibleGroup(componentKind) {
  return componentKind;
}

function getComponentContextGroup(component) {
  if (component.componentKind === "Button") {
    return "action";
  }

  if (["HeroEyebrow", "HeroChecklistItem"].includes(component.componentKind)) {
    return "hero";
  }

  if (component.componentKind === "CredibilityItem") {
    return "credibility-strip";
  }

  if (component.componentKind === "HeaderNavLink") {
    return "site-header";
  }

  if (component.componentKind === "NavLink") {
    return component.sectionType;
  }

  if (component.componentKind === "FooterLinkItem") {
    return "site-footer";
  }

  if (component.componentKind === "FooterMeta") {
    return "site-footer";
  }

  if (component.componentKind === "FooterColumnHeading") {
    return "site-footer";
  }

  if (component.componentKind === "FormField") {
    return "form";
  }

  if (component.componentKind === "FormFieldRow") {
    return "form";
  }

  if (["LegalInfoRow", "LegalTextBlock"].includes(component.componentKind)) {
    return "legal-content";
  }

  if (component.componentKind === "LegalBulletItem") {
    return "legal-content";
  }

  if (component.componentKind === "IconCard" && ["ServicesSection", "IconCardGrid"].includes(component.sectionType)) {
    return "icon-card-grid";
  }

  if (component.componentKind === "ImageCard" && component.sectionType === "ImageCardGrid") {
    return "image-card-grid";
  }

  return getSectionCompatibleGroup(component.sectionType);
}

function canComponentsShareCluster(left, right) {
  const sameKind = getComponentCompatibleGroup(left.componentKind) === getComponentCompatibleGroup(right.componentKind);
  const sameContext = getComponentContextGroup(left) === getComponentContextGroup(right);

  if (!sameKind) {
    return false;
  }

  if (
    !sameContext &&
    ["RepeatableBlock", "ContentCard", "ListItem", "NavLink", "FooterLinkItem", "TextLink", "FormField"].includes(
      left.componentKind,
    )
  ) {
    return false;
  }

  return true;
}

function getComponentClusterThreshold(left, right, combinedThreshold) {
  if (!canComponentsShareCluster(left, right)) {
    return 1.01;
  }

  const sameContext = getComponentContextGroup(left) === getComponentContextGroup(right);
  let threshold = combinedThreshold;

  if (["Button", "HeaderNavLink", "NavLink", "FooterLinkItem"].includes(left.componentKind)) {
    threshold -= 0.04;
  }

  if (["IconCard", "ImageCard", "ComparisonPanel", "ProcessStep", "AccordionItem"].includes(left.componentKind)) {
    threshold -= sameContext ? 0.02 : 0;
  }

  if (["RepeatableBlock", "ContentCard", "ListItem", "TextLink", "FormField"].includes(left.componentKind)) {
    threshold += 0.12;
  }

  return Number(clamp(threshold, 0.36, 0.88).toFixed(4));
}

function scoreComponentSimilarityDetailed(left, right) {
  const typeHint =
    left.componentKind === right.componentKind
      ? 1
      : getComponentCompatibleGroup(left.componentKind) === getComponentCompatibleGroup(right.componentKind)
        ? 0.55
        : 0;
  const structure = compareStructure(left, right);
  const layout = compareLayoutSignatures(left, right);
  const rootStyle = compareDecisionStyles(left.rootDecisionStyle, right.rootDecisionStyle);
  const subtreeStyle = compareSubtreeStyles(left, right);
  const classes = compareClassSignatures(left, right);
  const semantics = compareSemanticSignatures(left, right);
  const patterns = comparePatternSignatures(left, right);
  const visual = compareVisualSignatures(left.visualSignature, right.visualSignature);
  const combined =
    typeHint * componentSimilarityWeights.typeHint +
    structure * componentSimilarityWeights.structure +
    layout * componentSimilarityWeights.layout +
    rootStyle * componentSimilarityWeights.rootStyle +
    subtreeStyle * componentSimilarityWeights.subtreeStyle +
    classes * componentSimilarityWeights.classes +
    semantics * componentSimilarityWeights.semantics +
    patterns * componentSimilarityWeights.patterns +
    visual * componentSimilarityWeights.visual;

  return {
    typeHint: Number(typeHint.toFixed(4)),
    structure: Number(structure.toFixed(4)),
    layout: Number(layout.toFixed(4)),
    rootStyle: Number(rootStyle.toFixed(4)),
    subtreeStyle: Number(subtreeStyle.toFixed(4)),
    classes: Number(classes.toFixed(4)),
    semantics: Number(semantics.toFixed(4)),
    patterns: Number(patterns.toFixed(4)),
    visual: Number(visual.toFixed(4)),
    combined: Number(combined.toFixed(4)),
  };
}

function buildComponentPairScores(components) {
  const rows = [];
  const lookup = new Map();

  for (let leftIndex = 0; leftIndex < components.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < components.length; rightIndex += 1) {
      const left = components[leftIndex];
      const right = components[rightIndex];
      const scores = scoreComponentSimilarityDetailed(left, right);
      const row = {
        leftAuditId: left.auditId,
        rightAuditId: right.auditId,
        leftPageName: left.pageName,
        rightPageName: right.pageName,
        leftComponentKind: left.componentKind,
        rightComponentKind: right.componentKind,
        ...scores,
      };
      rows.push(row);
      lookup.set(getPairKey(left.auditId, right.auditId), row);
    }
  }

  return { rows, lookup };
}

function buildComponentValidationDataset(componentLookup) {
  const familyDefinitions = [
    {
      name: "HeaderNavLink",
      test: (component) => component.componentKind === "HeaderNavLink",
    },
    {
      name: "FooterNavLink",
      test: (component) => component.componentKind === "NavLink" && component.sectionType === "SiteFooter",
    },
    {
      name: "HeroButton",
      test: (component) => component.componentKind === "Button" && component.sectionType === "HeroSection",
    },
    {
      name: "ComparisonPanel",
      test: (component) => component.componentKind === "ComparisonPanel",
    },
    {
      name: "ComparisonListItem",
      test: (component) => component.componentKind === "ComparisonListItem",
    },
    {
      name: "ProcessStep",
      test: (component) => component.componentKind === "ProcessStep",
    },
    {
      name: "AccordionItem",
      test: (component) => component.componentKind === "AccordionItem",
    },
    {
      name: "FooterLinkItem",
      test: (component) => component.componentKind === "FooterLinkItem",
    },
    {
      name: "FooterMeta",
      test: (component) => component.componentKind === "FooterMeta",
    },
    {
      name: "LegalBulletItem",
      test: (component) => component.componentKind === "LegalBulletItem",
    },
    {
      name: "FormField",
      test: (component) => component.componentKind === "FormField",
    },
    {
      name: "CredibilityItem",
      test: (component) => component.componentKind === "CredibilityItem",
    },
    {
      name: "LegalInfoRow",
      test: (component) => component.componentKind === "LegalInfoRow",
    },
    {
      name: "IconCard",
      test: (component) =>
        component.componentKind === "IconCard" &&
        ["ServicesSection", "IconCardGrid"].includes(component.sectionType),
    },
  ];
  const familyMembers = familyDefinitions
    .map((definition) => ({
      name: definition.name,
      members: [...componentLookup.values()].filter(definition.test).map((component) => component.auditId),
    }))
    .filter((family) => family.members.length >= 2);
  const positives = [];
  const seenPositive = new Set();
  const membership = new Map();

  for (const family of familyMembers) {
    family.members.forEach((member) => membership.set(member, family.name));

    for (let leftIndex = 0; leftIndex < family.members.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < family.members.length; rightIndex += 1) {
        const key = getPairKey(family.members[leftIndex], family.members[rightIndex]);
        if (seenPositive.has(key)) {
          continue;
        }

        positives.push({
          label: "positive",
          family: family.name,
          leftAuditId: family.members[leftIndex],
          rightAuditId: family.members[rightIndex],
        });
        seenPositive.add(key);
      }
    }
  }

  const negatives = [];
  const components = [...componentLookup.values()].sort((left, right) => left.auditId.localeCompare(right.auditId));
  for (let leftIndex = 0; leftIndex < components.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < components.length; rightIndex += 1) {
      const left = components[leftIndex];
      const right = components[rightIndex];
      const leftFamily = membership.get(left.auditId);
      const rightFamily = membership.get(right.auditId);
      if (!leftFamily || !rightFamily || leftFamily === rightFamily) {
        continue;
      }

      negatives.push({
        label: "negative",
        family: `${leftFamily} vs ${rightFamily}`,
        leftAuditId: left.auditId,
        rightAuditId: right.auditId,
      });
    }
  }

  negatives.sort((left, right) => {
    const leftKey = `${left.leftAuditId}::${left.rightAuditId}`;
    const rightKey = `${right.leftAuditId}::${right.rightAuditId}`;
    return leftKey.localeCompare(rightKey);
  });

  return {
    samples: positives.concat(negatives.slice(0, positives.length)),
    families: familyMembers,
  };
}

function evaluateComponentDetectors(componentPairScores, componentLookup) {
  const validation = buildComponentValidationDataset(componentLookup);
  const dataset = validation.samples
    .map((sample) => {
      const pair = componentPairScores.lookup.get(getPairKey(sample.leftAuditId, sample.rightAuditId));
      const left = componentLookup.get(sample.leftAuditId);
      const right = componentLookup.get(sample.rightAuditId);
      return pair && left && right
        ? {
            ...sample,
            clusterCompatible: canComponentsShareCluster(left, right),
            scores: pair,
          }
        : null;
    })
    .filter(Boolean);
  const detectorKeys = [
    "typeHint",
    "structure",
    "layout",
    "rootStyle",
    "subtreeStyle",
    "classes",
    "semantics",
    "patterns",
    "visual",
    "combined",
  ];
  const detectors = {};

  for (const key of detectorKeys) {
    const positiveScores = dataset
      .filter((sample) => sample.label === "positive")
      .map((sample) => sample.scores[key]);
    const negativeScores = dataset
      .filter((sample) => sample.label === "negative")
      .map((sample) => sample.scores[key]);
    const summary = findBestThreshold(dataset, (sample) => sample.scores[key]);
    detectors[key] = {
      ...summary,
      averagePositive: Number(
        (
          positiveScores.reduce((sum, value) => sum + value, 0) / Math.max(positiveScores.length, 1)
        ).toFixed(4),
      ),
      averageNegative: Number(
        (
          negativeScores.reduce((sum, value) => sum + value, 0) / Math.max(negativeScores.length, 1)
        ).toFixed(4),
      ),
    };
  }

  const familyCoverage = validation.families.map((family) => {
    const familyPairs = [];
    for (let leftIndex = 0; leftIndex < family.members.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < family.members.length; rightIndex += 1) {
        const pair = componentPairScores.lookup.get(getPairKey(family.members[leftIndex], family.members[rightIndex]));
        if (pair) {
          familyPairs.push(pair);
        }
      }
    }

    const combinedThreshold = detectors.combined.threshold;
    const matchedCount = familyPairs.filter((pair) => pair.combined >= combinedThreshold).length;

    return {
      family: family.name,
      pairCount: familyPairs.length,
      averageCombined: Number(
        (
          familyPairs.reduce((sum, pair) => sum + pair.combined, 0) / Math.max(familyPairs.length, 1)
        ).toFixed(4),
      ),
      matchedCount,
      matchedPct: Number(((matchedCount / Math.max(familyPairs.length, 1)) * 100).toFixed(1)),
    };
  });

  return {
    datasetSize: dataset.length,
    positives: dataset.filter((sample) => sample.label === "positive").length,
    negatives: dataset.filter((sample) => sample.label === "negative").length,
    detectors,
    familyCoverage,
    samples: dataset.map((sample) => ({
      label: sample.label,
      family: sample.family,
      leftAuditId: sample.leftAuditId,
      rightAuditId: sample.rightAuditId,
      clusterCompatible: sample.clusterCompatible,
      scores: sample.scores,
    })),
  };
}

function getComponentPairScore(componentPairScores, left, right) {
  if (left.auditId === right.auditId) {
    return null;
  }

  return componentPairScores.lookup.get(getPairKey(left.auditId, right.auditId)) || null;
}

function getComponentDisplayName(component) {
  if (
    [
      "RepeatableBlock",
      "ContentCard",
      "ListItem",
      "FooterLinkItem",
      "FooterMeta",
      "FooterColumnHeading",
      "FormField",
      "LegalInfoRow",
      "LegalBulletItem",
      "LegalTextBlock",
      "FeatureItem",
      "HeroEyebrow",
      "HeroChecklistItem",
      "CredibilityItem",
    ].includes(
      component.componentKind,
    ) &&
    component.label
  ) {
    return `${component.componentKind}: ${component.label}`;
  }

  return component.componentKind;
}

function buildComponentClusters(components, componentPairScores, detectorEvaluation) {
  const combinedThreshold = detectorEvaluation.detectors.combined.threshold;
  const clusters = clusterBySimilarity(
    components,
    (left, right) => getComponentPairScore(componentPairScores, left, right)?.combined || 0,
    (left, right) => getComponentClusterThreshold(left, right, combinedThreshold),
    (item) =>
      `${getComponentContextGroup(item)}::${item.componentKind}::${item.structureFingerprint}`,
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
      id: `component-cluster-${index + 1}`,
      componentKind: cluster.representative.componentKind,
      displayName: getComponentDisplayName(cluster.representative),
      status,
      representativeId: cluster.representative.auditId,
      items: cluster.items.map((item) => ({
        auditId: item.auditId,
        pageName: item.pageName,
        route: item.route,
        sectionAuditId: item.sectionAuditId,
        sectionIndex: item.sectionIndex,
        sectionType: item.sectionType,
        componentKind: item.componentKind,
        label: item.label,
        variantTraits: item.variantTraits,
        representativeScores:
          item.auditId === cluster.representative.auditId
            ? null
            : getComponentPairScore(componentPairScores, cluster.representative, item),
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

function summarizeSignalEvidence(scores) {
  if (!scores) {
    return "";
  }

  const strongest = [
    "typeHint",
    "structure",
    "layout",
    "rootStyle",
    "subtreeStyle",
    "classes",
    "semantics",
    "patterns",
    "visual",
  ]
    .map((key) => [key, Number(scores[key] || 0)])
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 3)
    .map(([key, value]) => `${key} ${value.toFixed(2)}`);

  return strongest.join(", ");
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
      const evidenceSummary = item.representativeScores
        ? `; ensemble: ${item.representativeScores.combined.toFixed(2)}; signals: ${summarizeSignalEvidence(item.representativeScores)}`
        : "";
      lines.push(
        `- [ ] \`${item.pageName}\` section ${item.index} at \`${item.route}\`${heading}${variantSummary}${patternSummary}${evidenceSummary}`,
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

function buildNearestNeighbors(sections, sectionPairScores, count = 4) {
  return sections
    .map((section) => {
      const neighbors = sections
        .filter((candidate) => candidate.auditId !== section.auditId)
        .map((candidate) => ({
          section,
          candidate,
          scores: getSectionPairScore(sectionPairScores, section, candidate),
        }))
        .filter((entry) => entry.scores)
        .sort((left, right) => {
          if (right.scores.combined !== left.scores.combined) {
            return right.scores.combined - left.scores.combined;
          }

          return left.candidate.auditId.localeCompare(right.candidate.auditId);
        })
        .slice(0, count);

      return {
        auditId: section.auditId,
        pageName: section.pageName,
        index: section.index,
        sectionType: section.sectionType,
        firstHeading: section.firstHeading,
        route: section.route,
        neighbors: neighbors.map((entry) => ({
          auditId: entry.candidate.auditId,
          pageName: entry.candidate.pageName,
          index: entry.candidate.index,
          route: entry.candidate.route,
          sectionType: entry.candidate.sectionType,
          firstHeading: entry.candidate.firstHeading,
          scores: entry.scores,
        })),
      };
    })
    .sort((left, right) => left.auditId.localeCompare(right.auditId));
}

function renderSimilarityAnalysis(detectorEvaluation) {
  const lines = [
    "# Similarity Detector Analysis",
    "",
    `Validation set: ${detectorEvaluation.datasetSize} labeled pairs (${detectorEvaluation.positives} positive, ${detectorEvaluation.negatives} negative).`,
    "",
    "## Detector Calibration",
    "",
    "| Detector | Threshold | Avg + | Avg - | Precision | Recall | F1 | FP | FN |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const [key, summary] of Object.entries(detectorEvaluation.detectors)) {
    lines.push(
      `| \`${key}\` | ${summary.threshold.toFixed(2)} | ${summary.averagePositive.toFixed(2)} | ${summary.averageNegative.toFixed(2)} | ${summary.precision.toFixed(2)} | ${summary.recall.toFixed(2)} | ${summary.f1.toFixed(2)} | ${summary.falsePositive} | ${summary.falseNegative} |`,
    );
  }

  lines.push("");
  lines.push("## Family Coverage");
  lines.push("");
  lines.push("| Family | Pair count | Avg combined | Above threshold | Coverage |");
  lines.push("| --- | --- | --- | --- | --- |");

  for (const family of detectorEvaluation.familyCoverage) {
    lines.push(
      `| \`${family.family}\` | ${family.pairCount} | ${family.averageCombined.toFixed(2)} | ${family.matchedCount}/${family.pairCount} | ${family.matchedPct.toFixed(1)}% |`,
    );
  }

  const combinedThreshold = detectorEvaluation.detectors.combined.threshold;
  const falseNegatives = detectorEvaluation.samples
    .filter((sample) => sample.label === "positive" && sample.scores.combined < combinedThreshold)
    .sort((left, right) => left.scores.combined - right.scores.combined)
    .slice(0, 12);
  const falsePositives = detectorEvaluation.samples
    .filter((sample) => sample.label === "negative" && sample.scores.combined >= combinedThreshold)
    .sort((left, right) => right.scores.combined - left.scores.combined)
    .slice(0, 12);

  lines.push("");
  lines.push("## Misses To Review");
  lines.push("");

  if (falseNegatives.length === 0 && falsePositives.length === 0) {
    lines.push("- No labeled misses at the current combined threshold.");
    lines.push("");
    return `${lines.join("\n")}\n`;
  }

  if (falseNegatives.length > 0) {
    lines.push("### False Negatives");
    lines.push("");
    for (const sample of falseNegatives) {
      lines.push(
        `- [ ] \`${sample.leftAuditId}\` vs \`${sample.rightAuditId}\` in \`${sample.family}\` fell below threshold at ${sample.scores.combined.toFixed(2)}; strongest signals: ${summarizeSignalEvidence(sample.scores)}.`,
      );
    }
    lines.push("");
  }

  if (falsePositives.length > 0) {
    lines.push("### False Positives");
    lines.push("");
    for (const sample of falsePositives) {
      lines.push(
        `- [ ] \`${sample.leftAuditId}\` vs \`${sample.rightAuditId}\` crossed threshold at ${sample.scores.combined.toFixed(2)}; strongest signals: ${summarizeSignalEvidence(sample.scores)}.`,
      );
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function renderNearestNeighbors(sectionLookup, nearestNeighbors) {
  const lines = ["# Section Nearest Neighbors", ""];

  for (const entry of nearestNeighbors) {
    const section = sectionLookup.get(entry.auditId);
    const heading = section?.firstHeading ? ` - ${section.firstHeading}` : "";
    lines.push(`## \`${entry.pageName}\` section ${entry.index} (${entry.sectionType})${heading}`);
    lines.push("");

    for (const neighbor of entry.neighbors) {
      const neighborHeading = neighbor.firstHeading ? ` - ${neighbor.firstHeading}` : "";
      lines.push(
        `- [ ] \`${neighbor.pageName}\` section ${neighbor.index} at \`${neighbor.route}\`${neighborHeading}; ensemble ${neighbor.scores.combined.toFixed(2)}; signals: ${summarizeSignalEvidence(neighbor.scores)}.`,
      );
    }

    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function buildComponentNearestNeighbors(components, componentPairScores, count = 5) {
  return components
    .map((component) => {
      const neighbors = components
        .filter((candidate) => candidate.auditId !== component.auditId)
        .map((candidate) => ({
          component,
          candidate,
          scores: getComponentPairScore(componentPairScores, component, candidate),
        }))
        .filter((entry) => entry.scores)
        .sort((left, right) => {
          if (right.scores.combined !== left.scores.combined) {
            return right.scores.combined - left.scores.combined;
          }

          return left.candidate.auditId.localeCompare(right.candidate.auditId);
        })
        .slice(0, count);

      return {
        auditId: component.auditId,
        pageName: component.pageName,
        route: component.route,
        sectionIndex: component.sectionIndex,
        sectionType: component.sectionType,
        componentKind: component.componentKind,
        label: component.label,
        neighbors: neighbors.map((entry) => ({
          auditId: entry.candidate.auditId,
          pageName: entry.candidate.pageName,
          route: entry.candidate.route,
          sectionIndex: entry.candidate.sectionIndex,
          sectionType: entry.candidate.sectionType,
          componentKind: entry.candidate.componentKind,
          label: entry.candidate.label,
          scores: entry.scores,
        })),
      };
    })
    .sort((left, right) => left.auditId.localeCompare(right.auditId));
}

function chooseCanonicalComponent(componentClusters, componentLookup) {
  const canonicalChoices = new Map();

  for (const cluster of componentClusters) {
    const components = cluster.items.map((item) => componentLookup.get(item.auditId)).filter(Boolean);
    const indexComponent = components.find((component) => component.pageName === "index");
    const indexOriginalComponent = components.find((component) => component.pageName === "index_original");
    canonicalChoices.set(
      cluster.id,
      indexComponent || indexOriginalComponent || components[0] || null,
    );
  }

  return canonicalChoices;
}

function renderComponentStyleDeltas(componentClusters, componentLookup) {
  const lines = ["# Component Style Deltas", ""];

  for (const cluster of componentClusters.filter((entry) => entry.items.length > 1)) {
    const components = cluster.items.map((item) => componentLookup.get(item.auditId)).filter(Boolean);
    const deltas = getStyleDeltaSummary(components, (item) => item.rootDecisionStyle);
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

  return `${lines.join("\n")}\n`;
}

function summarizeComponentAlignment(components) {
  const counts = new Map();

  for (const component of components) {
    const key = `${component.pageName} / ${component.sectionType}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([key, count]) => `${key} x${count}`)
    .join("; ");
}

function renderCanonicalAlignment(sectionClusters, componentClusters, sectionLookup, componentLookup) {
  const lines = ["# Canonical Alignment", ""];
  const canonicalPages = new Set(["index", "index_original"]);
  const canonicalSections = chooseCanonicalSection(sectionClusters, sectionLookup);
  const canonicalComponents = chooseCanonicalComponent(componentClusters, componentLookup);

  const sectionRows = sectionClusters.map((cluster) => {
    const sections = cluster.items.map((item) => sectionLookup.get(item.auditId)).filter(Boolean);
    const target = sections.find((section) => section.pageName === "index") || null;
    const stitchPrecedent = sections.find((section) => section.pageName === "index_original") || null;

    return {
      cluster,
      target,
      stitchPrecedent,
      canonical: canonicalSections.get(cluster.id),
      aligned: sections.filter((section) => !canonicalPages.has(section.pageName)),
    };
  });

  const componentRows = componentClusters
    .filter((cluster) => cluster.items.length > 1)
    .map((cluster) => {
      const components = cluster.items.map((item) => componentLookup.get(item.auditId)).filter(Boolean);
      const target = components.find((component) => component.pageName === "index") || null;
      const stitchPrecedent =
        components.find((component) => component.pageName === "index_original") || null;

      return {
        cluster,
        target,
        stitchPrecedent,
        canonical: canonicalComponents.get(cluster.id),
        aligned: components.filter((component) => !canonicalPages.has(component.pageName)),
      };
    });

  lines.push("## Section Families With Home Precedent");
  lines.push("");

  for (const row of sectionRows.filter((entry) => entry.target || entry.stitchPrecedent)) {
    const canonical = row.target || row.stitchPrecedent;
    lines.push(`### ${row.cluster.displayName}`);
    lines.push("");
    lines.push(
      `- Canonical target: \`${canonical.pageName}\` section ${canonical.index}${canonical.firstHeading ? ` (${canonical.firstHeading})` : ""}.`,
    );
    if (row.target && row.stitchPrecedent) {
      lines.push(
        `- Stitch precedent available: \`${row.stitchPrecedent.pageName}\` section ${row.stitchPrecedent.index}.`,
      );
    }
    if (row.aligned.length > 0) {
      lines.push(
        `- Already aligns on other pages: ${row.aligned
          .map((section) => `\`${section.pageName}\` section ${section.index}`)
          .join(", ")}.`,
      );
    } else {
      lines.push("- No non-home sections align yet; this remains a home-only family.");
    }
    lines.push("");
  }

  lines.push("## Section Families Still New");
  lines.push("");

  for (const row of sectionRows.filter((entry) => !entry.target && !entry.stitchPrecedent)) {
    const canonical = row.canonical;
    lines.push(`### ${row.cluster.displayName}`);
    lines.push("");
    lines.push(
      `- No \`index\` precedent detected. Current source of truth: \`${canonical.pageName}\` section ${canonical.index}.`,
    );
    if (row.aligned.length > 1) {
      lines.push(
        `- Shared across: ${row.aligned
          .map((section) => `\`${section.pageName}\` section ${section.index}`)
          .join(", ")}.`,
      );
    } else {
      lines.push("- This is currently page-specific or family-specific and needs a fresh component definition.");
    }
    lines.push("");
  }

  lines.push("## Component Families With Home Precedent");
  lines.push("");

  for (const row of componentRows.filter((entry) => entry.target || entry.stitchPrecedent)) {
    const canonical = row.target || row.stitchPrecedent;
    lines.push(`### ${row.cluster.displayName}`);
    lines.push("");
    lines.push(
      `- Canonical target: \`${canonical.pageName}\` section ${canonical.sectionIndex} \`${canonical.componentKind}\`${canonical.label ? ` - ${canonical.label}` : ""}.`,
    );
    if (row.target && row.stitchPrecedent) {
      lines.push(
        `- Stitch precedent available: \`${row.stitchPrecedent.pageName}\` section ${row.stitchPrecedent.sectionIndex} \`${row.stitchPrecedent.componentKind}\`.`,
      );
    }
    if (row.aligned.length > 0) {
      lines.push(`- Already aligns on other pages: ${summarizeComponentAlignment(row.aligned)}.`);
    } else {
      lines.push("- No non-home components align yet; this remains a home-only primitive.");
    }
    lines.push("");
  }

  lines.push("## Component Families Still New");
  lines.push("");

  for (const row of componentRows.filter((entry) => !entry.target && !entry.stitchPrecedent)) {
    const canonical = row.canonical;
    lines.push(`### ${row.cluster.displayName}`);
    lines.push("");
    lines.push(
      `- No \`index\` precedent detected. Current source of truth: \`${canonical.pageName}\` section ${canonical.sectionIndex} \`${canonical.componentKind}\`${canonical.label ? ` - ${canonical.label}` : ""}.`,
    );
    lines.push(`- Current spread: ${summarizeComponentAlignment(row.aligned)}.`);
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function classifyColorFamily(value) {
  const normalized = normalizeWhitespace(value || "");
  if (!normalized || normalized === "transparent" || normalized === "rgba(0, 0, 0, 0)") {
    return "transparent";
  }

  const numbers = normalized.match(/[\d.]+/g)?.slice(0, 3).map(Number) || [];
  if (numbers.length < 3) {
    return normalized;
  }

  const [r, g, b] = numbers;
  const brightness = r * 0.299 + g * 0.587 + b * 0.114;
  if (brightness < 90) {
    return "dark";
  }
  if (brightness > 215) {
    return "light";
  }
  return "mid";
}

function buildComponentStyleArchetypes(components) {
  const groups = new Map();

  for (const component of components) {
    const style = component.rootDecisionStyle;
    const borderWidth =
      getNumericStyleValue(style, "border-top-width") +
      getNumericStyleValue(style, "border-right-width") +
      getNumericStyleValue(style, "border-bottom-width") +
      getNumericStyleValue(style, "border-left-width");
    const signatureTokens = [
      `fill:${isTransparentBackground(style) ? "transparent" : "filled"}`,
      `bg:${classifyColorFamily(style["background-color"])}`,
      `border:${bucketByThreshold(borderWidth, [
        { max: 0.1, label: "none" },
        { max: 2.1, label: "thin" },
        { max: Number.POSITIVE_INFINITY, label: "heavy" },
      ])}`,
      `radius:${bucketByThreshold(getNumericStyleValue(style, "border-radius"), [
        { max: 0.1, label: "none" },
        { max: 10.1, label: "sm" },
        { max: 20.1, label: "md" },
        { max: Number.POSITIVE_INFINITY, label: "lg" },
      ])}`,
      `shadow:${normalizeWhitespace(style["box-shadow"] || "") !== "none" ? "on" : "off"}`,
      `align:${style["text-align"] === "center" ? "center" : "left"}`,
      `case:${normalizeWhitespace(style["text-transform"] || "") || "none"}`,
      `display:${style.display || "block"}`,
      `fs:${bucketByThreshold(getNumericStyleValue(style, "font-size"), [
        { max: 14.1, label: "sm" },
        { max: 18.1, label: "md" },
        { max: Number.POSITIVE_INFINITY, label: "lg" },
      ])}`,
      `fw:${bucketByThreshold(getNumericStyleValue(style, "font-weight"), [
        { max: 500, label: "regular" },
        { max: 650, label: "medium" },
        { max: Number.POSITIVE_INFINITY, label: "bold" },
      ])}`,
      `px:${bucketByThreshold(
        getNumericStyleValue(style, "padding-left") + getNumericStyleValue(style, "padding-right"),
        [
          { max: 0.1, label: "none" },
          { max: 24.1, label: "sm" },
          { max: 56.1, label: "md" },
          { max: Number.POSITIVE_INFINITY, label: "lg" },
        ],
      )}`,
      `py:${bucketByThreshold(
        getNumericStyleValue(style, "padding-top") + getNumericStyleValue(style, "padding-bottom"),
        [
          { max: 0.1, label: "none" },
          { max: 16.1, label: "sm" },
          { max: 32.1, label: "md" },
          { max: Number.POSITIVE_INFINITY, label: "lg" },
        ],
      )}`,
    ];
    const signature = signatureTokens.join(" | ");
    const group = groups.get(signature) || {
      signature,
      items: [],
      componentKinds: new Map(),
      sectionTypes: new Map(),
    };
    group.items.push(component);
    addCount(group.componentKinds, component.componentKind);
    addCount(group.sectionTypes, component.sectionType);
    groups.set(signature, group);
  }

  return [...groups.values()]
    .sort((left, right) => right.items.length - left.items.length || left.signature.localeCompare(right.signature))
    .map((group, index) => ({
      id: `style-archetype-${index + 1}`,
      signature: group.signature,
      items: group.items,
      componentKinds: sortObjectEntries(Object.fromEntries(group.componentKinds)),
      sectionTypes: sortObjectEntries(Object.fromEntries(group.sectionTypes)),
    }));
}

function renderComponentStyleArchetypes(components) {
  const lines = ["# Component Style Archetypes", ""];
  const archetypes = buildComponentStyleArchetypes(components).filter((entry) => entry.items.length >= 3);

  for (const archetype of archetypes) {
    lines.push(`## ${archetype.id} (${archetype.items.length} instances)`);
    lines.push("");
    lines.push(`- Signature: ${archetype.signature}.`);
    lines.push(
      `- Component kinds: ${Object.entries(archetype.componentKinds)
        .map(([kind, count]) => `\`${kind}\` x${count}`)
        .join(", ")}.`,
    );
    lines.push(
      `- Section types: ${Object.entries(archetype.sectionTypes)
        .map(([kind, count]) => `\`${kind}\` x${count}`)
        .join(", ")}.`,
    );
    lines.push(
      `- Sample instances: ${archetype.items
        .slice(0, 8)
        .map(
          (component) =>
            `\`${component.pageName}\` section ${component.sectionIndex} \`${component.componentKind}\`${component.label ? ` - ${component.label}` : ""}`,
        )
        .join(", ")}.`,
    );
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function getTopSignatureKeys(signatureMap, limit = 8) {
  return Object.entries(signatureMap || {})
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([key]) => key);
}

function renderHomeConversionBlueprint(sectionClusters, componentClusters, sectionLookup, componentLookup) {
  const lines = [
    "# Home Conversion Blueprint",
    "",
    "This report compares the original stitch homepage against the converted homepage and treats that pair as the migration precedent for the remaining stitch pages.",
    "",
  ];

  const pairedHomeSections = sectionClusters
    .map((cluster) => {
      const sections = cluster.items.map((item) => sectionLookup.get(item.auditId)).filter(Boolean);
      const target = sections.find((section) => section.pageName === "index") || null;
      const source = sections.find((section) => section.pageName === "index_original") || null;

      return target && source ? { cluster, target, source } : null;
    })
    .filter(Boolean);

  for (const pair of pairedHomeSections) {
    const styleDeltas = getStyleDeltaSummary([pair.source, pair.target], (item) => item.rootDecisionStyle);
    const sourceUtilityFamilies = getTopSignatureKeys(pair.source.signatures.utilityFamilies);
    const targetCustomClasses = getTopSignatureKeys(pair.target.signatures.customClasses);
    const targetUtilityFamilies = getTopSignatureKeys(pair.target.signatures.utilityFamilies);
    const relatedComponentFamilies = componentClusters
      .map((cluster) => {
        const items = cluster.items.map((item) => componentLookup.get(item.auditId)).filter(Boolean);
        const sourceItems = items.filter(
          (component) =>
            component.pageName === "index_original" && component.sectionAuditId === pair.source.auditId,
        );
        const targetItems = items.filter(
          (component) => component.pageName === "index" && component.sectionAuditId === pair.target.auditId,
        );

        return sourceItems.length > 0 && targetItems.length > 0
          ? {
              displayName: cluster.displayName,
              sourceCount: sourceItems.length,
              targetCount: targetItems.length,
            }
          : null;
      })
      .filter(Boolean)
      .sort(
        (left, right) =>
          right.targetCount + right.sourceCount - (left.targetCount + left.sourceCount) ||
          left.displayName.localeCompare(right.displayName),
      );

    lines.push(`## ${pair.cluster.displayName}`);
    lines.push("");
    lines.push(
      `- Source stitch precedent: \`index_original\` section ${pair.source.index}${pair.source.firstHeading ? ` (${pair.source.firstHeading})` : ""}.`,
    );
    lines.push(
      `- Converted target: \`index\` section ${pair.target.index}${pair.target.firstHeading ? ` (${pair.target.firstHeading})` : ""}.`,
    );
    if (sourceUtilityFamilies.length > 0) {
      lines.push(`- Source utility families to replace: ${sourceUtilityFamilies.join(", ")}.`);
    }
    if (targetCustomClasses.length > 0) {
      lines.push(`- Target custom class namespace already exists: ${targetCustomClasses.join(", ")}.`);
    }
    if (targetUtilityFamilies.length > 0) {
      lines.push(`- Target still relies on these utility families: ${targetUtilityFamilies.join(", ")}.`);
    }
    if (styleDeltas.length > 0) {
      lines.push(
        `- Root style deltas between source and target: ${styleDeltas
          .slice(0, 6)
          .map((delta) => `\`${delta.property}\` (${delta.values.join(" vs ")})`)
          .join(", ")}.`,
      );
    }
    if (relatedComponentFamilies.length > 0) {
      lines.push(
        `- Child primitives already preserved through conversion: ${relatedComponentFamilies
          .map(
            (componentFamily) =>
              `\`${componentFamily.displayName}\` source x${componentFamily.sourceCount} -> target x${componentFamily.targetCount}`,
          )
          .join(", ")}.`,
      );
    }

    if (targetCustomClasses.length > 0 && sourceUtilityFamilies.length > targetUtilityFamilies.length) {
      lines.push(
        "- Suggested migration rule: replace stitch utilities with the existing target component namespace and keep the tokenized styles as the contract.",
      );
    } else if (relatedComponentFamilies.length >= 3) {
      lines.push(
        "- Suggested migration rule: extract the section wrapper and its child primitives together, because the component boundaries already survive the conversion.",
      );
    } else {
      lines.push(
        "- Suggested migration rule: keep the section boundary intact first, then normalize internal utility usage after the outer wrapper is moved to the target pattern.",
      );
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function renderComponentMatrix(componentClusters, componentLookup) {
  const lines = ["# Component Matrix", ""];

  for (const cluster of componentClusters) {
    lines.push(`## ${cluster.displayName} (${cluster.status})`);
    lines.push("");

    for (const item of cluster.items.sort((left, right) => {
      if (left.pageName !== right.pageName) {
        return left.pageName.localeCompare(right.pageName);
      }

      return left.sectionIndex - right.sectionIndex || left.auditId.localeCompare(right.auditId);
    })) {
      const component = componentLookup.get(item.auditId);
      const label = component?.label ? ` - ${component.label}` : "";
      const variantSummary = component?.variantTraits?.length
        ? `; variants: ${component.variantTraits.join(", ")}`
        : "";
      const evidenceSummary = item.representativeScores
        ? `; ensemble: ${item.representativeScores.combined.toFixed(2)}; signals: ${summarizeSignalEvidence(item.representativeScores)}`
        : "";
      lines.push(
        `- [ ] \`${item.pageName}\` section ${item.sectionIndex} \`${item.componentKind}\` in \`${item.sectionType}\`${label}${variantSummary}${evidenceSummary}`,
      );
    }

    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function renderComponentChecklist(componentClusters, componentLookup) {
  const lines = ["# Component Consolidation Checklist", ""];

  for (const cluster of componentClusters) {
    const components = cluster.items.map((item) => componentLookup.get(item.auditId)).filter(Boolean);
    const canonical =
      components.find((component) => component.pageName === "index") ||
      components.find((component) => component.pageName === "index_original") ||
      components[0] ||
      null;
    const styleDeltas = getStyleDeltaSummary(components, (item) => item.rootDecisionStyle);

    lines.push(`## ${cluster.displayName}`);
    lines.push("");
    lines.push(
      `- [ ] Define the canonical \`${cluster.displayName}\` using \`${canonical?.pageName || "unknown"}\` section ${canonical?.sectionIndex || "?"}.`,
    );
    lines.push("- [ ] Decide whether this becomes one shared child component or a variant family.");
    if (canonical?.variantTraits?.length) {
      lines.push(`- [ ] Canonical variant traits: ${canonical.variantTraits.join(", ")}.`);
    }

    if (styleDeltas.length > 0) {
      lines.push("- [ ] Resolve these root-level style decisions:");
      for (const delta of styleDeltas.slice(0, 6)) {
        lines.push(`- [ ] ${delta.property}: ${delta.values.join(" vs ")}`);
      }
    }

    for (const component of components.sort((left, right) => {
      if (left.pageName !== right.pageName) {
        return left.pageName.localeCompare(right.pageName);
      }

      return left.sectionIndex - right.sectionIndex || left.auditId.localeCompare(right.auditId);
    })) {
      const canonicalLabel =
        canonical && canonical.auditId === component.auditId ? " (canonical candidate)" : "";
      const label = component.label ? ` - ${component.label}` : "";
      const variantSummary = component.variantTraits.length
        ? `; variants: ${component.variantTraits.join(", ")}`
        : "";
      lines.push(
        `- [ ] Consolidate \`${component.pageName}\` section ${component.sectionIndex} \`${component.componentKind}\`${label}${canonicalLabel}${variantSummary}.`,
      );
    }

    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function renderComponentAnalysis(detectorEvaluation) {
  const combinedThreshold = detectorEvaluation.detectors.combined.threshold;
  const suppressedFalsePositives = detectorEvaluation.samples.filter(
    (sample) =>
      sample.label === "negative" &&
      !sample.clusterCompatible &&
      sample.scores.combined >= combinedThreshold,
  ).length;
  const lines = [
    "# Component Detector Analysis",
    "",
    `Validation set: ${detectorEvaluation.datasetSize} labeled pairs (${detectorEvaluation.positives} positive, ${detectorEvaluation.negatives} negative).`,
    `Cluster gates suppress ${suppressedFalsePositives} high-scoring negative pairs before they ever reach the primary component matrix.`,
    "",
    "## Detector Calibration",
    "",
    "| Detector | Threshold | Avg + | Avg - | Precision | Recall | F1 | FP | FN |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const [key, summary] of Object.entries(detectorEvaluation.detectors)) {
    lines.push(
      `| \`${key}\` | ${summary.threshold.toFixed(2)} | ${summary.averagePositive.toFixed(2)} | ${summary.averageNegative.toFixed(2)} | ${summary.precision.toFixed(2)} | ${summary.recall.toFixed(2)} | ${summary.f1.toFixed(2)} | ${summary.falsePositive} | ${summary.falseNegative} |`,
    );
  }

  lines.push("");
  lines.push("## Family Coverage");
  lines.push("");
  lines.push("| Family | Pair count | Avg combined | Above threshold | Coverage |");
  lines.push("| --- | --- | --- | --- | --- |");

  for (const family of detectorEvaluation.familyCoverage) {
    lines.push(
      `| \`${family.family}\` | ${family.pairCount} | ${family.averageCombined.toFixed(2)} | ${family.matchedCount}/${family.pairCount} | ${family.matchedPct.toFixed(1)}% |`,
    );
  }

  const falseNegatives = detectorEvaluation.samples
    .filter((sample) => sample.label === "positive" && sample.scores.combined < combinedThreshold)
    .sort((left, right) => left.scores.combined - right.scores.combined)
    .slice(0, 15);
  const falsePositives = detectorEvaluation.samples
    .filter(
      (sample) =>
        sample.label === "negative" &&
        sample.clusterCompatible &&
        sample.scores.combined >= combinedThreshold,
    )
    .sort((left, right) => right.scores.combined - left.scores.combined)
    .slice(0, 15);

  lines.push("");
  lines.push("## Misses To Review");
  lines.push("");

  if (falseNegatives.length === 0 && falsePositives.length === 0) {
    lines.push("- No labeled misses at the current combined threshold.");
    lines.push("");
    return `${lines.join("\n")}\n`;
  }

  if (falseNegatives.length > 0) {
    lines.push("### False Negatives");
    lines.push("");
    for (const sample of falseNegatives) {
      lines.push(
        `- [ ] \`${sample.leftAuditId}\` vs \`${sample.rightAuditId}\` in \`${sample.family}\` fell below threshold at ${sample.scores.combined.toFixed(2)}; strongest signals: ${summarizeSignalEvidence(sample.scores)}.`,
      );
    }
    lines.push("");
  }

  if (falsePositives.length > 0) {
    lines.push("### False Positives");
    lines.push("");
    for (const sample of falsePositives) {
      lines.push(
        `- [ ] \`${sample.leftAuditId}\` vs \`${sample.rightAuditId}\` crossed threshold at ${sample.scores.combined.toFixed(2)}; strongest signals: ${summarizeSignalEvidence(sample.scores)}.`,
      );
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function renderComponentNeighbors(componentLookup, nearestNeighbors) {
  const lines = ["# Component Nearest Neighbors", ""];

  for (const entry of nearestNeighbors) {
    const component = componentLookup.get(entry.auditId);
    const label = component?.label ? ` - ${component.label}` : "";
    lines.push(
      `## \`${entry.pageName}\` section ${entry.sectionIndex} (${entry.componentKind} in ${entry.sectionType})${label}`,
    );
    lines.push("");

    for (const neighbor of entry.neighbors) {
      const neighborLabel = neighbor.label ? ` - ${neighbor.label}` : "";
      lines.push(
        `- [ ] \`${neighbor.pageName}\` section ${neighbor.sectionIndex} \`${neighbor.componentKind}\` in \`${neighbor.sectionType}\`${neighborLabel}; ensemble ${neighbor.scores.combined.toFixed(2)}; signals: ${summarizeSignalEvidence(neighbor.scores)}.`,
      );
    }

    lines.push("");
  }

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
  const primarySectionVisuals = new Map();
  const primaryComponentVisuals = new Map();
  let capturedPrimarySections = [];
  let capturedPrimaryComponents = [];

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
        let nodeIdCount = 0;

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
          const existingNodeId = element.getAttribute("data-audit-node-id");
          const auditNodeId = existingNodeId || `audit-node-${++nodeIdCount}`;
          if (!existingNodeId) {
            element.setAttribute("data-audit-node-id", auditNodeId);
          }
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
            auditNodeId,
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

    if (viewport.name === primaryViewport.name) {
      const primarySectionNodes = findTopLevelSections(snapshot.body);
      let contentIndex = 0;
      capturedPrimarySections = primarySectionNodes.map((sectionNode, index) => {
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
          signatures: computeSectionSignatures(sectionNode, stats, patterns),
        };
      }).map((section) => {
        const sectionType = classifySection(section, {
          pageName: page.pageName,
          family: getPageFamily(page.pageName),
        });

        return {
          ...section,
          sectionType,
          variantTraits: deriveSectionTraits(sectionType, section.nodeSnapshot, section.stats),
        };
      });

      for (const section of capturedPrimarySections) {
        const sectionNode = section.nodeSnapshot;
        try {
          const screenshotBuffer = await browserPage
            .locator(`[data-audit-node-id="${sectionNode.auditNodeId}"]`)
            .first()
            .screenshot({
              animations: "disabled",
            });
          primarySectionVisuals.set(sectionNode.auditNodeId, buildVisualSignature(screenshotBuffer));
        } catch {
          primarySectionVisuals.set(sectionNode.auditNodeId, null);
        }
      }

      capturedPrimaryComponents = capturedPrimarySections.flatMap((section) =>
        buildComponentCandidates(section.nodeSnapshot, {
          auditId: section.auditId,
          pageName: section.pageName,
          route: section.route,
          index: section.index,
          sectionType: section.sectionType,
        }),
      );

      for (const component of capturedPrimaryComponents) {
        try {
          const screenshotBuffer = await browserPage
            .locator(`[data-audit-node-id="${component.auditNodeId}"]`)
            .first()
            .screenshot({
              animations: "disabled",
            });
          primaryComponentVisuals.set(component.auditNodeId, buildVisualSignature(screenshotBuffer));
        } catch {
          primaryComponentVisuals.set(component.auditNodeId, null);
        }
      }
    }

    await browserPage.close();
    audit.viewports.push({
      name: viewport.name,
      width: viewport.width,
      height: viewport.height,
      ...snapshot,
    });
  }

  audit.primarySections = capturedPrimarySections.map((section) => {
    const { nodeSnapshot, ...serializableSection } = section;
    return {
      ...serializableSection,
      visualSignature: primarySectionVisuals.get(nodeSnapshot.auditNodeId) || null,
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
  audit.components = capturedPrimaryComponents.map((component) => {
    const { nodeSnapshot, ...serializableComponent } = component;
    return {
      ...serializableComponent,
      visualSignature: primaryComponentVisuals.get(component.auditNodeId) || null,
    };
  });

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
    const allSections = pageAudits.flatMap((page) => page.primarySections);
    const allComponents = pageAudits.flatMap((page) => page.components || []);
    const sectionLookup = new Map(allSections.map((section) => [section.auditId, section]));
    const componentLookup = new Map(allComponents.map((component) => [component.auditId, component]));
    const sectionPairScores = buildSectionPairScores(allSections);
    const componentPairScores = buildComponentPairScores(allComponents);
    const detectorEvaluation = evaluateDetectors(sectionPairScores, sectionLookup);
    const componentDetectorEvaluation = evaluateComponentDetectors(
      componentPairScores,
      componentLookup,
    );
    const sectionClusters = buildSectionClusters(allSections, sectionPairScores, detectorEvaluation);
    const componentClusters = buildComponentClusters(
      allComponents,
      componentPairScores,
      componentDetectorEvaluation,
    );
    const patternClusters = buildPatternClusters(pageAudits.flatMap((page) => page.patterns));
    const nearestNeighbors = buildNearestNeighbors(allSections, sectionPairScores);
    const componentNearestNeighbors = buildComponentNearestNeighbors(
      allComponents,
      componentPairScores,
    );
    const componentStyleArchetypes = buildComponentStyleArchetypes(allComponents).filter(
      (entry) => entry.items.length >= 3,
    );
    const componentCombinedThreshold = componentDetectorEvaluation.detectors.combined.threshold;
    const retainedComponentPairs = componentPairScores.rows
      .filter((pair) => {
        const left = componentLookup.get(pair.leftAuditId);
        const right = componentLookup.get(pair.rightAuditId);
        return (
          left &&
          right &&
          canComponentsShareCluster(left, right) &&
          pair.combined >= Math.max(componentCombinedThreshold - 0.08, 0.38)
        );
      })
      .sort((left, right) => {
        if (right.combined !== left.combined) {
          return right.combined - left.combined;
        }

        return getPairKey(left.leftAuditId, left.rightAuditId).localeCompare(
          getPairKey(right.leftAuditId, right.rightAuditId),
        );
      });

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
        components: page.components.map((component) => ({
          auditId: component.auditId,
          sectionAuditId: component.sectionAuditId,
          sectionIndex: component.sectionIndex,
          sectionType: component.sectionType,
          componentKind: component.componentKind,
          label: component.label,
          path: component.path,
          source: component.source,
          parentPath: component.parentPath,
        })),
      })),
      sectionClusters,
      componentClusters,
      patternClusters,
      detectorEvaluation: {
        datasetSize: detectorEvaluation.datasetSize,
        positives: detectorEvaluation.positives,
        negatives: detectorEvaluation.negatives,
        detectors: detectorEvaluation.detectors,
        familyCoverage: detectorEvaluation.familyCoverage,
      },
      componentDetectorEvaluation: {
        datasetSize: componentDetectorEvaluation.datasetSize,
        positives: componentDetectorEvaluation.positives,
        negatives: componentDetectorEvaluation.negatives,
        detectors: componentDetectorEvaluation.detectors,
        familyCoverage: componentDetectorEvaluation.familyCoverage,
      },
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
    writeFileSync(
      join(rawDir, "section-similarity.json"),
      JSON.stringify(
        {
          generatedAt: manifest.generatedAt,
          detectorWeights: similarityDetectorWeights,
          detectorEvaluation,
          nearestNeighbors,
          pairs: sectionPairScores.rows,
        },
        null,
        2,
      ),
    );
    writeFileSync(
      join(rawDir, "component-similarity.json"),
      JSON.stringify(
        {
          generatedAt: manifest.generatedAt,
          detectorWeights: componentSimilarityWeights,
          detectorEvaluation: componentDetectorEvaluation,
          nearestNeighbors: componentNearestNeighbors,
          pairCount: componentPairScores.rows.length,
          retainedPairCount: retainedComponentPairs.length,
          retainedPairThreshold: Math.max(componentCombinedThreshold - 0.08, 0.38),
          pairs: retainedComponentPairs,
        },
        null,
        2,
      ),
    );
    writeFileSync(
      join(rawDir, "style-archetypes.json"),
      JSON.stringify(
        {
          generatedAt: manifest.generatedAt,
          archetypes: componentStyleArchetypes.map((archetype) => ({
            id: archetype.id,
            signature: archetype.signature,
            componentKinds: archetype.componentKinds,
            sectionTypes: archetype.sectionTypes,
            items: archetype.items.map((component) => ({
              auditId: component.auditId,
              pageName: component.pageName,
              route: component.route,
              sectionAuditId: component.sectionAuditId,
              sectionIndex: component.sectionIndex,
              sectionType: component.sectionType,
              componentKind: component.componentKind,
              label: component.label,
              path: component.path,
              variantTraits: component.variantTraits,
              rootClasses: component.rootClasses,
            })),
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
    writeFileSync(
      join(outputDir, "06-similarity-detectors.md"),
      renderSimilarityAnalysis(detectorEvaluation),
    );
    writeFileSync(
      join(outputDir, "07-section-neighbors.md"),
      renderNearestNeighbors(sectionLookup, nearestNeighbors),
    );
    writeFileSync(
      join(outputDir, "09-component-matrix.md"),
      renderComponentMatrix(componentClusters, componentLookup),
    );
    writeFileSync(
      join(outputDir, "10-component-checklist.md"),
      renderComponentChecklist(componentClusters, componentLookup),
    );
    writeFileSync(
      join(outputDir, "11-component-detectors.md"),
      renderComponentAnalysis(componentDetectorEvaluation),
    );
    writeFileSync(
      join(outputDir, "12-component-neighbors.md"),
      renderComponentNeighbors(componentLookup, componentNearestNeighbors),
    );
    writeFileSync(
      join(outputDir, "14-component-style-deltas.md"),
      renderComponentStyleDeltas(componentClusters, componentLookup),
    );
    writeFileSync(
      join(outputDir, "15-canonical-alignment.md"),
      renderCanonicalAlignment(sectionClusters, componentClusters, sectionLookup, componentLookup),
    );
    writeFileSync(
      join(outputDir, "16-style-archetypes.md"),
      renderComponentStyleArchetypes(allComponents),
    );
    writeFileSync(
      join(outputDir, "17-home-conversion-blueprint.md"),
      renderHomeConversionBlueprint(sectionClusters, componentClusters, sectionLookup, componentLookup),
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
