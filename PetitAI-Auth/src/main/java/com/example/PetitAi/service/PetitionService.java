//package com.example.PetitAi.service;
//
//import com.example.PetitAi.entity.Petition;
//import com.example.PetitAi.repository.PetitionRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class PetitionService {
//
//    @Autowired
//    private PetitionRepository petitionRepository;
//
//    public List<Petition> getAllPetitions() {
//        return petitionRepository.findAll();
//    }
//
//    public Optional<Petition> getPetitionById(String id) {
//        return petitionRepository.findById(id);
//    }
//
//    public List<Petition> getPetitionsByOrganization(String organizationId) {
//        return petitionRepository.findByOrganization_Id(organizationId);
//    }
//
//    public List<Petition> getPetitionsByDepartment(String departmentId) {
//        return petitionRepository.findByDepartment_Id(departmentId);
//    }
//
//    public List<Petition> getPetitionsByUser(String userId) {
//        return petitionRepository.findByFromUser_Id(userId);
//    }
//
//    public List<Petition> getPetitionsByPriority(String priority) {
//        return petitionRepository.findByPriority(priority);
//    }
//
//    public Petition createPetition(Petition petition) {
//        return petitionRepository.save(petition);
//    }
//
//    public void deletePetition(String id) {
//        petitionRepository.deleteById(id);
//    }
//}
