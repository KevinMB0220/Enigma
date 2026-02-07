#!/bin/bash

# Read the SQL file
SQL_FILE="prisma/migrations/001_create_agents.sql"
SQL_CONTENT=$(cat "$SQL_FILE")

# Supabase project details from .env
source .env

# Execute SQL using Supabase REST API
curl -X POST \
  "https://vflnzksveqewmigseask.supabase.co/rest/v1/rpc/exec_sql" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$SQL_CONTENT" | jq -Rs .)}"
