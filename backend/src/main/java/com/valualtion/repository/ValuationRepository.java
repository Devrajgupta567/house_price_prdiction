package com.valualtion.repository;

import com.valualtion.entity.Valuation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ValuationRepository extends JpaRepository<Valuation, UUID> {
    List<Valuation> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<Valuation> findByPropertyIdOrderByCreatedAtDesc(UUID propertyId);
}
