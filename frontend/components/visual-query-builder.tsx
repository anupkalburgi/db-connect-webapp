"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { PlusCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { VisualQuery, VisualQueryStep, Column } from "@/types/data"

interface VisualQueryBuilderProps {
  columns: Column[]
  onQueryChange: (query: VisualQuery) => void
}

export function VisualQueryBuilder({ columns, onQueryChange }: VisualQueryBuilderProps) {
  const [steps, setSteps] = useState<VisualQueryStep[]>([])

  const addStep = (type: "filter" | "groupBy") => {
    const newStep: VisualQueryStep = { id: Date.now().toString(), type }
    setSteps([...steps, newStep])
    onQueryChange({ steps: [...steps, newStep] })
  }

  const updateStep = (id: string, updates: Partial<VisualQueryStep>) => {
    const newSteps = steps.map((step) => (step.id === id ? { ...step, ...updates } : step))
    setSteps(newSteps)
    onQueryChange({ steps: newSteps })
  }

  const removeStep = (id: string) => {
    const newSteps = steps.filter((step) => step.id !== id)
    setSteps(newSteps)
    onQueryChange({ steps: newSteps })
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return
    const newSteps = Array.from(steps)
    const [reorderedStep] = newSteps.splice(result.source.index, 1)
    newSteps.splice(result.destination.index, 0, reorderedStep)
    setSteps(newSteps)
    onQueryChange({ steps: newSteps })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={() => addStep("filter")} size="sm">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Filter
        </Button>
        <Button onClick={() => addStep("groupBy")} size="sm">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Group By
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="steps">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {steps.map((step, index) => (
                <Draggable key={step.id} draggableId={step.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center gap-2 p-2 border rounded-md"
                    >
                      {step.type === "filter" ? (
                        <>
                          <Select value={step.column} onValueChange={(value) => updateStep(step.id, { column: value })}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select column" />
                            </SelectTrigger>
                            <SelectContent>
                              {columns.map((column) => (
                                <SelectItem key={column.name} value={column.name}>
                                  {column.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={step.operator}
                            onValueChange={(value) => updateStep(step.id, { operator: value })}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="=">=</SelectItem>
                              <SelectItem value="<">{"<"}</SelectItem>
                              <SelectItem value=">">{">"}</SelectItem>
                              <SelectItem value="LIKE">LIKE</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Value"
                            value={step.value || ""}
                            onChange={(e) => updateStep(step.id, { value: e.target.value })}
                            className="w-[180px]"
                          />
                        </>
                      ) : (
                        <>
                          <Select value={step.column} onValueChange={(value) => updateStep(step.id, { column: value })}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select column" />
                            </SelectTrigger>
                            <SelectContent>
                              {columns.map((column) => (
                                <SelectItem key={column.name} value={column.name}>
                                  {column.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={step.aggregation}
                            onValueChange={(value) => updateStep(step.id, { aggregation: value })}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Aggregation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="COUNT">COUNT</SelectItem>
                              <SelectItem value="SUM">SUM</SelectItem>
                              <SelectItem value="AVG">AVG</SelectItem>
                              <SelectItem value="MIN">MIN</SelectItem>
                              <SelectItem value="MAX">MAX</SelectItem>
                            </SelectContent>
                          </Select>
                        </>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => removeStep(step.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

