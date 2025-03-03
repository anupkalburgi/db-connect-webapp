import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface DatasetListProps {
  datasets: string[]
  selectedDataset: string | null
  onSelect: (dataset: string) => void
}

export function DatasetList({ datasets, selectedDataset, onSelect }: DatasetListProps) {
  return (
    <div className="w-64 border-r h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Datasets</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-2">
          {datasets.map((dataset) => (
            <Button
              key={dataset}
              variant="ghost"
              className={cn("w-full justify-start font-normal", selectedDataset === dataset && "bg-muted")}
              onClick={() => onSelect(dataset)}
            >
              {dataset}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

