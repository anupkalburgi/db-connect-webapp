import { useState } from "react"
import type { Column, Filter } from "@/types/data"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface FilterControlsProps {
  columns: Column[]
  filters: Record<string, Filter>
  onFiltersChange: (filters: Record<string, Filter>) => void
}

export function FilterControls({ columns, filters, onFiltersChange }: FilterControlsProps) {
  const [selectedColumn, setSelectedColumn] = useState<string>("")

  const addFilter = () => {
    if (!selectedColumn || filters[selectedColumn]) return
    onFiltersChange({
      ...filters,
      [selectedColumn]: {
        column: selectedColumn,
        operator: "=",
        value: "",
      },
    })
  }

  const removeFilter = (column: string) => {
    const newFilters = { ...filters }
    delete newFilters[column]
    onFiltersChange(newFilters)
  }

  const updateFilter = (column: string, updates: Partial<Filter>) => {
    onFiltersChange({
      ...filters,
      [column]: {
        ...filters[column],
        ...updates,
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select value={selectedColumn} onValueChange={setSelectedColumn}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Column" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((column) => (
              <SelectItem key={column.name} value={column.name}>
                {column.name} ({column.type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addFilter}>Add Column</Button>
      </div>
      <div className="space-y-2">
        {Object.entries(filters).map(([column, filter]) => (
          <div key={column} className="flex items-center gap-2">
            <span className="w-[200px]">{column}:</span>
            <Select
              value={filter.operator}
              onValueChange={(value) => updateFilter(column, { operator: value as Filter["operator"] })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="greater_than">Greater Than</SelectItem>
                <SelectItem value="less_than">Less Than</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={Array.isArray(filter.value) ? filter.value.join(",") : filter.value}
              onChange={(e) => updateFilter(column, { value: e.target.value })}
              placeholder={`Enter value...`}
              className="w-[200px]"
            />
            <Button variant="ghost" size="icon" onClick={() => removeFilter(column)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

