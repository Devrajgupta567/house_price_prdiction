package com.valualtion.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    private static final Logger log = LoggerFactory.getLogger(RestClientConfig.class);

    @Value("${app.ml-service.url:http://127.0.0.1:8000}")
    private String mlServiceBaseUrl;

    /**
     * Render's fromService host property gives just the hostname (e.g. valualtion-ml.onrender.com).
     * This method normalises it to a full https:// URL for production use.
     */
    private String normalizeUrl(String url) {
        if (url == null || url.isBlank()) return "http://127.0.0.1:8000";
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        // Plain hostname from Render — add https://
        String normalized = "https://" + url;
        log.info("ML service URL normalised to: {}", normalized);
        return normalized;
    }

    @Bean
    public RestClient mlRestClient() {
        return RestClient.builder()
                .baseUrl(normalizeUrl(mlServiceBaseUrl))
                .build();
    }
}
