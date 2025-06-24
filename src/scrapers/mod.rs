// SCRAPERS MODULE - Direct Content Access
pub mod movie;
pub mod tv;
pub mod book;
pub mod live_tv;

pub use movie::MovieScraper;
pub use tv::TVScraper;
pub use book::BookScraper;
pub use live_tv::LiveTVScraper;

use crate::ContentItem;
use anyhow::Result;
use reqwest::Client;
use scraper::{Html, Selector};
use std::time::Duration;

// TV SCRAPER IMPLEMENTATION
pub struct TVScraper {
    client: Client,
    sources: Vec<String>,
}

impl TVScraper {
    pub async fn new() -> Result<Self> {
        let client = Client::builder()
            .timeout(Duration::from_secs(30))
            .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
            .build()?;

        let sources = vec![
            "https://eztv.re".to_string(),
            "https://showrss.info".to_string(),
            "https://torrentgalaxy.to".to_string(),
        ];

        Ok(Self { client, sources })
    }

    pub async fn search(&self, query: &str, limit: usize) -> Result<Vec<ContentItem>> {
        let mut all_results = Vec::new();

        for source in &self.sources {
            if let Ok(mut results) = self.search_source(source, query).await {
                all_results.append(&mut results);
            }
        }

        all_results.sort_by(|a, b| b.seeds.unwrap_or(0).cmp(&a.seeds.unwrap_or(0)));
        all_results.truncate(limit);
        Ok(all_results)
    }

    async fn search_source(&self, source: &str, query: &str) -> Result<Vec<ContentItem>> {
        match source {
            s if s.contains("eztv.re") => self.search_eztv(query).await,
            s if s.contains("showrss.info") => self.search_showrss(query).await,
            _ => Ok(vec![]),
        }
    }

    async fn search_eztv(&self, query: &str) -> Result<Vec<ContentItem>> {
        let url = format!("https://eztv.re/search/{}", query.replace(" ", "-"));
        let response = self.client.get(&url).send().await?;
        let html = response.text().await?;
        let document = Html::parse_document(&html);

        let row_selector = Selector::parse("tr.forum_header_border").unwrap();
        let title_selector = Selector::parse(".forum_thread_post a").unwrap();
        let size_selector = Selector::parse("td:nth-child(4)").unwrap();
        let seeds_selector = Selector::parse("td:nth-child(6)").unwrap();

        let mut results = Vec::new();

        for row in document.select(&row_selector) {
            let title = row.select(&title_selector)
                .next()
                .map(|el| el.inner_html())
                .unwrap_or_default();

            let size = row.select(&size_selector)
                .next()
                .map(|el| el.inner_html())
                .unwrap_or_default();

            let seeds = row.select(&seeds_selector)
                .next()
                .and_then(|el| el.inner_html().parse().ok());

            results.push(ContentItem {
                id: uuid::Uuid::new_v4().to_string(),
                title,
                description: None,
                image_url: None,
                stream_urls: vec![],
                download_urls: vec![],
                quality: vec!["720p".to_string()],
                size: Some(size),
                seeds,
                peers: None,
                rating: None,
                year: None,
                genre: vec!["TV".to_string()],
                language: vec!["en".to_string()],
                subtitles: vec![],
            });
        }

        Ok(results)
    }

    async fn search_showrss(&self, query: &str) -> Result<Vec<ContentItem>> {
        // Implementation for ShowRSS
        Ok(vec![])
    }
}

// BOOK SCRAPER IMPLEMENTATION
pub struct BookScraper {
    client: Client,
    sources: Vec<String>,
}

impl BookScraper {
    pub async fn new() -> Result<Self> {
        let client = Client::builder()
            .timeout(Duration::from_secs(30))
            .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
            .build()?;

        let sources = vec![
            "https://libgen.is".to_string(),
            "https://z-lib.org".to_string(),
            "https://archive.org".to_string(),
            "https://gutenberg.org".to_string(),
        ];

        Ok(Self { client, sources })
    }

    pub async fn search(&self, query: &str, limit: usize) -> Result<Vec<ContentItem>> {
        let mut all_results = Vec::new();

        for source in &self.sources {
            if let Ok(mut results) = self.search_source(source, query).await {
                all_results.append(&mut results);
            }
        }

        all_results.truncate(limit);
        Ok(all_results)
    }

    async fn search_source(&self, source: &str, query: &str) -> Result<Vec<ContentItem>> {
        match source {
            s if s.contains("libgen.is") => self.search_libgen(query).await,
            s if s.contains("archive.org") => self.search_archive(query).await,
            s if s.contains("gutenberg.org") => self.search_gutenberg(query).await,
            _ => Ok(vec![]),
        }
    }

