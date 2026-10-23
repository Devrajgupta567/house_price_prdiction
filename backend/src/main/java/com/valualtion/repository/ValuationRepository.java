package com.valualtion.repository;

import com.valualtion.entity.Valuation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ValuationRepository extends JpaRepository<Valuation, UUID> {

    @Query("SELECT DISTINCT v FROM Valuation v LEFT JOIN FETCH v.comparables WHERE v.user.id = :userId ORDER BY v.createdAt DESC")
    List<Valuation> findByUserIdOrderByCreatedAtDesc(@Param("userId") UUID userId);

    @Query("SELECT v FROM Valuation v LEFT JOIN FETCH v.comparables WHERE v.id = :id")
    Optional<Valuation> findByIdWithComparables(@Param("id") UUID id);

    List<Valuation> findByPropertyIdOrderByCreatedAtDesc(UUID propertyId);
}
