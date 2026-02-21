import { readdir, readFile, writeFile, mkdir, unlink } from "fs/promises";
import { join, dirname } from "path";
import { updateQuickstart } from "./update-quickstart.js";
import { getCommunityLabeledFiles, getSidebarLabels, type SidebarInfo } from "../src/sidebar.js";
import { convertApiLink, isOldApiLink } from "../src/util/api-link-converter.js";

const DOCS_DIR = "docs";
const OUTPUT_DIR = "src/content/docs";
const MKDOCS_PATH = "mkdocs.yml";
const INFO_BLOCK_PATTERN = '!!! info "Language Support"';
const INFO_BLOCK_CONTENT = "    This provider is only supported in Python.";
const COMMUNITY_BANNER = "{{ community_contribution_banner }}";
const SKIP_FILES: string[] = [];
// Skip index files in examples directory (they're not included in the content collection)
const SKIP_PATTERNS = [/examples\/.*\/index\.md$/];

// Files that need explicit titles because they don't have H1 headings
const EXPLICIT_TITLES: Record<string, string> = {
  "user-guide/quickstart.md": "Quickstart",
  "user-guide/quickstart/python.md": "Python Quickstart",
  // Redirect pages (have <auto-redirect /> but no H1)
  "user-guide/concepts/model-providers/clova-studio.md": "Clova Studio",
  "user-guide/concepts/model-providers/cohere.md": "Cohere",
  "user-guide/concepts/model-providers/fireworksai.md": "Fireworks AI",
  "user-guide/concepts/model-providers/xai.md": "xAI",
  "user-guide/concepts/model-providers/nebius-token-factory.md": "Nebius Token Factory",
};

// MkDocs extra variables from mkdocs.yml
const MKDOCS_VARIABLES: Record<string, string> = {
  docs_repo: "https://github.com/strands-agents/docs/tree/main",
  sdk_pypi: "https://pypi.org/project/strands-agents/",
  sdk_repo: "https://github.com/strands-agents/sdk-python/blob/main",
  py_sdk_repo_home: "https://github.com/strands-agents/sdk-python/blob/main",
  ts_sdk_repo_home: "https://github.com/strands-agents/sdk-typescript/blob/main",
  tools_pypi: "https://pypi.org/project/strands-agents-tools/",
  tools_repo: "https://github.com/strands-agents/tools/blob/main",
  tools_repo_home: "https://github.com/strands-agents/tools",
  agent_builder_pypi: "https://pypi.org/project/strands-agents-builder/",
  agent_builder_repo_home: "https://github.com/strands-agents/agent-builder",
  link_strands_tools: "[`strands-agents-tools`](https://github.com/strands-agents/tools)",
  link_strands_builder: "[`strands-agents-builder`](https://github.com/strands-agents/agent-builder)",
};

// Default messages for macros
const DEFAULT_TS_NOT_SUPPORTED = "This feature is not supported in TypeScript.";
const DEFAULT_TS_NOT_SUPPORTED_CODE = "Not supported in TypeScript";
const DEFAULT_EXPERIMENTAL_WARNING =
  "This feature is experimental and may change in future versions. Use with caution in production environments.";

async function getAllMarkdownFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

