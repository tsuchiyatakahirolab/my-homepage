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
  outlet_en: string;
  outlet_ja: string;
  url_en: string | null;
  url_ja: string | null;
  showOnHome: boolean;
  published: boolean;
  sortOrder: number;
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

let resolvedDataSourceId: string | undefined;

async function getDataSourceId(notion: Client): Promise<string> {
  if (resolvedDataSourceId) return resolvedDataSourceId;

  const dsId = process.env.NOTION_DATA_SOURCE_ID;
  if (dsId) {
    resolvedDataSourceId = dsId;
    return dsId;
  }

  const dbId = process.env.NOTION_DATABASE_ID;
  if (!dbId) {
    throw new Error(
      "NOTION_DATA_SOURCE_ID or NOTION_DATABASE_ID is not configured"
    );
  }

  resolvedDataSourceId = dbId;
  return dbId;
}

/* ══════════════════════════════════════════
   Property Extractors
   ══════════════════════════════════════════

   Actual Notion schema:
     Type        (title)  — headline
     Date        (date)   — publication date
     Published   (select) — "TRUE" when published
     ShowOnHome  (select) — "TRUE" / "FALSE"
     Outlet_en   (text)   — English outlet name
     Outlet_ja   (text)   — Japanese outlet name
     URL_en      (url)    — English link
     URL_ja      (url)    — Japanese link
     SortOrder   (number) — manual sort tiebreaker
   ══════════════════════════════════════════ */

function extractTitle(page: PageObjectResponse): string {
  const prop = page.properties["Type"];
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

function extractSelectEquals(
  page: PageObjectResponse,
  key: string,
  value: string
): boolean {
  const prop = page.properties[key];
  if (prop?.type === "select" && prop.select) {
    return prop.select.name === value;
  }
  return false;
}

function extractRichText(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key];
  if (prop?.type === "rich_text") {
    return prop.rich_text.map((t) => t.plain_text).join("");
  }
  return "";
}

function extractUrl(page: PageObjectResponse, key: string): string | null {
  const prop = page.properties[key];
  if (prop?.type === "url") {
    return prop.url;
  }
  return null;
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
    outlet_en: extractRichText(page, "Outlet_en"),
    outlet_ja: extractRichText(page, "Outlet_ja"),
    url_en: extractUrl(page, "URL_en"),
    url_ja: extractUrl(page, "URL_ja"),
    showOnHome: extractSelectEquals(page, "ShowOnHome", "TRUE"),
    published: extractSelectEquals(page, "Published", "TRUE"),
    sortOrder: extractNumber(page, "SortOrder"),
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

   Published and ShowOnHome are select properties
   with value "TRUE", not checkboxes.
   ══════════════════════════════════════════ */

/** Homepage: Published="TRUE" + ShowOnHome="TRUE", top 3 */
export async function fetchHomeNews(): Promise<NewsItem[]> {
  const notion = getNotionClient();
  const dataSourceId = await getDataSourceId(notion);

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      and: [
        { property: "Published", select: { equals: "TRUE" } },
        { property: "ShowOnHome", select: { equals: "TRUE" } },
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

/** Archive: all Published="TRUE" items, paginated */
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
        select: { equals: "TRUE" },
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
