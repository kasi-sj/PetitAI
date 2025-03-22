//package com.example.PetitAi.controller;
//
//import com.example.PetitAi.entity.StatusUpdate;
//import com.example.PetitAi.service.StatusUpdateService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/status-updates")
//public class StatusUpdateController {
//
//    @Autowired
//    private StatusUpdateService statusUpdateService;
//
//    @PostMapping
//    public StatusUpdate createStatusUpdate(@RequestBody StatusUpdate statusUpdate) {
//        return statusUpdateService.createStatusUpdate(statusUpdate);
//    }
//
//    @GetMapping("/petition/{petitionId}")
//    public List<StatusUpdate> getStatusUpdatesByPetition(@PathVariable String petitionId) {
//        return statusUpdateService.getStatusUpdatesByPetition(petitionId);
//    }
//
//    @GetMapping("/{id}")
//    public Optional<StatusUpdate> getStatusUpdateById(@PathVariable String id) {
//        return statusUpdateService.getStatusUpdateById(id);
//    }
//
//    @DeleteMapping("/{id}")
//    public void deleteStatusUpdate(@PathVariable String id) {
//        statusUpdateService.deleteStatusUpdate(id);
//    }
//}
