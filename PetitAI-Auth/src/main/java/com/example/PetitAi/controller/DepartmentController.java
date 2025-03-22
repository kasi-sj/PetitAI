//package com.example.PetitAi.controller;
//
//import com.example.PetitAi.entity.Department;
//import com.example.PetitAi.service.DepartmentService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/departments")
//public class DepartmentController {
//
//    @Autowired
//    private DepartmentService departmentService;
//
//    @PostMapping("/{orgId}")
//    public Department createDepartment(@RequestBody Department department, @PathVariable String orgId) {
//        return departmentService.createDepartment(department, orgId);
//    }
//
//    @GetMapping
//    public List<Department> getAllDepartments() {
//        return departmentService.getAllDepartments();
//    }
//
//    @GetMapping("/{id}")
//    public Optional<Department> getDepartmentById(@PathVariable String id) {
//        return departmentService.getDepartmentById(id);
//    }
//
//    @DeleteMapping("/{id}")
//    public void deleteDepartment(@PathVariable String id) {
//        departmentService.deleteDepartment(id);
//    }
//}
