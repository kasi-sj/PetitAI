//package com.example.PetitAi.entity;
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
//import org.springframework.data.mongodb.core.mapping.DBRef;
//import lombok.Getter;
//import lombok.Setter;
////not changed
//import java.util.List;
//
//@Getter
//@Setter
//@Document(collection = "petitions")
//public class Petition {
//    @Id
//    private String id;
//
//    @DBRef
//    private OrganizationUser fromUser;
//
//    @DBRef
//    private Organization organization;
//
//    @DBRef
//    private Department department;
//
//    private String subject;
//    private String body;
//    private String tag;
//
//    private String priority; // Low, Medium, High, Critical
//    private List<Double> embedding;
//
//    private List<String> attachments;
//
//    @DBRef
//    private List<StatusUpdate> statusUpdates;
//}
//
