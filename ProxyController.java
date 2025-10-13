package com.example.proxy.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;

@RestController
@RequestMapping("/api/proxy")
public class ProxyController {

    @Value("${backend.url}")
    private String backendUrl;

    private final RestTemplate restTemplate;

    public ProxyController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/**")
    public ResponseEntity<String> proxyGet(
            HttpServletRequest request,
            @RequestHeader HttpHeaders headers) {
        
        String path = extractPath(request);
        String queryString = request.getQueryString();
        String targetUrl = backendUrl + path + (queryString != null ? "?" + queryString : "");

        HttpHeaders forwardHeaders = copyHeaders(headers);
        HttpEntity<Void> entity = new HttpEntity<>(forwardHeaders);

        ResponseEntity<String> response = restTemplate.exchange(
                targetUrl,
                HttpMethod.GET,
                entity,
                String.class
        );

        return ResponseEntity
                .status(response.getStatusCode())
                .headers(response.getHeaders())
                .body(response.getBody());
    }

    @PostMapping("/**")
    public ResponseEntity<String> proxyPost(
            HttpServletRequest request,
            @RequestHeader HttpHeaders headers,
            @RequestBody(required = false) String body) {
        
        String path = extractPath(request);
        String queryString = request.getQueryString();
        String targetUrl = backendUrl + path + (queryString != null ? "?" + queryString : "");

        HttpHeaders forwardHeaders = copyHeaders(headers);
        HttpEntity<String> entity = new HttpEntity<>(body, forwardHeaders);

        ResponseEntity<String> response = restTemplate.exchange(
                targetUrl,
                HttpMethod.POST,
                entity,
                String.class
        );

        return ResponseEntity
                .status(response.getStatusCode())
                .headers(response.getHeaders())
                .body(response.getBody());
    }

    private String extractPath(HttpServletRequest request) {
        String path = request.getRequestURI();
        String contextPath = request.getContextPath();
        String proxyPath = "/api/proxy";
        
        if (path.startsWith(contextPath)) {
            path = path.substring(contextPath.length());
        }
        if (path.startsWith(proxyPath)) {
            path = path.substring(proxyPath.length());
        }
        
        return path;
    }

    private HttpHeaders copyHeaders(HttpHeaders headers) {
        HttpHeaders forwardHeaders = new HttpHeaders();
        headers.forEach((key, value) -> {
            // Skip host header as it will be set automatically
            if (!key.equalsIgnoreCase("host")) {
                forwardHeaders.addAll(key, value);
            }
        });
        return forwardHeaders;
    }
}
