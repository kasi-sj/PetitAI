//package com.example.PetitAi.repository;
//
//import com.example.PetitAi.entity.Petition;
//import org.springframework.data.mongodb.repository.MongoRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface PetitionRepository extends MongoRepository<Petition, String> {
//
//    List<Petition> findByOrganization_Id(String organizationId);
//
//    List<Petition> findByDepartment_Id(String departmentId);
//
//    List<Petition> findByFromUser_Id(String userId);
//
//    List<Petition> findByPriority(String priority);
//}
