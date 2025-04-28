"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  title: string
  description: string
}

const steps: Step[] = [
  {
    id: 1,
    title: "Data overview",
    description: "Review and select data",
  },
  {
    id: 2,
    title: "Understand relationships",
    description: "Analyze data connections",
  },
  {
    id: 3,
    title: "Build expectations",
    description: "Set analysis parameters",
  },
  {
    id: 4,
    title: "Execute analytical procedure",
    description: "Run the analysis",
  },
]

interface WorkflowStepperProps {
  currentStep: number
  onStepClick: (step: number) => void
}

export function WorkflowStepper({ currentStep, onStepClick }: WorkflowStepperProps) {
  return (
    <div className="relative">
      <div className="absolute top-5 left-1 right-1 h-0.5 bg-muted" />
      <ol className="relative z-10 flex justify-between">
        {steps.map((step) => {
          const isComplete = currentStep > step.id
          const isCurrent = currentStep === step.id
          return (
            <li key={step.id} className="flex flex-col items-center">
              <button
                onClick={() => onStepClick(step.id)}
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background",
                  isComplete && "border-primary",
                  isCurrent && "border-primary",
                  !isComplete && !isCurrent && "border-muted-foreground",
                )}
              >
                {isComplete ? (
                  <Check className="h-6 w-6 text-primary" />
                ) : (
                  <span className={cn("text-sm font-semibold", isCurrent ? "text-primary" : "text-muted-foreground")}>
                    {step.id}
                  </span>
                )}
              </button>
              <div className="mt-2 space-y-1 text-center">
                <div className={cn("text-sm font-semibold", isCurrent ? "text-foreground" : "text-muted-foreground")}>
                  {step.title}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

