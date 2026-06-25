interface SearchResult {
  title: string
  url: string
  snippet: string
}

/**
 * Searches the web via DuckDuckGo's HTML search interface and parses organic snippets.
 * This runs entirely on the server using native Node.js fetch with zero dependencies.
 */
export async function searchWeb(query: string, maxResults = 4): Promise<SearchResult[]> {
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
    
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(10000)
    })

    const html = await response.text()
    const results: SearchResult[] = []

    // DuckDuckGo HTML results use the class "web-result" or simple nested divs
    // Let's parse result items using regex matching
    const resultBlockRegex = /<div class="result results_links results_links_deep web-result[^"]*">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g
    let match: RegExpExecArray | null

    while ((match = resultBlockRegex.exec(html)) !== null && results.length < maxResults) {
      const blockContent = match[1]

      // Extract Title & Link
      const titleLinkMatch = blockContent.match(/<a class="result__url"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/)
      // Extract Snippet
      const snippetMatch = blockContent.match(/<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/)

      if (titleLinkMatch) {
        let rawUrl = titleLinkMatch[1]
        // DuckDuckGo redirects links through: /l/?kh=-1&uddg=https%3A%2F%2Fexample.com
        if (rawUrl.includes("uddg=")) {
          const urlParam = rawUrl.split("uddg=")[1]
          if (urlParam) {
            rawUrl = decodeURIComponent(urlParam.split("&")[0])
          }
        }

        const title = titleLinkMatch[2].replace(/<[^>]*>/g, "").trim()
        const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, "").trim() : ""

        results.push({
          title: decodeHtmlEntities(title),
          url: rawUrl,
          snippet: decodeHtmlEntities(snippet)
        })
      }
    }

    if (results.length === 0) {
      // Fallback: try parsing simplified links if DDG layout is slightly different
      const simpleLinkRegex = /<a class="result__snippet"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g
      let simpleMatch: RegExpExecArray | null
      while ((simpleMatch = simpleLinkRegex.exec(html)) !== null && results.length < maxResults) {
        results.push({
          title: "Search Reference Result",
          url: simpleMatch[1],
          snippet: simpleMatch[2].replace(/<[^>]*>/g, "").trim()
        })
      }
    }

    console.log(`Web Search: Retrieved ${results.length} organic reference snippets for query: "${query}"`)
    return results
  } catch (error) {
    console.error("DuckDuckGo web scraper search failed:", error)
    return []
  }
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ")
}
