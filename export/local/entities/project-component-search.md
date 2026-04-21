---
type: concept
title: Project Component Search
---

# project-component-search

**Type:** project
**Updated:** 2026-03-26T16:10:46.083Z

## Summary

Thinking Process:

1.  **Analyze the Request:**
    *   Task: Summarize the given entity in one sentence.
    *   Entity: `project-component-search` (project).
    *   Facts provided:
        *   Issues with outdated search results.
        *   Currently uses Tavily API.
        *   Uses Brave API for web_search.
        *   Uses PostgreSQL for parts database.
        *   Switching to Fire

## Facts

- Has issues with outdated search results
- Currently uses Tavily API
- Uses Brave API for web_search
- Uses PostgreSQL for parts database
- Switching to Firecrawl
- Existing skill being enhanced with XCrawl integration
- Electronic parts search skill for LCSC/DigiKey
- Needs web scraping enhancement with XCrawl API
- Uses Firecrawl and Tavily APIs for search
- Currently implemented in Bash (search.sh)
- Goal to migrate to Python or add XCrawl

## Connected to

- [[person-george-arbiger]] — works on (reverse)
- [[tavily-api]] — uses for search
- [[person-george-arbiger]] — manages (reverse)
- [[tool-firecrawl]] — replacing web_search provider for (reverse)
- [[person-george-arbiger]] — develops (reverse)

## Activity

- 2026-03-26: Mentioned in conversation
- 2026-03-25: Mentioned in conversation
- 2026-03-25: Mentioned in conversation