async function getAllTypeScriptFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.name.endsWith(".ts")) {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

async function getAllPythonFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.name.endsWith(".py")) {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

async function getAllAssetFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const assetExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico", ".js", ".css"];

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (assetExtensions.some((ext) => entry.name.toLowerCase().endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

/**
 * Replace MkDocs variable references like {{ variable_name }}
 */
function replaceMkdocsVariables(content: string): string {
  let result = content;

  for (const [varName, value] of Object.entries(MKDOCS_VARIABLES)) {
    // Match {{ variable_name }} with optional whitespace
    const pattern = new RegExp(`\\{\\{\\s*${varName}\\s*\\}\\}`, "g");
    result = result.replace(pattern, value);
  }

  return result;
}

/**
 * Replace ts_not_supported() macro calls
 * Generates: !!! info "Not supported in TypeScript"\n    {message}
 */
function replaceTsNotSupported(content: string): string {
  // Match {{ ts_not_supported() }} or {{ ts_not_supported("message") }}
  const pattern = /\{\{\s*ts_not_supported\(\s*(?:"([^"]*)"|'([^']*)')?\s*\)\s*\}\}/g;

  return content.replace(pattern, (_match, doubleQuoted, singleQuoted) => {
    const message = doubleQuoted ?? singleQuoted ?? DEFAULT_TS_NOT_SUPPORTED;
    return `:::note[Not supported in TypeScript]\n${message}\n:::`;
  });
}

/**
 * Replace ts_not_supported_code() macro calls
 * Generates TypeScript code tab with comment
 */
function replaceTsNotSupportedCode(content: string): string {
  // Match {{ ts_not_supported_code() }} or {{ ts_not_supported_code("message") }}
  const pattern = /\{\{\s*ts_not_supported_code\(\s*(?:"([^"]*)"|'([^']*)')?\s*\)\s*\}\}/g;

  return content.replace(pattern, (_match, doubleQuoted, singleQuoted) => {
    const message = doubleQuoted ?? singleQuoted ?? DEFAULT_TS_NOT_SUPPORTED_CODE;
    return `=== "TypeScript"\n\n    \`\`\`ts\n    // ${message}\n    \`\`\``;
  });
}

/**
 * Remove experimental_feature_warning() macro from content
 * The experimental status is tracked via frontmatter instead
 */
function replaceExperimentalWarning(content: string): string {
  // Only match the exact macro with no arguments: {{ experimental_feature_warning() }}
  const pattern = /\{\{\s*experimental_feature_warning\(\)\s*\}\}\n?/g;
  return content.replace(pattern, "");
}

/**
 * Convert MkDocs tabs syntax to <tabs>/<tab> format
 * MkDocs format:
 *   === "Label"
 *       content (indented 4 spaces)
 *   === "Label2"
 *       content (indented 4 spaces)
 * 
 * New format:
 *   <tabs>
 *   <tab label="Label">
 *   content (no indent)
 *   </tab>
 *   <tab label="Label2">
 *   content (no indent)
 *   </tab>
 *   </tabs>
 */
function convertMkdocsTabs(content: string): string {
  const lines = content.split("\n");
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Match tab start: === "Label" or === 'Label'
    const tabMatch = line.match(/^(\s*)===\s+["']([^"']+)["']\s*$/);

    if (tabMatch) {
      const [, leadingWhitespace, firstLabel] = tabMatch;
      const baseIndent = leadingWhitespace.length;
      const contentIndent = baseIndent + 4;

      // Start collecting tabs
      const tabs: Array<{ label: string; content: string[] }> = [];
      
      // Process first tab
      let currentLabel = firstLabel;
      let currentContent: string[] = [];
      i++;

      while (i < lines.length) {
        const currentLine = lines[i];
        
        // Check for next tab at same indentation level
        const nextTabMatch = currentLine.match(/^(\s*)===\s+["']([^"']+)["']\s*$/);
        if (nextTabMatch && nextTabMatch[1].length === baseIndent) {
          // Save current tab and start new one
          tabs.push({ label: currentLabel, content: currentContent });
          currentLabel = nextTabMatch[2];
          currentContent = [];
          i++;
          continue;
        }

        // Check if we've exited the tab block (non-empty line at base indent or less)
        if (currentLine.trim() !== "") {
          const lineIndent = currentLine.match(/^(\s*)/)?.[1].length ?? 0;
          if (lineIndent < contentIndent && !currentLine.match(/^(\s*)===\s+["']/)) {
            // We've exited the tabs block
            break;
          }
        }

        // Handle content lines
        if (currentLine.trim() === "") {
          // Empty line - check if we're still in tabs
          let nextNonEmpty = i + 1;
          while (nextNonEmpty < lines.length && lines[nextNonEmpty].trim() === "") {
            nextNonEmpty++;
          }

          if (nextNonEmpty < lines.length) {
            const nextLine = lines[nextNonEmpty];
            const nextTabMatch = nextLine.match(/^(\s*)===\s+["']([^"']+)["']\s*$/);
            const nextIndent = nextLine.match(/^(\s*)/)?.[1].length ?? 0;
            
            // Continue if next content is indented or is another tab
            if (nextIndent >= contentIndent || (nextTabMatch && nextTabMatch[1].length === baseIndent)) {
              currentContent.push("");
              i++;
              continue;
            }
          }
          // End of tabs block
          break;
        }

        // Content line - remove the 4-space indentation
        const lineIndent = currentLine.match(/^(\s*)/)?.[1].length ?? 0;
        if (lineIndent >= contentIndent) {
          currentContent.push(currentLine.slice(contentIndent));
        } else {
          currentContent.push(currentLine.slice(lineIndent));
        }
        i++;
      }

      // Save last tab
      tabs.push({ label: currentLabel, content: currentContent });

      // Only convert if we have multiple tabs (single === might be something else)
      if (tabs.length >= 1) {
        // Build the new tabs format
        result.push(`${leadingWhitespace}<Tabs>`);
        for (const tab of tabs) {
          result.push(`${leadingWhitespace}<Tab label="${tab.label}">`);
          // Trim trailing empty lines from content
          while (tab.content.length > 0 && tab.content[tab.content.length - 1].trim() === "") {
            tab.content.pop();
          }
          // Add content without extra indentation
          for (const contentLine of tab.content) {
            result.push(`${leadingWhitespace}${contentLine}`);
          }
          result.push(`${leadingWhitespace}</Tab>`);
        }
        result.push(`${leadingWhitespace}</Tabs>`);
      } else {
        // Not a valid tabs block, restore original
        result.push(line);
      }
    } else {
      result.push(line);
      i++;
    }
  }

  return result.join("\n");
}

/**
 * Map MkDocs admonition types to Astro aside types
 * MkDocs types: note, abstract, info, tip, success, question, warning, failure, danger, bug, example, quote
 * Astro types: note, tip, caution, danger
 */
function mapAdmonitionType(mkdocsType: string): string {
  const typeMap: Record<string, string> = {
    note: "note",
    abstract: "note",
    summary: "note",
    tldr: "note",
    info: "note",
    todo: "note",
    tip: "tip",
    hint: "tip",
    important: "tip",
    success: "tip",
    check: "tip",
    done: "tip",
    question: "note",
    help: "note",
    faq: "note",
    warning: "caution",
    caution: "caution",
    attention: "caution",
    failure: "danger",
    fail: "danger",
    missing: "danger",
    danger: "danger",
    error: "danger",
    bug: "danger",
    example: "note",
    snippet: "note",
    quote: "note",
    cite: "note",
  };

  return typeMap[mkdocsType.toLowerCase()] ?? "note";
}

/**
 * Convert MkDocs admonitions to Astro asides
 * MkDocs format: !!! type "Title"\n    content (indented)
 * Astro format: :::type[Title]\ncontent\n:::
 */
function convertAdmonitions(content: string): string {
  const lines = content.split("\n");
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Match admonition start: !!! type "Title" or !!! type 'Title' or !!! type
    // Also matches collapsible variants: ??? type and ???+ type
    const admonitionMatch = line.match(/^(\s*)(?:!!!|\?\?\?[+]?)\s+(\w+)(?:\s+["']([^"']+)["'])?\s*$/);

    if (admonitionMatch) {
      const [, leadingWhitespace, type, title] = admonitionMatch;
      const astroType = mapAdmonitionType(type);
      const titlePart = title ? `[${title}]` : "";

      // Collect indented content lines (4 spaces more than the !!! line)
      const contentLines: string[] = [];
      const baseIndent = leadingWhitespace.length;
      const contentIndent = baseIndent + 4;

      i++;
      while (i < lines.length) {
        const contentLine = lines[i];

        // Check if line is indented content (at least 4 spaces more than base)
        // or is an empty line (which could be part of the admonition)
        if (contentLine.trim() === "") {
          // Empty line - could be part of admonition or separator
          // Look ahead to see if next non-empty line is still indented
          let nextNonEmpty = i + 1;
          while (nextNonEmpty < lines.length && lines[nextNonEmpty].trim() === "") {
            nextNonEmpty++;
          }

          if (nextNonEmpty < lines.length) {
            const nextLine = lines[nextNonEmpty];
            const nextIndent = nextLine.match(/^(\s*)/)?.[1].length ?? 0;
            if (nextIndent >= contentIndent) {
              // Next content is still indented, include empty line
              contentLines.push("");
              i++;
              continue;
            }
          }
          // End of admonition
          break;
        }

        const lineIndent = contentLine.match(/^(\s*)/)?.[1].length ?? 0;
        if (lineIndent >= contentIndent) {
          // Remove the content indentation (4 spaces relative to base)
          contentLines.push(contentLine.slice(contentIndent));
          i++;
        } else {
          // Line is not indented enough, end of admonition
          break;
        }
      }

      // Build the Astro aside
      result.push(`${leadingWhitespace}:::${astroType}${titlePart}`);
      for (const contentLine of contentLines) {
        result.push(`${leadingWhitespace}${contentLine}`);
      }
      result.push(`${leadingWhitespace}:::`);
    } else {
      result.push(line);
      i++;
    }
  }

  return result.join("\n");
}

/**
 * Convert HTML comments to JSX comments
 * HTML format: <!-- comment -->
 * JSX format: \{/* comment *\/\}
 */
function convertHtmlCommentsToJsx(content: string): string {
  // Match HTML comments: <!-- ... -->
  // Use non-greedy match to handle multiple comments
  return content.replace(/<!--([\s\S]*?)-->/g, (_match, commentContent) => {
    return `{/*${commentContent}*/}`;
  });
}

/**
 * Convert HTML <br> tags to self-closing JSX <br /> tags
 * MDX requires self-closing tags
 */
function convertBrToSelfClosing(content: string): string {
  // Match <br> that isn't already self-closing (not followed by optional whitespace and /)
  return content.replace(/<br\s*(?!\/)>/gi, "<br />");
}

/**
 * Convert old MkDocs-style API reference links to the new @api shorthand format.
 * 
 * Old formats:
 * - Python: `../api-reference/python/agent/agent_result.md#strands.agent.agent_result.AgentResult`
 * - TypeScript: `../api-reference/typescript/classes/BedrockModel.html`
 * 
 * New formats:
 * - Python: `@api/python/strands.agent.agent_result#AgentResult`
 * - TypeScript: `@api/typescript/BedrockModel`
 */
function convertApiLinks(content: string): string {
  // Match markdown links with potentially nested brackets in the text
  // This handles cases like [`list[ToolSpec]`](url)
  const markdownLinkPattern = /\[([^\]]*(?:\[[^\]]*\][^\]]*)*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  
  return content.replace(markdownLinkPattern, (match, text, url) => {
    if (isOldApiLink(url)) {
      const newUrl = convertApiLink(url);
      if (newUrl) {
        return `[${text}](${newUrl})`;
      }
    }
    return match;
  });
}

/**
 * Remove community_contribution_banner macro from content
 * The banner is rendered via a component based on `community: true` frontmatter
 */
function removeCommunityBannerMacro(content: string): string {
  const pattern = /\{\{\s*community_contribution_banner\s*\}\}\n?/g;
  return content.replace(pattern, "");
}

/**
 * Remove the Language Support info block from content
 * The language support is indicated via `languages: Python` frontmatter
 */
function removeLanguageSupportBlock(content: string): string {
  const lines = content.split("\n");
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check for the language support info block
    if (line === INFO_BLOCK_PATTERN) {
      i++;
      // Skip the content line if it matches
      if (i < lines.length && lines[i] === INFO_BLOCK_CONTENT) {
        i++;
      }
      // Skip trailing blank line if present
      if (i < lines.length && lines[i].trim() === "") {
        i++;
      }
      continue;
    }

    result.push(line);
    i++;
  }

  return result.join("\n");
}

/**
 * Extract the first L1 heading (# Title) from content
 * Returns the title text or null if not found
 */
function extractH1Title(content: string): string | null {
  // Match # Title at the start of a line (not inside code blocks)
  const lines = content.split("\n");
  let inCodeBlock = false;

  for (const line of lines) {
    // Track code blocks to avoid matching headings inside them
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (!inCodeBlock) {
      const h1Match = line.match(/^#\s+(.+)$/);
      if (h1Match) {
        return h1Match[1].trim();
      }
    }
  }

  return null;
}

/**
 * Check if frontmatter already has a title field
 */
function frontmatterHasTitle(content: string): boolean {
  const lines = content.split("\n");
  if (lines[0] !== "---") return false;

  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") break;
    if (lines[i].match(/^title:\s*.+$/)) {
      return true;
    }
  }

  return false;
}

/**
 * Remove the first L1 heading from content
 */
function removeH1Heading(content: string): string {
  const lines = content.split("\n");
  const result: string[] = [];
  let inCodeBlock = false;
  let removedH1 = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track code blocks
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }

    if (!inCodeBlock && !removedH1) {
      const h1Match = line.match(/^#\s+.+$/);
      if (h1Match) {
        removedH1 = true;
        // Skip blank line after H1 if present
        if (i + 1 < lines.length && lines[i + 1].trim() === "") {
          i++;
        }
        continue;
      }
    }

    result.push(line);
  }

  return result.join("\n");
}

function processFile(content: string, explicitTitle?: string, hasCommunityLabel?: boolean, sidebarInfo?: SidebarInfo, isBidiPage?: boolean): { modified: boolean; newContent: string } {
  // Detect features BEFORE any transformations
  const hasLanguageBlock = content.includes(INFO_BLOCK_PATTERN);
  const hasCommunityBanner = content.includes(COMMUNITY_BANNER);
  // Only match the exact macro with no arguments
  const hasExperimentalWarningMacro = content.includes("{{ experimental_feature_warning() }}");
  const alreadyHasLanguages = content.includes("languages:");
  const alreadyHasCommunity = content.includes("community:");
  const alreadyHasExperimental = content.includes("experimental:");
  const alreadyHasSidebar = content.includes("sidebar:");

  // Determine what frontmatter needs to be added based on original content
  const needsLanguages = hasLanguageBlock && !alreadyHasLanguages;
  const needsCommunity = hasCommunityBanner && !alreadyHasCommunity;

  // Apply all macro replacements and conversions
  let newContent = content;
  newContent = replaceMkdocsVariables(newContent);
  newContent = replaceTsNotSupported(newContent);
  newContent = replaceTsNotSupportedCode(newContent);
  newContent = replaceExperimentalWarning(newContent);
  newContent = removeCommunityBannerMacro(newContent);
  newContent = removeLanguageSupportBlock(newContent);
  newContent = convertAdmonitions(newContent);
  newContent = convertMkdocsTabs(newContent);
  newContent = convertHtmlCommentsToJsx(newContent);
  newContent = convertBrToSelfClosing(newContent);
  newContent = convertApiLinks(newContent);

  // Handle H1 heading and title frontmatter
  const h1Title = extractH1Title(newContent);
  const hasExistingTitle = frontmatterHasTitle(newContent);
  let titleToUse = explicitTitle ?? h1Title;
  
  // Check if title contains [Experimental] and strip it
  const hasExperimentalInTitle = titleToUse?.includes("[Experimental]") ?? false;
  if (hasExperimentalInTitle && titleToUse) {
    titleToUse = titleToUse.replace(/\s*\[Experimental\]\s*/g, "").trim();
  }

  // Determine if file needs experimental frontmatter (from title or macro)
  const hasExperimentalContent = hasExperimentalInTitle || hasExperimentalWarningMacro;
  const needsExperimental = hasExperimentalContent && !alreadyHasExperimental;
  const needsTitle = titleToUse && !hasExistingTitle;
  
  // Determine sidebar badge type (experimental takes precedence, then nav badge, then community)
  // Nav badges from <sup> tags: "new", "community", etc.
  const navBadge = sidebarInfo?.badge;
  const needsExperimentalBadge = hasExperimentalContent && !alreadyHasSidebar && !isBidiPage;
  const needsNavBadge = navBadge && !alreadyHasSidebar && !needsExperimentalBadge;
  const needsCommunityBadge = hasCommunityLabel && !alreadyHasSidebar && !needsExperimentalBadge && !needsNavBadge;
  
  // Determine if sidebar label is needed (when label differs from title)
  const sidebarLabel = sidebarInfo?.label;
  const needsSidebarLabel = sidebarLabel && sidebarLabel !== titleToUse && !alreadyHasSidebar;
  
  // Determine if any sidebar config is needed
  const needsSidebar = needsExperimentalBadge || needsNavBadge || needsCommunityBadge || needsSidebarLabel;

  // If there's an H1 heading, remove it (title goes in frontmatter)
  if (h1Title) {
    newContent = removeH1Heading(newContent);
  }

  // Check if content was transformed
  const contentTransformed = newContent !== content;

  // Determine if any modifications are needed
  const needsModification = contentTransformed || needsLanguages || needsCommunity || needsExperimental || needsTitle || needsSidebar;

  if (!needsModification) {
    return { modified: false, newContent: content };
  }

  const lines = newContent.split("\n");
  const newLines: string[] = [];
  const hasFrontMatter = lines[0] === "---";
  let inFrontMatter = false;
  let addedLanguages = alreadyHasLanguages;
  let addedCommunity = alreadyHasCommunity;
  let addedExperimental = alreadyHasExperimental;
  let addedTitle = hasExistingTitle;
  let addedSidebar = alreadyHasSidebar;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle front-matter
    if (i === 0 && line === "---") {
      inFrontMatter = true;
      newLines.push(line);
      continue;
    }

    if (inFrontMatter && line === "---") {
      // End of front-matter - add fields before closing ---
      if (titleToUse && !addedTitle) {
        // Escape quotes in title for YAML
        const escapedTitle = titleToUse.includes(":") || titleToUse.includes('"') || titleToUse.includes("'")
          ? `"${titleToUse.replace(/"/g, '\\"')}"`
          : titleToUse;
        newLines.push(`title: ${escapedTitle}`);
        addedTitle = true;
      }
      if (hasLanguageBlock && !addedLanguages) {
        newLines.push("languages: Python");
        addedLanguages = true;
      }
      if (hasCommunityBanner && !addedCommunity) {
        newLines.push("community: true");
        addedCommunity = true;
      }
      if (hasExperimentalContent && !addedExperimental) {
        newLines.push("experimental: true");
        addedExperimental = true;
      }
      // Add sidebar config (label and/or badge)
      if (needsSidebar && !addedSidebar) {
        newLines.push("sidebar:");
        if (needsSidebarLabel) {
          newLines.push(`  label: "${sidebarLabel}"`);
        }
        if (needsExperimentalBadge) {
          newLines.push("  badge:");
          newLines.push("    text: Experimental");
          newLines.push("    variant: note");
        } else if (needsNavBadge) {
          // Capitalize first letter of badge text
          const badgeText = navBadge.charAt(0).toUpperCase() + navBadge.slice(1);
          newLines.push("  badge:");
          newLines.push(`    text: ${badgeText}`);
          newLines.push("    variant: note");
        } else if (needsCommunityBadge) {
          newLines.push("  badge:");
          newLines.push("    text: Community");
          newLines.push("    variant: note");
        }
        addedSidebar = true;
      }
      inFrontMatter = false;
      newLines.push(line);
      continue;
    }

    newLines.push(line);
  }

  // If no front-matter existed, add it at the beginning
  if (!hasFrontMatter) {
    const frontMatterFields: string[] = [];
    if (titleToUse) {
      const escapedTitle = titleToUse.includes(":") || titleToUse.includes('"') || titleToUse.includes("'")
        ? `"${titleToUse.replace(/"/g, '\\"')}"`
        : titleToUse;
      frontMatterFields.push(`title: ${escapedTitle}`);
    }
    if (hasLanguageBlock) frontMatterFields.push("languages: Python");
    if (hasCommunityBanner) frontMatterFields.push("community: true");
    if (hasExperimentalContent) frontMatterFields.push("experimental: true");
    // Add sidebar config (label and/or badge)
    if (needsSidebar) {
      frontMatterFields.push("sidebar:");
      if (needsSidebarLabel) {
        frontMatterFields.push(`  label: "${sidebarLabel}"`);
      }
      if (needsExperimentalBadge) {
        frontMatterFields.push("  badge:");
        frontMatterFields.push("    text: Experimental");
        frontMatterFields.push("    variant: note");
      } else if (needsNavBadge) {
        // Capitalize first letter of badge text
        const badgeText = navBadge.charAt(0).toUpperCase() + navBadge.slice(1);
        frontMatterFields.push("  badge:");
        frontMatterFields.push(`    text: ${badgeText}`);
        frontMatterFields.push("    variant: note");
      } else if (needsCommunityBadge) {
        frontMatterFields.push("  badge:");
        frontMatterFields.push("    text: Community");
        frontMatterFields.push("    variant: note");
      }
    }
    if (frontMatterFields.length > 0) {
      newLines.unshift("---", ...frontMatterFields, "---", "");
    }
  }

  const finalContent = newLines.join("\n");
  return { modified: finalContent !== content, newContent: finalContent };
}

async function main() {
  console.log(`Scanning ${DOCS_DIR} for markdown files...`);
  console.log(`Output directory: ${OUTPUT_DIR}`);

  // Ensure output directory exists (use docs:revert to clean before re-running)
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Load community-labeled files from mkdocs.yml nav
  const communityLabeledFiles = getCommunityLabeledFiles(MKDOCS_PATH);
  console.log(`Found ${communityLabeledFiles.size} community-labeled files in nav`);

  // Load sidebar labels from mkdocs.yml nav
  const sidebarLabels = getSidebarLabels(MKDOCS_PATH);
  console.log(`Found ${sidebarLabels.size} sidebar labels in nav`);

  const files = await getAllMarkdownFiles(DOCS_DIR);
  let processedCount = 0;

  for (const file of files) {
    // Skip special-cased files
    if (SKIP_FILES.some((skip) => file.endsWith(skip))) {
      continue;
    }
    
    // Skip files matching skip patterns (e.g., index files in examples)
    if (SKIP_PATTERNS.some((pattern) => pattern.test(file))) {
      console.log(`⊘ Skipped (pattern): ${file}`);
      continue;
    }

    const content = await readFile(file, "utf-8");
    
    // Check if this file needs an explicit title
    const relativePath = file.replace(`${DOCS_DIR}/`, "");
    const explicitTitle = EXPLICIT_TITLES[relativePath];
    
    // Check if this file has a community label in the nav
    const hasCommunityLabel = communityLabeledFiles.has(relativePath);
    
    // Get sidebar info from nav (label and badge)
    const sidebarInfo = sidebarLabels.get(relativePath);
    
    // Check if this is a bidi (bidirectional-streaming) page — skip experimental badge for these
    const isBidiPage = relativePath.startsWith("user-guide/concepts/bidirectional-streaming/");

    const { newContent } = processFile(content, explicitTitle, hasCommunityLabel, sidebarInfo, isBidiPage);

    // Determine output path (convert .md to .mdx and write to OUTPUT_DIR)
    const outputRelativePath = relativePath.replace(/\.md$/, ".mdx");
    const outputPath = join(OUTPUT_DIR, outputRelativePath);
    
    // Ensure output directory exists
    await mkdir(dirname(outputPath), { recursive: true });
    
    // Write processed content to output directory
    await writeFile(outputPath, newContent, "utf-8");
    
    // Delete the original source file
    await unlink(file);
    
    console.log(`✓ ${relativePath} → ${outputRelativePath}`);
    processedCount++;
  }

  console.log(`\nDone! Processed ${processedCount} markdown file(s) to ${OUTPUT_DIR}.`);

  // Copy TypeScript files (used for code snippets)
  const tsFiles = await getAllTypeScriptFiles(DOCS_DIR);
  let tsCopiedCount = 0;

  for (const file of tsFiles) {
    const relativePath = file.replace(`${DOCS_DIR}/`, "");
    const outputPath = join(OUTPUT_DIR, relativePath);

    // Ensure output directory exists
    await mkdir(dirname(outputPath), { recursive: true });

    // Read and write the file (simple copy)
    const content = await readFile(file, "utf-8");
    await writeFile(outputPath, content, "utf-8");

    // Delete the original source file
    await unlink(file);

    console.log(`✓ Copied: ${relativePath}`);
    tsCopiedCount++;
  }

  console.log(`Copied ${tsCopiedCount} TypeScript file(s).`);

  // Copy Python files (used for code snippets)
  const pyFiles = await getAllPythonFiles(DOCS_DIR);
  let pyCopiedCount = 0;

  for (const file of pyFiles) {
    const relativePath = file.replace(`${DOCS_DIR}/`, "");
    const outputPath = join(OUTPUT_DIR, relativePath);

    // Ensure output directory exists
    await mkdir(dirname(outputPath), { recursive: true });

    // Read and write the file (simple copy)
    const content = await readFile(file, "utf-8");
    await writeFile(outputPath, content, "utf-8");

    // Delete the original source file
    await unlink(file);

    console.log(`✓ Copied: ${relativePath}`);
    pyCopiedCount++;
  }

  console.log(`Copied ${pyCopiedCount} Python file(s).`);

  // Copy asset files (images, JS, CSS, etc.)
  const assetFiles = await getAllAssetFiles(DOCS_DIR);
  let assetCopiedCount = 0;

  for (const file of assetFiles) {
    const relativePath = file.replace(`${DOCS_DIR}/`, "");
    const outputPath = join(OUTPUT_DIR, relativePath);

    // Ensure output directory exists
    await mkdir(dirname(outputPath), { recursive: true });

    // Read and write the file as binary
    const content = await readFile(file);
    await writeFile(outputPath, content);

    // Delete the original source file
    await unlink(file);

    console.log(`✓ Copied asset: ${relativePath}`);
    assetCopiedCount++;
  }

  console.log(`Copied ${assetCopiedCount} asset file(s).`);

  // Run special-case page updates
  await updateQuickstart();
}

main().catch(console.error);
