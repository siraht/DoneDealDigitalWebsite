import { readFileSync } from "node:fs";

type ScoreMap = {
  combined?: number;
  [key: string]: number | string | undefined;
};

type ClusterItem = {
  auditId: string;
  pageName: string;
  route: string;
  index?: number;
  sectionIndex?: number;
  sectionType?: string;
  componentKind?: string;
  firstHeading?: string;
  label?: string;
  variantTraits?: string[];
  representativeScores?: ScoreMap | null;
};

type Cluster = {
  id: string;
  displayName: string;
  status: string;
  items: ClusterItem[];
};

type SectionDetail = {
  auditId: string;
  pageName: string;
  route: string;
  index: number;
  path: string;
  sectionType: string;
  firstHeading: string;
  rootClasses?: string[];
  variantTraits?: string[];
};

type ComponentDetail = {
  auditId: string;
  pageName: string;
  route: string;
  sectionAuditId: string;
  sectionIndex: number;
  sectionType: string;
  componentKind: string;
  label: string;
  path: string;
  rootClasses?: string[];
  variantTraits?: string[];
};

type FamilyInstance = {
  auditId: string;
  pageName: string;
  route: string;
  path: string;
  title: string;
  subtitle: string;
  meta: string;
  variantTraits: string[];
  score: number | null;
  topSignals: string[];
  rootClasses: string[];
  sectionType?: string;
  componentKind?: string;
};

type FamilyCard = {
  id: string;
  displayName: string;
  status: string;
  canonical: FamilyInstance;
  gallery: FamilyInstance[];
  instances: FamilyInstance[];
  totalCount: number;
};

type ViewerMethod = {
  id: string;
  route: string;
  name: string;
  status: "Live" | "Planned";
  summary: string;
};

type AuditViewerData = {
  sectionFamilies: FamilyCard[];
  componentFamilies: FamilyCard[];
  styleArchetypes: {
    id: string;
    signature: string;
    componentKinds: Record<string, number>;
    sectionTypes: Record<string, number>;
    items: FamilyInstance[];
  }[];
  methods: ViewerMethod[];
  stats: {
    pageCount: number;
    sectionFamilyCount: number;
    componentFamilyCount: number;
    sectionInstanceCount: number;
    componentInstanceCount: number;
  };
};

const manifestUrl = new URL("../../docs/audit/raw/manifest.json", import.meta.url);
const rawPagesUrl = new URL("../../docs/audit/raw/pages/", import.meta.url);
const styleArchetypesUrl = new URL("../../docs/audit/raw/style-archetypes.json", import.meta.url);
const canonicalPages = ["index", "index_original"];

let cachedData: AuditViewerData | null = null;

function readJson<T>(url: URL): T {
  return JSON.parse(readFileSync(url, "utf8")) as T;
}

function getCanonicalRank(pageName: string) {
  const index = canonicalPages.indexOf(pageName);
  return index === -1 ? 99 : index;
}

function formatScore(score?: number) {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return null;
  }

  return Number(score.toFixed(2));
}

function topSignals(scores?: ScoreMap | null) {
  if (!scores) {
    return [];
  }

  return Object.entries(scores)
    .filter(([key, value]) => key !== "combined" && typeof value === "number")
    .sort((left, right) => {
      const rightValue = right[1] as number;
      const leftValue = left[1] as number;
      return rightValue - leftValue || left[0].localeCompare(right[0]);
    })
    .slice(0, 3)
    .map(([key, value]) => `${key} ${Number(value).toFixed(2)}`);
}

function chooseCanonical(items: FamilyInstance[]) {
  return [...items].sort((left, right) => {
    const rankDiff = getCanonicalRank(left.pageName) - getCanonicalRank(right.pageName);
    if (rankDiff !== 0) {
      return rankDiff;
    }

    const leftIndex = left.meta.match(/section (\d+)/)?.[1];
    const rightIndex = right.meta.match(/section (\d+)/)?.[1];
    const numericDiff = Number(leftIndex || "999") - Number(rightIndex || "999");
    if (numericDiff !== 0) {
      return numericDiff;
    }

    return left.auditId.localeCompare(right.auditId);
  })[0];
}

function chooseGalleryInstances(canonical: FamilyInstance, items: FamilyInstance[], limit = 6) {
  const seen = new Set<string>([canonical.auditId]);
  const gallery = [canonical];
  const remaining = [...items]
    .filter((item) => item.auditId !== canonical.auditId)
    .sort((left, right) => {
      const leftScore = typeof left.score === "number" ? left.score : 1;
      const rightScore = typeof right.score === "number" ? right.score : 1;
      if (leftScore !== rightScore) {
        return leftScore - rightScore;
      }

      return left.pageName.localeCompare(right.pageName) || left.title.localeCompare(right.title);
    });

  for (const candidate of remaining) {
    if (gallery.length >= limit) {
      break;
    }

    if (!seen.has(candidate.auditId)) {
      gallery.push(candidate);
      seen.add(candidate.auditId);
    }
  }

  return gallery;
}

function normalizeSectionInstance(item: ClusterItem, detail?: SectionDetail): FamilyInstance {
  return {
    auditId: item.auditId,
    pageName: item.pageName,
    route: item.route,
    path: detail?.path || "",
    title: detail?.firstHeading || item.firstHeading || item.pageName,
    subtitle: `${item.pageName} at ${item.route}`,
    meta: `section ${detail?.index || item.index || "?"} • ${detail?.sectionType || item.sectionType || "Section"}`,
    variantTraits: detail?.variantTraits || item.variantTraits || [],
    score: formatScore(item.representativeScores?.combined as number | undefined),
    topSignals: topSignals(item.representativeScores),
    rootClasses: detail?.rootClasses || [],
    sectionType: detail?.sectionType || item.sectionType,
  };
}

