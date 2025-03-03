"use client"
import type { QueryResult } from "@/types/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart } from "@/components/charts"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ResultsViewProps {
  results: QueryResult | null
  isLoading: boolean
}

export function ResultsView({ results, isLoading }: ResultsViewProps) {
  if (isLoading) {
    return <div className="p-8 text-center">Running query...</div>
  }

  if (!results) {
    return <div className="p-8 text-center">No results to display</div>
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">Results</h3>
            <p className="text-sm text-muted-foreground">
              {results.totalRows.toLocaleString()} rows in {results.executionTime}s
            </p>
          </div>
        </div>
      </div>
      <Tabs defaultValue="table" className="flex-1">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="chart">Chart</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="flex-1">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {results.columns.map((column) => (
                    <TableHead key={column.name}>{column.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.rows.map((row, i) => (
                  <TableRow key={i}>
                    {results.columns.map((column) => (
                      <TableCell key={column.name}>{row[column.name]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="chart" className="h-full">
          <div className="p-4">
            <BarChart data={results.rows} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

