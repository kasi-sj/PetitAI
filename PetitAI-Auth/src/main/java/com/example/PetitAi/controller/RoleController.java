//package com.example.PetitAi.controller;
//
//import com.example.PetitAi.entity.Role;
//import com.example.PetitAi.service.RoleService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/roles")
//public class RoleController {
//
//    @Autowired
//    private RoleService roleService;
//
//    @PostMapping
//    public Role createRole(@RequestBody Role role) {
//        return roleService.createRole(role);
//    }
//
//    @GetMapping("/organization/{organizationId}")
//    public List<Role> getRolesByOrganization(@PathVariable String organizationId) {
//        return roleService.getRolesByOrganization(organizationId);
//    }
//
//    @GetMapping("/{id}")
//    public Optional<Role> getRoleById(@PathVariable String id) {
//        return roleService.getRoleById(id);
//    }
//
//    @PutMapping("/{id}")
//    public Role updateRole(@PathVariable String id, @RequestBody Role roleDetails) {
//        return roleService.updateRole(id, roleDetails);
//    }
//
//    @DeleteMapping("/{id}")
//    public void deleteRole(@PathVariable String id) {
//        roleService.deleteRole(id);
//    }
//}
