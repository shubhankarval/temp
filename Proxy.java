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

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;

@Service
public class ProxyService {

    @Value("${backend.url}")
    private String backendUrl;

    private final RestTemplate restTemplate;

    public ProxyService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ResponseEntity<String> forwardGetRequest(HttpServletRequest request, HttpHeaders headers) {
        String targetUrl = buildTargetUrl(request);
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
        
        String targetUrl = buildTargetUrl(request);
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

    private String buildTargetUrl(HttpServletRequest request) {
        String path = extractPath(request);
        String queryString = request.getQueryString();
        return backendUrl + path + (queryString != null ? "?" + queryString : "");
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
