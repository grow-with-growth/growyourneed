// CACHE MANAGER - High Performance Caching
use anyhow::Result;
use moka::future::Cache;
use redis::AsyncCommands;
use serde::{Deserialize, Serialize};
use std::time::Duration;
use crate::ContentItem;

pub struct CacheManager {
    memory_cache: Cache<String, Vec<ContentItem>>,
    redis_client: Option<redis::Client>,
}

impl CacheManager {
    pub async fn new() -> Result<Self> {
        // Memory cache with 1GB capacity
        let memory_cache = Cache::builder()
            .max_capacity(10_000)
            .time_to_live(Duration::from_secs(300)) // 5 minutes
            .build();

        // Redis cache (optional)
        let redis_client = if let Ok(redis_url) = std::env::var("REDIS_URL") {
            Some(redis::Client::open(redis_url)?)
        } else {
            None
        };

        Ok(Self {
            memory_cache,
            redis_client,
        })
    }

    pub async fn get(&self, key: &str) -> Option<Vec<ContentItem>> {
        // Try memory cache first
        if let Some(cached) = self.memory_cache.get(key).await {
            return Some(cached);
        }

        // Try Redis cache
        if let Some(redis_client) = &self.redis_client {
            if let Ok(mut conn) = redis_client.get_async_connection().await {
                if let Ok(cached_json) = conn.get::<_, String>(key).await {
                    if let Ok(cached) = serde_json::from_str::<Vec<ContentItem>>(&cached_json) {
                        // Store back in memory cache
                        self.memory_cache.insert(key.to_string(), cached.clone()).await;
                        return Some(cached);
                    }
                }
            }
        }

        None
    }

    pub async fn set(&self, key: &str, value: &Vec<ContentItem>, ttl_seconds: u64) {
        // Store in memory cache
        self.memory_cache.insert(key.to_string(), value.clone()).await;

        // Store in Redis cache
        if let Some(redis_client) = &self.redis_client {
            if let Ok(mut conn) = redis_client.get_async_connection().await {
                if let Ok(json) = serde_json::to_string(value) {
                    let _: Result<(), redis::RedisError> = conn.setex(key, ttl_seconds, json).await;
                }
            }
        }
    }

    pub async fn delete(&self, key: &str) {
        self.memory_cache.remove(key).await;

        if let Some(redis_client) = &self.redis_client {
            if let Ok(mut conn) = redis_client.get_async_connection().await {
                let _: Result<(), redis::RedisError> = conn.del(key).await;
            }
        }
    }

    pub async fn clear(&self) {
        self.memory_cache.invalidate_all();

        if let Some(redis_client) = &self.redis_client {
            if let Ok(mut conn) = redis_client.get_async_connection().await {
                let _: Result<(), redis::RedisError> = redis::cmd("FLUSHDB").query_async(&mut conn).await;
            }
        }
    }
}
