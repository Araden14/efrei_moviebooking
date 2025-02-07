Movie Booking

---

Introduction

Ce projet est un prototype qui met en œuvre une application NestJS servant de système de réservation de séances pour un cinéma. L’application gère notamment les utilisateurs, les réservations, ainsi que la récupération des films via l’API TMDB. Deux scripts de seeding alimentent à titre de démonstration les tables movie et reservation de la base de données.


---

Table des matières

Introduction

Structure du Projet

Exos

Backend (NestJS)

Frontend (React + Vite)


Service Externe

Versions Déployées



---

Structure du Projet

Le dépôt se compose de trois dossiers principaux :

Exos

Ce dossier contient une suite d’exercices comprenant :

Une fonction de filtrage d’articles.

Une fonction pour encoder et décoder des données.


Backend (NestJS)

La partie backend est réalisée avec NestJS et se compose de plusieurs modules :

user : Gestion des utilisateurs.

auth : Authentification via token JWT.

reservation : Permet aux utilisateurs de réserver une séance.

movies : Récupération des films en interfaçant l’API TMDB.


La connexion à une base de données PostgreSQL permet de gérer quatre entités/tables :

Utilisateurs : Table des utilisateurs.

Movies : Liste des films disponibles dans le cinéma.

Reservation : Détails des créneaux disponibles selon la date et le film.

Reservation User : Table de liaison many-to-many entre une réservation et un utilisateur.


Un Swagger est disponible via le endpoint /api pour la documentation de l’API.

Frontend (React + Vite)

La partie frontend est développée avec React et Vite et utilise la bibliothèque de composants heroui (anciennement NextUI).
Elle se compose de :

Page d’inscription : Liée au backend.

Page de login : Gère l’authentification en stockant le token JWT localement.

Page d’accueil : Affiche les films (accessible uniquement après authentification) et propose une recherche de films alimentée par l’API TMDB via le backend.

Section films disponibles : Permet la réservation d’une séance.



---

Service Externe

Le projet intègre l’API TMDB pour la récupération des films.


---

Versions Déployées

Backend : https://efrei-moviebooking.onrender.com/

Frontend : https://efreimoviebooking.netlify.app