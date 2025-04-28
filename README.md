# Nextlead Test Technique

Bienvenue sur le **Test Technique Nextlead**.

Ce projet utilise les technologies suivantes :

- [Next.js 14](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Neon Database](https://neon.tech/)
- [Zod](https://zod.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

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

- `/prisma` : Schéma Prisma et migrations (Le model todo est à modifier)
- `/components` : Composants React (UI) (Global au projet)
- `/app` : Pages Next.js
- `/app/api` : Api Next.js
- `/lib` : Fonctions utilitaires (Global au projet)

## Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Neon](https://neon.tech/docs/introduction)
- [Documentation Zod](https://zod.dev/?id=table-of-contents)
- [Documentation shadcn/ui](https://ui.shadcn.com/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)

---

Si vous avez des questions, n'hésitez pas à contacter l'équipe Nextlead. Bonne chance pour le test technique !
