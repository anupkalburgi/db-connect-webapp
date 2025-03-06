"use client"

import { useState } from "react"
import { Editor } from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Play, Save } from "lucide-react"
import { cn } from "@/lib/utils"

interface QueryEditorProps {
  onExecute: (query: string) => void
  initialQuery?: string
  className?: string
}

export function QueryEditor({ onExecute, initialQuery = "", className }: QueryEditorProps) {
  const [query, setQuery] = useState(initialQuery)

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between p-2 border-b">
        <h3 className="font-semibold">Query Editor</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              /* Save query implementation */
            }}
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button size="sm" onClick={() => onExecute(query)}>
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={query}
          onChange={(value) => setQuery(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  )
}

