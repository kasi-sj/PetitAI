//package com.example.PetitAi.service;
//
//import com.example.PetitAi.entity.Organization;
//import com.example.PetitAi.repository.OrganizationRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class OrganizationService {
//
//    @Autowired
//    private OrganizationRepository organizationRepository;
//
//    // Create a new organization
//    public Organization createOrganization(Organization organization) {
//        return organizationRepository.save(organization);
//    }
//
//    // Get all organizations
//    public List<Organization> getAllOrganizations() {
//        return organizationRepository.findAll();
//    }
//
//    // Get an organization by ID
//    public Optional<Organization> getOrganizationById(String id) {
//        return organizationRepository.findById(id);
//    }
//
//    // Get an organization by name
//    public Optional<Organization> getOrganizationByName(String name) {
//        return organizationRepository.findByName(name);
//    }
//
//    // Update an existing organization
//    public Organization updateOrganization(String id, Organization updatedOrg) {
//        Optional<Organization> existingOrg = organizationRepository.findById(id);
//
//        if (existingOrg.isPresent()) {
//            Organization org = existingOrg.get();
//            org.setName(updatedOrg.getName());
//            org.setWhiteListedEmails(updatedOrg.getWhiteListedEmails());
//            org.setProfilePic(updatedOrg.getProfilePic());
//            org.setDescription(updatedOrg.getDescription());
//            org.setWebsite(updatedOrg.getWebsite());
//            org.setPhoneNumber(updatedOrg.getPhoneNumber());
//            org.setAddress(updatedOrg.getAddress());
//            org.setEstablishedYear(updatedOrg.getEstablishedYear());
//            org.setIsActive(updatedOrg.getIsActive());
//            org.setSimilarityThreshold(updatedOrg.getSimilarityThreshold());
//
//            return organizationRepository.save(org);
//        } else {
//            throw new RuntimeException("Organization not found!");
//        }
//    }
//
//    // Delete an organization by ID
//    public void deleteOrganization(String id) {
//        organizationRepository.deleteById(id);
//    }
//}
