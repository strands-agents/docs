import { describe, it, expect } from 'vitest'
import { resolveRedirect, resolveRedirectFromUrl } from '../src/util/redirect'

const redirectCases: Array<{ description: string; input: string; expected: string | null }> = [
  // Renamed pages
  { description: 'python-tools renamed to custom-tools',   input: 'docs/user-guide/concepts/tools/python-tools',         expected: 'docs/user-guide/concepts/tools/custom-tools' },
  { description: 'multi_agent_example index -> main page', input: 'docs/examples/python/multi_agent_example',             expected: 'docs/examples/python/multi_agent_example/multi_agent_example' },
  // No redirect
  { description: 'current page returns null',              input: 'docs/user-guide/concepts/agents/agent-loop',           expected: null },
  { description: 'unknown path returns null',              input: 'docs/some/unknown/path',                               expected: null },
  { description: 'api-reference path returns null',        input: 'docs/api-reference/python/agent/agent',                expected: null },
  { description: 'api path returns null',                  input: 'docs/api/python/strands.agent.agent',                  expected: null },
]

describe('resolveRedirect', () => {
  it.each(redirectCases.map((c) => [c.description, c.input, c.expected]))(
    '%s',
    (_description, input, expected) => {
      expect(resolveRedirect(input)).toBe(expected)
    }
  )
})

describe('resolveRedirect with redirectFromMap', () => {
  const redirectFromMap: Record<string, string> = {
    'docs/user-guide/concepts/model-providers/cohere': 'docs/community/model-providers/cohere',
    'docs/user-guide/concepts/model-providers/fireworksai': 'docs/community/model-providers/fireworksai',
    'docs/old/path': 'docs/new/path',
  }

  it('should resolve redirectFrom mappings correctly', () => {
    expect(resolveRedirect('docs/user-guide/concepts/model-providers/cohere', redirectFromMap)).toBe(
      'docs/community/model-providers/cohere'
    )
    expect(resolveRedirect('docs/user-guide/concepts/model-providers/fireworksai', redirectFromMap)).toBe(
      'docs/community/model-providers/fireworksai'
    )
    expect(resolveRedirect('docs/old/path', redirectFromMap)).toBe('docs/new/path')
  })

  it('should give SLUG_RULES priority over redirectFrom mappings', () => {
    // python-tools is in SLUG_RULES, so it should redirect to custom-tools even if in redirectFromMap
    const mapWithConflict: Record<string, string> = {
      'docs/user-guide/concepts/tools/python-tools': 'docs/some/other/place',
    }
    expect(resolveRedirect('docs/user-guide/concepts/tools/python-tools', mapWithConflict)).toBe(
      'docs/user-guide/concepts/tools/custom-tools'
    )
  })

  it('should return null for unknown slugs not in either SLUG_RULES or redirectFromMap', () => {
    expect(resolveRedirect('docs/completely/unknown/path', redirectFromMap)).toBe(null)
  })

  it('should work without redirectFromMap (backward compatible)', () => {
    expect(resolveRedirect('docs/user-guide/concepts/tools/python-tools')).toBe(
      'docs/user-guide/concepts/tools/custom-tools'
    )
    expect(resolveRedirect('docs/some/unknown/path')).toBe(null)
  })
})

const urlCases: Array<{ description: string; url: string; expected: string | null }> = [
  { description: 'latest root redirects to /',                         url: 'https://strandsagents.com/latest/',                                                                expected: '/' },
  { description: '1.x root redirects to /',                            url: 'https://strandsagents.com/1.x/',                                                                  expected: '/' },
  { description: '1.5.x root redirects to /',                          url: 'https://strandsagents.com/1.5.x/',                                                                expected: '/' },
  { description: '1.x docs index redirects to docs/',                  url: 'https://strandsagents.com/1.x/documentation/docs/',                                               expected: 'docs/' },
  { description: 'latest docs index redirects to docs/',               url: 'https://strandsagents.com/latest/documentation/docs/',                                            expected: 'docs/' },
  { description: '1.5.x doc page with trailing slash passes through',  url: 'https://strandsagents.com/1.5.x/documentation/docs/user-guide/concepts/agents/state/',            expected: 'docs/user-guide/concepts/agents/state/' },
  { description: '1.5.x doc page without trailing slash',              url: 'https://strandsagents.com/1.5.x/documentation/docs/user-guide/concepts/agents/state',             expected: 'docs/user-guide/concepts/agents/state' },
  { description: 'unrecognised URL with trailing slash passes through', url: 'https://strandsagents.com/latest/some/other/path/',                                              expected: 'some/other/path/' },
  { description: 'unrecognised URL without trailing slash',            url: 'https://strandsagents.com/latest/some/other/path',                                               expected: 'some/other/path' },
  { description: 'unchanged slug with trailing slash from 1.x',        url: 'https://strandsagents.com/1.x/documentation/docs/community/community-packages/',                 expected: 'docs/community/community-packages/' },
  { description: 'unchanged slug without trailing slash from 1.x',     url: 'https://strandsagents.com/1.x/documentation/docs/community/community-packages',                  expected: 'docs/community/community-packages' },
  { description: 'renamed page with trailing slash',                   url: 'https://strandsagents.com/latest/documentation/docs/user-guide/concepts/tools/python-tools/',    expected: 'docs/user-guide/concepts/tools/custom-tools/' },
  { description: 'renamed page without trailing slash',                url: 'https://strandsagents.com/latest/documentation/docs/user-guide/concepts/tools/python-tools',     expected: 'docs/user-guide/concepts/tools/custom-tools' },
  // we don't rewrite these because they're subject to change quite a bit
  { description: 'api-reference URL passes through unrewritten',       url: 'https://strandsagents.com/latest/documentation/docs/api-reference/python/agent/agent/',          expected: 'docs/api-reference/python/agent/agent/' },
  // URLs with file extensions must not have a trailing slash added
  { description: 'index.md URL has no trailing slash added',           url: 'https://strandsagents.com/latest/documentation/docs/some/files/index.md',                        expected: 'docs/some/files/index.md' },
  { description: '.txt URL has no trailing slash added',               url: 'https://strandsagents.com/latest/documentation/docs/llms.txt',                                   expected: 'docs/llms.txt' },
  // Top-level versioned paths (not under /documentation/docs/) pass through after version strip
  { description: 'versioned llms.txt redirects to llms.txt',           url: 'https://strandsagents.com/latest/llms.txt',                                                      expected: 'llms.txt' },
]

describe('resolveRedirectFromUrl', () => {
  it.each(urlCases.map((c) => [c.description, c.url, c.expected]))(
    '%s',
    (_description, url, expected) => {
      expect(resolveRedirectFromUrl(url)).toBe(expected)
    }
  )
})
