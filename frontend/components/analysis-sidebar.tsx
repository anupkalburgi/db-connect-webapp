"use client"

import { ChevronDown, Filter, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Account, AnalysisSetup } from "@/types/data"

interface AnalysisSidebarProps {
  setup: AnalysisSetup
  accounts: Account[]
  onSetupChange: (setup: AnalysisSetup) => void
}

export function AnalysisSidebar({ setup, accounts, onSetupChange }: AnalysisSidebarProps) {
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="w-64 border-r h-full bg-muted/5">
      <div className="p-4 border-b flex items-center gap-2">
        <Settings className="w-4 h-4" />
        <h2 className="font-semibold">Setup</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-57px)]">
        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Analysis period</label>
              <Select
                value={setup.analysisPeriod.year.toString()}
                onValueChange={(value) =>
                  onSetupChange({
                    ...setup,
                    analysisPeriod: { ...setup.analysisPeriod, year: Number.parseInt(value) },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Comparative period</label>
              <Select
                value={setup.comparativePeriod.year.toString()}
                onValueChange={(value) =>
                  onSetupChange({
                    ...setup,
                    comparativePeriod: { ...setup.comparativePeriod, year: Number.parseInt(value) },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Aggregation level</label>
              <Select
                value={setup.aggregationLevel}
                onValueChange={(value: "year" | "quarter" | "month") =>
                  onSetupChange({
                    ...setup,
                    aggregationLevel: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Accounts for analysis</h3>
            {accounts.map((account) => (
              <Collapsible key={account.id}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between font-normal">
                    {account.name}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-1">
                  {account.subAccounts?.map((subAccount) => (
                    <Button key={subAccount.id} variant="ghost" className="w-full justify-start font-normal">
                      {subAccount.name}
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
            <Button variant="outline" className="w-full mt-2">
              Add account
            </Button>
          </div>

          <div>
            <Button variant="ghost" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Global filters
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

