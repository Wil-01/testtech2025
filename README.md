# 🚀 Nextlead – Test Technique

Bienvenue sur le **Test Technique Nextlead**.

Ce repository est une **boilerplate** conçue pour vous faire gagner du temps.  
Tous les outils nécessaires à sa réalisation ont été **préinstallés et préconfigurés** par nos soins.

Merci de lire attentivement les instructions ci-dessous pour bien démarrer.

---

## 🧰 Gestionnaire de paquets

Nous vous recommandons d’utiliser **[`pnpm`](https://pnpm.io/)** pour ce projet.  
Cependant, `yarn` ou `npm` restent compatibles.

---

## 💡 Base de données

Ce projet utilise [**Neon**](https://neon.tech), un service PostgreSQL.  
Il est **gratuit pour les tests techniques et petits projets**.  
Si votre projet évolue fortement, des frais peuvent s’appliquer —  
**mais dans le cadre de ce test, aucun risque de dépassement.**

---

## 🛠️ Stack technique

Ce projet repose sur les technologies suivantes :

- [Next.js 15.3.1](https://nextjs.org/)
- [Prisma 6.7.0](https://www.prisma.io/)
- [Neon Database](https://neon.tech/)
- [Zod](https://zod.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React 19](https://react.dev/)

---

## ✅ Prérequis

- [Node.js](https://nodejs.org/) **>= 20.x**
- [pnpm](https://pnpm.io/installation)

---

## 📦 Installation

1. **Cloner le dépôt**
   ```bash
   git clone <url-du-repo>
   cd <nom-du-dossier>
   ```

2. **Installer les dépendances**
   ```bash
   pnpm install
   ```

3. **Configurer la base de données Neon**
   - Créez un compte sur [Neon](https://neon.tech/) et créez un nouveau projet PostgreSQL.
   - Récupérez l’URL de connexion (format : `postgresql://...`)

4. **Configurer les variables d’environnement**
   ```bash
   cp .env.example .env
   ```
   - Remplissez la variable `DATABASE_URL` avec l’URL de connexion Neon.

5. **Initialiser la base de données avec Prisma**
   ```bash
   pnpm prisma migrate dev
   ```

6. **Démarrer le serveur**
   ```bash
   pnpm dev
   ```

---

## 🧪 Scripts utiles

- `pnpm dev` : Lance le serveur de développement
- `pnpm prisma studio` : Ouvre Prisma Studio (ou consultez la base via Neon directement)

---

## 🗂️ Structure du projet

- `/prisma` : Schéma Prisma et fichiers de migration (`Example` est à modifier)
- `/components` : Composants UI globaux
- `/app` : Pages Next.js
- `/app/api` : API routes Next.js
- `/lib` : Fonctions utilitaires
- `/test-technique/_*` : Dossiers locaux aux composants liés à votre rendu

---

## 📚 Ressources utiles

- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [Neon](https://neon.tech/docs/introduction)
- [Zod](https://zod.dev/)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React](https://react.dev/)

---

## 🙋 Besoin d'aide ?

Si vous avez des questions, n’hésitez pas à contacter l’équipe **Nextlead**.
Bonne chance pour votre test ! 💪
