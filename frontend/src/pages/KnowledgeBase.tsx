import { LibraryBig } from 'lucide-react'
import ChunkingConfig from '../components/ChunkingConfig'
import DatasetCard from '../components/DatasetCard'
import DocumentExplorer from '../components/DocumentExplorer'
import EmbeddingConfig from '../components/EmbeddingConfig'
import IndexingPipeline from '../components/IndexingPipeline'
import IndexStatus from '../components/IndexStatus'
import KnowledgeBaseStats from '../components/KnowledgeBaseStats'
import LanguageCoverage from '../components/LanguageCoverage'
import PageHeader from '../components/PageHeader'
import SearchPreview from '../components/SearchPreview'

export default function KnowledgeBase() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={LibraryBig}
        eyebrow="Knowledge Base"
        title="Knowledge Base"
        description="MSMARCO-XI — the knowledge foundation behind VaaniRAG AI."
      />

      <DatasetCard className="animate-rise [animation-delay:60ms]" />
      <KnowledgeBaseStats className="animate-rise [animation-delay:120ms]" />
      <IndexStatus className="animate-rise [animation-delay:180ms]" />

      <div className="grid animate-rise gap-6 lg:grid-cols-[minmax(0,1fr)_400px] [animation-delay:240ms]">
        <IndexingPipeline />
        <div className="space-y-6">
          <EmbeddingConfig />
          <ChunkingConfig />
        </div>
      </div>

      <div className="grid animate-rise gap-6 lg:grid-cols-2 [animation-delay:300ms]">
        <LanguageCoverage />
        <SearchPreview />
      </div>

      <DocumentExplorer className="animate-rise [animation-delay:360ms]" />
    </div>
  )
}