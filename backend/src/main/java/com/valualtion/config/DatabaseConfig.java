package com.valualtion.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url}")
    private String rawUrl;

    @Value("${spring.datasource.username:}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Value("${spring.datasource.driver-class-name:org.h2.Driver}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();

        // Handle cloud PaaS postgres:// or postgresql:// URIs (e.g. Render, Railway, Neon, Supabase)
        if (rawUrl != null && (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(rawUrl.replace("postgresql://", "http://").replace("postgres://", "http://"));
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                String dbName = path != null && path.startsWith("/") ? path.substring(1) : path;

                String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, dbName != null ? dbName : "valualtion");
                if (uri.getQuery() != null) {
                    jdbcUrl += "?" + uri.getQuery();
                }

                config.setJdbcUrl(jdbcUrl);
                config.setDriverClassName("org.postgresql.Driver");

                if (uri.getUserInfo() != null) {
                    String[] userInfo = uri.getUserInfo().split(":", 2);
                    config.setUsername(userInfo[0]);
                    if (userInfo.length > 1) {
                        config.setPassword(userInfo[1]);
                    }
                } else {
                    if (username != null && !username.isBlank()) config.setUsername(username);
                    if (password != null && !password.isBlank()) config.setPassword(password);
                }

                log.info("Configured PostgreSQL DataSource from Cloud URI: {}", jdbcUrl);
                return new HikariDataSource(config);
            } catch (Exception e) {
                log.warn("Failed to parse raw cloud database URI, falling back to standard properties: {}", e.getMessage());
            }
        }

        // Standard configuration (JDBC URL or local H2)
        config.setJdbcUrl(rawUrl);
        if (username != null && !username.isBlank()) config.setUsername(username);
        if (password != null && !password.isBlank()) config.setPassword(password);
        if (driverClassName != null && !driverClassName.isBlank()) config.setDriverClassName(driverClassName);
        return new HikariDataSource(config);
    }
}
