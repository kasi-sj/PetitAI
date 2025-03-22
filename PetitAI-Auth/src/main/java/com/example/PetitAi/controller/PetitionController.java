//package com.example.PetitAi.controller;
//
//import com.example.PetitAi.entity.Petition;
//import com.example.PetitAi.service.PetitionService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/petitions")
//public class PetitionController {
//
//    @Autowired
//    private PetitionService petitionService;
//
//    @GetMapping
//    public List<Petition> getAllPetitions() {
//        return petitionService.getAllPetitions();
//    }
//
//    @GetMapping("/{id}")
//    public Optional<Petition> getPetitionById(@PathVariable String id) {
//        return petitionService.getPetitionById(id);
//    }
//
//    @GetMapping("/organization/{organizationId}")
//    public List<Petition> getPetitionsByOrganization(@PathVariable String organizationId) {
//        return petitionService.getPetitionsByOrganization(organizationId);
//    }
//
//    @GetMapping("/department/{departmentId}")
//    public List<Petition> getPetitionsByDepartment(@PathVariable String departmentId) {
//        return petitionService.getPetitionsByDepartment(departmentId);
//    }
//
//    @GetMapping("/user/{userId}")
//    public List<Petition> getPetitionsByUser(@PathVariable String userId) {
//        return petitionService.getPetitionsByUser(userId);
//    }
//
//    @GetMapping("/priority/{priority}")
//    public List<Petition> getPetitionsByPriority(@PathVariable String priority) {
//        return petitionService.getPetitionsByPriority(priority);
//    }
//
//    @PostMapping
//    public Petition createPetition(@RequestBody Petition petition) {
//        return petitionService.createPetition(petition);
//    }
//
//    @DeleteMapping("/{id}")
//    public void deletePetition(@PathVariable String id) {
//        petitionService.deletePetition(id);
//    }
//}
