# ⚡ SmartHire — AI-Powered Job Recruitment Portal

## Tech Stack
- **Backend:** Java 17, Spring Boot 3.2, Hibernate ORM, Spring Security, JWT, REST API (MVC Pattern)
- **Frontend:** React 18 (Vite), React Router, Axios, CSS3
- **Database:** MySQL 8
- **AI Features:** Pure Java — Match Score Algorithm + Salary Predictor



## Project Structure

smarthire/
├── backend/          ← Spring Boot Maven Project (open in Eclipse)
└── frontend/         ← React Vite Project (run via terminal)




 🔑 Demo Login Credentials

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
<img width="1888" height="906" alt="Screenshot 2026-08-05 113520" src="https://github.com/user-attachments/assets/ec75ce89-e13b-4ff3-9a10-0d643d4b7da2" />
<img width="1907" height="910" alt="Screenshot 2026-08-05 113536" src="https://github.com/user-attachments/assets/9ee1e376-b1df-483d-8e0e-740413fa5d8a" />
<img width="1890" height="896" alt="Screenshot 2026-08-05 113553" src="https://github.com/user-attachments/assets/840e6867-cacc-4fe8-b352-7b169a51eebe" />
<img width="1888" height="892" alt="Screenshot 2026-08-05 113613" src="https://github.com/user-attachments/assets/9b82e1b9-f64a-43b5-b8a5-d79f207a6d1c" />
<img width="1883" height="900" alt="Screenshot 2026-08-05 113655" src="https://github.com/user-attachments/assets/325ba1b3-f6b1-4479-9e11-905dbb58b063" />
<img width="1876" height="897" alt="Screenshot 2026-08-05 113715" src="https://github.com/user-attachments/assets/e7d5d751-e155-4bbf-b8d1-fe7f190a2579" />
<img width="1877" height="897" alt="Screenshot 2026-08-05 113752" src="https://github.com/user-attachments/assets/7a21776c-1a11-4099-9205-7d4d71f0c768" />



