# Nextlead Test Technique

Bienvenue sur le **Test Technique Nextlead**.

Ce Repository est une boilerplate pour votre test technique. Tous les outils nécessaires à la réalisation de votre test ont été préinstallés et préconfigurés par nos soins.
Merci de suivre attentivement les instructions ci-dessous afin de bien démarrer.
Je vous recommande également d'utiliser le package manager `pnpm` mais vous pouvez utiliser `yarn`ou `npm`
Neon est un service PostgreSQL gratuit pour les tests techniques et petits projets. Si votre projet grandit, des frais peuvent s’appliquer — mais pour ce test, aucun risque de dépassement.

Ce projet utilise les technologies suivantes :

- [Next.js 15.3.1](https://nextjs.org/)
- [Prisma 6.7.0](https://www.prisma.io/)
- [Neon Database](https://neon.tech/)
- [Zod](https://zod.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React 19](https://react.dev/)

## Prérequis

- Node.js >= 20.x
- [pnpm](https://pnpm.io/installation)

## Installation

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
   - Récupérez l’URL de connexion (format : `postgresql://...`).

4. **Configurer les variables d’environnement**

   - Copiez le fichier `.env.example` en `.env` :
     ```bash
     cp .env.example .env
     ```
   - Remplissez la variable `DATABASE_URL` avec l’URL de connexion Neon.

5. **Initialiser la base de données avec Prisma**

   ```bash
   pnpm prisma migrate dev
   ```

6. **Démarrer le projet**

   ```bash
   pnpm run dev
   ```

## Scripts Utiles

- `pnpm run dev` : Démarre le serveur de développement Next.js
- `pnpm prisma studio` : Ouvre Prisma Studio pour explorer la base de données mais vous pouvez consulter votre DB sur neon.tech directement

## Structure du projet

- `/prisma` : Schéma Prisma et migrations (Le model Example est à modifier)
- `/components` : Composants React (UI) (Global au projet)
- `/app` : Pages Next.js
- `/app/api` : Api Next.js
- `/lib` : Fonctions utilitaires (Global au projet)
- /test-technique/_* sont les différents dossier local aux composants de la page de votre rendu

## Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Neon](https://neon.tech/docs/introduction)
- [Documentation Zod](https://zod.dev/?id=table-of-contents)
- [Documentation shadcn/ui](https://ui.shadcn.com/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation React](https://react.dev/)

---

Si vous avez des questions, n'hésitez pas à contacter l'équipe Nextlead. Bonne chance pour le test technique !
