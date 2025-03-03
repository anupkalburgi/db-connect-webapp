"use client"

import { useState } from "react"
import type { Dataset } from "@/types/data"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Database, Table } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SchemaExplorerProps {
  datasets: Dataset[]
  onDatasetSelect: (datasetName: string) => void
  availableDatasets: string[]
}

export function SchemaExplorer({ datasets, onDatasetSelect, availableDatasets }: SchemaExplorerProps) {
  const [expandedDatasets, setExpandedDatasets] = useState<string[]>([])

  const handleDatasetClick = (datasetName: string) => {
    if (!datasets.find((d) => d.name === datasetName)) {
      onDatasetSelect(datasetName)
    }
    setExpandedDatasets((prev) =>
      prev.includes(datasetName) ? prev.filter((d) => d !== datasetName) : [...prev, datasetName],
    )
  }

  return (
    <div className="w-64 border-r h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold flex items-center gap-2">
          <Database className="w-4 h-4" />
          Schema
        </h2>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <Accordion type="multiple" value={expandedDatasets} onValueChange={setExpandedDatasets} className="p-2">
          {availableDatasets.map((datasetName) => {
            const dataset = datasets.find((d) => d.name === datasetName)
            return (
              <AccordionItem key={datasetName} value={datasetName}>
                <AccordionTrigger className="text-sm">
                  <span className="flex items-center gap-2">
                    <Table className="w-4 h-4" />
                    {datasetName}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  {dataset ? (
                    <div className="pl-4 space-y-1">
                      {dataset.columns.map((column) => (
                        <div key={column.name} className="text-sm py-1 flex justify-between">
                          <span>{column.name}</span>
                          <span className="text-muted-foreground">{column.type}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-4"
                      onClick={() => onDatasetSelect(datasetName)}
                    >
                      Load schema
                    </Button>
                  )}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </ScrollArea>
    </div>
  )
}

