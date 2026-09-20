package com.realestate.duediligenceagent.repository;

import com.realestate.duediligenceagent.entity.UtilityInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtilityInformationRepository extends JpaRepository<UtilityInformation, Long> {
    List<UtilityInformation> findByPropertyId(Long propertyId);
    Optional<UtilityInformation> findByIdAndPropertyId(Long id, Long propertyId);
}
