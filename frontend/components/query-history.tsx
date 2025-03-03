"use client"

import type { QueryHistory } from "@/types/data"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { Check, X } from "lucide-react"

interface QueryHistoryProps {
  history: QueryHistory[]
  onSelect: (query: string) => void
}

export function QueryHistoryView({ history, onSelect }: QueryHistoryProps) {
  return (
    <ScrollArea className="h-[200px] border rounded-md">
      <div className="p-4 space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="text-sm space-y-1 cursor-pointer hover:bg-muted p-2 rounded"
            onClick={() => onSelect(item.query)}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium truncate max-w-[200px]">{item.query}</span>
              <span className="text-muted-foreground">{formatDistanceToNow(item.timestamp)} ago</span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                {item.status === "success" ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <X className="w-3 h-3 text-red-500" />
                )}
                {item.status}
              </span>
              <span>{item.rowCount} rows</span>
              <span>{item.executionTime}s</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

