# 📘 Healthcare API Documentation

## Authentication

### `POST /register/`
Register a new user.

#### Request Body:
```json
{
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "patient",  // or "doctor"
  "password": "yourpassword"
}
```

#### Response:
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "patient"
}
```

---

### `GET /profile/`
Retrieve the authenticated user's profile.

#### Headers:
- `Authorization: Bearer <token>`

#### Response:
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "doctor"
}
```

---

## Availability

### `GET /availability/`
List all availability entries (authenticated doctor).

### `POST /availability/`
Create new availability slot (doctors only).

#### Request Body:
```json
{
  "date": "2025-05-10",
  "start_time": "09:00",
  "end_time": "12:00"
}
```

---

## Appointments

### `GET /appointments/`
Get all appointments related to the logged-in user.

### `POST /appointments/`
Create a new appointment (patients only).

#### Request Body:
```json
{
  "doctor": 2,
  "scheduled_time": "2025-05-12T10:00:00Z",
  "reason": "Regular check-up",
  "visit_type": "in-person"
}
```

### `PATCH /appointments/{id}/`
Update an appointment (only if status is `pending`).

---

## Medical Records

### `GET /medical-records/`
Retrieve medical records:
- Patients see their own records.
- Doctors see records they authored.

### `POST /medical-records/`
Create a medical record (doctors only).

#### Request Body:
```json
{
  "patient": 3,
  "diagnosis": "Malaria",
  "symptoms": ["Fever", "Headache"],
  "notes": "Patient needs to hydrate."
}
```

---

## Prescriptions

### `GET /prescriptions/`
List all prescriptions (doctor or patient).

### `POST /prescriptions/`
Create a prescription (linked to a medical record).

#### Request Body:
```json
{
  "medical_record": 5,
  "medication_name": "Panadol",
  "dosage": "500mg twice daily"
}
```

---

## Doctor Search

### `GET /doctors/?search=john&specialty=cardiology`
Search for doctors by name or specialty.

#### Response:
```json
[
  {
    "id": 1,
    "user": {
      "full_name": "Dr. John Doe",
      "email": "john@example.com"
    },
    "specialty": "Cardiology",
    "bio": "Experienced cardiologist."
  }
]
```

---

## Notes
- Authentication is required for all endpoints except registration.
- Role-based access is enforced (e.g., only doctors can create availability).
- Appointments and medical records are filtered based on the logged-in user.

# SET UP

## Clone

```bash
git clone https://github.com/quiesscent/q-telemed-kenya.git
```

## Frontend

```bash
cd frontend
npm i
npm run dev
```

## Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
```

## Author
[Ephesians Lewis](https://the-quiesscent-hub.vercel.app)