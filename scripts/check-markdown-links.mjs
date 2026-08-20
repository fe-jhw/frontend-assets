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

  for (const relativeFile of markdownFiles) {
    const sourcePath = path.resolve(repositoryRoot, relativeFile)
    const text = await readFile(sourcePath, "utf8")

    for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const rawTarget = match[1].trim().replace(/^<|>$/g, "")
      const fileTarget = rawTarget.split("#", 1)[0]
      if (!fileTarget || /^(?:https?:|mailto:)/i.test(fileTarget)) {
        continue
      }

      const targetPath = path.resolve(path.dirname(sourcePath), decodeURIComponent(fileTarget))
      try {
        await access(targetPath)
      } catch {
        missing.push(`${relativeFile}: ${rawTarget}`)
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
