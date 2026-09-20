package com.realestate.duediligenceagent.repository;

import com.realestate.duediligenceagent.entity.TaxHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaxHistoryRepository extends JpaRepository<TaxHistory, Long> {
    List<TaxHistory> findByPropertyIdOrderByTaxYearDesc(Long propertyId);
}
