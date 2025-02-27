from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from typing import List, Dict, Any
from pydantic import BaseModel
from .DataSource import DataSource

import logging
import gc

datasource = DataSource()

app = FastAPI(title="Databricks Query API")

logger = logging.getLogger('uvicorn.error')

# Load .env file
load_dotenv()


#def get_connection():
#    """Get a new DB Connect connection; invalidate any previous before calling this"""
#    logger.info(f"Initializing Databricks connection")
#    gc.collect()
#    ds = DataSource()
#    return ds





class QueryResponse(BaseModel):
    data: List[Dict]
    count: int
    

def build_query(query_json: Dict[str, Any]) -> str:
    """Build SQL query from JSON structure"""
    try:
        # Get base components
        table_name = query_json.get('table_name')
        if not table_name:
            raise ValueError("table_name is required")

        # Handle SELECT clause
        columns = query_json.get('columns', ['*'])
        aggregations = query_json.get('aggregations', [])
        
        select_parts = []
        
        # Add regular columns if specified
        if columns != ['*'] or not aggregations:
            select_parts.extend(columns)
            
        # Add aggregations
        for agg in aggregations:
            agg_str = f"{agg['function']}({agg['column']})"
            if 'alias' in agg:
                agg_str += f" as {agg['alias']}"
            select_parts.append(agg_str)
            
        select_clause = ", ".join(select_parts) if select_parts else "*"
        
        # Build base query
        query = f"SELECT {select_clause} FROM {table_name}"
        
        # Handle WHERE clause
        filters = query_json.get('filters', [])
        if filters:
            conditions = []
            for filter in filters:
                column = filter['column']
                operator = filter['operator']
                value = filter['value']
                
                if isinstance(value, list):
                    # Handle IN operator
                    values = ", ".join(f"'{v}'" if isinstance(v, str) else str(v) 
                                     for v in value)
                    conditions.append(f"{column} {operator} ({values})")
                else:
                    # Handle other operators
                    value_str = f"'{value}'" if isinstance(value, str) else str(value)
                    conditions.append(f"{column} {operator} {value_str}")
                    
            query += " WHERE " + " AND ".join(conditions)
        
        # Handle GROUP BY
        group_by = query_json.get('group_by', [])
        if group_by:
            query += " GROUP BY " + ", ".join(group_by)
            
        # Handle ORDER BY
        order_by = query_json.get('order_by', [])
        if order_by:
            order_terms = [
                f"{item['column']} {item.get('order', 'ASC')}"
                for item in order_by
            ]
            query += " ORDER BY " + ", ".join(order_terms)
            
        # Handle LIMIT
        limit = query_json.get('limit')
        if limit:
            query += f" LIMIT {limit}"
            
        return query
        
    except Exception as e:
        raise ValueError(f"Error building query: {str(e)}")

@app.post("/api/v1/query")
async def run_query(query_json: Dict[str, Any]):
    for attempt in range(2):  # Try twice at most
        try:
            # Build the query
            query = build_query(query_json)

            # Execute query using your datasource
            logger.info('Getting query results from Databricks connections')
            df = datasource.session.sql(query)
            results = [row.asDict() for row in df.collect()]

            return {
                "data": results,
                "count": len(results),
                "query": query
            }

        except ValueError as e:
            raise HTTPException(status_code=400, detail={
                    "error": "Unexpected Error",
                    "message": str(e),
                    "query_json": query
                }
                )
        except Exception as e:
            if attempt == 0:  # only runs once, after the first failure - try to re-initialise the datasource
                #datasource = None
                logger.info(str(e))
                #datasource = get_connection()
                datasource = DataSource()
            else:
                raise HTTPException(status_code=500, detail={
                        "error": "Unexpected Error",
                        "message": str(e),
                        "query_json": query
                    })


@app.get("/api/v1/tables")
async def list_tables(catalog: str = None, database: str = None):
    try:
        tables = datasource.session.sql(f"SHOW TABLES in {catalog}.{database}").collect()
        return [row.tableName for row in tables]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/table/schema")
async def table_schema(catalog: str = None, database: str = None, table: str = None):
    try:
        sql_stmt = f"DESCRIBE {catalog}.{database}.{table}"
        print(sql_stmt)
        schema = datasource.session.sql(sqlQuery=sql_stmt).collect()
        return [row.asDict() for row in schema]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    