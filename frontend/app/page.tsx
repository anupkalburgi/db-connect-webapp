import { DataExplorer } from "@/components/data-explorer"
import { fetchDatasets } from "@/lib/api"

export default async function Page() {
  const initialDatasets = await fetchDatasets()
  return <DataExplorer initialDatasets={initialDatasets} />
}

