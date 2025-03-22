# Petition Service - PetitAI

A backend service for managing petitions, users, organization users, and departments.

## Tech Stack
- **Backend:** Node.js, TypeScript, Express.js
- **Database:** PostgreSQL (via Prisma), MongoDB (via Mongoose)
- **Message Queue:** Redpanda (Kafka-compatible)
- **Validation:** Zod
- **Testing:** Jest, Supertest
# API Reference

This is a concise reference for all the routes used in the Petition Service.

---

## Departments (`/departments`)
- **GET /**  
  *Get all departments*  
  `validate(getAllDepartmentsSchema)` → `getAllDepartments`

- **GET /:id**  
  *Get a department by ID*  
  `validate(getDepartmentSchema)` → `getDepartmentById`

- **POST /**  
  *Create a department*  
  `validate(createDepartmentSchema)` → `createDepartment`

- **PUT /:id**  
  *Update a department*  
  `validate(updateDepartmentSchema)` → `updateDepartment`

- **DELETE /:id**  
  *Delete a department*  
  `validate(deleteDepartmentSchema)` → `deleteDepartment`

- **GET /:id/available-user**  
  *Get available low-level users for a department*  
  `validate(getAvailableUsersSchema)` → `getAvailableLowLevelUsers`

- **POST /is-department-exist**  
  *Check if a department exists*  
  `validate(isDepartmentExistSchema)` → `isDepartmentExist`

- **GET /:id/organization-users**  
  *Get organization users for a department*  
  `validate(getOrganizationUsersSchema)` → `getOrganizationUsers`

---

## Organization Users (`/organization-users`)
- **GET /**  
  *Get all organization users*  
  `validate(getAllOrganizationUsersSchema)` → `getAllOrganizationUsers`

- **GET /:id**  
  *Get an organization user by ID*  
  `validate(getOrganizationUserSchema)` → `getOrganizationUserById`

- **POST /**  
  *Create an organization user*  
  `validate(createOrganizationUserSchema)` → `createOrganizationUser`

- **PUT /:id**  
  *Update an organization user*  
  `validate(updateOrganizationUserSchema)` → `updateOrganizationUser`

- **DELETE /:id**  
  *Delete an organization user*  
  `validate(deleteOrganizationUserSchema)` → `deleteOrganizationUser`

- **POST /is-user-exist**  
  *Check if a user exists*  
  `validate(isUserExistSchema)` → `isUserExist`

- **GET /report-to/role/:roleId**  
  *Get reporting user by role ID*  
  `validate(getReportToUserByRoleIdSchema)` → `getReportToUserByRoleId`

- **POST /login**  
  *Login organization user*  
  `validate(loginSchema)` → `loginOrganizationUser`

- **GET /:id/petitions**  
  *Get petitions for an organization user*  
  `validate(getOrganizationUserPetitionSchema)` → `getOrganizationUserPetition`

---

## Organizations (`/organizations`)
- **GET /**  
  *Get all organizations*  
  `validate(getAllOrganizationsSchema)` → `getAllOrganizations`

- **GET /:id**  
  *Get an organization by ID*  
  `validate(getOrganizationSchema)` → `getOrganizationById`

- **POST /**  
  *Create an organization*  
  `validate(createOrganizationSchema)` → `createOrganization`

- **PUT /:id**  
  *Update an organization*  
  `validate(updateOrganizationSchema)` → `updateOrganization`

- **DELETE /:id**  
  *Delete an organization*  
  `validate(deleteOrganizationSchema)` → `deleteOrganization`

- **GET /:id/departments**  
  *Get departments for an organization*  
  `validate(getOrganizationDepartmentsSchema)` → `getOrganizationDepartments`

- **GET /:id/roles**  
  *Get roles for an organization*  
  `validate(getOrganizationRolesSchema)` → `getOrganizationRoles`

- **GET /:id/organization-users**  
  *Get organization users for an organization*  
  `validate(getOrganizationUsersSchema)` → `getOrganizationUsers`

- **GET /name/:name**  
  *Get an organization by name*  
  `validate(getOrganizationByNameSchema)` → `getOrganizationByName`

- **GET /:id/petitions-count**  
  *Get petition count for an organization*  
  `validate(getPetitionCountSchema)` → `getPetitionCount`

- **GET /:id/petitions-count-by-department**  
  *Get petition count by department for an organization*  
  `validate(getPetitionCountByDepartmentSchema)` → `getPetitionCountByDepartment`

---

## Petitions (`/petitions`)
- **GET /**  
  *Get all petitions*  
  `validate(getAllPetitionsSchema)` → `getAllPetitions`

- **GET /:id**  
  *Get a petition by ID*  
  `validate(getPetitionSchema)` → `getPetitionById`

- **POST /**  
  *Create a petition*  
  `validate(createPetitionSchema)` → `createPetition`

- **PUT /:id**  
  *Update a petition*  
  `validate(updatePetitionSchema)` → `updatePetition`

- **DELETE /:id**  
  *Delete a petition*  
  `validate(deletePetitionSchema)` → `deletePetition`

- **POST /most-similar**  
  *Get most similar petition*  
  `validate(getMostSimilarPetitionSchema)` → `getMostSimilarPetition`

- **POST /:id/assign**  
  *Assign a petition to an organization user*  
  `validate(assignPetitionToOrgUserSchema)` → `assignPetitionToOrgUser`

- **GET /:id/getSimilarPetitions**  
  *Get similar petitions*  
  `validate(getMostSimilarPetitionsSchema)` → `getSimilarPetitions`

---

## Queues (`/queues`)
- **POST /add**  
  *Add a message to the queue*  
  `validate(createQueueMessageSchema)` → `addMessageToQueue`

---

## Roles (`/roles`)
- **GET /**  
  *Get all roles*  
  `validate(getAllRolesSchema)` → `getAllRoles`

- **GET /:id**  
  *Get a role by ID*  
  `validate(getRoleSchema)` → `getRoleById`

- **POST /**  
  *Create a role*  
  `validate(createRoleSchema)` → `createRole`

- **PUT /:id**  
  *Update a role*  
  `validate(updateRoleSchema)` → `updateRole`

- **DELETE /:id**  
  *Delete a role*  
  `validate(deleteRoleSchema)` → `deleteRole`

- **POST /is-role-exist**  
  *Check if a role exists*  
  `validate(isRoleExists)` → `isRoleExist`

---

## Status Updates (`/status-updates`)
- **POST /**  
  *Create a status update*  
  `validate(createStatusUpdateSchema)` → `createStatusUpdate`

---

## Users (`/users`)
- **GET /**  
  *Get all users*  
  `validate(getAllUsersSchema)` → `getAllUsers`

- **GET /:id**  
  *Get a user by ID*  
  `validate(getUserSchema)` → `getUserById`

- **POST /**  
  *Create a user*  
  `validate(createUserSchema)` → `createUser`

- **PUT /:id**  
  *Update a user*  
  `validate(updateUserSchema)` → `updateUser`

- **DELETE /:id**  
  *Delete a user*  
  `validate(deleteUserSchema)` → `deleteUser`

- **GET /:id/organizations**  
  *Get organizations associated with a user*  
  `validate(getUserOrganizationsSchema)` → `getUserOrganizations`

- **GET /:id/petitions**  
  *Get petitions associated with a user*  
  `validate(getUserPetitionsSchema)` → `getUserPetitions`

- **GET /:id/petitions/admin**  
  *Get admin petitions for a user*  
  `validate(getOrganizationPetition)` → `getAdminOrganizationPetition`

---

## Root
- **GET /**  
  *Health Check*  
  Returns a message: "Petition Service API is working (3)"

## Quick Start

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/kasi-sj/PetitAI.git
   cd PetitAI/petition-service
   npm install
