# ⚡ SmartHire — AI-Powered Job Recruitment Portal

## Tech Stack
- **Backend:** Java 17, Spring Boot 3.2, Hibernate ORM, Spring Security, JWT, REST API (MVC Pattern)
- **Frontend:** React 18 (Vite), React Router, Axios, CSS3
- **Database:** MySQL 8
- **AI Features:** Pure Java — Match Score Algorithm + Salary Predictor

---

## Project Structure
```
smarthire/
├── backend/          ← Spring Boot Maven Project (open in Eclipse)
└── frontend/         ← React Vite Project (run via terminal)
```

---

## ⚙️ STEP 1 — Setup MySQL Database

1. Open **MySQL Workbench** or any MySQL client
2. Run this command:
   ```sql
   CREATE DATABASE smarthire_db;
   ```
3. Open `backend/src/main/resources/application.properties`
4. Set your MySQL credentials:
   ```
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
   (Default is `root` / `root` — change if different)

---

## ⚙️ STEP 2 — Run Backend in Eclipse

1. Open **Eclipse IDE** (Spring Tools Suite preferred)
2. Go to **File → Import → Maven → Existing Maven Projects**
3. Browse to the `smarthire/backend` folder → Click **Finish**
4. Wait for Maven to download dependencies (2-3 mins first time)
5. Open `SmartHireApplication.java`
6. Right-click → **Run As → Spring Boot App**
7. Backend starts on `http://localhost:8080`

✅ You will see in console:
```
SmartHire Backend Started on port 8080
Demo data seeded successfully!
```

---

## ⚙️ STEP 3 — Run Frontend

Open a terminal/command prompt:
```bash
cd smarthire/frontend
npm install
npm run dev
```

Frontend starts on `http://localhost:5173`

---

## 🔑 Demo Login Credentials

| Role      | Email                      | Password    |
|-----------|----------------------------|-------------|
| Admin     | admin@smarthire.com        | admin123    |
| Recruiter | recruiter@smarthire.com    | recruit123  |
| Candidate | candidate@smarthire.com    | cand123     |

---

## 🤖 AI Features Explained

### Feature 1 — Candidate-Job Match Score
- When a candidate applies, `AIService.java` compares candidate skills with job required skills
- Uses Java `Set` intersection to calculate percentage overlap
- Example: Job needs [Java, Spring Boot, MySQL, React]. Candidate has [Java, Spring Boot, MySQL] → Score = 75%
- Score shown to recruiter in dashboard, candidates sorted by score

### Feature 2 — Salary Prediction
- Formula: `BaseSalary(3L) + ExperienceBonus(1L/yr) + SkillBonus(0.2L/skill) + MatchBonus`
- Returns a salary range like "7.5 LPA – 9.5 LPA"
- Shown on candidate's My Applications page

---

## 📡 API Endpoints Reference

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login, returns JWT token

### Jobs (Public)
- `GET /api/jobs/all` — All active jobs
- `GET /api/jobs/search?keyword=java` — Search jobs
- `GET /api/jobs/{id}` — Single job

### Recruiter (JWT Required)
- `POST /api/jobs/recruiter/post` — Post a job
- `GET /api/jobs/recruiter/my-jobs` — My jobs
- `PUT /api/jobs/recruiter/close/{id}` — Close job
- `GET /api/applications/recruiter/all` — All applications for my jobs
- `PUT /api/applications/recruiter/update/{id}?status=SHORTLISTED` — Update status

### Candidate (JWT Required)
- `POST /api/applications/apply` — Apply to job
- `GET /api/applications/my` — My applications with AI scores

### Admin (JWT Required)
- `GET /api/admin/stats` — Dashboard stats
- `GET /api/admin/users` — All users
- `DELETE /api/admin/users/{id}` — Delete user

---

## Resume Description (Copy This!)

> **SmartHire — AI-Powered Job Recruitment Portal**
> *Java 17 | Spring Boot 3 | Hibernate | MySQL | REST API | React | JWT | MVC Pattern*
>
> Developed a full-stack job portal with role-based access for Admin, Recruiter, and Candidate.
> Implemented AI-based candidate-job skill matching algorithm (Java Set intersection) generating 0–100%
> compatibility scores, and a salary prediction engine based on experience and skill parameters.
> Built secure REST APIs with Spring Security + JWT, consumed by a React frontend using Axios.
> Used Hibernate ORM with MySQL for data persistence and MVC pattern for clean code architecture.
