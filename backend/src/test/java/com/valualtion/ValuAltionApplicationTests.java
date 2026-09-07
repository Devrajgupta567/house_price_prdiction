package com.valualtion;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.valualtion.dto.AuthRequest;
import com.valualtion.dto.RegisterRequest;
import com.valualtion.dto.ValuationRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ValuAltionApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void contextLoads() {
    }

    @Test
    void healthEndpointShouldReturnUp() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("ValuAltion Java Backend"));
    }

    @Test
    void valuationEstimateShouldCalculateSuccessfully() throws Exception {
        ValuationRequest request = new ValuationRequest();
        request.setAddress("456 Grand Ave, Ames, IA");
        request.setNeighborhood("Northridge");
        request.setGrLivArea(2200.0);
        request.setBedrooms(4);
        request.setFullBath(3);
        request.setYearBuilt(2012);
        request.setOverallQual(8);
        request.setOverallCond(6);

        mockMvc.perform(post("/api/v1/valuation/estimate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estimatedValue").isNumber())
                .andExpect(jsonPath("$.rangeLow").isNumber())
                .andExpect(jsonPath("$.rangeHigh").isNumber())
                .andExpect(jsonPath("$.confidenceScore").isNumber())
                .andExpect(jsonPath("$.comparables").isArray());
    }

    @Test
    void authWorkflowShouldRegisterAndLogin() throws Exception {
        String testEmail = "testuser_" + System.currentTimeMillis() + "@valualtion.com";
        RegisterRequest registerReq = new RegisterRequest(testEmail, "SecurePassword123!", "Jane Doe", "ROLE_HOMEOWNER");

        // 1. Signup
        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.email").value(testEmail));

        // 2. Signin
        AuthRequest loginReq = new AuthRequest(testEmail, "SecurePassword123!");
        mockMvc.perform(post("/api/v1/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString());
    }
}
