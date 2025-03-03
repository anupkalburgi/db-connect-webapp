import type { DataRow } from "@/types/data"

interface BarChartProps {
  data: DataRow[]
}

export function BarChart({ data }: BarChartProps) {
  // Implement Bar chart logic here using data
  return <div>Bar Chart Placeholder</div>
}

interface LineChartProps {
  data: DataRow[]
}

export function LineChart({ data }: LineChartProps) {
  // Implement Line chart logic here using data
  return <div>Line Chart Placeholder</div>
}

