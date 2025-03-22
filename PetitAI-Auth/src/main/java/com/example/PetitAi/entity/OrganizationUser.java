//package com.example.PetitAi.entity;
////not changed
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
//import org.springframework.data.mongodb.core.mapping.DBRef;
//import lombok.Getter;
//import lombok.Setter;
//
//import java.util.List;
//
//@Getter
//@Setter
//@Document(collection = "organization_users")
//public class OrganizationUser {
//    @Id
//    private String id;
//
//    @DBRef
//    private Users user;
//
//    @DBRef
//    private Organization organization;
//
//
//    @DBRef
//    private Department departments;
//
//    @DBRef
//    private Role role;
//
//    @DBRef
//    private OrganizationUser reportTo;
//
//
//    private List<Petition> petitionAssigned;
//    private List<Petition> petitionProcessed;
//    private List<Petition> petitionDelegated;
//    private List<Petition> petitionForwarded;
//    private List<Petition> petitionRejected;
//    private List<Petition> petitionPending;
//    private Boolean isActive = true;
//}
