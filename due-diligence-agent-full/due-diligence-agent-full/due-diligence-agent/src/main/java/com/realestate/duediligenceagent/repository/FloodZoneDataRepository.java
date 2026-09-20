package com.realestate.duediligenceagent.repository;

import com.realestate.duediligenceagent.entity.FloodZoneData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FloodZoneDataRepository extends JpaRepository<FloodZoneData, Long> {
    Optional<FloodZoneData> findByPropertyId(Long propertyId);
}
