package com.valualtion.controller;

import com.valualtion.dto.ValuationRequest;
import com.valualtion.dto.ValuationResponse;
import com.valualtion.service.ValuationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/valuation")
public class ValuationController {

    private final ValuationService valuationService;

    public ValuationController(ValuationService valuationService) {
        this.valuationService = valuationService;
    }

    @PostMapping("/estimate")
    public ResponseEntity<ValuationResponse> estimateProperty(@Valid @RequestBody ValuationRequest request) {
        ValuationResponse response = valuationService.estimateProperty(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ValuationResponse> getValuation(@PathVariable UUID id) {
        ValuationResponse response = valuationService.getValuationById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ValuationResponse>> getUserValuations() {
        List<ValuationResponse> list = valuationService.getUserValuations();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/{id}/email-report")
    public ResponseEntity<Map<String, String>> emailReport(
            @PathVariable UUID id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String targetEmail = body != null ? body.get("email") : null;
        byte[] pdfBytes = null;
        if (body != null && body.containsKey("pdfBase64") && !body.get("pdfBase64").isBlank()) {
            try {
                pdfBytes = Base64.getDecoder().decode(body.get("pdfBase64"));
            } catch (Exception ignored) {}
        }

        valuationService.emailValuationReport(id, targetEmail, pdfBytes);
        return ResponseEntity.ok(Map.of("message", "Valuation report successfully emailed"));
    }
}
