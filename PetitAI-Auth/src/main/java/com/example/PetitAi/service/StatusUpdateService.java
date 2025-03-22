//package com.example.PetitAi.service;
//
//import com.example.PetitAi.entity.StatusUpdate;
//import com.example.PetitAi.repository.StatusUpdateRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class StatusUpdateService {
//    @Autowired
//    private StatusUpdateRepository statusUpdateRepository;
//
//    public StatusUpdate createStatusUpdate(StatusUpdate statusUpdate) {
//        return statusUpdateRepository.save(statusUpdate);
//    }
//
//    public List<StatusUpdate> getStatusUpdatesByPetition(String petitionId) {
//        return statusUpdateRepository.findByPetitionId(petitionId);
//    }
//
//    public Optional<StatusUpdate> getStatusUpdateById(String id) {
//        return statusUpdateRepository.findById(id);
//    }
//
//    public void deleteStatusUpdate(String id) {
//        statusUpdateRepository.deleteById(id);
//    }
//}