    async fn search_libgen(&self, query: &str) -> Result<Vec<ContentItem>> {
        let url = format!("https://libgen.is/search.php?req={}&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def", 
                         query.replace(" ", "+"));
        
        let response = self.client.get(&url).send().await?;
        let html = response.text().await?;
        let document = Html::parse_document(&html);

        let row_selector = Selector::parse("tr[valign='top']").unwrap();
        let title_selector = Selector::parse("td:nth-child(3) a").unwrap();
        let author_selector = Selector::parse("td:nth-child(2)").unwrap();
        let size_selector = Selector::parse("td:nth-child(8)").unwrap();
        let format_selector = Selector::parse("td:nth-child(9)").unwrap();

        let mut results = Vec::new();

        for row in document.select(&row_selector) {
            let title = row.select(&title_selector)
                .next()
                .map(|el| el.inner_html())
                .unwrap_or_default();

            let author = row.select(&author_selector)
                .next()
                .map(|el| el.inner_html())
                .unwrap_or_default();

            let size = row.select(&size_selector)
                .next()
                .map(|el| el.inner_html())
                .unwrap_or_default();

            let format = row.select(&format_selector)
                .next()
                .map(|el| el.inner_html())
                .unwrap_or_default();

            results.push(ContentItem {
                id: uuid::Uuid::new_v4().to_string(),
                title,
                description: Some(format!("Author: {}", author)),
                image_url: None,
                stream_urls: vec![],
                download_urls: vec![], // Will be populated by direct link scraper
                quality: vec![format],
                size: Some(size),
                seeds: None,
                peers: None,
                rating: None,
                year: None,
                genre: vec!["Book".to_string()],
                language: vec!["en".to_string()],
                subtitles: vec![],
            });
        }

        Ok(results)
    }

    async fn search_archive(&self, query: &str) -> Result<Vec<ContentItem>> {
        // Implementation for Archive.org
        Ok(vec![])
    }

    async fn search_gutenberg(&self, query: &str) -> Result<Vec<ContentItem>> {
        // Implementation for Project Gutenberg
        Ok(vec![])
    }
}

// LIVE TV SCRAPER IMPLEMENTATION
pub struct LiveTVScraper {
    client: Client,
    sources: Vec<String>,
}

impl LiveTVScraper {
    pub async fn new() -> Result<Self> {
        let client = Client::builder()
            .timeout(Duration::from_secs(30))
            .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
            .build()?;

        let sources = vec![
            "https://raw.githubusercontent.com/iptv-org/iptv/master/channels/us.m3u".to_string(),
            "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8".to_string(),
        ];

        Ok(Self { client, sources })
    }

    pub async fn get_channels(&self) -> Result<Vec<ContentItem>> {
        let mut all_channels = Vec::new();

        for source in &self.sources {
            if let Ok(mut channels) = self.parse_m3u(source).await {
                all_channels.append(&mut channels);
            }
        }

        Ok(all_channels)
    }

    async fn parse_m3u(&self, url: &str) -> Result<Vec<ContentItem>> {
        let response = self.client.get(url).send().await?;
        let content = response.text().await?;
        
        let mut channels = Vec::new();
        let lines: Vec<&str> = content.lines().collect();
        
        let mut i = 0;
        while i < lines.len() {
            if lines[i].starts_with("#EXTINF:") {
                let info_line = lines[i];
                let url_line = if i + 1 < lines.len() { lines[i + 1] } else { "" };
                
                if !url_line.is_empty() && url_line.starts_with("http") {
                    let title = self.extract_title(info_line);
                    let logo = self.extract_logo(info_line);
                    let group = self.extract_group(info_line);
                    
                    channels.push(ContentItem {
                        id: uuid::Uuid::new_v4().to_string(),
                        title,
                        description: Some(group.clone()),
                        image_url: logo,
                        stream_urls: vec![url_line.to_string()],
                        download_urls: vec![],
                        quality: vec!["Live".to_string()],
                        size: None,
                        seeds: None,
                        peers: None,
                        rating: None,
                        year: None,
                        genre: vec![group],
                        language: vec!["en".to_string()],
                        subtitles: vec![],
                    });
                }
                i += 2;
            } else {
                i += 1;
            }
        }
        
        Ok(channels)
    }

    fn extract_title(&self, line: &str) -> String {
        if let Some(comma_pos) = line.rfind(',') {
            line[comma_pos + 1..].trim().to_string()
        } else {
            "Unknown Channel".to_string()
        }
    }

    fn extract_logo(&self, line: &str) -> Option<String> {
        if let Some(start) = line.find("tvg-logo=\"") {
            let start = start + 10;
            if let Some(end) = line[start..].find('"') {
                return Some(line[start..start + end].to_string());
            }
        }
        None
    }

    fn extract_group(&self, line: &str) -> String {
        if let Some(start) = line.find("group-title=\"") {
            let start = start + 13;
            if let Some(end) = line[start..].find('"') {
                return line[start..start + end].to_string();
            }
        }
        "General".to_string()
    }
}
