Structure de donnée du call_log

-- zenicall.call_logs definition

CREATE TABLE `call_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clinic_id` int(11) NOT NULL,
  `external_call_id` varchar(255) NOT NULL,
  `caller_first_name` varchar(255) DEFAULT NULL,
  `caller_last_name` varchar(255) DEFAULT NULL,
  `caller_phone_number` varchar(30) NOT NULL,
  `is_existing_patient` tinyint(1) DEFAULT NULL,
  `call_started_at` datetime NOT NULL,
  `call_ended_at` datetime DEFAULT NULL,
  `call_duration_seconds` float DEFAULT NULL,
  `reason_for_call` enum('NEW_APPOINTMENT','CANCELLATION','RESCHEDULE','GENERAL_MESSAGE','EMERGENCY','OTHER') DEFAULT NULL,
  `callback_preference` enum('MORNING','AFTERNOON','EVENING','ANYTIME') DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `detailed_reason` text DEFAULT NULL,
  `preferred_dentist` varchar(255) DEFAULT NULL,
  `full_conversation_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`full_conversation_json`)),
  `raw_structured_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`raw_structured_data`)),
  `transcript_text` text DEFAULT NULL,
  `audio_recording_url` varchar(2048) DEFAULT NULL,
  `cost` decimal(10,5) DEFAULT NULL,
  `ended_reason` varchar(100) DEFAULT NULL,
  `status` enum('NEW','IN_PROGRESS','DONE','ARCHIVED') NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_call_logs_external_call_id` (`external_call_id`),
  KEY `ix_call_logs_caller_phone_number` (`caller_phone_number`),
  KEY `ix_call_logs_clinic_id` (`clinic_id`),
  KEY `ix_call_logs_id` (`id`),
  KEY `ix_call_logs_reason_for_call` (`reason_for_call`),
  KEY `ix_call_logs_status` (`status`),
  CONSTRAINT `call_logs_ibfk_1` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


1. Lister les journaux d’appels d’une clinique
Endpoint


GET /api/v1/call-logs/by-clinic/{clinic_id}
Requête

Path

clinic_id (integer, obligatoire)

Query params

search (string, optionnel) : recherche sur nom, prénom, téléphone ou résumé

status[] (array[string], optionnel) : filtre par statut (New, In Progress, Done, Archived)

page (integer, optionnel, défaut 1) : numéro de page

limit (integer, optionnel, défaut 20) : éléments par page

Header

Authorization: Bearer <access_token>

Réponse 200 OK
Schéma CallLogPage


{
  "items": [
    {
      "id": 101,
      "external_call_id": "vapi-call-xyz",
      "caller_first_name": "Jane",
      "caller_last_name": "Doe",
      "caller_phone_number": "+15551234567",
      "call_started_at": "2023-10-27T09:30:00Z",
      "reason_for_call": "New Appointment",
      "status": "New",
      "clinic": {
        "id": 1,
        "name": "Zenith Dental Center",
        "created_at": "2023-01-15T08:00:00Z",
        "updated_at": "2023-06-10T12:30:00Z"
      }
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "pages": 8
}
Codes d’état

200 OK

401 Unauthorized

404 Not Found (error_key: CLINIC_NOT_FOUND)

422 Unprocessable Entity

2. Récupérer un journal d’appel
Endpoint


GET /api/v1/call-logs/{call_log_id}
Requête

Path

call_log_id (integer, obligatoire)

Header

Authorization: Bearer <access_token>

Réponse 200 OK
Schéma CallLogDetailView

Contient tous les champs de la liste, plus :
call_ended_at, call_duration_seconds, callback_preference, summary,
detailed_reason, preferred_dentist, audio_recording_url, cost,
ended_reason, transcript_text, full_conversation_json,
raw_structured_data, created_at, updated_at.

Codes d’état

200 OK

401 Unauthorized

404 Not Found (error_key: CALL_LOG_NOT_FOUND)

3. Mettre à jour un journal d’appel
Endpoint


PATCH /api/v1/call-logs/{call_log_id}
Requête

Path

call_log_id (integer, obligatoire)

Header

Authorization: Bearer <access_token>

Body (schéma CallLogUpdate)


{
  "status": "In Progress",  
  "summary": "Patient called to confirm appointment. Also asked about parking."
}
Réponse 200 OK
Schéma CallLogDetailView (objet complet mis à jour)

Codes d’état

200 OK

401 Unauthorized

404 Not Found (error_key: CALL_LOG_NOT_FOUND)

422 Unprocessable Entity (statut invalide)