function normalizeComponentInstance(item: ClusterItem, detail?: ComponentDetail): FamilyInstance {
  return {
    auditId: item.auditId,
    pageName: item.pageName,
    route: item.route,
    path: detail?.path || "",
    title: detail?.label || item.label || detail?.componentKind || item.componentKind || item.pageName,
    subtitle: `${item.pageName} in ${detail?.sectionType || item.sectionType || "Section"}`,
    meta: `section ${detail?.sectionIndex || item.sectionIndex || "?"} • ${detail?.componentKind || item.componentKind || "Component"}`,
    variantTraits: detail?.variantTraits || item.variantTraits || [],
    score: formatScore(item.representativeScores?.combined as number | undefined),
    topSignals: topSignals(item.representativeScores),
    rootClasses: detail?.rootClasses || [],
    sectionType: detail?.sectionType || item.sectionType,
    componentKind: detail?.componentKind || item.componentKind,
  };
}

function buildFamilyCards(
  clusters: Cluster[],
  lookup: Map<string, SectionDetail | ComponentDetail>,
  kind: "section" | "component",
) {
  return clusters
    .map((cluster) => {
      const instances = cluster.items.map((item) =>
        kind === "section"
          ? normalizeSectionInstance(item, lookup.get(item.auditId) as SectionDetail | undefined)
          : normalizeComponentInstance(item, lookup.get(item.auditId) as ComponentDetail | undefined),
      );
      const canonical = chooseCanonical(instances);

      return {
        id: cluster.id,
        displayName: cluster.displayName,
        status: cluster.status,
        canonical,
        gallery: chooseGalleryInstances(canonical, instances),
        instances,
        totalCount: instances.length,
      } satisfies FamilyCard;
    })
    .sort((left, right) => {
      if (right.totalCount !== left.totalCount) {
        return right.totalCount - left.totalCount;
      }

      return left.displayName.localeCompare(right.displayName);
    });
}

function loadRawPages() {
  const manifest = readJson<{
    pages: { pageName: string }[];
    sectionClusters: Cluster[];
    componentClusters: Cluster[];
  }>(manifestUrl);
  const sectionLookup = new Map<string, SectionDetail>();
  const componentLookup = new Map<string, ComponentDetail>();

  for (const page of manifest.pages) {
    const pageAudit = readJson<{
      primarySections: SectionDetail[];
      components: ComponentDetail[];
    }>(new URL(`${page.pageName}.json`, rawPagesUrl));

    for (const section of pageAudit.primarySections || []) {
      sectionLookup.set(section.auditId, section);
    }

    for (const component of pageAudit.components || []) {
      componentLookup.set(component.auditId, component);
    }
  }

  return {
    manifest,
    sectionLookup,
    componentLookup,
  };
}

export function getVisualMethods(): ViewerMethod[] {
  return [
    {
      id: "gallery",
      route: "/audit/gallery",
      name: "Family Gallery Wall",
      status: "Live",
      summary: "Scan each shared family as a grouped wall of real page previews, with canonical picks and the most divergent variants surfaced first.",
    },
    {
      id: "compare",
      route: "/audit/compare",
      name: "Canonical Comparator",
      status: "Live",
      summary: "Pin a canonical instance beside its strongest and weakest matches so consolidation decisions are made against an explicit reference.",
    },
    {
      id: "matrix",
      route: "/audit/matrix",
      name: "Coverage Heatmap",
      status: "Live",
      summary: "Map pages against family clusters and open each intersection into a preview tray, making gaps, outliers, and duplication visible.",
    },
    {
      id: "archetypes",
      route: "/audit/archetypes",
      name: "Style Archetype Atlas",
      status: "Live",
      summary: "Group visually similar primitives across different component families so shared design-system surfaces emerge beyond section names.",
    },
    {
      id: "workbench",
      route: "/audit/workbench",
      name: "Conversion Workbench",
      status: "Live",
      summary: "Show stitch source, tokenized precedent, and target variants together so the consolidation path is visible as an actionable blueprint.",
    },
  ];
}

export function getAuditViewerData() {
  if (cachedData) {
    return cachedData;
  }

  const { manifest, sectionLookup, componentLookup } = loadRawPages();
  const rawArchetypes = readJson<{
    archetypes: {
      id: string;
      signature: string;
      componentKinds: Record<string, number>;
      sectionTypes: Record<string, number>;
      items: ClusterItem[];
    }[];
  }>(styleArchetypesUrl);
  const sectionFamilies = buildFamilyCards(manifest.sectionClusters, sectionLookup, "section");
  const componentFamilies = buildFamilyCards(manifest.componentClusters, componentLookup, "component");
  const styleArchetypes = rawArchetypes.archetypes.map((archetype) => ({
    id: archetype.id,
    signature: archetype.signature,
    componentKinds: archetype.componentKinds,
    sectionTypes: archetype.sectionTypes,
    items: archetype.items.map((item) =>
      normalizeComponentInstance(item, componentLookup.get(item.auditId) as ComponentDetail | undefined),
    ),
  }));

  cachedData = {
    sectionFamilies,
    componentFamilies,
    styleArchetypes,
    methods: getVisualMethods(),
    stats: {
      pageCount: manifest.pages.length,
      sectionFamilyCount: sectionFamilies.length,
      componentFamilyCount: componentFamilies.length,
      sectionInstanceCount: sectionFamilies.reduce((sum, family) => sum + family.totalCount, 0),
      componentInstanceCount: componentFamilies.reduce((sum, family) => sum + family.totalCount, 0),
    },
  };

  return cachedData;
}
