# Petition Service - PetitAI

- PetitAI is a backend service designed to manage petitions within an organizational structure.
- The service integrates both SQL (PostgreSQL) and NoSQL (MongoDB) databases and uses a Kafka-compatible message queue (Redpanda) for automation and asynchronous processing.
- PetitAI provides robust APIs for handling organizations, departments, users, roles, petitions, and status updates — all validated with Zod and organized following a clean service-controller architecture.

### 🔄 Request Flow

The flow of a typical API request in the PetitAI backend:

     ┌────────────────────────────┐
     │     Client/API Request     │  # server (index.ts)
     └────────────┬───────────────┘
                  │
                  ▼
     ┌─────────────────────────────┐
     │   Route is matched (Express)│ # routes
     └────────────┬────────────────┘
                  │
                  ▼
     ┌────────────────────────────┐
     │ Validate & Authenticate    │  # middleware
     │    (Zod + Middleware)      │
     └────────────┬───────────────┘
                  │
                  ▼
     ┌────────────────────────────┐
     │   Controller function      │  # controllers
     │ receives the request       │
     └────────────┬───────────────┘
                  │
                  ▼
     ┌────────────────────────────┐
     │    Call relevant services  │  # services
     │   (Business logic layer)   │
     └────────────┬───────────────┘
                  │
                  ▼
     ┌────────────────────────────┐
     │   Interact with database   │  # prisma / mongoose
     │ (PostgreSQL / MongoDB)     │
     └────────────┬───────────────┘
                  │
                  ▼
     ┌────────────────────────────┐
     │ Return structured response │  # json
     └────────────────────────────┘

### 🛠️ Tech Stack

- Node.js (TypeScript)
- Express.js
- PostgreSQL (via Prisma)
- MongoDB (via Mongoose)
- Zod (for validation)
- Redpanda (Kafka-compatible message queue)

# API Reference

This is a concise reference for all the routes used in the Petition Service.

---

<details>
<summary><strong>📁 Departments <code>`/departments`</code> </strong>
</summary>

- **GET /**  
  _Get all departments_

- **GET /:id**  
  _Get a department by ID_

- **POST /**  
  _Create a department_

- **PUT /:id**  
  _Update a department_

- **DELETE /:id**  
  _Delete a department_

- **GET /:id/available-user**  
  _Get available low-level users for a department_

- **POST /is-department-exist**  
  _Check if a department exists_

- **GET /:id/organization-users**  
 _Get organization users for a department_
</details>

---

<details> <summary><strong>📁 Organization Users <code>`/organization-users`</code></strong></summary>

- **GET /**  
  _Get all organization users_

- **GET /:id**  
  _Get an organization user by ID_

- **POST /**  
  _Create an organization user_

- **PUT /:id**  
  _Update an organization user_

- **DELETE /:id**  
  _Delete an organization user_

- **POST /is-user-exist**  
  _Check if a user exists_

- **GET /report-to/role/:roleId**  
  _Get reporting user by role ID_

- **POST /login**  
  _Login organization user_

- **GET /:id/petitions**  
  _Get petitions for an organization user_

</details>

---

<details> <summary><strong>📁 Organizations <code>`/organizations`</code></strong></summary>

- **GET /**  
  _Get all organizations_

- **GET /:id**  
  _Get an organization by ID_

- **POST /**  
  _Create an organization_

- **PUT /:id**  
  _Update an organization_

- **DELETE /:id**  
  _Delete an organization_

- **GET /:id/departments**  
  _Get departments for an organization_

- **GET /:id/roles**  
  _Get roles for an organization_

- **GET /:id/organization-users**  
  _Get organization users for an organization_

- **GET /name/:name**  
  _Get an organization by name_

- **GET /:id/petitions-count**  
  _Get petition count for an organization_

- **GET /:id/petitions-count-by-department**  
 _Get petition count by department for an organization_
</details>

---

<details> <summary><strong>📁 Petitions <code>`/petitions`</code></strong></summary>

- **GET /**  
  _Get all petitions_

- **GET /:id**  
  _Get a petition by ID_

- **POST /**  
  _Create a petition_

- **PUT /:id**  
  _Update a petition_

- **DELETE /:id**  
  _Delete a petition_

- **POST /most-similar**  
  _Get most similar petition_

- **POST /:id/assign**  
  _Assign a petition to an organization user_

- **GET /:id/getSimilarPetitions**  
 _Get similar petitions_
</details>

---

<details> <summary><strong>📁 Queues <code>`/queues`</code></strong></summary>

- **POST /add**  
  _Add a message to the queue_

</details>

---

<details> <summary><strong>📁 Roles <code>`/roles`</code></strong></summary>

- **GET /**  
  _Get all roles_

- **GET /:id**  
  _Get a role by ID_

- **POST /**  
  _Create a role_

- **PUT /:id**  
  _Update a role_

- **DELETE /:id**  
  _Delete a role_

- **POST /is-role-exist**  
  _Check if a role exists_

</details>

---

<details> <summary><strong>📁 Status Updates <code>`/status-updates`</code></strong></summary>

- **POST /**  
  _Create a status update_

</details>

---

<details> <summary><strong>📁 Users <code>`/users`</code></strong></summary>

- **GET /**  
  _Get all users_

- **GET /:id**  
  _Get a user by ID_

- **POST /**  
  _Create a user_

- **PUT /:id**  
  _Update a user_

- **DELETE /:id**  
  _Delete a user_

- **GET /:id/organizations**  
  _Get organizations associated with a user_

- **GET /:id/petitions**  
  _Get petitions associated with a user_

- **GET /:id/petitions/admin**  
  _Get admin petitions for a user_

</details>

---

<details> <summary><strong>📁 Root <code>`/`</code></strong></summary>

- **GET /**  
  _Health Check_  
  Returns a message: "Petition Service API is working (3)"

</details>

## Quick Start

### 1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/kasi-sj/PetitAI.git
   cd PetitAI/petition-service
   ```
### 2. **Set up environment variables:**
  ```bash
  npm install
  ```

### 3. Set up environment variables
  ```bash
  cp .env.example .env
  # Then update the values in .env as needed
  ```


### 4. Generate Prisma client
  ```bash
  npx prisma generate
  ```

### 5. Run database migrations
  ```bash
  npx prisma migrate dev
  ```
### 6. Start the development server
  ```bash
  npm run dev
  ```