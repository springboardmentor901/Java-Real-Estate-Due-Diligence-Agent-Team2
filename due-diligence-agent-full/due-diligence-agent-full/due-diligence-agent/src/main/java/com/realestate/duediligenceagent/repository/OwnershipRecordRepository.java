package com.realestate.duediligenceagent.repository;

import com.realestate.duediligenceagent.entity.OwnershipRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OwnershipRecordRepository extends JpaRepository<OwnershipRecord, Long> {
    List<OwnershipRecord> findByPropertyId(Long propertyId);
}
