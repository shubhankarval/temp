// ProxyController.java
package com.example.proxy.controller;

import com.example.proxy.service.ProxyService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/proxy")
public class ProxyController {

    private final ProxyService proxyService;

    public ProxyController(ProxyService proxyService) {
        this.proxyService = proxyService;
    }

    @GetMapping
    public ResponseEntity<?> proxyGet(
            @RequestParam(required = false) String param1,
            @RequestParam(required = false) String param2,
            @RequestHeader HttpHeaders headers) {
        
        return proxyService.forwardGetRequest(param1, param2, headers);
    }

    @PostMapping
    public ResponseEntity<?> proxyPost(
            @RequestParam(required = false) String param1,
            @RequestParam(required = false) String param2,
            @RequestHeader HttpHeaders headers,
            @RequestBody Object payload) {
        
        return proxyService.forwardPostRequest(param1, param2, headers, payload);
    }
}

// ============================================

// ProxyService.java
package com.example.proxy.service;

import com.example.proxy.config.BackendConfig;
import com.example.proxy.constants.QueryParamConstants;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class ProxyService {

    private final BackendConfig backendConfig;
    private final RestTemplate restTemplate;

    public ProxyService(BackendConfig backendConfig, RestTemplate restTemplate) {
        this.backendConfig = backendConfig;
        this.restTemplate = restTemplate;
    }

    public ResponseEntity<?> forwardGetRequest(String param1, String param2, HttpHeaders headers) {
        String targetUrl = buildTargetUrl(backendConfig.endpoints().get(), param1, param2);
        HttpHeaders forwardHeaders = copyHeaders(headers);
        HttpEntity<Void> entity = new HttpEntity<>(forwardHeaders);

        return restTemplate.exchange(
                targetUrl,
                HttpMethod.GET,
                entity,
                Object.class
        );
    }

    public ResponseEntity<?> forwardPostRequest(
            String param1, 
            String param2,
            HttpHeaders headers, 
            Object payload) {
        
        String targetUrl = buildTargetUrl(backendConfig.endpoints().post(), param1, param2);
        HttpHeaders forwardHeaders = copyHeaders(headers);
        HttpEntity<Object> entity = new HttpEntity<>(payload, forwardHeaders);

        return restTemplate.exchange(
                targetUrl,
                HttpMethod.POST,
                entity,
                Object.class
        );
    }

    private String buildTargetUrl(String endpoint, String param1, String param2) {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(backendConfig.basePath())
                .path(endpoint);
        
        if (param1 != null) {
            builder.queryParam(QueryParamConstants.PARAM_1, param1);
        } else if (param2 != null) {
            builder.queryParam(QueryParamConstants.PARAM_2, param2);
        }
        
        return builder.toUriString();
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

// ============================================

// QueryParamConstants.java
package com.example.proxy.constants;

public final class QueryParamConstants {
    
    public static final String PARAM_1 = "param1";
    public static final String PARAM_2 = "param2";
    
    private QueryParamConstants() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }
}
