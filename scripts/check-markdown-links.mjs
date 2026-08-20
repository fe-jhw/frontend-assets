#!/usr/bin/env node

import { access, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const markdownFiles = process.argv.slice(2)

if (markdownFiles.length === 0) {
  console.error("Pass one or more Markdown files to check.")
  process.exitCode = 2
} else {
  const missing = []
  const anchorCache = new Map()

  async function readMarkdownAnchors(filePath) {
    const cached = anchorCache.get(filePath)
    if (cached) {
      return cached
    }

    const text = await readFile(filePath, "utf8")
    const anchors = new Set()
    const slugCounts = new Map()

    for (const match of text.matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
      const baseSlug = match[1]
        .replace(/<[^>]*>/g, "")
        .replace(/[`*_~]/g, "")
        .trim()
        .toLocaleLowerCase("en-US")
        .replace(/[^\p{Letter}\p{Number}\p{Mark}\s-]/gu, "")
        .replace(/\s+/g, "-")
      const duplicateCount = slugCounts.get(baseSlug) ?? 0
      const slug = duplicateCount === 0 ? baseSlug : `${baseSlug}-${duplicateCount}`
      slugCounts.set(baseSlug, duplicateCount + 1)
      anchors.add(slug)
    }

    anchorCache.set(filePath, anchors)
    return anchors
  }

  for (const relativeFile of markdownFiles) {
    const sourcePath = path.resolve(repositoryRoot, relativeFile)
    const text = await readFile(sourcePath, "utf8")

    for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const rawTarget = match[1].trim().replace(/^<|>$/g, "")
      if (/^(?:https?:|mailto:)/i.test(rawTarget)) {
        continue
      }

      const [fileTarget, rawFragment] = rawTarget.split("#", 2)
      const targetPath = fileTarget
        ? path.resolve(path.dirname(sourcePath), decodeURIComponent(fileTarget))
        : sourcePath
      try {
        await access(targetPath)
      } catch {
        missing.push(`${relativeFile}: ${rawTarget}`)
        continue
      }

      if (rawFragment) {
        const anchors = await readMarkdownAnchors(targetPath)
        const fragment = decodeURIComponent(rawFragment).toLocaleLowerCase("en-US")
        if (!anchors.has(fragment)) {
          missing.push(`${relativeFile}: ${rawTarget} (section not found)`)
        }
      }
    }
  }

  if (missing.length > 0) {
    console.error(missing.join("\n"))
    process.exitCode = 1
  } else {
    console.log(`OK: checked local links in ${markdownFiles.length} Markdown file(s)`)
  }
}
