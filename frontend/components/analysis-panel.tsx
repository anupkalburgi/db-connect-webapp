"use client"

import { useState, useEffect } from "react"
import { Plus, X, Group, Play, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Dataset, Column, Filter, GroupBy, QueryConfig } from "@/types/data"

interface AnalysisPanelProps {
  datasets: Dataset[]
  columns: Column[]
  onQueryChange: (config: QueryConfig) => void
  isLoading?: boolean
  onExecute: () => void
}

export function AnalysisPanel({
  datasets,
  columns,
  onQueryChange,
  isLoading = false,
  onExecute,
}: AnalysisPanelProps) {
  const [selectedDataset, setSelectedDataset] = useState<string>("")
  const [filters, setFilters] = useState<Filter[]>([])
  const [groupBy, setGroupBy] = useState<GroupBy[]>([])

  useEffect(() => {
    setFilters([])
    setGroupBy([])
  }, [selectedDataset])

  const updateQuery = (newDataset?: string, newFilters?: Filter[], newGroupBy?: GroupBy[]) => {
    onQueryChange({
      dataset: newDataset ?? selectedDataset,
      filters: newFilters ?? filters,
      groupBy: newGroupBy ?? groupBy,
      availableColumns: columns.map(column => column.name),
    })
  }

  const addFilter = () => {
    const newFilter = {
      column: columns[0]?.name ?? "",
      operator: "=" as const,
      value: "",
    }
    setFilters([...filters, newFilter])
    updateQuery(undefined, [...filters, newFilter])
  }

  const addGroupBy = () => {
    const newGroupBy = {
      column: columns[0]?.name ?? "",
      aggregation: "sum" as const,
    }
    setGroupBy([...groupBy, newGroupBy])
    updateQuery(undefined, undefined, [...groupBy, newGroupBy])
  }

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index)
    setFilters(newFilters)
    updateQuery(undefined, newFilters)
  }

  const removeGroupBy = (index: number) => {
    const newGroupBy = groupBy.filter((_, i) => i !== index)
    setGroupBy(newGroupBy)
    updateQuery(undefined, undefined, newGroupBy)
  }

  const updateFilter = (index: number, updates: Partial<Filter>) => {
    const newFilters = filters.map((filter, i) => (i === index ? { ...filter, ...updates } : filter))
    setFilters(newFilters)
    updateQuery(undefined, newFilters)
  }

  const updateGroupBy = (index: number, updates: Partial<GroupBy>) => {
    const newGroupBy = groupBy.map((group, i) => (i === index ? { ...group, ...updates } : group))
    setGroupBy(newGroupBy)
    updateQuery(undefined, undefined, newGroupBy)
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Analysis Panel</h2>
        <Button onClick={onExecute} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Execute
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Dataset</label>
          <Select value={selectedDataset} onValueChange={setSelectedDataset}>
            <SelectTrigger>
              <SelectValue placeholder="Select a dataset" />
            </SelectTrigger>
            <SelectContent>
              {datasets.map((dataset) => (
                <SelectItem key={dataset.id} value={dataset.id}>
                  {dataset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Filters</label>
            <Button variant="outline" size="sm" onClick={addFilter}>
              <Plus className="mr-2 h-4 w-4" />
              Add Filter
            </Button>
          </div>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            <div className="space-y-4">
              {filters.map((filter, index) => (
                <div key={index} className="grid gap-2 bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Select value={filter.column} onValueChange={(value) => updateFilter(index, { column: value })}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Column" />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map((column) => (
                          <SelectItem key={column.name} value={column.name}>
                            {column.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFilter(index)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Group By</label>
            <Button variant="outline" size="sm" onClick={addGroupBy}>
              <Group className="mr-2 h-4 w-4" />
              Add Group By
            </Button>
          </div>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            <div className="space-y-4">
              {groupBy.map((group, index) => (
                <div key={index} className="grid gap-2 bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Select value={group.column} onValueChange={(value) => updateGroupBy(index, { column: value })}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Column" />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map((column) => (
                          <SelectItem key={column.name} value={column.name}>
                            {column.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeGroupBy(index)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

