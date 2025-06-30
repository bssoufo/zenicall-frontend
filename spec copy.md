Gestion des Cliniques

Base URL : /api/v1/clinics

POST /

Crée une nouvelle clinique

Body (JSON)


{
  "name": "Zenith Dental Center"
}
Réponse 201


{
  "id": 1,
  "name": "Zenith Dental Center",
  "created_at": "2023-10-27T10:00:00Z",
  "updated_at": "2023-10-27T10:00:00Z"
}
Erreurs

401 Unauthorized

403 Forbidden (permission MANAGE_CLINICS)

409 Conflict (CLINIC_NAME_EXISTS)

422 Unprocessable Entity (champ name manquant)

GET /

Liste toutes les cliniques

Auth : Bearer <token>

Réponse 200 : tableau d’objets ClinicRead

GET /{clinic_id}

Détails d’une clinique

Réponse 200 ou 404 (CLINIC_NOT_FOUND)