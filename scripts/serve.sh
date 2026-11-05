#!/bin/sh
# Local preview at http://localhost:4000 with live reload.
export PATH="/opt/homebrew/opt/ruby/bin:$HOME/.gem/ruby/4.0.0/bin:$PATH"
cd "$(dirname "$0")/.." && jekyll serve --livereload --port 4000
