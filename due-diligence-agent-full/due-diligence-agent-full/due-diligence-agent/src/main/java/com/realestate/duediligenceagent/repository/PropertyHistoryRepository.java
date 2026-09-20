package com.realestate.duediligenceagent.repository;

import com.realestate.duediligenceagent.entity.PropertyHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyHistoryRepository
        extends JpaRepository<PropertyHistory, Long> {

    List<PropertyHistory> findByPropertyIdOrderByChangedAtDesc(Long propertyId);
}
