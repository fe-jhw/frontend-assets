#!/usr/bin/env node

import { brotliCompressSync, gzipSync } from "node:zlib"
import { readdir, readFile, stat } from "node:fs/promises"
import path from "node:path"

const target = path.resolve(process.argv[2] ?? "dist")
const supportedExtensions = new Set([".css", ".js", ".mjs"])

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)))
      continue
    }

    if (supportedExtensions.has(path.extname(entry.name))) {
      files.push(entryPath)
    }
  }

  return files
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`
}

try {
  const targetStat = await stat(target)
  if (!targetStat.isDirectory()) {
    throw new Error("target is not a directory")
  }

  const rows = []
  for (const file of await collectFiles(target)) {
    const contents = await readFile(file)
    rows.push({
      file: path.relative(target, file),
      raw: contents.byteLength,
      gzip: gzipSync(contents).byteLength,
      brotli: brotliCompressSync(contents).byteLength
    })
  }

  rows.sort((left, right) => right.brotli - left.brotli)
  console.table(
    rows.map((row) => ({
      file: row.file,
      raw: formatBytes(row.raw),
      gzip: formatBytes(row.gzip),
      brotli: formatBytes(row.brotli)
    }))
  )
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Unable to inspect ${target}: ${message}`)
  process.exitCode = 1
}
