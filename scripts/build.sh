#!/bin/sh
# Build the site with Homebrew Ruby + user-installed Jekyll.
export PATH="/opt/homebrew/opt/ruby/bin:$HOME/.gem/ruby/4.0.0/bin:$PATH"
cd "$(dirname "$0")/.." && jekyll build --quiet
