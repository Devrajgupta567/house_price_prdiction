package com.valualtion.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Value("${app.ml-service.url:http://127.0.0.1:8000}")
    private String mlServiceBaseUrl;

    @Bean
    public RestClient mlRestClient() {
        return RestClient.builder()
                .baseUrl(mlServiceBaseUrl)
                .build();
    }
}
