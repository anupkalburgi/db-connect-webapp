"use client"

import { useState } from "react"
import { WorkflowStepper } from "./workflow-stepper"
import { AnalysisSidebar } from "./analysis-sidebar"
import { FinancialDataGrid } from "./financial-data-grid"
import type { Account, AnalysisSetup, FinancialData } from "@/types/data"

interface DataAnalyzerProps {
  accounts: Account[]
  initialData: FinancialData[]
  initialComparisonData: FinancialData[]
}

export function DataAnalyzer({ accounts, initialData, initialComparisonData }: DataAnalyzerProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [setup, setSetup] = useState<AnalysisSetup>({
    analysisPeriod: { year: 2023 },
    comparativePeriod: { year: 2022 },
    aggregationLevel: "month",
    selectedAccounts: [],
  })

  return (
    <div className="flex h-screen">
      <AnalysisSidebar setup={setup} accounts={accounts} onSetupChange={setSetup} />
      <div className="flex-1 flex flex-col">
        <div className="p-8 border-b">
          <WorkflowStepper currentStep={currentStep} onStepClick={setCurrentStep} />
        </div>
        <div className="p-8 flex-1 overflow-auto">
          <FinancialDataGrid data={initialData} comparisonData={initialComparisonData} />
        </div>
      </div>
    </div>
  )
}

