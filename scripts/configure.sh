#!/usr/bin/env bash

set -e

root="$(dirname "${BASH_SOURCE[0]}")/.."

environment=${1:-development}
case $environment in
    development)
        export API_BASE_URL=http://localhost/liga-tool
        ;;
    production)
        export API_BASE_URL=https://kickern-hamburg.de/de/competitions
        ;;
    *) echo "Unknown environment: $environment"; exit 2;;
esac

export APP_VERSION=$(node -e "process.stdout.write(require('$root/package.json').version)")

envsubst < "$root/app/config.js.tmpl" > "$root/app/config.js"
