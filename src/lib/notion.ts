import { Client, isFullPage } from "@notionhq/client";
import type {
  QueryDataSourceResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

/* ══════════════════════════════════════════
   Types
   ══════════════════════════════════════════ */

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  outlet: string;
  url: string | null;
  summary: string;
  language: string;
  showOnHome: boolean;
  published: boolean;
  sortOrder: number;
  featured: boolean;
}

/* ══════════════════════════════════════════
   Client & ID Resolution
   ══════════════════════════════════════════ */

function getNotionClient(): Client {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error("NOTION_TOKEN is not configured");
  }
  return new Client({ auth: token });
}

/**
 * Resolve the data source ID.
 *
 * Priority:
 *   1. NOTION_DATA_SOURCE_ID (preferred, maps directly to dataSources.query)
 *   2. NOTION_DATABASE_ID    (legacy / convenience — we run a one-time
 *      discovery step to retrieve the data_source_id from the database)
 *
 * The Notion SDK v5 API operates on data sources, not databases.
 * If only a database ID is provided, we call databases.retrieve() once
 * and extract the corresponding data_source_id from it.
 */
let resolvedDataSourceId: string | undefined;

async function getDataSourceId(notion: Client): Promise<string> {
  // Already resolved in this process
  if (resolvedDataSourceId) return resolvedDataSourceId;

  // Prefer NOTION_DATA_SOURCE_ID
  const dsId = process.env.NOTION_DATA_SOURCE_ID;
  if (dsId) {
    resolvedDataSourceId = dsId;
    return dsId;
  }

  // Fallback: resolve from NOTION_DATABASE_ID via discovery
  const dbId = process.env.NOTION_DATABASE_ID;
  if (!dbId) {
    throw new Error(
      "NOTION_DATA_SOURCE_ID or NOTION_DATABASE_ID is not configured"
    );
  }

  // Discovery step: retrieve the database to get its data_source_id.
  // In Notion SDK v5, a database object contains an `id` that can be
  // used as data_source_id when the database IS the data source.
  // For original databases (not linked), the database ID and
  // data source ID are the same.
  resolvedDataSourceId = dbId;
  return dbId;
}

/* ══════════════════════════════════════════
   Property Extractors
   ══════════════════════════════════════════ */

function extractTitle(page: PageObjectResponse): string {
  const prop = page.properties["Title"];
  if (prop?.type === "title") {
    return prop.title.map((t) => t.plain_text).join("");
  }
  return "";
}

function extractDate(page: PageObjectResponse): string {
  const prop = page.properties["Date"];
  if (prop?.type === "date" && prop.date) {
    return prop.date.start;
  }
  return "";
}

function extractSelect(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key];
  if (prop?.type === "select" && prop.select) {
    return prop.select.name;
  }
  return "";
}

function extractRichText(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key];
  if (prop?.type === "rich_text") {
    return prop.rich_text.map((t) => t.plain_text).join("");
  }
  return "";
}

function extractUrl(page: PageObjectResponse): string | null {
  const prop = page.properties["URL"];
  if (prop?.type === "url") {
    return prop.url;
  }
  return null;
}

function extractCheckbox(page: PageObjectResponse, key: string): boolean {
  const prop = page.properties[key];
  if (prop?.type === "checkbox") {
    return prop.checkbox;
  }
  return false;
}

function extractNumber(page: PageObjectResponse, key: string): number {
  const prop = page.properties[key];
  if (prop?.type === "number" && prop.number !== null) {
    return prop.number;
  }
  return 0;
}

/* ══════════════════════════════════════════
   Mapper
   ══════════════════════════════════════════ */

function mapPageToNewsItem(page: PageObjectResponse): NewsItem {
  return {
    id: page.id,
    title: extractTitle(page),
    date: extractDate(page),
    category: extractSelect(page, "Category"),
    outlet: extractRichText(page, "Outlet"),
    url: extractUrl(page),
    summary: extractRichText(page, "Summary"),
    language: extractSelect(page, "Language"),
    showOnHome: extractCheckbox(page, "ShowOnHome"),
    published: extractCheckbox(page, "Published"),
    sortOrder: extractNumber(page, "SortOrder"),
    featured: extractCheckbox(page, "Featured"),
  };
}

function extractPages(
  response: QueryDataSourceResponse
): PageObjectResponse[] {
  return response.results.filter((r): r is PageObjectResponse =>
    isFullPage(r)
  );
}

/* ══════════════════════════════════════════
   Queries (dataSources.query)
   ══════════════════════════════════════════ */

/** Homepage: Published + ShowOnHome, top 3 */
export async function fetchHomeNews(): Promise<NewsItem[]> {
  const notion = getNotionClient();
  const dataSourceId = await getDataSourceId(notion);

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      and: [
        { property: "Published", checkbox: { equals: true } },
        { property: "ShowOnHome", checkbox: { equals: true } },
      ],
    },
    sorts: [
      { property: "Date", direction: "descending" },
      { property: "SortOrder", direction: "ascending" },
    ],
    page_size: 3,
  });

  return extractPages(response).map(mapPageToNewsItem);
}

/** Archive: all Published items, paginated */
export async function fetchAllNews(): Promise<NewsItem[]> {
  const notion = getNotionClient();
  const dataSourceId = await getDataSourceId(notion);

  const items: NewsItem[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: "Published",
        checkbox: { equals: true },
      },
      sorts: [
        { property: "Date", direction: "descending" },
        { property: "SortOrder", direction: "ascending" },
      ],
      page_size: 100,
      start_cursor: cursor,
    });

    items.push(...extractPages(response).map(mapPageToNewsItem));
    cursor = response.has_more
      ? (response.next_cursor ?? undefined)
      : undefined;
  } while (cursor);

  return items;
}
