//package com.example.PetitAi.service;
//
//import com.example.PetitAi.entity.Department;
//import com.example.PetitAi.entity.Organization;
//import com.example.PetitAi.repository.DepartmentRepository;
//import com.example.PetitAi.repository.OrganizationRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class DepartmentService {
//
//    @Autowired
//    private DepartmentRepository departmentRepository;
//
//    @Autowired
//    private OrganizationRepository organizationRepository;
//
//    public Department createDepartment(Department department, String orgId) {
//        // Save the department first
//        Department savedDepartment = departmentRepository.save(department);
//
//        // Add department reference to organization
//        Optional<Organization> organizationOptional = organizationRepository.findById(orgId);
//        if (organizationOptional.isPresent()) {
//            Organization organization = organizationOptional.get();
//            organizationRepository.save(organization);
//        }
//
//        return savedDepartment;
//    }
//
//    public List<Department> getAllDepartments() {
//        return departmentRepository.findAll();
//    }
//
//    public Optional<Department> getDepartmentById(String id) {
//        return departmentRepository.findById(id);
//    }
//
//    public void deleteDepartment(String id) {
//        departmentRepository.deleteById(id);
//    }
//}
