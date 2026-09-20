package com.realestate.duediligenceagent.repository;

import com.realestate.duediligenceagent.entity.EnvironmentalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnvironmentalRecordRepository extends JpaRepository<EnvironmentalRecord, Long> {
    List<EnvironmentalRecord> findByPropertyId(Long propertyId);
}
