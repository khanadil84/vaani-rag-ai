/**
 * Knowledge Base data model — API-ready for the future indexing backend.
 * Unavailable values are `null` and rendered as "--" by the UI; nothing is
 * fabricated.
 */

export interface KnowledgeBaseStats {
  documentCount: number | null
  chunkCount: number | null
  languageCount: number | null
  indexedCount: number | null
}

export interface KnowledgeBaseStatus {
  status: 'not-indexed' | 'indexing' | 'indexed' | 'error'
  progress: number | null
  lastIndexedAt: string | null
  error: string | null
}

export interface EmbeddingConfig {
  model: string | null
  dimension: number | null
  distanceMetric: string | null
  indexType: string | null
}

export interface DocumentRecord {
  documentId: string
  language: string
  query: string
  passage: string
  chunkCount: number | null
  status: 'indexed' | 'pending' | 'failed'
}