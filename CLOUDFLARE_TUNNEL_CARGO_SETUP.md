# Cloudflare Tunnel + Rust Cargo Direct Content Access

## 🚀 **DIRECT CONTENT ACCESS WITHOUT PUBLIC APIs**

### **Architecture Overview**
```
User Request → Cloudflare Tunnel → Rust Backend → Direct Content Sources → Response
```

### **Why This Approach?**
- ✅ **No API Limits** - Direct scraping, no rate limits
- ✅ **No API Keys** - Bypass all public API restrictions
- ✅ **Faster Response** - Direct source access
- ✅ **More Content** - Access to private/restricted sources
- ✅ **Cloudflare Protection** - DDoS protection, caching, CDN
- ✅ **Rust Performance** - Ultra-fast backend processing

---

## 📦 **RUST BACKEND SETUP**

### **Cargo.toml - Production Dependencies**
```toml
[package]
name = "content-scraper"
version = "0.1.0"
edition = "2021"

[dependencies]
# Web Framework
tokio = { version = "1.0", features = ["full"] }
axum = "0.7"
tower = "0.4"
tower-http = { version = "0.5", features = ["cors", "compression"] }

# HTTP Client & Scraping
reqwest = { version = "0.11", features = ["json", "stream"] }
scraper = "0.18"
select = "0.6"
html5ever = "0.26"

# Async & Concurrency
futures = "0.3"
tokio-stream = "0.1"
async-stream = "0.3"

# Serialization
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

# Database (Optional - for caching)
sqlx = { version = "0.7", features = ["runtime-tokio-rustls", "postgres", "chrono"] }

# Caching
redis = { version = "0.24", features = ["tokio-comp"] }
moka = { version = "0.12", features = ["future"] }

# Error Handling
anyhow = "1.0"
thiserror = "1.0"

# Logging
tracing = "0.1"
tracing-subscriber = "0.3"

# Configuration
config = "0.13"
dotenv = "0.15"

# Utilities
uuid = { version = "1.0", features = ["v4"] }
chrono = { version = "0.4", features = ["serde"] }
url = "2.4"
regex = "1.10"

# Video/Media Processing
ffmpeg-next = "6.0"
image = "0.24"

# Torrent Support
torrent-rs = "0.2"
bencode = "0.3"

# Proxy Support
reqwest-middleware = "0.2"
reqwest-retry = "0.3"
```

