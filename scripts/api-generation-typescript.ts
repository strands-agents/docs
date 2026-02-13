/**
 * Generate TypeScript API documentation using typedoc-plugin-markdown.
 *
 * This script runs typedoc to generate markdown files, then post-processes them
 * to add frontmatter with slugs for Astro/Starlight compatibility.
 *
 * Usage:
 *   npx tsx scripts/api-generation-typescript.ts
 */

import { execSync } from 'child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync, rmSync, statSync } from 'fs'
import { join, basename, relative } from 'path'

const OUTPUT_DIR = '.build/api-docs/typescript'

interface FileInfo {
  path: string
  category: string // 'classes', 'interfaces', 'type-aliases', 'functions', or 'index'
  name: string
}

/**
 * Recursively get all .md files in a directory
 */
function getAllMdFiles(dir: string, baseDir: string = dir): FileInfo[] {
  const files: FileInfo[] = []

  if (!existsSync(dir)) {
    return files
  }

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...getAllMdFiles(fullPath, baseDir))
    } else if (entry.endsWith('.md')) {
      const relativePath = relative(baseDir, fullPath)
      const parts = relativePath.split('/')

      let category: string
      let name: string

      if (parts.length === 1) {
        // Root level file (index.md)
        category = 'index'
        name = basename(entry, '.md')
      } else {
        // Nested file (classes/Agent.md)
        category = parts[0]!
        name = basename(entry, '.md')
      }

      files.push({ path: fullPath, category, name })
    }
  }

  return files
}

/**
 * Generate a slug for a file (flat, without category)
 */
function generateSlug(category: string, name: string): string {
  if (category === 'index') {
    return 'api/typescript'
  }
  return `api/typescript/${name}`
}

/**
 * Generate a title for a file
 */
function generateTitle(category: string, name: string): string {
  if (category === 'index') {
    return 'TypeScript API Reference'
  }
  return name
}

/**
 * Process a single file to add frontmatter
 */
function processFile(file: FileInfo): void {
  const content = readFileSync(file.path, 'utf-8')

  // Check if frontmatter already exists
  if (content.startsWith('---')) {
    console.log(`Skipping (already has frontmatter): ${file.path}`)
    return
  }

  const slug = generateSlug(file.category, file.name)
  const title = generateTitle(file.category, file.name)

  // For the index file, we'll create a custom one later
  if (file.category === 'index') {
    console.log(`Skipping index file (will be replaced): ${file.path}`)
    return
  }

  // Fix relative links to remove category folders (e.g., ../interfaces/AgentData.md -> ../AgentData.md)
  // This matches the flat slug structure we use
  const processedContent = content.replace(
    /\]\(\.\.\/(classes|interfaces|type-aliases|functions)\/([^)]+)\)/g,
    '](../$2)'
  )

  // Add frontmatter with category for sidebar grouping
  const frontmatter = `---
title: "${title}"
slug: ${slug}
category: ${file.category}
---

`

  const finalContent = frontmatter + processedContent

  writeFileSync(file.path, finalContent, 'utf-8')
  console.log(`Processed: ${file.path}`)
}

/**
 * Main function
 */
function main(): void {
  console.log('🔧 TypeScript API Documentation Generator\n')

  // Step 1: Clean output directory
  if (existsSync(OUTPUT_DIR)) {
    console.log(`Cleaning output directory: ${OUTPUT_DIR}`)
    rmSync(OUTPUT_DIR, { recursive: true })
  }

  // Step 2: Run typedoc
  console.log('\n📚 Running typedoc...\n')
  try {
    execSync('npx typedoc --options typedoc.json', {
      stdio: 'inherit',
    })
  } catch (error) {
    console.error('Failed to run typedoc')
    process.exit(1)
  }

  // Step 3: Get all generated files
  console.log('\n📝 Post-processing files...\n')
  const files = getAllMdFiles(OUTPUT_DIR)

  // Step 4: Process each file (skip the index file - we have our own)
  for (const file of files) {
    if (file.category === 'index') {
      // Delete the generated index file - we use our own in src/content/docs/api/typescript/index.mdx
      rmSync(file.path)
      console.log(`Deleted: ${file.path} (using custom index)`)
      continue
    }
    processFile(file)
  }

  console.log(`\n✅ Done! Generated ${files.length - 1} API doc files.`)
}

main()
