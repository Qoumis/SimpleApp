#  Simple Web Application

A full-stack web application for user registration and management.
This project was implemented as a technical assessment to demonstrate understanding of:


Java backend frameworks (**Spring Boot**, **JPA**)

**REST API** design

Frontend SPA patterns using **jQuery**

Relational database design (**MySQL**)

**Git** was used from the beginning of the project to maintain version control.

---

## Features

- Register new users with:
  - First Name, Last Name, Gender, Birthdate (required)
  - Home Address and Work Address (optional, stored in a separate table)
- View a list of registered users
- View user details in a new tab
- Delete users
- **(Extra Feature)** Edit user details
- Data stored in MySQL using JPA

---

## Tech Stack

### Backend
- [Spring Boot] (with embedded Tomcat)
- [Spring Data JPA]
- [MySQL]
- [Maven]

### Frontend
- [JavaScript] SPA
- [jQuery] (ajax calls to interact with the backend API)
- [Bootstrap] for styling
- [Vite] for serving the frontend server separately.

---

##  How to Run

### Prerequisites

- Java 17+
- Node.js 18+ and npm (to run vite dev server)
- MySQL

### Backend

<pre>$ cd frontend 
$ npm run dev </pre>

### Frontend

<pre>$ cd frontend
$ npm run dev</pre>
