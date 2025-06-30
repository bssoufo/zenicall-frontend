
1. Contexte et objectifs
Présentation de l'application

ZeniCall est une application backend conçue pour la gestion des prospects téléphoniques pour des cliniques dentaires. Le système s'articule autour de trois modules principaux :

Gestion des Cliniques (/clinics) : Module de base pour créer et lister les cliniques dentaires clientes du service.

Gestion des Journaux d'Appels (/call-logs) : Cœur de l'application, ce module reçoit (via un webhook) et stocke des données riches provenant d'un service d'assistant vocal par IA (probablement Vapi.ai, d'après la dépendance x-vapi-secret). Il permet de consulter, filtrer et gérer le statut de chaque appel.

Authentification et Administration (/auth, /admin) : Fourni par une librairie externe (zenidata_auth), ce module gère l'authentification des utilisateurs (connexion, etc.) et les accès administratifs. L'interface frontend devra interagir avec ce module pour sécuriser l'accès aux données.

L'application est construite sur une architecture en couches classique (routes, services, repositories) et utilise une base de données relationnelle avec Alembic pour les migrations.

Objectifs principaux du frontend

Expérience Utilisateur (UX) :

Fournir une interface claire et intuitive pour le personnel des cliniques afin de visualiser et traiter rapidement les nouveaux appels.

Le flux principal doit être optimisé : tableau de bord listant les appels -> vue détaillée d'un appel -> action (ex: changer le statut).

Assurer une réactivité de l'interface, notamment sur les actions de filtrage, de recherche et de pagination.

Performance :

Gérer efficacement l'affichage de listes potentiellement longues de journaux d'appels via une pagination côté serveur.

Utiliser des techniques de chargement différé (lazy-loading) pour les données lourdes (ex: transcriptions complètes, JSON brut) afin d'accélérer l'affichage initial des pages.

Mettre en cache les données statiques ou peu volatiles (ex: liste des cliniques, informations utilisateur).

Sécurité :

Implémenter un flux d'authentification robuste basé sur les tokens JWT (Bearer Token) fournis par le backend.

Protéger toutes les routes frontend nécessitant une authentification.

Gérer la déconnexion et l'expiration des sessions utilisateur.

Prévenir les failles de type XSS en s'assurant que toutes les données affichées sont correctement échappées.

2. Inventaire des endpoints

Voici la liste des interfaces API que le frontend devra consommer.

Authentification (Module zenidata_auth - Déduit)

URL : /auth/login

Méthode HTTP : POST

Description fonctionnelle : Authentifie un utilisateur avec son email/nom d'utilisateur et son mot de passe, et retourne un token d'accès.

URL : /auth/me

Méthode HTTP : GET

Description fonctionnelle : Récupère les informations du profil de l'utilisateur actuellement authentifié. Essentiel pour afficher les informations de l'utilisateur et gérer les permissions.

Gestion des Cliniques (Module clinic_routes)

URL : /api/v1/clinics/

Méthode HTTP : POST

Description fonctionnelle : Crée une nouvelle clinique. (Probablement réservé aux administrateurs).

URL : /api/v1/clinics/

Méthode HTTP : GET

Description fonctionnelle : Récupère la liste de toutes les cliniques.

URL : /api/v1/clinics/{clinic_id}

Méthode HTTP : GET

Description fonctionnelle : Récupère les détails d'une clinique spécifique par son ID.

Gestion des Journaux d'Appels (Module call_log_routes)

URL : /api/v1/call-logs/webhook

Méthode HTTP : POST

Description fonctionnelle : À noter : Cet endpoint est destiné à être appelé par un service tiers (webhook) et non par le frontend. Il n'y a donc pas d'interface utilisateur à développer pour celui-ci.

URL : /api/v1/call-logs/by-clinic/{clinic_id}

Méthode HTTP : GET

Description fonctionnelle : Endpoint principal du tableau de bord. Récupère une liste paginée et filtrable des journaux d'appels pour une clinique donnée.

URL : /api/v1/call-logs/{call_log_id}

Méthode HTTP : GET

Description fonctionnelle : Récupère les détails complets d'un journal d'appel spécifique.

URL : /api/v1/call-logs/{call_log_id}

Méthode HTTP : PATCH

Description fonctionnelle : Met à jour les informations d'un journal d'appel, principalement pour changer son statut (ex: de "New" à "In Progress").

3. Contrats API
Authentification

Note de l'architecte : Les contrats suivants sont déduits de l'utilisation de la librairie zenidata_auth et des standards de l'industrie. Ils devront être confirmés avec l'implémentation exacte de la librairie.

Endpoint : POST /auth/login

Schéma de requête (Body - JSON)

Generated json
{
  "username": "user@example.com", // string, obligatoire
  "password": "securepassword123" // string, obligatoire
}


Schéma de réponse (JSON)

Generated json
{
  "access_token": "ey...", // string, JWT
  "token_type": "bearer" // string, toujours "bearer"
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

Codes d’état

200 OK : Succès.

401 Unauthorized : Identifiants incorrects.

422 Unprocessable Entity : Données de requête invalides (champs manquants).

Endpoint : GET /auth/me

Schéma de requête : (Header)

Authorization: Bearer <access_token> (string, obligatoire)

Schéma de réponse (JSON - Exemple déduit)

Generated json
{
  "id": 1,
  "username": "user@example.com",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "status": "active",
  "roles": ["clinic_staff"], // array[string], important pour la gestion des permissions
  "permissions": ["view_call_logs", "edit_call_log_status"] // array[string]
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

Codes d’état

200 OK : Succès.

401 Unauthorized : Token manquant, invalide ou expiré.

Gestion des Cliniques

Endpoint : POST /api/v1/clinics/

Schéma de requête (Body - JSON, Schema: ClinicCreate)

Generated json
{
  "name": "Zenith Dental Center" // string, obligatoire
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

Schéma de réponse (JSON, Schema: ClinicRead)

Generated json
{
  "id": 1,
  "name": "Zenith Dental Center",
  "created_at": "2023-10-27T10:00:00Z",
  "updated_at": "2023-10-27T10:00:00Z"
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

Codes d’état

201 Created : Succès.

401 Unauthorized : Non authentifié.

403 Forbidden : L'utilisateur n'a pas la permission MANAGE_CLINICS.

409 Conflict : Une clinique avec ce nom existe déjà (error_key: CLINIC_NAME_EXISTS).

422 Unprocessable Entity : Le champ name est manquant.

Endpoint : GET /api/v1/clinics/

Schéma de requête : (Header)

Authorization: Bearer <access_token>

Schéma de réponse (JSON, Schema: List[ClinicRead])

Generated json
[
  {
    "id": 1,
    "name": "Zenith Dental Center",
    "created_at": "2023-10-27T10:00:00Z",
    "updated_at": "2023-10-27T10:00:00Z"
  }
]
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

Codes d’état

200 OK : Succès.

401 Unauthorized : Non authentifié.

Gestion des Journaux d'Appels

Endpoint : GET /api/v1/call-logs/by-clinic/{clinic_id}

Schéma de requête

Path:

clinic_id: integer, obligatoire.

Query Params:

search: string, optionnel. Recherche sur le nom, prénom, téléphone ou résumé de l'appel.

status: array[string], optionnel. Filtre par un ou plusieurs statuts. Valeurs possibles : New, In Progress, Done, Archived. Exemple : ?status=New&status=In%20Progress.

page: integer, optionnel, défaut 1. Numéro de la page.

limit: integer, optionnel, défaut 20. Nombre d'éléments par page.

Header:

Authorization: Bearer <access_token>

Schéma de réponse (JSON, Schema: CallLogPage)

Generated json
{
  "items": [ // Schema: CallLogListView
    {
      "id": 101,
      "external_call_id": "vapi-call-xyz",
      "caller_first_name": "Jane",
      "caller_last_name": "Doe",
      "caller_phone_number": "+15551234567",
      "call_started_at": "2023-10-27T09:30:00Z",
      "reason_for_call": "New Appointment", // Enum
      "status": "New", // Enum
      "clinic": { // Schema: ClinicRead
        "id": 1,
        "name": "Zenith Dental Center",
        "created_at": "...",
        "updated_at": "..."
      }
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "pages": 8
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

Codes d’état

200 OK : Succès.

401 Unauthorized : Non authentifié.

404 Not Found : La clinique avec l'ID spécifié n'existe pas (error_key: CLINIC_NOT_FOUND).

422 Unprocessable Entity : Paramètres de pagination ou de filtre invalides.

Endpoint : GET /api/v1/call-logs/{call_log_id}

Schéma de requête

Path: call_log_id: integer, obligatoire.

Header: Authorization: Bearer <access_token>

Schéma de réponse (JSON, Schema: CallLogDetailView)

Contient tous les champs de CallLogListView plus les champs détaillés : call_ended_at, call_duration_seconds, callback_preference, summary, detailed_reason, preferred_dentist, audio_recording_url, cost, ended_reason, transcript_text, full_conversation_json, raw_structured_data, created_at, updated_at.

Codes d’état

200 OK : Succès.

401 Unauthorized : Non authentifié.

404 Not Found : Le journal d'appel n'existe pas (error_key: CALL_LOG_NOT_FOUND).

Endpoint : PATCH /api/v1/call-logs/{call_log_id}

Schéma de requête

Path: call_log_id: integer, obligatoire.

Body (JSON, Schema: CallLogUpdate):

Generated json
{
  "status": "In Progress", // string, optionnel. Enum: "New", "In Progress", "Done", "Archived"
  "summary": "Patient called to confirm appointment. Also asked about parking." // string, optionnel
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

Header: Authorization: Bearer <access_token>

Schéma de réponse (JSON, Schema: CallLogDetailView)

L'objet complet du journal d'appel mis à jour.

Codes d’état

200 OK : Succès.

401 Unauthorized : Non authentifié.

404 Not Found : Le journal d'appel n'existe pas (error_key: CALL_LOG_NOT_FOUND).

422 Unprocessable Entity : Le statut fourni n'est pas une valeur valide.

4. Règles de validation côté frontend

Pour améliorer l'UX et réduire la charge sur le backend, le frontend doit implémenter les validations suivantes avant de soumettre les données.

Formulaire de Connexion :

Le champ username (email) doit être non-vide et respecter un format d'email valide (ex: test@example.com).

Le champ password doit être non-vide.

Formulaire de Création de Clinique :

Le champ name doit être non-vide et avoir une longueur minimale (ex: 2 caractères).

Filtres du Tableau de Bord des Appels :

Les champs page et limit doivent être des entiers positifs.

Le champ status ne peut contenir que les valeurs autorisées par l'énumération CallLogStatus.

Gestion des Erreurs de Validation :

Afficher des messages d'erreur clairs et contextualisés à côté des champs invalides (ex: "Ce champ est obligatoire", "Veuillez entrer une adresse email valide").

Pour les erreurs API (4xx, 5xx), afficher une notification globale ("toast" ou "snackbar") avec un message compréhensible pour l'utilisateur, en se basant sur error_key et details si disponibles dans la réponse.

5. Composants et interactions UI
Recommandations de composants

Composants de base : Button, Input, Select, Checkbox, Modal, Spinner/Loader.

Composants complexes :

DataTable : Pour afficher la liste des journaux d'appels. Doit supporter le tri, la pagination et la sélection de lignes.

PaginationControls : Composant dédié à la navigation entre les pages de la DataTable.

SearchInput : Champ de recherche avec une icône et potentiellement un mécanisme de "debounce".

MultiSelectDropdown : Pour le filtre par statut.

NotificationManager (Toast/Snackbar) : Pour afficher les messages de succès et d'erreur de manière non-bloquante.

AudioPlayer : Pour lire les enregistrements (audio_recording_url).

JsonViewer : Pour afficher de manière lisible les champs full_conversation_json et raw_structured_data.

Flux utilisateur pour chaque fonctionnalité clé

Flux d'Authentification :

L'utilisateur arrive sur /login.

Il remplit le formulaire et soumet. Appel à POST /auth/login.

En cas de succès : le JWT est stocké de manière sécurisée et l'utilisateur est redirigé vers le tableau de bord principal (/dashboard/{clinic_id}).

En cas d'échec : un message d'erreur s'affiche sur la page de connexion.

Flux de Consultation des Appels (Tableau de Bord) :

L'utilisateur arrive sur le tableau de bord. La clinic_id est probablement extraite de l'URL ou des données de l'utilisateur (/auth/me).

Appel initial à GET /api/v1/call-logs/by-clinic/{clinic_id} pour charger la première page.

Les données sont affichées dans la DataTable.

L'utilisateur peut :

Taper dans le SearchInput -> après un "debounce", un nouvel appel API est fait avec le paramètre search.

Changer les filtres de status -> nouvel appel API avec le paramètre status.

Changer de page via PaginationControls -> nouvel appel API avec le paramètre page.

L'utilisateur clique sur une ligne du tableau -> navigation vers la page de détail de l'appel (ex: /call-logs/{call_log_id}).

Flux de Gestion d'un Appel (Vue Détail) :

La page charge les données via GET /api/v1/call-logs/{call_log_id}.

Toutes les informations détaillées sont affichées dans des sections claires (Infos Appelant, Analyse IA, Artefacts, etc.).

Un Select permet de modifier le status de l'appel.

En changeant la valeur, un bouton "Enregistrer" s'active.

Au clic sur "Enregistrer", un appel PATCH /api/v1/call-logs/{call_log_id} est envoyé avec le nouveau statut.

Une notification de succès ou d'erreur est affichée.

6. Sécurité et performance
Points de vigilance

Authentification :

Le token JWT doit être envoyé dans le header Authorization: Bearer <token> pour chaque requête API protégée.

Le frontend doit mettre en place un intercepteur (ex: avec Axios ou Fetch) pour ajouter ce header automatiquement.

Gérer la réponse 401 Unauthorized globalement : si une requête échoue avec ce code, l'utilisateur doit être déconnecté et redirigé vers la page de connexion.

Stocker le token JWT de manière sécurisée (par exemple, dans un cookie httpOnly si une partie serveur est utilisée pour le rendu, ou dans le localStorage pour une SPA, en étant conscient des risques XSS).

Autorisation :

Le frontend doit conditionner l'affichage de certains éléments de l'UI (ex: lien vers la page de gestion des cliniques) en fonction des rôles/permissions de l'utilisateur récupérés via GET /auth/me.

XSS :

Utiliser un framework frontend (React, Vue, Angular) qui échappe par défaut les données injectées dans le DOM.

Faire preuve de prudence si vous devez utiliser des fonctions comme dangerouslySetInnerHTML.

Conseils d’optimisation

Pagination : Obligatoire pour la liste des appels. Ne jamais tenter de charger tous les journaux d'appels en une seule fois.

Lazy-loading / Code Splitting : Utiliser le découpage de code par route (React.lazy, import()) pour que l'utilisateur ne charge que le code de la page qu'il visite.

Caching :

Utiliser une librairie de data-fetching comme React Query ou SWR.

Elle gérera automatiquement le cache, la revalidation des données en arrière-plan et la synchronisation de l'état du serveur, réduisant drastiquement les appels API redondants.

Les données quasi-statiques comme les détails de l'utilisateur (/auth/me) ou la liste des cliniques (/clinics) sont d'excellents candidats pour une mise en cache agressive.

Debouncing : Appliquer un délai (debounce) de 250-300ms sur le champ de recherche pour éviter de surcharger l'API pendant la saisie.


Bonnes pratiques

Nommage : PascalCase pour les composants et les pages. camelCase pour les fonctions, variables et hooks.

Découpage : Isoler la logique API dans le dossier api/. Isoler la logique métier complexe dans des hooks/. Garder les composants pages/ aussi légers que possible, en les faisant orchestrer les hooks et les composants de présentation.

Types : Si possible, utiliser TypeScript pour typer les contrats API et les props des composants, ce qui garantira la cohérence avec le backend et réduira les bugs.