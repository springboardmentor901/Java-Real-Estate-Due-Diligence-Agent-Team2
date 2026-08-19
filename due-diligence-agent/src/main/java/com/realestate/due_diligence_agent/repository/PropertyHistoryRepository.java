package com.realestate.due_diligence_agent.repository;

import com.realestate.due_diligence_agent.entity.PropertyHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyHistoryRepository
        extends JpaRepository<PropertyHistory, Long> {

    List<PropertyHistory> findByPropertyIdOrderByEventDateDesc(Long propertyId);
}