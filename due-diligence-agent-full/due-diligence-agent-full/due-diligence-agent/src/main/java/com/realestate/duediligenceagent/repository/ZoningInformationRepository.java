package com.realestate.duediligenceagent.repository;

import com.realestate.duediligenceagent.entity.ZoningInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ZoningInformationRepository extends JpaRepository<ZoningInformation, Long> {
    Optional<ZoningInformation> findByPropertyId(Long propertyId);
}
