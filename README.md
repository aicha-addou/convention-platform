# 🪪 Plateforme de Gestion des Conventions VIGIK

## 📘 Contexte du projet

La **plateforme VIGIK** vise à digitaliser et centraliser le processus de **gestion des conventions** entre les **prestataires**, les **référents**, et les **administrateurs** d’une organisation.  
Elle permet à chaque acteur de gérer ses droits et ses informations de manière sécurisée et efficace, dans un environnement entièrement web.

Ce projet est développé dans un cadre académique et personnel, avant une éventuelle intégration dans le schéma directeur informatique d'une entreprise.

---

## 🧭 Objectifs principaux

- Simplifier la gestion des conventions et des acteurs impliqués  
- Offrir une interface moderne, fluide et responsive  
- Séparer clairement le **frontend** (React) et le **backend** (Express)  
- Garantir la **sécurité** (authentification JWT, rôles, CORS, etc.)  


---

## 🏗️ Architecture technique

Le projet suit une architecture **MERN** (MongoDB – Express – React – Node.js) moderne et modulaire.

Frontend (React - Vercel)
│
▼
Backend (Express / Node.js - Render)
│
▼
Base de données (MongoDB Atlas)


### ⚙️ Détails :
| Composant | Technologie | Description |
|------------|--------------|-------------|
| **Frontend** | React.js | Interface utilisateur, pages de connexion, inscription, dashboard |
| **Backend** | Node.js + Express | API REST, logique métier, sécurité et middleware |
| **Base de données** | MongoDB Atlas | Stockage des utilisateurs et données des conventions |
| **Authentification** | JWT (JSON Web Token) | Gestion des sessions et rôles utilisateurs |
| **Déploiement** | Vercel (frontend), Render (backend) | Hébergement cloud gratuit et CI/CD |
| **Qualité de code** | ESLint, Prettier | Linting et formatage du code |
| **Gestion des variables** | dotenv | Protection des clés et secrets d’environnement |

---

## 🔐 Rôles utilisateurs

| Rôle | Description | Droits principaux |
|------|--------------|-------------------|
| **Admin** | Supervise la plateforme | Gère tous les utilisateurs, les conventions, et les rôles |
| **Référent** | Responsable local ou de service | Valide et suit les conventions |
| **Prestataire** | Utilisateur externe ou partenaire | Crée et gère ses propres conventions |

---



## 🧰 Installation locale

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/aicha-addou/convention-platform.git
cd convention-platform