### **Main Rust Backend - src/main.rs**
```rust
use axum::{
    extract::{Query, Path},
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;
use tracing::{info, error};

mod scrapers;
mod cache;
mod torrent;
mod proxy;

use scrapers::{MovieScraper, TVScraper, BookScraper, LiveTVScraper};
use cache::CacheManager;

#[derive(Debug, Serialize, Deserialize)]
pub struct ContentItem {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub image_url: Option<String>,
    pub stream_urls: Vec<String>,
    pub download_urls: Vec<String>,
    pub quality: Vec<String>,
    pub size: Option<String>,
    pub seeds: Option<u32>,
    pub peers: Option<u32>,
    pub rating: Option<f32>,
    pub year: Option<u32>,
    pub genre: Vec<String>,
    pub language: Vec<String>,
    pub subtitles: Vec<String>,
}

#[derive(Debug, Deserialize)]
pub struct SearchQuery {
    q: String,
    category: Option<String>,
    quality: Option<String>,
    year: Option<u32>,
    limit: Option<usize>,
}

pub struct AppState {
    movie_scraper: MovieScraper,
    tv_scraper: TVScraper,
    book_scraper: BookScraper,
    live_tv_scraper: LiveTVScraper,
    cache: CacheManager,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::init();
    dotenv::dotenv().ok();

    let state = AppState {
        movie_scraper: MovieScraper::new().await?,
        tv_scraper: TVScraper::new().await?,
        book_scraper: BookScraper::new().await?,
        live_tv_scraper: LiveTVScraper::new().await?,
        cache: CacheManager::new().await?,
    };

    let app = Router::new()
        .route("/api/search/movies", get(search_movies))
        .route("/api/search/tv", get(search_tv))
        .route("/api/search/books", get(search_books))
        .route("/api/live-tv", get(get_live_tv))
        .route("/api/trending/movies", get(get_trending_movies))
        .route("/api/content/:id/stream", get(get_stream_urls))
        .route("/api/content/:id/download", get(get_download_urls))
        .route("/api/health", get(health_check))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let listener = TcpListener::bind("0.0.0.0:3001").await?;
    info!("Server running on http://0.0.0.0:3001");
    
    axum::serve(listener, app).await?;
    Ok(())
}

async fn search_movies(
    Query(params): Query<SearchQuery>,
    state: axum::extract::State<AppState>,
) -> Result<Json<Vec<ContentItem>>, StatusCode> {
    let cache_key = format!("movies:{}:{:?}", params.q, params);
    
    if let Some(cached) = state.cache.get(&cache_key).await {
        return Ok(Json(cached));
    }

    match state.movie_scraper.search(&params.q, params.limit.unwrap_or(20)).await {
        Ok(results) => {
            state.cache.set(&cache_key, &results, 300).await; // 5 min cache
            Ok(Json(results))
        }
        Err(e) => {
            error!("Movie search failed: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn search_tv(
    Query(params): Query<SearchQuery>,
    state: axum::extract::State<AppState>,
) -> Result<Json<Vec<ContentItem>>, StatusCode> {
    let cache_key = format!("tv:{}:{:?}", params.q, params);
    
    if let Some(cached) = state.cache.get(&cache_key).await {
        return Ok(Json(cached));
    }

    match state.tv_scraper.search(&params.q, params.limit.unwrap_or(20)).await {
        Ok(results) => {
            state.cache.set(&cache_key, &results, 300).await;
            Ok(Json(results))
        }
        Err(e) => {
            error!("TV search failed: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn search_books(
    Query(params): Query<SearchQuery>,
    state: axum::extract::State<AppState>,
) -> Result<Json<Vec<ContentItem>>, StatusCode> {
    let cache_key = format!("books:{}:{:?}", params.q, params);
    
    if let Some(cached) = state.cache.get(&cache_key).await {
        return Ok(Json(cached));
    }

    match state.book_scraper.search(&params.q, params.limit.unwrap_or(20)).await {
        Ok(results) => {
            state.cache.set(&cache_key, &results, 600).await; // 10 min cache
            Ok(Json(results))
        }
        Err(e) => {
            error!("Book search failed: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn get_live_tv(
    state: axum::extract::State<AppState>,
) -> Result<Json<Vec<ContentItem>>, StatusCode> {
    let cache_key = "live_tv:all";
    
    if let Some(cached) = state.cache.get(cache_key).await {
        return Ok(Json(cached));
    }

    match state.live_tv_scraper.get_channels().await {
        Ok(results) => {
            state.cache.set(cache_key, &results, 1800).await; // 30 min cache
            Ok(Json(results))
        }
        Err(e) => {
            error!("Live TV failed: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn get_trending_movies(
    state: axum::extract::State<AppState>,
) -> Result<Json<Vec<ContentItem>>, StatusCode> {
    let cache_key = "trending:movies";
    
    if let Some(cached) = state.cache.get(cache_key).await {
        return Ok(Json(cached));
    }

    match state.movie_scraper.get_trending().await {
        Ok(results) => {
            state.cache.set(cache_key, &results, 3600).await; // 1 hour cache
            Ok(Json(results))
        }
        Err(e) => {
            error!("Trending movies failed: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn get_stream_urls(
    Path(id): Path<String>,
    state: axum::extract::State<AppState>,
) -> Result<Json<Vec<String>>, StatusCode> {
    // Implementation for getting direct stream URLs
    Ok(Json(vec![]))
}

async fn get_download_urls(
    Path(id): Path<String>,
    state: axum::extract::State<AppState>,
) -> Result<Json<Vec<String>>, StatusCode> {
    // Implementation for getting direct download URLs
    Ok(Json(vec![]))
}

async fn health_check() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now(),
        "version": env!("CARGO_PKG_VERSION")
    }))
}
```

---

## 🔍 **DIRECT CONTENT SCRAPERS**

