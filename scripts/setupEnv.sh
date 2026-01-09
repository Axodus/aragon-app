#!/bin/bash

# Exit if a command exits with a non-zero status
set -e

ENV=$1

SOURCE_ENV_FILE=./config/.env.$ENV
TARGET_ENV_FILE=.env.local
ROOT_ENV_FILE=.env.$ENV

# Copy environment variables into TARGET_ENV_FILE
if [[ "$ENV" =~ ^(development|staging|production|local|preview)$ ]]
then
    echo "Setup ENV: using $ENV environment"
    cp "$SOURCE_ENV_FILE" "$TARGET_ENV_FILE"

    # Also materialize the selected env file at the project root.
    # Next.js will still report `.env.local` in `next dev`, but having `.env.<env>`
    # helps debugging and aligns with the environment naming.
    if [[ "$ENV" != "local" ]]; then
        cp "$SOURCE_ENV_FILE" "$ROOT_ENV_FILE"
    fi
else
    echo "Setup ENV: '$ENV' is not a valid environment"
    exit 1
fi
