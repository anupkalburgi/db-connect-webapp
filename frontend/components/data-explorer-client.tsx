"use client"

import { useState } from "react"
import { VisualQueryBuilder } from "@/components/visual-query-builder"
import { SchemaExplorer } from "@/components/schema-explorer"
import { ResultsView } from "@/components/results-view"
import { executeVisualQuery, getDatasetSchema } from "../app/actions"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import type { QueryResult, Dataset, VisualQuery } from "@/types/data"
import { Button } from "@/components/ui/button"
import ErrorBoundary from "@/components/error-boundary"

interface DataExplorerClientProps {
  initialDatasets: string[]
}

export function DataExplorerClient({ initialDatasets }: DataExplorerClientProps) {
  const [results, setResults] = useState<QueryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)
  const [visualQuery, setVisualQuery] = useState<VisualQuery>({ steps: [] })
  const [error, setError] = useState<string | null>(null)

  const handleExecuteQuery = async () => {
    if (!selectedDataset) return
    setIsLoading(true)
    setError(null)
    try {
      const results = await executeVisualQuery(visualQuery)
      setResults(results)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const loadDatasetSchema = async (datasetName: string) => {
    setError(null)
    try {
      const schema = await getDatasetSchema(datasetName)
      setDatasets((prev) => [...prev.filter((d) => d.name !== datasetName), schema])
      setSelectedDataset(schema)
    } catch (error) {
      console.error("Failed to load dataset schema:", error)
      setError(error instanceof Error ? error.message : "Failed to load dataset schema")
    }
  }

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col md:flex-row">
        <div className="w-full md:w-64">
          <SchemaExplorer datasets={datasets} onDatasetSelect={loadDatasetSchema} availableDatasets={initialDatasets} />
        </div>
        <ResizablePanelGroup direction="vertical" className="flex-1">
          <ResizablePanel defaultSize={40}>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Visual Query Builder</h2>
              {error && <div className="p-2 mb-4 border border-red-500 rounded-md bg-red-50 text-red-700">{error}</div>}
              {selectedDataset && (
                <VisualQueryBuilder columns={selectedDataset.columns} onQueryChange={setVisualQuery} />
              )}
              <Button onClick={handleExecuteQuery} className="mt-4" disabled={isLoading || !selectedDataset}>
                {isLoading ? "Executing..." : "Execute Query"}
              </Button>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={60}>
            <ResultsView results={results} isLoading={isLoading} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ErrorBoundary>
  )
}

