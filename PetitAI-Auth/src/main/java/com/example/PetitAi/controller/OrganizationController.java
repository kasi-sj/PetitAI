//package com.example.PetitAi.controller;
//
//import com.example.PetitAi.entity.Organization;
//import com.example.PetitAi.service.OrganizationService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/organizations")
//public class OrganizationController {
//
//    @Autowired
//    private OrganizationService organizationService;
//
//    // Create a new organization
//    @PostMapping
//    public Organization createOrganization(@RequestBody Organization organization) {
//        return organizationService.createOrganization(organization);
//    }
//
//    // Get all organizations
//    @GetMapping
//    public List<Organization> getAllOrganizations() {
//        return organizationService.getAllOrganizations();
//    }
//
//    // Get an organization by ID
//    @GetMapping("/{id}")
//    public Optional<Organization> getOrganizationById(@PathVariable String id) {
//        return organizationService.getOrganizationById(id);
//    }
//
//    // Get an organization by name
//    @GetMapping("/name/{name}")
//    public Optional<Organization> getOrganizationByName(@PathVariable String name) {
//        return organizationService.getOrganizationByName(name);
//    }
//
//    // Update an organization
//    @PutMapping("/{id}")
//    public Organization updateOrganization(@PathVariable String id, @RequestBody Organization updatedOrg) {
//        return organizationService.updateOrganization(id, updatedOrg);
//    }
//
//    // Delete an organization
//    @DeleteMapping("/{id}")
//    public void deleteOrganization(@PathVariable String id) {
//        organizationService.deleteOrganization(id);
//    }
//}
