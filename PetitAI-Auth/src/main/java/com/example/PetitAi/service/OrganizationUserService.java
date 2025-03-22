//package com.example.PetitAi.service;
//
//import com.example.PetitAi.entity.Organization;
//import com.example.PetitAi.entity.OrganizationUser;
//import com.example.PetitAi.repository.OrganizationRepository;
//import com.example.PetitAi.repository.OrganizationUserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class OrganizationUserService {
//
//    @Autowired
//    private OrganizationUserRepository organizationUserRepository;
//
//    @Autowired
//    private OrganizationRepository organizationRepository;
//
//    public OrganizationUser createOrganizationUser(OrganizationUser user, String orgId) {
//        // Associate user with organization
//        Optional<Organization> organizationOptional = organizationRepository.findById(orgId);
//        if (organizationOptional.isPresent()) {
//            Organization organization = organizationOptional.get();
//
//            // Set organization reference
//            user.setOrganization(organization);
//
//            // Save user
//            OrganizationUser savedUser = organizationUserRepository.save(user);
//
//            organizationRepository.save(organization);
//
//            return savedUser;
//        }
//
//        throw new RuntimeException("Organization not found");
//    }
//
//    public List<OrganizationUser> getUsersByOrganization(String orgId) {
//        return organizationUserRepository.findByOrganizationId(orgId);
//    }
//
//    public Optional<OrganizationUser> getUserById(String id) {
//        return organizationUserRepository.findById(id);
//    }
//
//    public void deleteUser(String id) {
//        organizationUserRepository.deleteById(id);
//    }
//}
