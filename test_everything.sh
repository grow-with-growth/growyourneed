#!/bin/bash

# COMPREHENSIVE TESTING SCRIPT - Verify Everything Actually Works
set -e

echo "🧪 COMPREHENSIVE CONTENT SYSTEM TESTING"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE="http://localhost:3001/api"
TIMEOUT=30

# Function to test API endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    local expected_field=$3
    
    echo -n "Testing $description... "
    
    response=$(curl -s --max-time $TIMEOUT "$API_BASE$endpoint" || echo "ERROR")
    
    if [[ "$response" == "ERROR" ]]; then
        echo -e "${RED}FAILED${NC} (Connection error)"
        return 1
    fi
    
    if [[ -n "$expected_field" ]]; then
        if echo "$response" | jq -e ".$expected_field" > /dev/null 2>&1; then
            echo -e "${GREEN}PASSED${NC}"
            return 0
        else
            echo -e "${RED}FAILED${NC} (Missing field: $expected_field)"
            return 1
        fi
    else
        if [[ ${#response} -gt 10 ]]; then
            echo -e "${GREEN}PASSED${NC}"
            return 0
        else
            echo -e "${RED}FAILED${NC} (Empty response)"
            return 1
        fi
    fi
}

# Function to test search endpoint with results
test_search_endpoint() {
    local endpoint=$1
    local query=$2
    local description=$3
    local min_results=$4
    
    echo -n "Testing $description with query '$query'... "
    
    encoded_query=$(echo "$query" | sed 's/ /%20/g')
    response=$(curl -s --max-time $TIMEOUT "$API_BASE$endpoint?q=$encoded_query&verify=true" || echo "ERROR")
    
    if [[ "$response" == "ERROR" ]]; then
        echo -e "${RED}FAILED${NC} (Connection error)"
        return 1
    fi
    
    # Check if response is valid JSON array
    if ! echo "$response" | jq -e 'type == "array"' > /dev/null 2>&1; then
        echo -e "${RED}FAILED${NC} (Invalid JSON response)"
        return 1
    fi
    
    # Count results
    result_count=$(echo "$response" | jq 'length')
    
    if [[ $result_count -ge $min_results ]]; then
        # Check if results have required fields
        has_title=$(echo "$response" | jq -e '.[0].title' > /dev/null 2>&1 && echo "true" || echo "false")
        has_streams=$(echo "$response" | jq -e '.[0].stream_urls' > /dev/null 2>&1 && echo "true" || echo "false")
        is_verified=$(echo "$response" | jq -e '.[0].is_verified' > /dev/null 2>&1 && echo "true" || echo "false")
        
        if [[ "$has_title" == "true" && "$has_streams" == "true" && "$is_verified" == "true" ]]; then
            echo -e "${GREEN}PASSED${NC} ($result_count results, verified)"
            
            # Show sample result
            sample_title=$(echo "$response" | jq -r '.[0].title')
            sample_streams=$(echo "$response" | jq -r '.[0].stream_urls | length')
            echo "  └─ Sample: \"$sample_title\" ($sample_streams stream URLs)"
            
            return 0
        else
            echo -e "${YELLOW}PARTIAL${NC} ($result_count results, missing fields)"
            return 1
        fi
    else
        echo -e "${RED}FAILED${NC} ($result_count results, expected >= $min_results)"
        return 1
    fi
}

# Function to test stream URL
test_stream_url() {
    local url=$1
    local description=$2
    
    echo -n "Testing $description stream... "
    
    # Test with HEAD request
    status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" || echo "000")
    
    if [[ "$status_code" =~ ^(200|302|301)$ ]]; then
        echo -e "${GREEN}WORKING${NC} (HTTP $status_code)"
        return 0
    else
        echo -e "${RED}FAILED${NC} (HTTP $status_code)"
        return 1
    fi
}

# Start testing
echo -e "${BLUE}Starting comprehensive system tests...${NC}"
echo

# Test 1: Health Check
echo "=== HEALTH CHECK ==="
test_endpoint "/health" "Health Check" "status"
echo

# Test 2: Full System Test
echo "=== SYSTEM HEALTH TEST ==="
test_endpoint "/test/full" "Full System Test" "overall_health"
echo

# Test 3: Movie Search Tests
echo "=== MOVIE SEARCH TESTS ==="
test_search_endpoint "/search/movies" "Avengers" "Popular Movie Search" 1
test_search_endpoint "/search/movies" "Inception" "Specific Movie Search" 1
test_search_endpoint "/search/movies" "The Matrix" "Classic Movie Search" 1
echo

# Test 4: TV Show Search Tests
echo "=== TV SHOW SEARCH TESTS ==="
test_search_endpoint "/search/tv" "Breaking Bad" "Popular TV Show Search" 1
test_search_endpoint "/search/tv" "Game of Thrones" "Epic TV Show Search" 1
test_search_endpoint "/search/tv" "The Office" "Comedy TV Show Search" 1
echo

# Test 5: Book Search Tests
echo "=== BOOK SEARCH TESTS ==="
test_search_endpoint "/search/books" "Harry Potter" "Popular Book Search" 1
test_search_endpoint "/search/books" "1984" "Classic Book Search" 1
test_search_endpoint "/search/books" "Pride and Prejudice" "Literature Search" 1
echo

# Test 6: Live TV Tests
echo "=== LIVE TV TESTS ==="
test_endpoint "/live-tv/verified" "Verified Live TV Channels" ""
echo

# Test 7: Individual Component Tests
echo "=== COMPONENT TESTS ==="
test_endpoint "/test/movies" "Movie Component Test" "success_rate"
test_endpoint "/test/tv" "TV Component Test" "success_rate"
test_endpoint "/test/books" "Book Component Test" "success_rate"
test_endpoint "/test/live-tv" "Live TV Component Test" "success_rate"
echo

# Test 8: Stream URL Verification
echo "=== STREAM URL VERIFICATION ==="
echo "Getting sample stream URLs to test..."

# Get a movie result and test its stream URL
movie_response=$(curl -s --max-time $TIMEOUT "$API_BASE/search/movies?q=Avengers&verify=true&limit=1")
if echo "$movie_response" | jq -e '.[0].stream_urls[0]' > /dev/null 2>&1; then
    sample_movie_url=$(echo "$movie_response" | jq -r '.[0].stream_urls[0]')
    test_stream_url "$sample_movie_url" "Sample Movie"
else
    echo -e "${YELLOW}No movie stream URL to test${NC}"
fi

# Get a live TV result and test its stream URL
tv_response=$(curl -s --max-time $TIMEOUT "$API_BASE/live-tv/verified?limit=1")
if echo "$tv_response" | jq -e '.[0].stream_urls[0]' > /dev/null 2>&1; then
    sample_tv_url=$(echo "$tv_response" | jq -r '.[0].stream_urls[0]')
    test_stream_url "$sample_tv_url" "Sample Live TV"
else
    echo -e "${YELLOW}No live TV stream URL to test${NC}"
fi
echo

# Test 9: Performance Tests
echo "=== PERFORMANCE TESTS ==="
echo -n "Testing response time for movie search... "
start_time=$(date +%s%N)
curl -s --max-time $TIMEOUT "$API_BASE/search/movies?q=test" > /dev/null
end_time=$(date +%s%N)
duration=$(( (end_time - start_time) / 1000000 )) # Convert to milliseconds

if [[ $duration -lt 5000 ]]; then
    echo -e "${GREEN}FAST${NC} (${duration}ms)"
else
    echo -e "${YELLOW}SLOW${NC} (${duration}ms)"
fi
echo

# Test 10: Cache Tests
echo "=== CACHE TESTS ==="
echo -n "Testing cache functionality... "
# First request
response1=$(curl -s --max-time $TIMEOUT "$API_BASE/search/movies?q=cache_test")
# Second request (should be cached)
start_time=$(date +%s%N)
response2=$(curl -s --max-time $TIMEOUT "$API_BASE/search/movies?q=cache_test")
end_time=$(date +%s%N)
cache_duration=$(( (end_time - start_time) / 1000000 ))

if [[ "$response1" == "$response2" && $cache_duration -lt 100 ]]; then
    echo -e "${GREEN}WORKING${NC} (${cache_duration}ms cached response)"
else
    echo -e "${YELLOW}UNCERTAIN${NC} (${cache_duration}ms)"
fi
echo

# Summary
echo "=== TEST SUMMARY ==="
echo -e "${BLUE}Testing completed!${NC}"
echo
echo "🔍 Manual verification steps:"
echo "1. Open http://localhost:3001/api/health in browser"
echo "2. Test movie search: http://localhost:3001/api/search/movies?q=avengers&verify=true"
echo "3. Test TV search: http://localhost:3001/api/search/tv?q=breaking+bad&verify=true"
echo "4. Test book search: http://localhost:3001/api/search/books?q=harry+potter&verify=true"
echo "5. Test live TV: http://localhost:3001/api/live-tv/verified"
echo "6. Run full test: http://localhost:3001/api/test/full"
echo
echo "📊 Expected results:"
echo "- Movies: Should return playable stream URLs"
echo "- TV Shows: Should return episode stream URLs"
echo "- Books: Should return download URLs"
echo "- Live TV: Should return working M3U8/stream URLs"
echo "- All results should have is_verified: true"
echo
echo -e "${GREEN}✅ If all tests pass, your system is working correctly!${NC}"
echo -e "${YELLOW}⚠️  If tests fail, check the server logs for details.${NC}"
