// LIVE TV SCRAPER MODULE
use anyhow::Result;
use reqwest::Client;
use crate::ContentItem;

pub struct LiveTVScraper {
    client: Client,
    sources: Vec<String>,
}

impl LiveTVScraper {
    pub async fn new() -> Result<Self> {
        let client = Client::builder()
            .timeout(std::time::Duration::from_secs(30))
            .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
            .build()?;
        let sources = vec![
            "https://iptv-org.github.io/iptv/index.country.m3u".to_string(),
            "https://iptv-org.github.io/iptv/index.language.m3u".to_string(),
        ];
        Ok(Self { client, sources })
    }
    pub async fn get_channels(&self) -> Result<Vec<ContentItem>> {
        let mut all_channels = Vec::new();
        for source in &self.sources {
            let response = self.client.get(source).send().await?;
            let content = response.text().await?;
            let lines: Vec<&str> = content.lines().collect();
            let mut i = 0;
            while i < lines.len() {
                if lines[i].starts_with("#EXTINF:") {
                    let info_line = lines[i];
                    let url_line = if i + 1 < lines.len() { lines[i + 1] } else { "" };
                    if !url_line.is_empty() && url_line.starts_with("http") {
                        // Parse channel info
                        let title = Self::extract_title(info_line);
                        let logo = Self::extract_logo(info_line);
                        let group = Self::extract_group(info_line);
                        all_channels.push(ContentItem {
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
        }
        Ok(all_channels)
    }

    fn extract_title(line: &str) -> String {
        if let Some(comma_pos) = line.rfind(',') {
            line[comma_pos + 1..].trim().to_string()
        } else {
            "Unknown Channel".to_string()
        }
    }
    fn extract_logo(line: &str) -> Option<String> {
        if let Some(start) = line.find("tvg-logo=\"") {
            let start = start + 10;
            if let Some(end) = line[start..].find('"') {
                return Some(line[start..start + end].to_string());
            }
        }
        None
    }
    fn extract_group(line: &str) -> String {
        if let Some(start) = line.find("group-title=\"") {
            let start = start + 13;
            if let Some(end) = line[start..].find('"') {
                return line[start..start + end].to_string();
            }
        }
        "General".to_string()
    }
}
