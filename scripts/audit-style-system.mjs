import { readFileSync } from "node:fs";

const rootFontSizePx = 16;
const defaultExampleLimit = 4;
const tokenGroupWeights = {
  color: ["color"],
  shadow: ["shadow"],
  space: ["space", "padding", "gutter", "container"],
  size: ["size", "container", "hero", "height", "width", "max", "min"],
  type: ["type", "font", "tracking", "leading"],
  radius: ["radius"],
  border: ["border"],
  layer: ["z"],
  effect: ["outline", "focus", "opacity"],
};
const valueKindOrder = ["color", "shadow", "length", "number", "font-family", "image", "keyword"];
const actionablePropertyPatterns = [
  /^background-(color|image|position|repeat|size)$/,
  /^color$/,
  /^border-/,
  /^box-shadow$/,
  /^text-shadow$/,
  /^font-(family|size|style|weight)$/,
  /^line-height$/,
  /^letter-spacing$/,
  /^text-(align|transform|wrap|indent|underline-offset|decoration-thickness)$/,
  /^padding-/,
  /^margin-/,
  /^gap$/,
  /^row-gap$/,
  /^column-gap$/,
  /^width$/,
  /^height$/,
  /^min-/,
  /^max-/,
  /^block-size$/,
  /^inline-size$/,
  /^display$/,
  /^position$/,
  /^top$/,
  /^right$/,
  /^bottom$/,
  /^left$/,
  /^flex-/,
  /^grid-/,
  /^justify-/,
  /^align-/,
  /^place-/,
  /^overflow/,
  /^object-fit$/,
  /^aspect-ratio$/,
  /^opacity$/,
  /^z-index$/,
  /^transform$/,
  /^transform-origin$/,
  /^transition-/,
  /^filter$/,
  /^backdrop-filter$/,
  /^outline-(color|offset|style|width)$/,
];
const neutralKeywordValues = new Set([
  "",
  "(empty)",
  "\"en\"",
  "add",
  "anchors-visible",
  "auto",
  "baseline",
  "block",
  "content-box",
  "currentcolor",
  "en",
  "fill",
  "none",
  "normal",
  "running",
  "start",
  "stretch",
  "transparent",
  "visible",
]);

function normalizeWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
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

function round(value, decimals = 2) {
  if (!Number.isFinite(value)) {
    return value;
  }

  const precision = 10 ** decimals;
  return Math.round(value * precision) / precision;
}

function collectNodes(node, visit) {
  visit(node);
  for (const child of node.children || []) {
    collectNodes(child, visit);
  }
}

function matchesPathPrefix(path, candidateRootPath) {
  return path === candidateRootPath || path.startsWith(`${candidateRootPath} > `);
}

function buildFamilyLookup(clusters, kindKey) {
  const lookup = new Map();

  for (const cluster of clusters || []) {
    for (const item of cluster.items || []) {
      lookup.set(item.auditId, {
        id: cluster.id,
        displayName: cluster.displayName,
        status: cluster.status,
        kind: cluster[kindKey],
      });
    }
  }

  return lookup;
}

function inferSemanticGroup(property) {
  const normalizedProperty = normalizeWhitespace(property).toLowerCase();

  if (
    normalizedProperty.startsWith("font") ||
    normalizedProperty.startsWith("line-") ||
    normalizedProperty.startsWith("letter-") ||
    normalizedProperty.startsWith("text-") ||
    normalizedProperty.startsWith("word-") ||
    normalizedProperty === "white-space"
  ) {
    return "type";
  }

  if (
    normalizedProperty.includes("color") ||
    ["fill", "stroke", "caret-color", "accent-color"].includes(normalizedProperty)
  ) {
    return "color";
  }

  if (normalizedProperty.includes("shadow")) {
    return "shadow";
  }

  if (
    normalizedProperty.includes("padding") ||
    normalizedProperty.includes("margin") ||
    normalizedProperty.includes("gap") ||
    normalizedProperty === "top" ||
    normalizedProperty === "right" ||
    normalizedProperty === "bottom" ||
    normalizedProperty === "left" ||
    normalizedProperty.startsWith("inset")
  ) {
    return "space";
  }

  if (
    normalizedProperty.includes("border") ||
    normalizedProperty.includes("outline") ||
    normalizedProperty.includes("column-rule")
  ) {
    return "border";
  }

  if (
    normalizedProperty.includes("width") ||
    normalizedProperty.includes("height") ||
    normalizedProperty.includes("size") ||
    normalizedProperty.includes("basis")
  ) {
    return "size";
  }

  if (normalizedProperty.includes("radius")) {
    return "radius";
  }

  if (
    normalizedProperty === "display" ||
    normalizedProperty === "position" ||
    normalizedProperty.startsWith("flex") ||
    normalizedProperty.startsWith("grid") ||
    normalizedProperty.startsWith("justify") ||
    normalizedProperty.startsWith("align") ||
    normalizedProperty.startsWith("place") ||
    normalizedProperty.startsWith("overflow") ||
    normalizedProperty === "object-fit" ||
    normalizedProperty === "aspect-ratio"
  ) {
    return "layout";
  }

  if (normalizedProperty === "z-index") {
    return "layer";
  }

  if (
    normalizedProperty === "opacity" ||
    normalizedProperty.includes("filter") ||
    normalizedProperty.startsWith("transform") ||
    normalizedProperty.startsWith("transition") ||
    normalizedProperty.startsWith("animation")
  ) {
    return "effect";
  }

  if (normalizedProperty.includes("image")) {
    return "image";
  }

  return "misc";
}

function isActionablePropertyName(property) {
  const normalizedProperty = normalizeWhitespace(property).toLowerCase();

  if (!normalizedProperty) {
    return false;
  }

  if (normalizedProperty.startsWith("--") || normalizedProperty.startsWith("-webkit-")) {
    return false;
  }

  if (
    normalizedProperty.startsWith("border-image-") ||
    [
      "background-attachment",
      "background-blend-mode",
      "background-clip",
      "background-origin",
      "border-collapse",
      "font-stretch",
      "overflow-anchor",
      "overflow-clip-margin",
      "overflow-wrap",
      "transform-origin",
    ].includes(normalizedProperty)
  ) {
    return false;
  }

  return actionablePropertyPatterns.some((pattern) => pattern.test(normalizedProperty));
}

function isGridDisplay(profile) {
  const display = normalizeWhitespace(profile?.display || "").toLowerCase();
  return display === "grid" || display === "inline-grid";
}

function isFlexDisplay(profile) {
  const display = normalizeWhitespace(profile?.display || "").toLowerCase();
  return display === "flex" || display === "inline-flex";
}

function isPositioned(profile) {
  const position = normalizeWhitespace(profile?.position || "").toLowerCase();
  return ["relative", "absolute", "fixed", "sticky"].includes(position);
}

function hasBackgroundImage(profile) {
  const backgroundImage = normalizeWhitespace(profile?.["background-image"] || "").toLowerCase();
  return Boolean(backgroundImage) && backgroundImage !== "none";
}

function hasVisibleOutline(profile) {
  const outlineWidth = normalizeWhitespace(profile?.["outline-width"] || "").toLowerCase();
  const outlineStyle = normalizeWhitespace(profile?.["outline-style"] || "").toLowerCase();
  return !["", "0", "0px"].includes(outlineWidth) && outlineStyle !== "none";
}

function isTransparentColorValue(value) {
  const normalized = normalizeWhitespace(value).toLowerCase();
  return !normalized || normalized === "transparent" || normalized === "rgba(0, 0, 0, 0)";
}

function splitLayers(value) {
  return normalizeWhitespace(value)
    .split(/\s*,\s*/)
    .map((layer) => layer.trim().toLowerCase())
    .filter(Boolean);
}

function layersMatch(value, predicate) {
  const layers = splitLayers(value);
  return layers.length > 0 && layers.every(predicate);
}

function getRelatedBorderWidth(property, profile) {
  if (property.includes("top")) {
    return normalizeWhitespace(profile?.["border-top-width"] || "");
  }

  if (property.includes("right") || property.includes("inline-end")) {
    return normalizeWhitespace(profile?.["border-right-width"] || "");
  }

  if (property.includes("bottom") || property.includes("block-end")) {
    return normalizeWhitespace(profile?.["border-bottom-width"] || "");
  }

  if (property.includes("left") || property.includes("inline-start")) {
    return normalizeWhitespace(profile?.["border-left-width"] || "");
  }

  return "";
}

