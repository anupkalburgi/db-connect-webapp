import type { Dataset, Column, QueryResult, QueryConfig } from "@/types/data"

// Mock data
const mockDatasets: Dataset[] = [
  { id: "sales", name: "Sales Data" },
  { id: "inventory", name: "Inventory" },
  { id: "customers", name: "Customer Data" },
]

const mockColumns: Column[] = [
  { name: "date", type: "date" },
  { name: "product", type: "string" },
  { name: "category", type: "string" },
  { name: "quantity", type: "number" },
  { name: "revenue", type: "number" },
  { name: "cost", type: "number" },
  { name: "customer_id", type: "string" },
  { name: "region", type: "string" },
]

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";
const CATALOG = "anup_kalburgi";
const DATABASE = "share_explore";

// Server-side API functions
export async function fetchDatasets(): Promise<Dataset[]> {
  // console.log("Fetching datasets on the server"); // This will appear in the server console
  const response = await fetch(`${API_BASE_URL}/tables?catalog=${CATALOG}&database=${DATABASE}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Error fetching datasets: ${response.statusText}`);
  }
  const data: string[] = await response.json();
  return data.map((name) => ({ id: name, name })); // Map response to Dataset type
}

export async function fetchColumns(datasetId: string): Promise<Column[]> {
  // console.log(`Fetching columns for dataset ${datasetId} on the server`); // This will appear in the server console
  const response = await fetch(`${API_BASE_URL}/table/schema?catalog=${CATALOG}&database=${DATABASE}&table=${datasetId}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Error fetching columns for dataset ${datasetId}: ${response.statusText}`);
  }
  const data: { col_name: string, data_type: string, comment: string | null }[] = await response.json();
  return data.map((col) => ({ name: col.col_name, type: col.data_type as "string" | "number" | "date" })); // Map response to Column type
}

export async function executeQuery(config: QueryConfig): Promise<QueryResult> {
  // console.log("Executing query on the server", config); // This will appear in the server console

  const filters = config.filters.map(filter => ({
    column: filter.column,
    operator: filter.operator,
    value: filter.value
  }));

  const aggregations = config.groupBy.map(group => ({
    function: group.aggregation.toUpperCase(),
    column: group.column,
    alias: `${group.aggregation}_${group.column}`
  }));

  const groupBy = config.groupBy.map(group => group.column);

  const payload = {
    table_name: `${CATALOG}.${DATABASE}.${config.dataset}`,
    columns: config.availableColumns,
    filters,
    aggregations,
    group_by: groupBy,
    order_by: [], // Add order_by if needed
    limit: 10 // Add limit if needed
  };

  const response = await fetch(`${API_BASE_URL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Error executing query: ${response.statusText}`);
  }

  const data = await response.json();
  const rows = data.data;
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  const queryResult: QueryResult = {
    columns,
    rows
  };

  // console.log("Query results:", queryResult); // This will appear in the server console
  return queryResult;
}

