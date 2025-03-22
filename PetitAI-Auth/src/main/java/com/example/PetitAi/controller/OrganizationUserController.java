//package com.example.PetitAi.controller;
//
//import com.example.PetitAi.entity.OrganizationUser;
//import com.example.PetitAi.service.OrganizationUserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/organizationUsers")
//public class OrganizationUserController {
//
//    @Autowired
//    private OrganizationUserService organizationUserService;
//
//    @PostMapping("/{orgId}")
//    public OrganizationUser createOrganizationUser(@RequestBody OrganizationUser user, @PathVariable String orgId) {
//        return organizationUserService.createOrganizationUser(user, orgId);
//    }
//
//    @GetMapping("/organization/{orgId}")
//    public List<OrganizationUser> getUsersByOrganization(@PathVariable String orgId) {
//        return organizationUserService.getUsersByOrganization(orgId);
//    }
//
//    @GetMapping("/{id}")
//    public Optional<OrganizationUser> getUserById(@PathVariable String id) {
//        return organizationUserService.getUserById(id);
//    }
//
//    @DeleteMapping("/{id}")
//    public void deleteUser(@PathVariable String id) {
//        organizationUserService.deleteUser(id);
//    }
//}
