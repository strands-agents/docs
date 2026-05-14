import { describe, it, expect } from 'vitest'
import type { CollectionEntry } from 'astro:content'
import { relatedUserGuideFor, humanRelatedUserGuideFor } from '../src/util/related-docs'

function doc(id: string, title: string, tags: string[]): CollectionEntry<'docs'> {
  return { id, collection: 'docs', data: { title, tags } } as unknown as CollectionEntry<'docs'>
}

describe('relatedUserGuideFor (headless: top 10, Jaccard)', () => {
  it('ranks pages by tag-overlap size, descending', () => {
    const current = doc('docs/user-guide/a', 'A', ['x', 'y', 'z'])
    const two = doc('docs/user-guide/b', 'B', ['x', 'y'])
    const one = doc('docs/user-guide/c', 'C', ['x'])

    const result = relatedUserGuideFor(current, [current, one, two])
    expect(result.map((r) => r.title)).toEqual(['B', 'C'])
  })

  it('breaks overlap ties alphabetically by title', () => {
    const current = doc('docs/user-guide/a', 'A', ['x'])
    const zebra = doc('docs/user-guide/z', 'Zebra', ['x'])
    const apple = doc('docs/user-guide/b', 'Apple', ['x'])

    const result = relatedUserGuideFor(current, [current, zebra, apple])
    expect(result.map((r) => r.title)).toEqual(['Apple', 'Zebra'])
  })

  it('excludes the current page from its own results', () => {
    const current = doc('docs/user-guide/a', 'A', ['x'])
    const other = doc('docs/user-guide/b', 'B', ['x'])

    const result = relatedUserGuideFor(current, [current, other])
    expect(result.map((r) => r.slug)).toEqual(['docs/user-guide/b'])
  })

  it('returns empty when the current page has no tags', () => {
    const current = doc('docs/user-guide/a', 'A', [])
    const other = doc('docs/user-guide/b', 'B', ['x'])

    expect(relatedUserGuideFor(current, [current, other])).toEqual([])
  })

  it('returns empty when no other page shares a tag', () => {
    const current = doc('docs/user-guide/a', 'A', ['x'])
    const other = doc('docs/user-guide/b', 'B', ['y'])

    expect(relatedUserGuideFor(current, [current, other])).toEqual([])
  })

  it('ignores candidates outside the user-guide tree', () => {
    const current = doc('docs/user-guide/a', 'A', ['x'])
    const blogLike = doc('docs/community/b', 'B', ['x'])
    const userGuide = doc('docs/user-guide/c', 'C', ['x'])

    const result = relatedUserGuideFor(current, [current, blogLike, userGuide])
    expect(result.map((r) => r.slug)).toEqual(['docs/user-guide/c'])
  })

  it('returns empty when the current page is not in the user-guide tree', () => {
    const current = doc('docs/community/a', 'A', ['x'])
    const other = doc('docs/user-guide/b', 'B', ['x'])

    expect(relatedUserGuideFor(current, [current, other])).toEqual([])
  })

  it('caps at 10 matches', () => {
    const current = doc('docs/user-guide/a', 'A', ['x'])
    const candidates = Array.from({ length: 12 }, (_, i) =>
      doc(`docs/user-guide/${i}`, `T${i}`, ['x'])
    )

    expect(relatedUserGuideFor(current, [current, ...candidates])).toHaveLength(10)
  })

  it('reports overlap count on each result', () => {
    const current = doc('docs/user-guide/a', 'A', ['x', 'y', 'z'])
    const two = doc('docs/user-guide/b', 'B', ['x', 'y'])
    const one = doc('docs/user-guide/c', 'C', ['x'])

    const result = relatedUserGuideFor(current, [current, one, two])
    expect(result).toEqual([
      { slug: 'docs/user-guide/b', title: 'B', overlap: 2 },
      { slug: 'docs/user-guide/c', title: 'C', overlap: 1 },
    ])
  })

  it('prefers a focused match over a coincidental multi-tag match', () => {
    // current shares 1 of its 2 tags with `focused`
    // current shares 1 of its 2 tags with `coincidental` but `coincidental`
    // has 6 unrelated tags. Specificity-weighted Jaccard correctly puts the
    // focused match first because the union is much smaller.
    const current = doc('docs/user-guide/a', 'A', ['bedrock', 'aws'])
    const focused = doc('docs/user-guide/b', 'Focused', ['bedrock'])
    const coincidental = doc('docs/user-guide/c', 'Coincidental', ['aws', 'multi-agent', 'observability', 'deployment', 'tools', 'hooks', 'event-loop'])

    const result = relatedUserGuideFor(current, [current, focused, coincidental])
    expect(result.map((r) => r.title)).toEqual(['Focused', 'Coincidental'])
  })
})

describe('humanRelatedUserGuideFor (top 6, with score floor)', () => {
  // To clear the score floor in tests, a candidate needs to share enough
  // *rare* tags. Identical tag sets between the current and candidates
  // produce score=1.0 (well above the 0.4 floor) because shared==union.

  it('returns at most 6 results', () => {
    // Need diversity in the corpus so x and y are NOT in every page. We add
    // some "filler" docs with unrelated tags so spec(x), spec(y) > 0.
    const current = doc('docs/user-guide/a', 'A', ['x', 'y'])
    const matching = Array.from({ length: 8 }, (_, i) =>
      doc(`docs/user-guide/m${i}`, `M${i}`, ['x', 'y'])
    )
    const fillers = Array.from({ length: 8 }, (_, i) =>
      doc(`docs/user-guide/f${i}`, `F${i}`, [`other-${i}`])
    )
    expect(humanRelatedUserGuideFor(current, [current, ...matching, ...fillers])).toHaveLength(6)
  })

  it('uses the same scoring as the headless surface', () => {
    // `focused` and `noise` both share `bedrock` with current, but `noise`
    // adds 5 unrelated tags. Specificity-weighted Jaccard penalizes the
    // larger union — focused wins.
    const current = doc('docs/user-guide/a', 'A', ['bedrock', 'aws'])
    const focused = doc('docs/user-guide/b', 'Focused', ['bedrock', 'aws'])
    const noise = doc('docs/user-guide/c', 'Noise', ['bedrock', 'unrelated-1', 'unrelated-2', 'unrelated-3'])

    const result = humanRelatedUserGuideFor(current, [current, focused, noise])
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]?.title).toBe('Focused')
  })

  it('returns empty when no candidates exist', () => {
    const current = doc('docs/user-guide/a', 'A', ['x', 'y'])
    const other = doc('docs/user-guide/b', 'B', ['z', 'w'])
    expect(humanRelatedUserGuideFor(current, [current, other])).toEqual([])
  })

  it('hides matches below the human score floor', () => {
    // 13 pages all share `x` but each has a unique second tag. Specificity
    // of x is near 0 (in nearly every page), so sharing only x → score ≈ 0
    // and the floor (0.4) suppresses everything. Better empty than wrong.
    const current = doc('docs/user-guide/a', 'A', ['x'])
    const candidates = Array.from({ length: 12 }, (_, i) =>
      doc(`docs/user-guide/${i}`, `T${i}`, ['x', `z${i}`])
    )
    const result = humanRelatedUserGuideFor(current, [current, ...candidates])
    expect(result).toEqual([])
  })

})
