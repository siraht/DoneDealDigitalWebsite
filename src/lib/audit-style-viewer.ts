import { readFileSync } from "node:fs";
import { getAuditViewerData } from "./audit-viewer";

type PreviewInstance = {
  auditId: string;
  pageName: string;
  route: string;
  path: string;
  title: string;
  subtitle: string;
  meta: string;
  variantTraits?: string[];
  score?: number | null;
  topSignals?: string[];
  rootClasses?: string[];
  sectionType?: string;
  componentKind?: string;
};

function readJson<T>(url: URL): T {
  return JSON.parse(readFileSync(url, "utf8")) as T;
}

function toTitleCase(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatTokenMatches(matches: { token: string; matchType: string }[] = []) {
  return matches.slice(0, 3).map((match) => `${match.token} (${match.matchType})`);
}

const propertyAtlasUrl = new URL("../../docs/audit/raw/property-atlas.json", import.meta.url);
const tokenCoverageUrl = new URL("../../docs/audit/raw/token-coverage.json", import.meta.url);
const familyStyleDeltasUrl = new URL("../../docs/audit/raw/family-style-deltas.json", import.meta.url);
const decisionQueueUrl = new URL("../../docs/audit/raw/token-decision-queue.json", import.meta.url);

export function getPropertyAtlasViewerData() {
  const audit = getAuditViewerData();
  const raw = readJson<{
    primaryViewport: string;
    totalPropertyCount: number;
    actionablePropertyCount: number;
    actionableProperties: {
      property: string;
      kind: string;
      semanticGroup: string;
      usageCount: number;
      clusterCount: number;
      clusters: {
        id: string;
        displayValue: string;
        count: number;
        pages: string[];
        sectionFamilies: string[];
        componentFamilies: string[];
        tokenMatches: { token: string; matchType: string }[];
        examples: PreviewInstance[];
      }[];
    }[];
  }>(propertyAtlasUrl);

  const groupMap = new Map<string, typeof raw.actionableProperties>();

  for (const property of raw.actionableProperties) {
    const entry = groupMap.get(property.semanticGroup) || [];
    entry.push(property);
    groupMap.set(property.semanticGroup, entry);
  }

  const semanticGroups = [...groupMap.entries()]
    .map(([semanticGroup, properties]) => ({
      semanticGroup,
      label: toTitleCase(semanticGroup),
      propertyCount: properties.length,
      properties: [...properties]
        .sort((left, right) => {
          if (right.clusterCount !== left.clusterCount) {
            return right.clusterCount - left.clusterCount;
          }

          return right.usageCount - left.usageCount || left.property.localeCompare(right.property);
        })
        .slice(0, 6),
    }))
    .sort((left, right) => right.propertyCount - left.propertyCount || left.label.localeCompare(right.label));

  return {
    audit,
    summary: {
      primaryViewport: raw.primaryViewport,
      totalPropertyCount: raw.totalPropertyCount,
      actionablePropertyCount: raw.actionablePropertyCount,
      semanticGroupCount: semanticGroups.length,
    },
    semanticGroups,
  };
}

export function getTokenCoverageViewerData() {
  const audit = getAuditViewerData();
  const raw = readJson<{
    tokens: {
      name: string;
      displayValue: string;
      tokenGroup: string;
      exactMatchCount: number;
      nearMatchCount: number;
      exactMatches: {
        displayValue: string;
        count: number;
        properties: { property: string; count: number }[];
        examples: PreviewInstance[];
      }[];
      nearMatches: {
        displayValue: string;
        count: number;
        properties: { property: string; count: number }[];
        examples: PreviewInstance[];
      }[];
    }[];
    uncoveredSharedValues: {
      id: string;
      displayValue: string;
      kind: string;
      semanticGroup: string;
      count: number;
      propertyCount: number;
      pages: string[];
      sectionFamilies: string[];
      componentFamilies: string[];
      examples: PreviewInstance[];
    }[];
  }>(tokenCoverageUrl);

  const matchedTokens = raw.tokens
    .filter((token) => token.exactMatchCount + token.nearMatchCount > 0)
    .map((token) => ({
      ...token,
      bestMatches: [...token.exactMatches, ...token.nearMatches].slice(0, 2),
    }))
    .slice(0, 24);

  return {
    audit,
    summary: {
      tokenCount: raw.tokens.length,
      matchedTokenCount: matchedTokens.length,
      uncoveredValueCount: raw.uncoveredSharedValues.length,
    },
    matchedTokens,
    uncoveredValues: raw.uncoveredSharedValues.slice(0, 18),
  };
}

export function getFamilyDeltasViewerData() {
  const audit = getAuditViewerData();
  const familyCards = new Map(
    [...audit.sectionFamilies, ...audit.componentFamilies].map((family) => [family.id, family]),
  );
  const raw = readJson<{
    primaryViewport: string;
    families: {
      id: string;
      displayName: string;
      status: string;
      familyKind: "section" | "component";
      instanceCount: number;
      varyingPropertyCount: number;
      stablePropertyCount: number;
      properties: {
        property: string;
        kind: string;
        semanticGroup: string;
        actionable: boolean;
        status: "stable" | "varying";
        canonicalValue: {
          displayValue: string;
          count: number;
          tokenMatches: { token: string; matchType: string }[];
        } | null;
        values: {
          displayValue: string;
          count: number;
          pages: string[];
          tokenMatches: { token: string; matchType: string }[];
        }[];
      }[];
    }[];
  }>(familyStyleDeltasUrl);

  const families = raw.families
    .map((family) => ({
      ...family,
      preview: familyCards.get(family.id)?.canonical || null,
      varyingProperties: family.properties.filter((property) => property.status === "varying").slice(0, 12),
    }))
    .sort((left, right) => {
      if (right.varyingPropertyCount !== left.varyingPropertyCount) {
        return right.varyingPropertyCount - left.varyingPropertyCount;
      }

      return left.displayName.localeCompare(right.displayName);
    });

  return {
    audit,
    summary: {
      primaryViewport: raw.primaryViewport,
      familyCount: families.length,
      sectionFamilyCount: families.filter((family) => family.familyKind === "section").length,
      componentFamilyCount: families.filter((family) => family.familyKind === "component").length,
    },
    families,
  };
}

export function getDecisionQueueViewerData() {
  const audit = getAuditViewerData();
  const raw = readJson<{
    items: {
      id: string;
      action: string;
      rationale: string;
      kind: string;
      semanticGroup: string;
      displayValue: string;
      count: number;
      propertySpread: number;
      familySpread: number;
      pageSpread: number;
      propertyUsage: { property: string; count: number; semanticGroup: string }[];
      tokenMatches: { token: string; matchType: string }[];
      examples: PreviewInstance[];
    }[];
  }>(decisionQueueUrl);

  const groups = ["Adopt existing token", "Unify to nearby token", "Create shared token", "Consider component-scoped variable"].map(
    (action) => ({
      action,
      label: action,
      items: raw.items.filter((item) => item.action === action).slice(0, action === "Create shared token" ? 16 : 12),
    }),
  );

  return {
    audit,
    summary: {
      decisionCount: raw.items.length,
      actionGroupCount: groups.filter((group) => group.items.length > 0).length,
    },
    groups: groups.filter((group) => group.items.length > 0),
    formatTokenMatches,
  };
}

export { formatTokenMatches };