function isMaterialPropertyValue(property, rawValue, profile) {
  const normalizedProperty = normalizeWhitespace(property).toLowerCase();
  const normalizedValue = normalizeWhitespace(rawValue).toLowerCase();

  if (!normalizedValue) {
    return false;
  }

  if (normalizedProperty === "display") {
    return !["block", "inline", "inline-block", "table", "table-row", "table-cell", "list-item"].includes(
      normalizedValue,
    );
  }

  if (normalizedProperty === "position") {
    return normalizedValue !== "static";
  }

  if (["top", "right", "bottom", "left"].includes(normalizedProperty)) {
    return isPositioned(profile) && normalizedValue !== "auto";
  }

  if (normalizedProperty === "z-index") {
    return normalizedValue !== "auto";
  }

  if (normalizedProperty.startsWith("grid-")) {
    if (!isGridDisplay(profile)) {
      return false;
    }

    if (
      ["grid-template-columns", "grid-template-rows", "grid-auto-columns", "grid-auto-rows"].includes(
        normalizedProperty,
      )
    ) {
      return !["none", "auto"].includes(normalizedValue);
    }

    if (["grid-auto-flow"].includes(normalizedProperty)) {
      return normalizedValue !== "row";
    }

    return normalizedValue !== "auto";
  }

  if (["gap", "row-gap", "column-gap"].includes(normalizedProperty)) {
    return (isGridDisplay(profile) || isFlexDisplay(profile)) && !["normal", "0px", "0"].includes(normalizedValue);
  }

  if (normalizedProperty.startsWith("flex-")) {
    if (!isFlexDisplay(profile)) {
      return false;
    }

    if (normalizedProperty === "flex-direction") {
      return normalizedValue !== "row";
    }

    if (normalizedProperty === "flex-wrap") {
      return normalizedValue !== "nowrap";
    }

    if (normalizedProperty === "flex-grow") {
      return normalizedValue !== "0";
    }

    if (normalizedProperty === "flex-shrink") {
      return normalizedValue !== "1";
    }

    if (normalizedProperty === "flex-basis") {
      return normalizedValue !== "auto";
    }
  }

  if (
    normalizedProperty.startsWith("justify-") ||
    normalizedProperty.startsWith("align-") ||
    normalizedProperty.startsWith("place-")
  ) {
    if (!(isGridDisplay(profile) || isFlexDisplay(profile))) {
      return false;
    }

    return !["normal", "stretch", "start", "auto"].includes(normalizedValue);
  }

  if (normalizedProperty === "background-color") {
    return !isTransparentColorValue(normalizedValue);
  }

  if (normalizedProperty === "background-image") {
    return normalizedValue !== "none";
  }

  if (normalizedProperty === "background-position") {
    return (
      hasBackgroundImage(profile) &&
      !layersMatch(normalizedValue, (layer) => ["0% 0%", "0px 0px", "left top"].includes(layer))
    );
  }

  if (normalizedProperty === "background-repeat") {
    return hasBackgroundImage(profile) && !layersMatch(normalizedValue, (layer) => layer === "repeat");
  }

  if (normalizedProperty === "background-size") {
    return hasBackgroundImage(profile) && !layersMatch(normalizedValue, (layer) => ["auto", "auto auto"].includes(layer));
  }

  if (normalizedProperty === "box-shadow" || normalizedProperty === "text-shadow") {
    return normalizedValue !== "none" && normalizedValue !== "0px 0px 0px 0px rgba(0, 0, 0, 0)";
  }

  if (normalizedProperty.startsWith("border-") && normalizedProperty.endsWith("-width")) {
    return normalizedValue !== "0px" && normalizedValue !== "0";
  }

  if (normalizedProperty.startsWith("border-") && normalizedProperty.endsWith("-style")) {
    const width = getRelatedBorderWidth(normalizedProperty, profile);
    return !["", "0", "0px"].includes(width) && normalizedValue !== "none";
  }

  if (normalizedProperty.startsWith("border-") && normalizedProperty.endsWith("-color")) {
    const width = getRelatedBorderWidth(normalizedProperty, profile);
    return !["", "0", "0px"].includes(width) && !isTransparentColorValue(normalizedValue);
  }

  if (normalizedProperty.includes("radius")) {
    return !["0", "0px"].includes(normalizedValue);
  }

  if (
    [
      "width",
      "height",
      "min-width",
      "min-height",
      "max-width",
      "max-height",
      "block-size",
      "inline-size",
      "min-block-size",
      "min-inline-size",
      "max-block-size",
      "max-inline-size",
    ].includes(normalizedProperty)
  ) {
    return !["auto", "none", "normal", "0", "0px"].includes(normalizedValue);
  }

  if (normalizedProperty === "aspect-ratio") {
    return normalizedValue !== "auto";
  }

  if (normalizedProperty.startsWith("margin-")) {
    return normalizedValue !== "0px" && normalizedValue !== "0";
  }

  if (normalizedProperty.startsWith("padding-")) {
    return normalizedValue !== "0px" && normalizedValue !== "0";
  }

  if (normalizedProperty === "font-weight") {
    return !["400", "normal"].includes(normalizedValue);
  }

  if (normalizedProperty === "font-style") {
    return normalizedValue !== "normal";
  }

  if (normalizedProperty === "line-height") {
    return normalizedValue !== "normal";
  }

  if (normalizedProperty === "letter-spacing") {
    return normalizedValue !== "normal" && normalizedValue !== "0px" && normalizedValue !== "0";
  }

  if (normalizedProperty === "text-align") {
    return !["start", "left"].includes(normalizedValue);
  }

  if (normalizedProperty === "text-transform") {
    return normalizedValue !== "none";
  }

  if (normalizedProperty === "text-indent") {
    return normalizedValue !== "0px" && normalizedValue !== "0";
  }

  if (normalizedProperty.startsWith("overflow")) {
    return !["visible", "clip"].includes(normalizedValue);
  }

  if (normalizedProperty === "object-fit") {
    return normalizedValue !== "fill";
  }

  if (normalizedProperty === "opacity") {
    return normalizedValue !== "1";
  }

  if (normalizedProperty === "transform" || normalizedProperty === "filter" || normalizedProperty === "backdrop-filter") {
    return normalizedValue !== "none";
  }

  if (normalizedProperty === "grid-template-areas") {
    return normalizedValue !== "none";
  }

  if (normalizedProperty.startsWith("transition-")) {
    return !["0s", "all", "ease", "normal"].includes(normalizedValue);
  }

  if (normalizedProperty.startsWith("outline-")) {
    if (!hasVisibleOutline(profile)) {
      return false;
    }

    if (normalizedProperty.endsWith("-width")) {
      return normalizedValue !== "0px" && normalizedValue !== "0";
    }

    if (normalizedProperty.endsWith("-style")) {
      return normalizedValue !== "none";
    }

    if (normalizedProperty.endsWith("-color")) {
      return !isTransparentColorValue(normalizedValue);
    }

    if (normalizedProperty.endsWith("-offset")) {
      return normalizedValue !== "0px" && normalizedValue !== "0";
    }
  }

  return true;
}

function parseLengthValue(value) {
  const normalized = normalizeWhitespace(value).toLowerCase();
  const match = normalized.match(/^(-?\d*\.?\d+)(px|rem|em|%)$/);
  if (!match) {
    return null;
  }

  const amount = Number.parseFloat(match[1]);
  const unit = match[2];

  if (unit === "px") {
    return { amount, unit: "px", normalized: `${round(amount, 2)}px` };
  }

  if (unit === "rem" || unit === "em") {
    const px = amount * rootFontSizePx;
    return { amount: px, unit: "px", normalized: `${round(px, 2)}px`, sourceUnit: unit };
  }

  return { amount, unit, normalized: `${round(amount, 2)}${unit}` };
}

function parseNumberValue(value) {
  const normalized = normalizeWhitespace(value).toLowerCase();
  if (!/^-?\d*\.?\d+$/.test(normalized)) {
    return null;
  }

  return { amount: Number.parseFloat(normalized), normalized: `${round(Number.parseFloat(normalized), 3)}` };
}

