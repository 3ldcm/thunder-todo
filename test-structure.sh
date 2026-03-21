#!/usr/bin/env bash
# US-001 repo structure tests
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_DIR"

PASS=0
FAIL=0

check() {
  local desc="$1"
  local result="$2"
  if [ "$result" = "0" ]; then
    echo "  PASS: $desc"
    PASS=$((PASS+1))
  else
    echo "  FAIL: $desc"
    FAIL=$((FAIL+1))
  fi
}

echo "=== US-001 Repo Structure Tests ==="
[ -d frontend ] && check "frontend/ directory exists" 0 || check "frontend/ directory exists" 1
[ -d backend ] && check "backend/ directory exists" 0 || check "backend/ directory exists" 1
[ -f README.md ] && check "README.md exists" 0 || check "README.md exists" 1
[ -f .gitignore ] && check ".gitignore exists" 0 || check ".gitignore exists" 1
grep -q 'Thunder Todo' README.md && check "README.md has project title" 0 || check "README.md has project title" 1
grep -q 'node_modules' .gitignore && check ".gitignore covers node_modules" 0 || check ".gitignore covers node_modules" 1
grep -q '.env' .gitignore && check ".gitignore covers .env" 0 || check ".gitignore covers .env" 1
grep -q 'dist' .gitignore && check ".gitignore covers dist" 0 || check ".gitignore covers dist" 1
git log --oneline | head -1 | grep -q . && check "git log has at least one commit" 0 || check "git log has at least one commit" 1
[ -f Dockerfile ] && check "Dockerfile exists" 0 || check "Dockerfile exists" 1
[ -f docker-compose.yml ] && check "docker-compose.yml exists" 0 || check "docker-compose.yml exists" 1

echo ""
echo "Results: $PASS passed, $FAIL failed"
if [ "$FAIL" -eq 0 ]; then
  echo "All tests passed!"
  exit 0
else
  exit 1
fi
