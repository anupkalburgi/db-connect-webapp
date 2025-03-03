"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { FinancialData } from "@/types/data"

interface FinancialDataGridProps {
  data: FinancialData[]
  comparisonData: FinancialData[]
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function FinancialDataGrid({ data, comparisonData }: FinancialDataGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Have you selected the appropriate accounts for the analytical procedure?
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>FiscalYear-Period</TableHead>
              <TableHead className="text-right">Sales</TableHead>
              <TableHead className="text-right">Cost of Material</TableHead>
              <TableHead className="text-right">Personnel Costs</TableHead>
              <TableHead className="text-right">Rent Costs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.fiscalYearPeriod}>
                <TableCell>{row.fiscalYearPeriod}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.sales)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.costOfMaterial)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.personnelCosts)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.rentCosts)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Have you selected the appropriate accounts for the analytical procedure?
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>FiscalYear-Period</TableHead>
              <TableHead className="text-right">Sales</TableHead>
              <TableHead className="text-right">Cost of Material</TableHead>
              <TableHead className="text-right">Personnel Costs</TableHead>
              <TableHead className="text-right">Rent Costs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonData.map((row) => (
              <TableRow key={row.fiscalYearPeriod}>
                <TableCell>{row.fiscalYearPeriod}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.sales)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.costOfMaterial)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.personnelCosts)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.rentCosts)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

