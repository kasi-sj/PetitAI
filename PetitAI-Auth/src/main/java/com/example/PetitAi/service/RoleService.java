//package com.example.PetitAi.service;
//
//import com.example.PetitAi.entity.Role;
//import com.example.PetitAi.repository.RoleRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class RoleService {
//    @Autowired
//    private RoleRepository roleRepository;
//
//    public Role createRole(Role role) {
//        return roleRepository.save(role);
//    }
//
//    public List<Role> getRolesByOrganization(String organizationId) {
//        return roleRepository.findByOrganizationId(organizationId);
//    }
//
//    public Optional<Role> getRoleById(String id) {
//        return roleRepository.findById(id);
//    }
//
//    public Role updateRole(String id, Role roleDetails) {
//        return roleRepository.findById(id).map(role -> {
//            role.setRoleName(roleDetails.getRoleName());
//            role.setPriority(roleDetails.getPriority());
//            return roleRepository.save(role);
//        }).orElseThrow(() -> new RuntimeException("Role not found"));
//    }
//
//    public void deleteRole(String id) {
//        roleRepository.deleteById(id);
//    }
//}
