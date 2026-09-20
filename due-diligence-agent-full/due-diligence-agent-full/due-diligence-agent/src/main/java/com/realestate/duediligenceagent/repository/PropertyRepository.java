package com.realestate.duediligenceagent.repository;

import com.realestate.duediligenceagent.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByAddressContainingIgnoreCase(String address);
}
