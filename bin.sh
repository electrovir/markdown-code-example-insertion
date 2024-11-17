#!/bin/bash

npx tsx "$(dirname "$(readlink -f "$0")")/src/cli/cli.script.ts" "$@"