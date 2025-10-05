The Workforce Management System (WMS) is a scalable backend application built using Node.js (Express.js), TypeScript, and MySQL (TypeORM ORM).
It manages company departments, employees, and leave requests — complete with role-based access control (RBAC) and RabbitMQ-based asynchronous processing for leave approval logic.

The system follows Clean Architecture and Domain-Driven Design (DDD) principles to ensure scalability, maintainability, and testability.

SYSTEM ARCHITECTURE
src/
│
├── config/                # Database and RabbitMQ configurations
├── controllers/           # Handles HTTP requests and responses
├── domains/               # Business validation logic
├── dtos/                  # Data Transfer Objects (DTOs)
├── mappers/               # Maps DTOs to Entity models
├── middlewares/           # Authentication and authorization logic
├── models/                # TypeORM entity models
├── repositories/          # Direct database operations
├── services/              # Business logic (application layer)
├── routes/                # Express routes
├── queues/                # RabbitMQ producers and consumers
├── utils/                 # Logger, response wrappers, helpers
└── index.ts               # Application entry point

Architectural Pattern:
Controller → Domain → Mapper → Service → Repository → Database

Each layer has a single responsibility, and dependencies always flow inward (higher layers depend on abstractions, not concrete implementations).

Technologies Used
Category -> Technology
Language -> TypeScript
Framework -> Express.js
ORM -> TypeORM
Database -> MySQL
Message_Broker	-> RabbitMQ
Logging	-> Winston (custom logger utility)
Security -> Helmet.js
Environment -> dotenv
Authentication -> JWT (or mock for testing)
Architecture -> Clean Architecture + DDD principles

Features Implemented
1. Core Functionality

- Department management (create, list with employees)
- Employee management (create, get by ID with leave history)
- Leave request creation with queue-based asynchronous processing
- Paginated results for large datasets

2. Message Queue (RabbitMQ)
- Leave requests are published asynchronously to a message queue
- Consumer/Worker processes requests:
    Auto-approves short leaves (≤ 2 days)
    Marks others as PENDING_APPROVAL
    Implements retry strategy (exponential backoff) for failed messages
    Uses idempotency tracking to avoid duplicate processing

3. System Health Checks
- /health — Verifies API and database connectivity
- /queue-health — Checks RabbitMQ queue status and message broker connectivity