function hslToRgb(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const sat = Math.max(0, Math.min(1, s));
  const light = Math.max(0, Math.min(1, l));
  const chroma = (1 - Math.abs(2 * light - 1)) * sat;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - chroma / 2;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (hue < 60) {
    red = chroma;
    green = x;
  } else if (hue < 120) {
    red = x;
    green = chroma;
  } else if (hue < 180) {
    green = chroma;
    blue = x;
  } else if (hue < 240) {
    green = x;
    blue = chroma;
  } else if (hue < 300) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  return {
    r: Math.round((red + m) * 255),
    g: Math.round((green + m) * 255),
    b: Math.round((blue + m) * 255),
  };
}

function formatColor({ r, g, b, a = 1 }) {
  if (a < 1) {
    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${round(a, 3)})`;
  }

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

function parseRgbParts(source) {
  const normalized = normalizeWhitespace(source);
  if (!normalized) {
    return [];
  }

  if (normalized.includes(",")) {
    return normalized
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  return normalized
    .replace(/\s*\/\s*/g, " / ")
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseColorValue(value) {
  const normalized = normalizeWhitespace(value).toLowerCase();
  if (!normalized || normalized === "transparent") {
    return null;
  }

  const rgbMatch = normalized.match(/^rgba?\((.+)\)$/);
  if (rgbMatch) {
    const parts = parseRgbParts(rgbMatch[1]);
    const slashIndex = parts.indexOf("/");
    const rgbParts = slashIndex === -1 ? parts : parts.slice(0, slashIndex);
    const alphaParts = slashIndex === -1 ? [] : parts.slice(slashIndex + 1);
    const [r = 0, g = 0, b = 0] = rgbParts.map((part) => Number.parseFloat(part) || 0);
    const a = alphaParts.length > 0 ? Number.parseFloat(alphaParts[0]) || 0 : parts[3] ? Number.parseFloat(parts[3]) || 0 : 1;
    return {
      kind: "color",
      r,
      g,
      b,
      a,
      normalized: formatColor({ r, g, b, a }),
    };
  }

  const hexMatch = normalized.match(/^#([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    const valueText = hexMatch[1];
    const chunk =
      valueText.length <= 4
        ? valueText.split("").map((part) => part + part)
        : valueText.match(/.{1,2}/g) || [];
    const [r = "00", g = "00", b = "00", a = "ff"] = chunk;
    const alpha = round(Number.parseInt(a, 16) / 255, 3);
    return {
      kind: "color",
      r: Number.parseInt(r, 16),
      g: Number.parseInt(g, 16),
      b: Number.parseInt(b, 16),
      a: alpha,
      normalized: formatColor({
        r: Number.parseInt(r, 16),
        g: Number.parseInt(g, 16),
        b: Number.parseInt(b, 16),
        a: alpha,
      }),
    };
  }

  const hslMatch = normalized.match(/^hsla?\((.+)\)$/);
  if (hslMatch) {
    const parts = parseRgbParts(hslMatch[1]);
    const slashIndex = parts.indexOf("/");
    const hslParts = slashIndex === -1 ? parts : parts.slice(0, slashIndex);
    const alphaParts = slashIndex === -1 ? [] : parts.slice(slashIndex + 1);
    const hue = Number.parseFloat(hslParts[0]) || 0;
    const sat = (Number.parseFloat(hslParts[1]) || 0) / 100;
    const light = (Number.parseFloat(hslParts[2]) || 0) / 100;
    const alpha = alphaParts.length > 0 ? Number.parseFloat(alphaParts[0]) || 0 : parts[3] ? Number.parseFloat(parts[3]) || 0 : 1;
    const rgb = hslToRgb(hue, sat, light);
    return {
      kind: "color",
      ...rgb,
      a: alpha,
      normalized: formatColor({ ...rgb, a: alpha }),
    };
  }

  return null;
}

function normalizeFontFamily(value) {
  return normalizeWhitespace(value)
    .split(",")[0]
    .replace(/["']/g, "")
    .trim()
    .toLowerCase();
}

function normalizeShadowValue(value) {
  const normalized = normalizeWhitespace(value);
  if (!normalized || normalized.toLowerCase() === "none") {
    return {
      kind: "shadow",
      normalized: "none",
      offsetX: 0,
      offsetY: 0,
      blur: 0,
      spread: 0,
      color: null,
    };
  }

  const colorMatch = normalized.match(/(rgba?\([^)]+\)|hsla?\([^)]+\)|#[0-9a-f]{3,8})/i);
  const color = colorMatch ? parseColorValue(colorMatch[1]) : null;
  const numberMatches = [...normalized.matchAll(/(-?\d*\.?\d+)(px|rem|em)/gi)].map((match) => {
    const length = parseLengthValue(`${match[1]}${match[2]}`);
    return length ? length.amount : 0;
  });

  return {
    kind: "shadow",
    normalized: [
      `${round(numberMatches[0] || 0, 2)}px`,
      `${round(numberMatches[1] || 0, 2)}px`,
      `${round(numberMatches[2] || 0, 2)}px`,
      `${round(numberMatches[3] || 0, 2)}px`,
      color?.normalized || "currentcolor",
    ].join(" "),
    offsetX: numberMatches[0] || 0,
    offsetY: numberMatches[1] || 0,
    blur: numberMatches[2] || 0,
    spread: numberMatches[3] || 0,
    color,
  };
}

function analyzeValue(property, rawValue, tokenName = "") {
  const normalizedRaw = normalizeWhitespace(rawValue);
  const semanticGroup = inferSemanticGroup(property || tokenName);

  if (!normalizedRaw) {
    return {
      kind: "keyword",
      semanticGroup,
      normalized: "",
      displayValue: "(empty)",
      metric: null,
    };
  }

  if (property === "font-family" || tokenName.includes("font")) {
    return {
      kind: "font-family",
      semanticGroup: "type",
      normalized: normalizeFontFamily(normalizedRaw),
      displayValue: normalizeFontFamily(normalizedRaw),
      metric: null,
    };
  }

  if (property.includes("shadow") || tokenName.includes("shadow")) {
    const shadow = normalizeShadowValue(normalizedRaw);
    return {
      kind: "shadow",
      semanticGroup: "shadow",
      normalized: shadow.normalized,
      displayValue: shadow.normalized,
      metric: shadow,
    };
  }

  const color = parseColorValue(normalizedRaw);
  if (
    color &&
    (semanticGroup === "color" ||
      tokenName.includes("color") ||
      tokenName.includes("accent") ||
      tokenName.includes("overlay"))
  ) {
    return {
      kind: "color",
      semanticGroup: "color",
      normalized: color.normalized,
      displayValue: color.normalized,
      metric: color,
    };
  }

  const length = parseLengthValue(normalizedRaw);
  if (length) {
    return {
      kind: "length",
      semanticGroup,
      normalized: length.normalized,
      displayValue: length.normalized,
      metric: length,
    };
  }

  const number = parseNumberValue(normalizedRaw);
  if (number) {
    return {
      kind: "number",
      semanticGroup,
      normalized: number.normalized,
      displayValue: number.normalized,
      metric: number,
    };
  }

  if (semanticGroup === "image") {
    return {
      kind: "image",
      semanticGroup,
      normalized: normalizedRaw.toLowerCase(),
      displayValue: normalizedRaw,
      metric: null,
    };
  }

  return {
    kind: "keyword",
    semanticGroup,
    normalized: normalizedRaw.toLowerCase(),
    displayValue: normalizedRaw.toLowerCase(),
    metric: null,
  };
}

function isNeutralAnalysis(property, analysis) {
  if (!analysis) {
    return true;
  }

  if (analysis.kind === "keyword") {
    return neutralKeywordValues.has(analysis.normalized);
  }

  if (analysis.kind === "shadow") {
    return analysis.normalized === "none" || analysis.normalized === "0px 0px 0px 0px rgba(0, 0, 0, 0)";
  }

  if (analysis.kind === "length") {
    return analysis.normalized === "0px";
  }

  if (analysis.kind === "number") {
    if (property === "opacity") {
      return false;
    }

    return analysis.normalized === "0" || analysis.normalized === "1";
  }

  if (analysis.kind === "color") {
    return analysis.normalized === "rgba(0, 0, 0, 0)";
  }

  return false;
}

function getDistance(left, right) {
  if (!left || !right || left.kind !== right.kind) {
    return Number.POSITIVE_INFINITY;
  }

  if (left.kind === "color") {
    if (!left.metric || !right.metric) {
      return left.normalized === right.normalized ? 0 : Number.POSITIVE_INFINITY;
    }

    if (Math.abs((left.metric?.a || 1) - (right.metric?.a || 1)) > 0.15) {
      return Number.POSITIVE_INFINITY;
    }

    const alphaDiff = Math.abs((left.metric?.a || 1) - (right.metric?.a || 1)) * 255;
    return Math.sqrt(
      (left.metric.r - right.metric.r) ** 2 +
        (left.metric.g - right.metric.g) ** 2 +
        (left.metric.b - right.metric.b) ** 2 +
        alphaDiff ** 2,
    );
  }

  if (left.kind === "length") {
    return Math.abs((left.metric?.amount || 0) - (right.metric?.amount || 0));
  }

  if (left.kind === "number") {
    return Math.abs((left.metric?.amount || 0) - (right.metric?.amount || 0));
  }

  if (left.kind === "shadow") {
    const leftIsNeutral = left.normalized === "none" || left.normalized === "0px 0px 0px 0px rgba(0, 0, 0, 0)";
    const rightIsNeutral =
      right.normalized === "none" || right.normalized === "0px 0px 0px 0px rgba(0, 0, 0, 0)";
    if (leftIsNeutral || rightIsNeutral) {
      return left.normalized === right.normalized ? 0 : Number.POSITIVE_INFINITY;
    }

    const colorDistance =
      left.metric?.color && right.metric?.color
        ? getDistance(
            {
              kind: "color",
              metric: left.metric.color,
            },
            {
              kind: "color",
              metric: right.metric.color,
            },
          )
        : 0;
    return (
      Math.abs((left.metric?.offsetX || 0) - (right.metric?.offsetX || 0)) +
      Math.abs((left.metric?.offsetY || 0) - (right.metric?.offsetY || 0)) +
      Math.abs((left.metric?.blur || 0) - (right.metric?.blur || 0)) +
      Math.abs((left.metric?.spread || 0) - (right.metric?.spread || 0)) +
      colorDistance / 20
    );
  }

  return left.normalized === right.normalized ? 0 : Number.POSITIVE_INFINITY;
}

function isTokenCandidateGroup(group) {
  if (!group || group.neutral) {
    return false;
  }

  if (group.kind === "keyword" || group.kind === "image") {
    return false;
  }

  if (group.kind === "length") {
    return !["100%", "auto"].includes(group.normalizedValue);
  }

  if (group.kind === "number") {
    return ["type", "layer", "effect"].includes(group.semanticGroup);
  }

  if (group.kind === "font-family") {
    return true;
  }

  return ["color", "shadow"].includes(group.kind);
}

function getDistanceThreshold(kind, semanticGroup, property) {
  if (kind === "color") {
    return 26;
  }

  if (kind === "length") {
    if (semanticGroup === "radius" || property.includes("border-width")) {
      return 1.5;
    }

    if (semanticGroup === "type" && property === "letter-spacing") {
      return 0.35;
    }

    if (semanticGroup === "type") {
      return 2.5;
    }

    return 4;
  }

  if (kind === "number") {
    if (property === "opacity") {
      return 0.08;
    }

    if (property === "font-weight") {
      return 100;
    }

    return 0.1;
  }

  if (kind === "shadow") {
    return 6;
  }

  return 0;
}

function safeLabel(value, fallback = "Untitled") {
  const normalized = normalizeWhitespace(value);
  if (!normalized) {
    return fallback;
  }

  return normalized.length <= 80 ? normalized : `${normalized.slice(0, 77)}...`;
}

function pickExamples(items, limit = defaultExampleLimit) {
  const seen = new Set();
  const examples = [];

  for (const item of items) {
    const key = `${item.pageName}:${item.path}`;
    if (seen.has(key)) {
      continue;
    }

    examples.push({
      auditId: item.componentAuditId || item.sectionAuditId || item.auditNodeId,
      pageName: item.pageName,
      route: item.route,
      path: item.path,
      title: item.label,
      subtitle: `${item.pageName} • ${item.componentFamilyName || item.sectionFamilyName || item.tag}`,
      meta: `${item.viewport} • ${item.tag}${item.componentKind ? ` • ${item.componentKind}` : ""}`,
      variantTraits: [],
      score: null,
      topSignals: [],
      rootClasses: (item.classes || []).slice(0, 6),
      sectionType: item.sectionType || undefined,
      componentKind: item.componentKind || undefined,
    });
    seen.add(key);

    if (examples.length >= limit) {
      break;
    }
  }

  return examples;
}

function parseTokenDeclarations(tokensFilePath) {
  const source = readFileSync(tokensFilePath, "utf8");
  const declarations = new Map();

  for (const match of source.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    declarations.set(match[1], normalizeWhitespace(match[2]));
  }

  const resolveTokenValue = (tokenName, stack = new Set()) => {
    if (!declarations.has(tokenName)) {
      return "";
    }

    if (stack.has(tokenName)) {
      return declarations.get(tokenName);
    }

    const nextStack = new Set(stack);
    nextStack.add(tokenName);
    return declarations
      .get(tokenName)
      .replace(/var\((--[a-z0-9-]+)\)/gi, (_, referencedName) => resolveTokenValue(referencedName, nextStack));
  };

  return [...declarations.entries()].map(([name, rawValue]) => {
    const resolvedValue = resolveTokenValue(name);
    const analysis = analyzeValue(name, resolvedValue || rawValue, name.toLowerCase());
    return {
      name,
      rawValue,
      resolvedValue: resolvedValue || rawValue,
      kind: analysis.kind,
      semanticGroup: analysis.semanticGroup,
      normalizedValue: analysis.normalized,
      displayValue: analysis.displayValue,
      tokenGroup: inferTokenGroup(name),
      metric: analysis.metric,
    };
  });
}

function inferTokenGroup(tokenName) {
  const normalizedName = tokenName.replace(/^--/, "");

  if (normalizedName.includes("type-size") || normalizedName.includes("tracking") || normalizedName.includes("leading") || normalizedName.startsWith("font-")) {
    return "type";
  }

  if (normalizedName.includes("space") || normalizedName.includes("padding") || normalizedName.includes("gutter")) {
    return "space";
  }

  if (normalizedName.includes("radius")) {
    return "radius";
  }

  if (normalizedName.includes("border-width")) {
    return "border";
  }

  if (normalizedName.startsWith("z-")) {
    return "layer";
  }

  if (normalizedName.includes("shadow")) {
    return "shadow";
  }

  if (normalizedName.includes("color") || normalizedName.includes("overlay")) {
    return "color";
  }

  if (
    normalizedName.includes("container") ||
    normalizedName.includes("size") ||
    normalizedName.includes("width") ||
    normalizedName.includes("height") ||
    normalizedName.includes("max") ||
    normalizedName.includes("min")
  ) {
    return "size";
  }

  if (normalizedName.includes("outline") || normalizedName.includes("opacity")) {
    return "effect";
  }

  for (const [group, patterns] of Object.entries(tokenGroupWeights)) {
    if (patterns.some((pattern) => normalizedName.includes(pattern))) {
      return group;
    }
  }

  return "misc";
}

function tokenAffinity(token, semanticGroup, property) {
  let affinity = 0;
  if (token.tokenGroup === semanticGroup) {
    affinity += 4;
  }

  if (property && token.name.includes(property.replace(/[^a-z-]/gi, "").toLowerCase())) {
    affinity += 2;
  }

  if (semanticGroup === "type" && token.name.includes("type-size") && property === "font-size") {
    affinity += 2;
  }

  if (semanticGroup === "type" && token.name.includes("tracking") && property === "letter-spacing") {
    affinity += 2;
  }

  if (semanticGroup === "type" && token.name.includes("leading") && property === "line-height") {
    affinity += 2;
  }

  return affinity;
}

function getCompatibleTokenGroups(semanticGroup) {
  if (semanticGroup === "color") {
    return ["color"];
  }

  if (semanticGroup === "shadow") {
    return ["shadow"];
  }

  if (semanticGroup === "space") {
    return ["space", "size"];
  }

  if (semanticGroup === "size") {
    return ["size", "space"];
  }

  if (semanticGroup === "type") {
    return ["type"];
  }

  if (semanticGroup === "radius") {
    return ["radius"];
  }

  if (semanticGroup === "border") {
    return ["border"];
  }

  if (semanticGroup === "layer") {
    return ["layer"];
  }

  if (semanticGroup === "effect") {
    return ["effect"];
  }

  return ["misc", "size", "space"];
}

function matchTokensForAnalysis(analysis, tokens, property, limit = 4) {
  const threshold = getDistanceThreshold(analysis.kind, analysis.semanticGroup, property);
  const compatibleTokenGroups = getCompatibleTokenGroups(analysis.semanticGroup);

  return tokens
    .filter((token) => token.kind === analysis.kind && compatibleTokenGroups.includes(token.tokenGroup))
    .map((token) => {
      const distance = getDistance(analysis, {
        kind: token.kind,
        metric: token.metric,
        normalized: token.normalizedValue,
      });
      const exact = analysis.normalized === token.normalizedValue;
      const near = Number.isFinite(distance) && distance <= threshold;
      return {
        token: token.name,
        tokenGroup: token.tokenGroup,
        rawValue: token.rawValue,
        resolvedValue: token.resolvedValue,
        normalizedValue: token.normalizedValue,
        matchType: exact ? "exact" : near ? "near" : "none",
        distance: Number.isFinite(distance) ? round(distance, 3) : null,
        affinity: tokenAffinity(token, analysis.semanticGroup, property),
      };
    })
    .filter((entry) => entry.matchType !== "none")
    .sort((left, right) => {
      const leftRank = left.matchType === "exact" ? 0 : 1;
      const rightRank = right.matchType === "exact" ? 0 : 1;
      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }

      if (right.affinity !== left.affinity) {
        return right.affinity - left.affinity;
      }

      return (left.distance || 0) - (right.distance || 0) || left.token.localeCompare(right.token);
    })
    .slice(0, limit);
}

function createFamilyIndex(pageAudits, sectionClusters, componentClusters) {
  const sectionFamilyLookup = buildFamilyLookup(sectionClusters, "sectionType");
  const componentFamilyLookup = buildFamilyLookup(componentClusters, "componentKind");
  const pageByName = new Map(pageAudits.map((page) => [page.pageName, page]));
  const index = [];

  for (const page of pageAudits) {
    const sectionsByPath = [...page.primarySections].sort(
      (left, right) => right.path.length - left.path.length || left.path.localeCompare(right.path),
    );
    const componentsByPath = [...(page.components || [])].sort(
      (left, right) => right.path.length - left.path.length || left.path.localeCompare(right.path),
    );

    for (const viewport of page.viewports) {
      collectNodes(viewport.body, (node) => {
        const section = sectionsByPath.find((candidate) => matchesPathPrefix(node.path, candidate.path)) || null;
        const component =
          componentsByPath.find((candidate) => matchesPathPrefix(node.path, candidate.path)) || null;
        const sectionFamily = section ? sectionFamilyLookup.get(section.auditId) : null;
        const componentFamily = component ? componentFamilyLookup.get(component.auditId) : null;

        index.push({
          ledgerId: `${page.pageName}:${viewport.name}:${node.auditNodeId}`,
          pageName: page.pageName,
          route: page.route,
          viewport: viewport.name,
          auditNodeId: node.auditNodeId,
          path: node.path,
          tag: node.tag,
          visible: node.visible,
          textPreview: safeLabel(node.ownText || node.textPreview, node.tag),
          label: safeLabel(node.ownText || node.textPreview, node.tag),
          classes: node.classes || [],
          styleProfileId: node.styleProfileId,
          sectionAuditId: section?.auditId || null,
          sectionType: section?.sectionType || null,
          sectionFamilyId: sectionFamily?.id || null,
          sectionFamilyName: sectionFamily?.displayName || null,
          componentAuditId: component?.auditId || null,
          componentKind: component?.componentKind || null,
          componentFamilyId: componentFamily?.id || null,
          componentFamilyName: componentFamily?.displayName || null,
          pageFamily: page.family,
        });
      });
    }
  }

  return {
    pageByName,
    sectionFamilyLookup,
    componentFamilyLookup,
    nodes: index,
  };
}

function buildProfileLookup(pageAudits) {
  const lookup = new Map();

  for (const page of pageAudits) {
    for (const viewport of page.viewports) {
      for (const [profileId, profile] of Object.entries(viewport.styleProfiles || {})) {
        lookup.set(`${page.pageName}:${viewport.name}:${profileId}`, profile);
      }
    }
  }

  return lookup;
}

function createExactCluster(property, analysis) {
  return {
    property,
    kind: analysis.kind,
    semanticGroup: analysis.semanticGroup,
    normalizedValue: analysis.normalized,
    displayValue: analysis.displayValue,
    metric: analysis.metric,
    count: 0,
    rawValues: new Map(),
    pages: new Set(),
    sectionFamilies: new Set(),
    componentFamilies: new Set(),
    sectionTypes: new Set(),
    componentKinds: new Set(),
    examples: [],
  };
}

function addExample(target, item) {
  if (target.examples.find((example) => example.pageName === item.pageName && example.path === item.path)) {
    return;
  }

  target.examples.push(item);
}

function serializeCounts(map) {
  return [...map.entries()]
    .sort((left, right) => right[1] - left[1] || String(left[0]).localeCompare(String(right[0])))
    .map(([value, count]) => ({ value, count }));
}

function sortSet(value) {
  return [...value].sort((left, right) => String(left).localeCompare(String(right)));
}

function buildPropertyAtlas(pageAudits, familyIndex, tokens, primaryViewportName) {
  const profiles = buildProfileLookup(pageAudits);
  const propertyBuckets = new Map();

  for (const node of familyIndex.nodes) {
    if (!node.visible || node.viewport !== primaryViewportName) {
      continue;
    }

    const profile = profiles.get(`${node.pageName}:${node.viewport}:${node.styleProfileId}`);
    if (!profile) {
      continue;
    }

    for (const [property, rawValue] of Object.entries(profile)) {
      if (!isActionablePropertyName(property) || !isMaterialPropertyValue(property, rawValue, profile)) {
        continue;
      }

      const analysis = analyzeValue(property, rawValue);
      const propertyBucket =
        propertyBuckets.get(property) ||
        (() => {
          const created = {
            property,
            kind: analysis.kind,
            semanticGroup: analysis.semanticGroup,
            count: 0,
            exactValues: new Map(),
          };
          propertyBuckets.set(property, created);
          return created;
        })();

      propertyBucket.count += 1;
      const exactKey = analysis.normalized;
      const exactCluster =
        propertyBucket.exactValues.get(exactKey) || createExactCluster(property, analysis);

      exactCluster.count += 1;
      exactCluster.rawValues.set(rawValue || "", (exactCluster.rawValues.get(rawValue || "") || 0) + 1);
      exactCluster.pages.add(node.pageName);
      if (node.sectionFamilyName) {
        exactCluster.sectionFamilies.add(node.sectionFamilyName);
      }
      if (node.componentFamilyName) {
        exactCluster.componentFamilies.add(node.componentFamilyName);
      }
      if (node.sectionType) {
        exactCluster.sectionTypes.add(node.sectionType);
      }
      if (node.componentKind) {
        exactCluster.componentKinds.add(node.componentKind);
      }
      addExample(exactCluster, node);
      propertyBucket.exactValues.set(exactKey, exactCluster);
    }
  }

  const properties = [...propertyBuckets.values()]
    .map((bucket) => {
      const exactClusters = [...bucket.exactValues.values()].sort(
        (left, right) => right.count - left.count || left.normalizedValue.localeCompare(right.normalizedValue),
      );
      const nearClusters = [];

      for (const exactCluster of exactClusters) {
        const threshold = getDistanceThreshold(bucket.kind, bucket.semanticGroup, bucket.property);
        const match = nearClusters.find((cluster) => {
          const left = {
            kind: exactCluster.kind,
            metric: exactCluster.metric,
            normalized: exactCluster.normalizedValue,
          };
          const right = {
            kind: cluster.kind,
            metric: cluster.metric,
            normalized: cluster.normalizedValue,
          };
          return threshold > 0 && getDistance(left, right) <= threshold;
        });

        if (match) {
          match.count += exactCluster.count;
          match.rawValues.push(...serializeCounts(exactCluster.rawValues));
          match.pages = [...new Set([...match.pages, ...sortSet(exactCluster.pages)])];
          match.sectionFamilies = [
            ...new Set([...match.sectionFamilies, ...sortSet(exactCluster.sectionFamilies)]),
          ];
          match.componentFamilies = [
            ...new Set([...match.componentFamilies, ...sortSet(exactCluster.componentFamilies)]),
          ];
          match.sectionTypes = [...new Set([...match.sectionTypes, ...sortSet(exactCluster.sectionTypes)])];
          match.componentKinds = [...new Set([...match.componentKinds, ...sortSet(exactCluster.componentKinds)])];
          match.exactValues.push({
            value: exactCluster.displayValue,
            normalizedValue: exactCluster.normalizedValue,
            count: exactCluster.count,
          });
          match.examples.push(...pickExamples(exactCluster.examples));
          continue;
        }

        nearClusters.push({
          id: `${bucket.property}-${hashString(`${bucket.property}:${exactCluster.normalizedValue}`)}`,
          property: bucket.property,
          kind: bucket.kind,
          semanticGroup: bucket.semanticGroup,
          normalizedValue: exactCluster.normalizedValue,
          displayValue: exactCluster.displayValue,
          metric: exactCluster.metric,
          count: exactCluster.count,
          rawValues: serializeCounts(exactCluster.rawValues),
          pages: sortSet(exactCluster.pages),
          sectionFamilies: sortSet(exactCluster.sectionFamilies),
          componentFamilies: sortSet(exactCluster.componentFamilies),
          sectionTypes: sortSet(exactCluster.sectionTypes),
          componentKinds: sortSet(exactCluster.componentKinds),
          exactValues: [
            {
              value: exactCluster.displayValue,
              normalizedValue: exactCluster.normalizedValue,
              count: exactCluster.count,
            },
          ],
          examples: pickExamples(exactCluster.examples),
        });
      }

      const serializedNearClusters = nearClusters
        .map((cluster) => {
          const tokenMatches = matchTokensForAnalysis(
            {
              kind: cluster.kind,
              semanticGroup: cluster.semanticGroup,
              normalized: cluster.normalizedValue,
              metric: cluster.metric,
            },
            tokens,
            bucket.property,
          );

          return {
            ...cluster,
            rawValues: cluster.rawValues
              .sort((left, right) => right.count - left.count || left.value.localeCompare(right.value))
              .slice(0, 8),
            examples: pickExamples(cluster.examples, defaultExampleLimit),
            tokenMatches,
          };
        })
        .sort((left, right) => right.count - left.count || left.displayValue.localeCompare(right.displayValue));

      return {
        property: bucket.property,
        kind: bucket.kind,
        semanticGroup: bucket.semanticGroup,
        actionable: isActionablePropertyName(bucket.property),
        usageCount: bucket.count,
        exactValueCount: exactClusters.length,
        clusterCount: serializedNearClusters.length,
        clusters: serializedNearClusters,
      };
    })
    .sort((left, right) => {
      if (right.usageCount !== left.usageCount) {
        return right.usageCount - left.usageCount;
      }

      const leftKindIndex = valueKindOrder.indexOf(left.kind);
      const rightKindIndex = valueKindOrder.indexOf(right.kind);
      if (leftKindIndex !== rightKindIndex) {
        return leftKindIndex - rightKindIndex;
      }

      return left.property.localeCompare(right.property);
    });

  return {
    primaryViewport: primaryViewportName,
    totalPropertyCount: properties.length,
    actionablePropertyCount: properties.filter((property) => property.actionable).length,
    properties,
    actionableProperties: properties.filter((property) => property.actionable),
  };
}

function buildValueGraph(propertyAtlas, tokens) {
  const groups = [];

  for (const property of propertyAtlas.actionableProperties || propertyAtlas.properties) {
    for (const cluster of property.clusters) {
      const analysis = {
        kind: cluster.kind,
        semanticGroup: cluster.semanticGroup,
        normalized: cluster.normalizedValue,
        metric: cluster.metric,
      };
      const threshold = getDistanceThreshold(cluster.kind, cluster.semanticGroup, property.property);
      const match = groups.find((group) => {
        const distance = getDistance(analysis, {
          kind: group.kind,
          metric: group.metric,
          normalized: group.normalizedValue,
        });
        return (
          group.kind === analysis.kind &&
          group.semanticGroup === analysis.semanticGroup &&
          threshold > 0 &&
          distance <= threshold
        );
      });

      if (match) {
        match.count += cluster.count;
        match.properties.push({
          property: property.property,
          clusterId: cluster.id,
          count: cluster.count,
          semanticGroup: cluster.semanticGroup,
        });
        match.pages = [...new Set([...match.pages, ...cluster.pages])];
        match.sectionFamilies = [...new Set([...match.sectionFamilies, ...cluster.sectionFamilies])];
        match.componentFamilies = [...new Set([...match.componentFamilies, ...cluster.componentFamilies])];
        match.examples.push(...cluster.examples);
        continue;
      }

      groups.push({
        id: `value-${hashString(`${cluster.kind}:${cluster.semanticGroup}:${cluster.normalizedValue}`)}`,
        kind: cluster.kind,
        semanticGroup: cluster.semanticGroup,
        normalizedValue: cluster.normalizedValue,
        displayValue: cluster.displayValue,
        metric: cluster.metric,
        count: cluster.count,
        neutral: isNeutralAnalysis(property.property, {
          kind: cluster.kind,
          semanticGroup: cluster.semanticGroup,
          normalized: cluster.normalizedValue,
          metric: cluster.metric,
        }),
        properties: [
          {
            property: property.property,
            clusterId: cluster.id,
            count: cluster.count,
            semanticGroup: cluster.semanticGroup,
          },
        ],
        pages: [...cluster.pages],
        sectionFamilies: [...cluster.sectionFamilies],
        componentFamilies: [...cluster.componentFamilies],
        examples: [...cluster.examples],
      });
    }
  }

  return {
    groups: groups
      .map((group) => {
        const tokenMatches = matchTokensForAnalysis(
          {
            kind: group.kind,
            semanticGroup: group.semanticGroup,
            normalized: group.normalizedValue,
            metric: group.metric,
          },
          tokens,
          "",
        );

        return {
          ...group,
          examples: pickExamples(group.examples, defaultExampleLimit),
          properties: group.properties.sort((left, right) => right.count - left.count || left.property.localeCompare(right.property)),
          tokenMatches,
          actionable: !group.neutral,
        };
      })
      .sort((left, right) => right.count - left.count || left.displayValue.localeCompare(right.displayValue)),
  };
}

function buildTokenCoverage(tokens, valueGraph) {
  const tokensWithCoverage = tokens
    .map((token) => {
      const exactMatches = [];
      const nearMatches = [];

      for (const group of valueGraph.groups.filter((entry) => entry.actionable && isTokenCandidateGroup(entry))) {
        const exact = group.tokenMatches.find((match) => match.token === token.name && match.matchType === "exact");
        const near = group.tokenMatches.find((match) => match.token === token.name && match.matchType === "near");

        if (exact) {
          exactMatches.push({
            valueGroupId: group.id,
            displayValue: group.displayValue,
            kind: group.kind,
            count: group.count,
            properties: group.properties,
            pages: group.pages,
            sectionFamilies: group.sectionFamilies,
            componentFamilies: group.componentFamilies,
            examples: group.examples,
          });
        } else if (near) {
          nearMatches.push({
            valueGroupId: group.id,
            displayValue: group.displayValue,
            kind: group.kind,
            count: group.count,
            distance: near.distance,
            properties: group.properties,
            pages: group.pages,
            sectionFamilies: group.sectionFamilies,
            componentFamilies: group.componentFamilies,
            examples: group.examples,
          });
        }
      }

      return {
        ...token,
        exactMatchCount: exactMatches.length,
        nearMatchCount: nearMatches.length,
        exactMatches: exactMatches.sort((left, right) => right.count - left.count),
        nearMatches: nearMatches.sort((left, right) => right.count - left.count),
      };
    })
    .sort((left, right) => {
      const leftCount = left.exactMatchCount + left.nearMatchCount;
      const rightCount = right.exactMatchCount + right.nearMatchCount;
      if (rightCount !== leftCount) {
        return rightCount - leftCount;
      }

      return left.name.localeCompare(right.name);
    });

  const uncoveredSharedValues = valueGraph.groups
    .filter(
      (group) =>
        group.actionable &&
        isTokenCandidateGroup(group) &&
        group.tokenMatches.length === 0 &&
        group.count >= 3,
    )
    .map((group) => ({
      id: group.id,
      displayValue: group.displayValue,
      kind: group.kind,
      semanticGroup: group.semanticGroup,
      count: group.count,
      propertyCount: group.properties.length,
      pages: group.pages,
      sectionFamilies: group.sectionFamilies,
      componentFamilies: group.componentFamilies,
      examples: group.examples,
    }))
    .sort((left, right) => right.count - left.count || left.displayValue.localeCompare(right.displayValue));

  return {
    tokens: tokensWithCoverage,
    uncoveredSharedValues,
  };
}

function buildFamilyStyleDeltas(pageAudits, sectionClusters, componentClusters, primaryViewportName, tokens) {
  const profiles = buildProfileLookup(pageAudits);
  const pageLookup = new Map(pageAudits.map((page) => [page.pageName, page]));
  const familyBuckets = [];

  const collectFamily = (cluster, kind) => {
    const records = [];

    for (const item of cluster.items || []) {
      const page = pageLookup.get(item.pageName);
      const detail =
        kind === "section"
          ? page?.primarySections.find((entry) => entry.auditId === item.auditId)
          : page?.components.find((entry) => entry.auditId === item.auditId);
      if (!detail) {
        continue;
      }

      const viewport = page.viewports.find((entry) => entry.name === primaryViewportName);
      if (!viewport) {
        continue;
      }

      const nodeProfileId =
        kind === "section"
          ? (() => {
              let profileId = null;
              collectNodes(viewport.body, (node) => {
                if (!profileId && node.path === detail.path) {
                  profileId = node.styleProfileId;
                }
              });
              return profileId;
            })()
          : (() => {
              let profileId = null;
              collectNodes(viewport.body, (node) => {
                if (!profileId && node.auditNodeId === detail.auditNodeId) {
                  profileId = node.styleProfileId;
                }
              });
              return profileId;
            })();

      if (!nodeProfileId) {
        continue;
      }

      const profile = profiles.get(`${item.pageName}:${primaryViewportName}:${nodeProfileId}`);
      if (!profile) {
        continue;
      }

      records.push({
        auditId: item.auditId,
        pageName: item.pageName,
        route: item.route,
        label:
          kind === "section"
            ? safeLabel(detail.firstHeading || cluster.displayName, cluster.displayName)
            : safeLabel(detail.label || cluster.displayName, cluster.displayName),
        path: detail.path,
        profile,
        sectionType: kind === "section" ? detail.sectionType : detail.sectionType || null,
        componentKind: kind === "component" ? detail.componentKind : null,
      });
    }

    const propertyMap = new Map();

    for (const record of records) {
      for (const [property, rawValue] of Object.entries(record.profile)) {
        if (!isActionablePropertyName(property) || !isMaterialPropertyValue(property, rawValue, record.profile)) {
          continue;
        }

        const analysis = analyzeValue(property, rawValue);
        const bucket =
          propertyMap.get(property) ||
          (() => {
            const created = {
              property,
              kind: analysis.kind,
              semanticGroup: analysis.semanticGroup,
              values: new Map(),
            };
            propertyMap.set(property, created);
            return created;
          })();
        const valueBucket =
          bucket.values.get(analysis.normalized) ||
          (() => {
            const created = {
              normalizedValue: analysis.normalized,
              displayValue: analysis.displayValue,
              metric: analysis.metric,
              count: 0,
              items: [],
            };
            bucket.values.set(analysis.normalized, created);
            return created;
          })();
        valueBucket.count += 1;
        valueBucket.items.push({
          auditId: record.auditId,
          pageName: record.pageName,
          route: record.route,
          path: record.path,
          label: record.label,
          sectionType: record.sectionType,
          componentKind: record.componentKind,
        });
      }
    }

    const properties = [...propertyMap.values()]
      .map((bucket) => {
        const values = [...bucket.values.values()]
          .map((value) => ({
            normalizedValue: value.normalizedValue,
            displayValue: value.displayValue,
            count: value.count,
            pages: [...new Set(value.items.map((item) => item.pageName))].sort(),
            tokenMatches: matchTokensForAnalysis(
              {
                kind: bucket.kind,
                semanticGroup: bucket.semanticGroup,
                normalized: value.normalizedValue,
                metric: value.metric,
              },
              tokens,
              bucket.property,
            ).slice(0, 2),
          }))
          .sort((left, right) => right.count - left.count || left.displayValue.localeCompare(right.displayValue));

        return {
          property: bucket.property,
          kind: bucket.kind,
          semanticGroup: bucket.semanticGroup,
          actionable: isActionablePropertyName(bucket.property),
          status: values.length === 1 ? "stable" : "varying",
          canonicalValue: values[0] || null,
          values: values.slice(0, 6),
        };
      })
      .sort((left, right) => {
        const leftRank = left.status === "varying" ? 0 : 1;
        const rightRank = right.status === "varying" ? 0 : 1;
        if (leftRank !== rightRank) {
          return leftRank - rightRank;
        }

        return left.property.localeCompare(right.property);
      });

    const serializedProperties = properties.filter(
      (property) => property.actionable || property.status === "varying",
    );

    familyBuckets.push({
      id: cluster.id,
      displayName: cluster.displayName,
      status: cluster.status,
      familyKind: kind,
      primaryViewport: primaryViewportName,
      instanceCount: records.length,
      varyingPropertyCount: properties.filter((property) => property.status === "varying").length,
      stablePropertyCount: properties.filter((property) => property.status === "stable").length,
      properties: serializedProperties,
    });
  };

  for (const cluster of sectionClusters || []) {
    collectFamily(cluster, "section");
  }

  for (const cluster of componentClusters || []) {
    collectFamily(cluster, "component");
  }

  return familyBuckets.sort((left, right) => {
    if (right.varyingPropertyCount !== left.varyingPropertyCount) {
      return right.varyingPropertyCount - left.varyingPropertyCount;
    }

    return left.displayName.localeCompare(right.displayName);
  });
}

function buildDecisionQueue(valueGraph, tokenCoverage) {
  const decisions = [];

  for (const group of valueGraph.groups.filter((entry) => entry.actionable && isTokenCandidateGroup(entry))) {
    const exactToken = group.tokenMatches.find((match) => match.matchType === "exact");
    const nearToken = group.tokenMatches.find((match) => match.matchType === "near");
    const familySpread = new Set([...group.sectionFamilies, ...group.componentFamilies]).size;
    const pageSpread = group.pages.length;
    const propertySpread = group.properties.length;
    let action = "Leave local";
    let rationale = "The value is not shared widely enough yet to justify a global token.";
    let priority = 20 + group.count;

    if (exactToken && familySpread >= 2) {
      action = "Adopt existing token";
      rationale = `This value already matches ${exactToken.token} and appears across multiple families.`;
      priority = 120 + familySpread * 4 + propertySpread * 3;
    } else if (!exactToken && nearToken && familySpread >= 2) {
      action = "Unify to nearby token";
      rationale = `This value is close to ${nearToken.token} and is probably drift rather than intentional differentiation.`;
      priority = 98 + familySpread * 4 + propertySpread * 3;
    } else if (!exactToken && familySpread >= 3) {
      action = "Create shared token";
      rationale = "This value is used across several families without an existing token match.";
      priority = 70 + familySpread * 4 + propertySpread * 5;
      if (propertySpread === 1) {
        priority -= 24;
      }
      if (group.kind === "number") {
        priority -= 18;
      }
      if (group.kind === "font-family") {
        priority += 10;
      }
    } else if (!exactToken && familySpread === 1 && group.count >= 4) {
      action = "Consider component-scoped variable";
      rationale = "This value repeats enough to deserve a local variable, but not necessarily a global token.";
      priority = 48 + group.count;
    }

    decisions.push({
      id: group.id,
      action,
      rationale,
      priority,
      kind: group.kind,
      semanticGroup: group.semanticGroup,
      displayValue: group.displayValue,
      normalizedValue: group.normalizedValue,
      count: group.count,
      propertySpread,
      familySpread,
      pageSpread,
      propertyUsage: group.properties,
      tokenMatches: group.tokenMatches,
      examples: group.examples,
    });
  }

  const uncoveredTokenNames = new Set(
    tokenCoverage.tokens
      .filter((token) => token.exactMatchCount === 0 && token.nearMatchCount === 0)
      .map((token) => token.name),
  );

  return {
    items: decisions
      .sort((left, right) => right.priority - left.priority || right.count - left.count || left.displayValue.localeCompare(right.displayValue)),
    uncoveredTokenNames: [...uncoveredTokenNames].sort(),
  };
}

function renderPropertyAtlas(propertyAtlas) {
  const lines = [
    "# Property Atlas",
    "",
    `Primary decision viewport: \`${propertyAtlas.primaryViewport}\``,
    "",
    `Tracked properties in atlas: **${propertyAtlas.totalPropertyCount}**`,
    "",
    `Actionable properties surfaced in this markdown view: **${propertyAtlas.actionablePropertyCount}**`,
    "",
  ];

  for (const property of propertyAtlas.actionableProperties.slice(0, 80)) {
    lines.push(`## ${property.property}`);
    lines.push("");
    lines.push(
      `- Kind: \`${property.kind}\` • semantic group: \`${property.semanticGroup}\` • usage count: **${property.usageCount}** • near clusters: **${property.clusterCount}**`,
    );

    for (const cluster of property.clusters.slice(0, 5)) {
      const tokenText =
        cluster.tokenMatches.length > 0
          ? cluster.tokenMatches
              .slice(0, 3)
              .map((match) => `\`${match.token}\` (${match.matchType})`)
              .join(", ")
          : "none";
      lines.push(
        `- ${cluster.displayValue}: count ${cluster.count}; pages ${cluster.pages.length}; families ${cluster.sectionFamilies.length + cluster.componentFamilies.length}; tokens ${tokenText}`,
      );
    }

    lines.push("");
  }

  lines.push(
    `The atlas JSON in \`docs/audit/raw/property-atlas.json\` contains the full property list, not just the top slice rendered in this markdown view.`,
  );

  return `${lines.join("\n")}\n`;
}

