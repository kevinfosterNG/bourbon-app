#!/usr/bin/env bash
set -euo pipefail

: "${SUPABASE_DB_HOST:?Set SUPABASE_DB_HOST}"
: "${SUPABASE_DB_PORT:=5432}"
: "${SUPABASE_DB_NAME:=postgres}"
: "${SUPABASE_DB_USER:=postgres}"

# Preferred secret naming
if [[ -n "${SUPABASE_DB_PASSWORD:-}" ]]; then
  DB_PASSWORD="$SUPABASE_DB_PASSWORD"
# Backward compatibility for older secret naming
elif [[ -n "${SUPABASE_DATABASE_PASSWORD:-}" ]]; then
  DB_PASSWORD="$SUPABASE_DATABASE_PASSWORD"
else
  echo "Set SUPABASE_DB_PASSWORD (or SUPABASE_DATABASE_PASSWORD for legacy support)." >&2
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "psql is required. Install PostgreSQL client tools first." >&2
  exit 1
fi

export PGPASSWORD="$DB_PASSWORD"

psql \
  "host=$SUPABASE_DB_HOST port=$SUPABASE_DB_PORT dbname=$SUPABASE_DB_NAME user=$SUPABASE_DB_USER sslmode=require" \
  -f supabase/schema.sql

echo "Supabase schema applied successfully."
