/**
 * Mock for the `astro:content` virtual module.
 *
 * Implements getCollection/getEntry directly from the pre-built data store,
 * bypassing the astro:data-layer-content virtual module which isn't available
 * outside of Vite/Astro's build pipeline.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as devalue from 'devalue'

export { defineCollection, defineLiveCollection } from 'astro/content/runtime'
export { z } from 'astro/zod'

// Load the data store once at module init time
const raw = readFileSync(resolve('.astro/data-store.json'), 'utf-8')
const collections: Map<string, Map<string, unknown>> = devalue.unflatten(JSON.parse(raw))

export async function getCollection(collection: string, filter?: (entry: unknown) => unknown) {
  const col = collections.get(collection)
  if (!col) {
    console.warn(`The collection ${JSON.stringify(collection)} does not exist or is empty.`)
    return []
  }
  const entries = [...col.values()].map((raw: any) => ({ ...raw, collection }))
  return filter ? entries.filter(filter) : entries
}

export async function getEntry(collectionOrRef: string | { collection: string; id: string }, id?: string) {
  const [collection, entryId] =
    typeof collectionOrRef === 'object'
      ? [collectionOrRef.collection, collectionOrRef.id]
      : [collectionOrRef, id!]
  return collections.get(collection)?.get(entryId) ?? undefined
}

export async function getEntries(entries: { collection: string; id: string }[]) {
  return Promise.all(entries.map((e) => getEntry(e)))
}

export function reference(collection: string) {
  return (id: string) => ({ collection, id })
}

// Stubs for live collections (not used in tests)
export async function getLiveCollection() {
  return { entries: [] }
}
export async function getLiveEntry() {
  return { error: new Error('getLiveEntry not supported in tests') }
}
export async function render() {
  throw new Error('render() not supported in tests')
}
