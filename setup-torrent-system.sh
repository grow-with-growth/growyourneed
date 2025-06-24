#!/bin/bash

# TORRENT STREAMING SYSTEM SETUP
echo "🚀 SETTING UP TORRENT STREAMING SYSTEM"
echo "🎬 WebTorrent + FFmpeg Direct Streaming"
echo "========================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Installing Node.js..."
    
    # Install Node.js based on OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install node
    else
        echo "Please install Node.js manually: https://nodejs.org/"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"
fi

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${YELLOW}⚠️  FFmpeg not found${NC}"
    echo "Installing FFmpeg..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y ffmpeg
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install ffmpeg
    else
        echo "Please install FFmpeg manually: https://ffmpeg.org/download.html"
        echo "FFmpeg is required for video transcoding and streaming"
        exit 1
    fi
else
    echo -e "${GREEN}✅ FFmpeg found: $(ffmpeg -version | head -n1)${NC}"
fi

# Install Node.js dependencies
echo -e "${BLUE}📦 Installing Node.js dependencies...${NC}"
npm install express axios webtorrent fluent-ffmpeg cheerio

# Create directories
mkdir -p public
mkdir -p tmp

# Set permissions
chmod +x torrent-stream-server.js

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "🎯 QUICK START:"
echo "1. Start the server:"
echo "   node torrent-stream-server.js"
echo ""
echo "2. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "3. Search and stream:"
echo "   • Search for movies, TV shows, anime"
echo "   • Click any poster to stream instantly"
echo "   • No downloads, no waiting"
echo ""
echo "🔧 FEATURES:"
echo "✅ Real torrent crawling (YTS, 1337x, EZTV)"
echo "✅ WebTorrent + FFmpeg streaming"
echo "✅ No downloads to disk"
echo "✅ No manual tracker configuration"
echo "✅ One-click streaming"
echo "✅ Poster UI with search"
echo "✅ Auto-transcoding to MP4"
echo "✅ Responsive web interface"
echo ""
echo "📡 API ENDPOINTS:"
echo "• GET /api/search?q=query&type=movie - Search content"
echo "• GET /api/stream/:id - Stream content"
echo "• GET /api/trending - Get trending content"
echo "• GET /api/health - System health"
echo ""
echo "🧪 TEST THE SYSTEM:"
echo "   node test-torrent-system.js"
echo ""
echo -e "${GREEN}🎉 Ready to stream torrents directly!${NC}"
