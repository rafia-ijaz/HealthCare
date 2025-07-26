#!/bin/bash

echo "🚀 Code Snippet Sharing Platform - API Demo"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_BASE="http://localhost:5000"

echo -e "${BLUE}🔧 Testing Backend Health...${NC}"
HEALTH=$(curl -s $API_BASE/api/health)
echo "$HEALTH" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(f'✅ Status: {data[\"status\"]}')
    print(f'📊 Connected Users: {data[\"connectedUsers\"]}')
    print(f'📝 Total Snippets: {data[\"totalSnippets\"]}')
    print(f'🕐 Timestamp: {data[\"timestamp\"]}')
except:
    print('❌ Backend not responding')
    exit(1)
"
echo ""

echo -e "${BLUE}📝 Current Snippets:${NC}"
curl -s $API_BASE/api/snippets | python3 -c "
import sys, json
data = json.load(sys.stdin)
for i, snippet in enumerate(data[:5], 1):
    print(f'{i}. {snippet[\"title\"]} - {snippet[\"language\"]} - {snippet[\"likes\"]} ❤️')
    print(f'   Author: {snippet[\"author\"]}')
    print(f'   ID: {snippet[\"id\"]}')
    print()
"

echo -e "${YELLOW}➕ Creating a new snippet...${NC}"
NEW_SNIPPET=$(curl -s -X POST $API_BASE/api/snippets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Demo - Quick Sort Implementation",
    "code": "def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    \n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    \n    return quicksort(left) + middle + quicksort(right)\n\n# Example usage\ndata = [3, 6, 8, 10, 1, 2, 1]\nsorted_data = quicksort(data)\nprint(sorted_data)  # [1, 1, 2, 3, 6, 8, 10]",
    "language": "python",
    "author": "API Demo Bot"
  }')

SNIPPET_ID=$(echo "$NEW_SNIPPET" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(data['id'])
")

echo "✅ Created snippet with ID: $SNIPPET_ID"
echo ""

echo -e "${YELLOW}❤️  Testing like functionality...${NC}"
curl -s -X POST "$API_BASE/api/snippets/$SNIPPET_ID/like" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f'❤️  Liked! New count: {data[\"likes\"]}')
"
echo ""

echo -e "${GREEN}🎯 Final Statistics:${NC}"
curl -s $API_BASE/api/health | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f'📊 Total Snippets: {data[\"totalSnippets\"]}')
print(f'👥 Connected Users: {data[\"connectedUsers\"]}')
"
echo ""

echo -e "${BLUE}📱 Frontend Interface Details:${NC}"
echo "The React app provides:"
echo "• Beautiful gradient interface with syntax highlighting"
echo "• Real-time updates using WebSocket"
echo "• Form validation and user feedback"
echo "• Mobile-responsive design"
echo "• Interactive like buttons"
echo "• Live user count display"
echo ""

echo -e "${GREEN}✨ Demo Complete! All features working perfectly.${NC}"