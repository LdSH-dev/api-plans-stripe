# Subscription API - NestJS + PostgreSQL + Stripe

## 🚀 About the Project

This project is an API developed with **NestJS**, using **PostgreSQL**
as the database and **Stripe** for payment and subscription management.
The API supports JWT authentication, plan creation, subscriptions, and
automatic invoices.

## 🛠 Technologies

-   **NestJS** (Node.js Framework)
-   **Prisma** (ORM for PostgreSQL)
-   **PostgreSQL** (Database)
-   **Stripe** (Payments and subscriptions)
-   **Docker and Docker Compose**

## 📂 Folder Structure

    📦 api-plans-stripe
     ┣ 📂 prisma      # Prisma ORM configuration
     ┣ 📂 src
     ┃ ┣ 📂 auth        # Authentication module (JWT)
     ┃ ┣ 📂 payments    # Payments module with Stripe
     ┃ ┣ 📂 plans       # Plans module
     ┃ ┣ 📂 subscriptions # Subscriptions module
     ┃ ┣ 📂 invoices    # Invoices module
     ┃ ┣ 📂 email       # Email sending service
     ┃ ┗ 📜 main.ts     # Application entry point
     ┣ 📜 Dockerfile    # Docker configuration
     ┣ 📜 docker-compose.yml # Docker Compose configuration
     ┣ 📜 .env.example  # Example of environment variables
     ┣ 📜 postman_collection.json  # Postman JSON file for easier testing
     ┗ 📜 README.md     # Project documentation

## 📦 Setup and Run with Docker

### 1️⃣ Clone the repository

``` sh
git clone https://github.com/LdSH-dev/api-plans-stripe.git
cd api-plans-stripe
```

### 2️⃣ Create the `.env` file

``` sh
cp .env.example .env
```

### 3️⃣ Build and start the containers

``` sh
docker-compose up --build
```

This will: - Start the NestJS API - Start PostgreSQL - Configure Stripe
CLI to listen for webhooks

### 4️⃣ Access the API

-   **NestJS API:** `http://localhost:3000`
-   **Database:** `localhost:5432`

## 🔄 Running Prisma Migrations

If you need to run migrations manually:

``` sh
docker-compose exec api npx prisma migrate dev
```

## 🔗 Main Endpoints

### 🔑 Authentication

-   `POST /auth/register` - Create user
-   `POST /auth/login` - Login and get JWT

### 📦 Plans

-   `POST /plans` - Create plan
-   `GET /plans` - List plans
-   `GET /plans/:id` - Get plan by ID

### 📄 Subscriptions

-   `POST /subscriptions` - Create subscription
-   `GET /subscriptions/:id` - Get subscription
-   `DELETE /subscriptions/:id` - Cancel subscription

### 💰 Payments

-   `POST /payments` - Create payment intent
-   `GET /payments/:id` - Get payment status
-   `POST /webhooks/stripe` - Stripe webhook

### 📜 Invoices

-   `GET /invoices/:id` - Get specific invoice
-   `GET /invoices/user/:userId` - List user invoices

## 📧 Email Sending

The system sends invoices via **Nodemailer**, but I've already set the
SMTP credentials in `.env` to enable this feature.

## 🛑 Stop and Remove Containers

``` sh
docker-compose down
```

------------------------------------------------------------------------

Project developed for a technical challenge with full subscription and
payment integration using **NestJS, Prisma, Stripe, and Docker**. The
project contains a **Postman JSON file** to simplify API testing.
