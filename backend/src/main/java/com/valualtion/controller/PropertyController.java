package com.valualtion.controller;

import com.valualtion.dto.PropertyDto;
import com.valualtion.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public ResponseEntity<List<PropertyDto>> getProperties() {
        return ResponseEntity.ok(propertyService.getUserProperties());
    }

    @PostMapping
    public ResponseEntity<PropertyDto> createProperty(@Valid @RequestBody PropertyDto dto) {
        PropertyDto saved = propertyService.createProperty(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable UUID id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }
}
