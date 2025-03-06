"use server"

import { fetchColumns, executeQuery } from "@/lib/api"
import type { QueryConfig } from "@/types/data"

export async function getColumns(datasetId: string) {
  return fetchColumns(datasetId)
}

export async function runQuery(config: QueryConfig) {
  return executeQuery(config)
}

