import * as cheerio from 'cheerio';

export interface BookmarkLink {
  url: string;
  title?: string;
}

export function parseChromeBookmarks(html: string): BookmarkLink[] {
  const $ = cheerio.load(html);
  const links: BookmarkLink[] = [];

  // Find all anchor tags
  $('a').each((_, element) => {
    const href = $(element).attr('href');
    const title = $(element).text().trim();

    if (href && href.startsWith('http')) {
      links.push({
        url: href,
        title: title || undefined,
      });
    }
  });

  // Remove duplicates based on URL
  const uniqueLinks = Array.from(
    new Map(links.map((link) => [link.url, link])).values()
  );

  return uniqueLinks;
}

export function isValidBookmarksHtml(html: string): boolean {
  // Check if the HTML looks like a Chrome bookmarks export
  return (
    html.includes('<!DOCTYPE NETSCAPE-Bookmark-file-1>') ||
    html.includes('NETSCAPE-Bookmark-file') ||
    (html.includes('<DT>') && html.includes('<A HREF='))
  );
}
