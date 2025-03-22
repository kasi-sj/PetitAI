//package com.example.PetitAi.entity;
//
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
//import org.springframework.data.mongodb.core.mapping.DBRef;
//import lombok.Getter;
//import lombok.Setter;
//
//@Getter
//@Setter
//@Document(collection = "status_updates")
//public class StatusUpdate {
//    @Id
//    private String id;
//
//    @DBRef
//    private Petition petition;
//
//    private String status;
//    private String description;
//
//    @DBRef
//    private OrganizationUser updatedBy;
//}
//
