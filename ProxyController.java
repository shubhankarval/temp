// ProxyController.java
package com.example.proxy.controller;

import com.example.proxy.service.ProxyService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/proxy")
public class ProxyController {

    private final ProxyService proxyService;

    public ProxyController(ProxyService proxyService) {
        this.proxyService = proxyService;
    }

    @GetMapping("/**")
    public ResponseEntity<String> proxyGet(
            HttpServletRequest request,
            @RequestHeader HttpHeaders headers) {
        
        return proxyService.forwardGetRequest(request, headers);
    }

    @PostMapping("/**")
    public ResponseEntity<String> proxyPost(
            HttpServletRequest request,
            @RequestHeader HttpHeaders headers,
            @RequestBody(required = false) String body) {
        
        return proxyService.forwardPostRequest(request, headers, body);
    }
}

// ============================================

// ProxyService.java
package com.example.proxy.service;

import com.example.proxy.config.BackendConfig;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;

@Service
public class ProxyService {

    private final BackendConfig backendConfig;
    private final RestTemplate restTemplate;

    public ProxyService(BackendConfig backendConfig, RestTemplate restTemplate) {
        this.backendConfig = backendConfig;
        this.restTemplate = restTemplate;
    }

    public ResponseEntity<String> forwardGetRequest(HttpServletRequest request, HttpHeaders headers) {
        String targetUrl = buildTargetUrl(backendConfig.getEndpoints().get());
        HttpHeaders forwardHeaders = copyHeaders(headers);
        HttpEntity<Void> entity = new HttpEntity<>(forwardHeaders);

        ResponseEntity<String> response = restTemplate.exchange(
                targetUrl,
                HttpMethod.GET,
                entity,
                String.class
        );

        return buildResponse(response);
    }

    public ResponseEntity<String> forwardPostRequest(
            HttpServletRequest request, 
            HttpHeaders headers, 
            String body) {
        
        String targetUrl = buildTargetUrl(backendConfig.getEndpoints().post());
        HttpHeaders forwardHeaders = copyHeaders(headers);
        HttpEntity<String> entity = new HttpEntity<>(body, forwardHeaders);

        ResponseEntity<String> response = restTemplate.exchange(
                targetUrl,
                HttpMethod.POST,
                entity,
                String.class
        );

        return buildResponse(response);
    }

    private String buildTargetUrl(String endpoint) {
        String queryString = "";
        // Query params will be added by RestTemplate from request
        return backendConfig.basePath() + endpoint + queryString;
    }

    private HttpHeaders copyHeaders(HttpHeaders headers) {
        HttpHeaders forwardHeaders = new HttpHeaders();
        headers.forEach((key, value) -> {
            if (!key.equalsIgnoreCase("host")) {
                forwardHeaders.addAll(key, value);
            }
        });
        return forwardHeaders;
    }

    private ResponseEntity<String> buildResponse(ResponseEntity<String> response) {
        return ResponseEntity
                .status(response.getStatusCode())
                .headers(response.getHeaders())
                .body(response.getBody());
    }
}

// ============================================

// BackendConfig.java
package com.example.proxy.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "backend")
public record BackendConfig(
    String basePath,
    Endpoints endpoints
) {
    public record Endpoints(
        String get,
        String post
    ) {}
}