function renderTokenCoverage(tokenCoverage) {
  const lines = [
    "# Token Coverage",
    "",
    `Tokens parsed from \`src/styles/tokens.css\`: **${tokenCoverage.tokens.length}**`,
    "",
    "## Highest-coverage tokens",
    "",
  ];

  for (const token of tokenCoverage.tokens.filter((entry) => entry.exactMatchCount + entry.nearMatchCount > 0).slice(0, 40)) {
    lines.push(
      `- \`${token.name}\` (${token.displayValue}): exact groups ${token.exactMatchCount}; near groups ${token.nearMatchCount}`,
    );
  }

  lines.push("");
  lines.push("## Shared uncovered values");
  lines.push("");

  for (const value of tokenCoverage.uncoveredSharedValues.slice(0, 30)) {
    lines.push(
      `- ${value.displayValue}: kind \`${value.kind}\`; count ${value.count}; properties ${value.propertyCount}; pages ${value.pages.length}`,
    );
  }

  return `${lines.join("\n")}\n`;
}

function renderFamilyStyleDeltas(familyStyleDeltas) {
  const lines = ["# Family Property Deltas", ""];

  for (const family of familyStyleDeltas.slice(0, 40)) {
    lines.push(`## ${family.displayName} (${family.familyKind})`);
    lines.push("");
    lines.push(
      `- Instances: **${family.instanceCount}** • varying properties: **${family.varyingPropertyCount}** • stable properties: **${family.stablePropertyCount}**`,
    );

    for (const property of family.properties.filter((entry) => entry.actionable && entry.status === "varying").slice(0, 12)) {
      const values = property.values
        .slice(0, 4)
        .map((value) => `${value.displayValue} (${value.count})`)
        .join(", ");
      lines.push(`- \`${property.property}\`: ${values}`);
    }

    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function renderDecisionQueue(decisionQueue) {
  const lines = ["# Token Decision Queue", "", "## Prioritized actions", ""];

  for (const item of decisionQueue.items.slice(0, 50)) {
    const tokenText =
      item.tokenMatches.length > 0
        ? item.tokenMatches
            .slice(0, 2)
            .map((match) => `\`${match.token}\` (${match.matchType})`)
            .join(", ")
        : "no token match";
    lines.push(
      `- [ ] ${item.action}: ${item.displayValue} • kind \`${item.kind}\` • reuse ${item.count} • properties ${item.propertySpread} • families ${item.familySpread} • ${tokenText}`,
    );
    lines.push(`  ${item.rationale}`);
  }

  if (decisionQueue.uncoveredTokenNames.length > 0) {
    lines.push("");
    lines.push("## Unmatched existing tokens");
    lines.push("");
    for (const tokenName of decisionQueue.uncoveredTokenNames) {
      lines.push(`- \`${tokenName}\``);
    }
  }

  return `${lines.join("\n")}\n`;
}

function renderStyleSystemMethods(propertyAtlas, tokenCoverage, decisionQueue) {
  return `# Property and Token Methods

- Raw node styles are not duplicated here. The source of truth remains the per-page snapshots in \`docs/audit/raw/pages/*.json\`, and the new ledger indexes those existing style profiles back to page, section family, and component family.
- The atlas, value graph, token coverage, and family deltas are all driven from visible nodes in the primary decision viewport: \`${propertyAtlas.primaryViewport}\`.
- Every computed property remains tracked in the page snapshots. The atlas layers a usefulness filter on top of that raw capture so the browser views can stay decision-oriented.
- Token matching is deterministic. It uses normalized values, token var-chain resolution from \`src/styles/tokens.css\`, and near-match thresholds for colors, lengths, numbers, and shadows.
- The decision queue is a recommendation surface, not an auto-refactor plan. It prioritizes adoption of existing tokens first, then creation of new shared tokens, then component-scoped variables, then true one-offs.
- Existing tokens with no observed matches are still reported so dead or overly-specific tokens are visible.

Summary:
- Atlas properties: **${propertyAtlas.totalPropertyCount}**
- Tokens parsed: **${tokenCoverage.tokens.length}**
- Decision items: **${decisionQueue.items.length}**
`;
}

export function buildPropertySystemAnalysis({
  generatedAt,
  pageAudits,
  sectionClusters,
  componentClusters,
  primaryViewportName,
  tokensFilePath,
}) {
  const tokens = parseTokenDeclarations(tokensFilePath);
  const familyIndex = createFamilyIndex(pageAudits, sectionClusters, componentClusters);
  const propertyLedger = {
    generatedAt,
    primaryViewport: primaryViewportName,
    availableViewports: [...new Set(familyIndex.nodes.map((node) => node.viewport))].sort(),
    nodeCount: familyIndex.nodes.length,
    nodes: familyIndex.nodes,
  };
  const propertyAtlas = {
    generatedAt,
    ...buildPropertyAtlas(pageAudits, familyIndex, tokens, primaryViewportName),
  };
  const valueGraph = {
    generatedAt,
    primaryViewport: primaryViewportName,
    ...buildValueGraph(propertyAtlas, tokens),
  };
  const tokenCoverage = {
    generatedAt,
    primaryViewport: primaryViewportName,
    ...buildTokenCoverage(tokens, valueGraph),
  };
  const familyStyleDeltas = {
    generatedAt,
    primaryViewport: primaryViewportName,
    families: buildFamilyStyleDeltas(
      pageAudits,
      sectionClusters,
      componentClusters,
      primaryViewportName,
      tokens,
    ),
  };
  const decisionQueue = {
    generatedAt,
    primaryViewport: primaryViewportName,
    ...buildDecisionQueue(valueGraph, tokenCoverage),
  };

  return {
    propertyLedger,
    propertyAtlas,
    valueGraph,
    tokenCoverage,
    familyStyleDeltas,
    decisionQueue,
    reports: {
      propertyAtlas: renderPropertyAtlas(propertyAtlas),
      tokenCoverage: renderTokenCoverage(tokenCoverage),
      familyStyleDeltas: renderFamilyStyleDeltas(familyStyleDeltas.families),
      decisionQueue: renderDecisionQueue(decisionQueue),
      methods: renderStyleSystemMethods(propertyAtlas, tokenCoverage, decisionQueue),
    },
  };
}