### **Movie Scraper - src/scrapers/movie.rs**
```rust
use crate::ContentItem;
use anyhow::Result;
use reqwest::Client;
use scraper::{Html, Selector};
use std::time::Duration;

pub struct MovieScraper {
    client: Client,
    sources: Vec<String>,
}

impl MovieScraper {
    pub async fn new() -> Result<Self> {
        let client = Client::builder()
            .timeout(Duration::from_secs(30))
            .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
            .build()?;

        let sources = vec![
            // Direct movie sources (replace with actual working sources)
            "https://yts.mx".to_string(),
            "https://1337x.to".to_string(),
            "https://thepiratebay.org".to_string(),
            "https://rarbg.to".to_string(),
            "https://eztv.re".to_string(),
        ];

        Ok(Self { client, sources })
    }

    pub async fn search(&self, query: &str, limit: usize) -> Result<Vec<ContentItem>> {
        let mut all_results = Vec::new();

        // Search across multiple sources concurrently
        let futures: Vec<_> = self.sources.iter()
            .map(|source| self.search_source(source, query))
            .collect();

        let results = futures::future::join_all(futures).await;

        for result in results {
            if let Ok(mut items) = result {
                all_results.append(&mut items);
            }
        }

        // Sort by quality and seeds
        all_results.sort_by(|a, b| {
            b.seeds.unwrap_or(0).cmp(&a.seeds.unwrap_or(0))
        });

        all_results.truncate(limit);
        Ok(all_results)
    }

    async fn search_source(&self, source: &str, query: &str) -> Result<Vec<ContentItem>> {
        match source {
            s if s.contains("yts.mx") => self.search_yts(query).await,
            s if s.contains("1337x.to") => self.search_1337x(query).await,
            s if s.contains("thepiratebay.org") => self.search_tpb(query).await,
            _ => Ok(vec![]),
        }
    }

    async fn search_yts(&self, query: &str) -> Result<Vec<ContentItem>> {
        let url = format!("https://yts.mx/browse-movies/{}/all/all/0/latest/0/all", 
                         query.replace(" ", "%20"));
        
        let response = self.client.get(&url).send().await?;
        let html = response.text().await?;
        let document = Html::parse_document(&html);

        let movie_selector = Selector::parse(".browse-movie-wrap").unwrap();
        let title_selector = Selector::parse(".browse-movie-title").unwrap();
        let year_selector = Selector::parse(".browse-movie-year").unwrap();
        let rating_selector = Selector::parse(".rating").unwrap();
        let image_selector = Selector::parse(".browse-movie-poster img").unwrap();

        let mut results = Vec::new();

        for movie in document.select(&movie_selector) {
            let title = movie.select(&title_selector)
                .next()
                .map(|el| el.inner_html())
                .unwrap_or_default();

            let year = movie.select(&year_selector)
                .next()
                .and_then(|el| el.inner_html().parse().ok());

            let rating = movie.select(&rating_selector)
                .next()
                .and_then(|el| el.inner_html().parse().ok());

            let image_url = movie.select(&image_selector)
                .next()
                .and_then(|el| el.value().attr("src"))
                .map(|s| s.to_string());

            results.push(ContentItem {
                id: uuid::Uuid::new_v4().to_string(),
                title,
                description: None,
                image_url,
                stream_urls: vec![],
                download_urls: vec![], // Will be populated by torrent scraper
                quality: vec!["1080p".to_string(), "720p".to_string()],
                size: None,
                seeds: None,
                peers: None,
                rating,
                year,
                genre: vec![],
                language: vec!["en".to_string()],
                subtitles: vec![],
            });
        }

        Ok(results)
    }

    async fn search_1337x(&self, query: &str) -> Result<Vec<ContentItem>> {
        // Implementation for 1337x scraping
        Ok(vec![])
    }

    async fn search_tpb(&self, query: &str) -> Result<Vec<ContentItem>> {
        // Implementation for ThePirateBay scraping
        Ok(vec![])
    }

    pub async fn get_trending(&self) -> Result<Vec<ContentItem>> {
        // Scrape trending movies from multiple sources
        self.search("", 50).await
    }
}
```
