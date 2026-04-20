# AsthmaCare 🫁

Application de suivi des crises d'asthme — React + Supabase + Vercel.

---

## 🚀 Déploiement en 4 étapes

### Étape 1 — Créer la base de données Supabase (5 min)

1. Allez sur [supabase.com](https://supabase.com) et créez un compte gratuit
2. Cliquez **"New project"**, donnez un nom (ex: `asthmacare`), choisissez un mot de passe
3. Une fois le projet créé, allez dans **SQL Editor** (menu de gauche)
4. Copiez-collez tout le contenu du fichier `supabase-schema.sql` et cliquez **Run**
5. Allez dans **Settings → API** et notez :
   - **Project URL** (ex: `https://abcdef.supabase.co`)
   - **anon public key** (longue chaîne de caractères)

---

### Étape 2 — Configurer les variables d'environnement

1. Copiez le fichier `.env.example` en `.env` :
   ```bash
   cp .env.example .env
   ```
2. Ouvrez `.env` et remplissez vos valeurs :
   ```
   VITE_SUPABASE_URL=https://VOTRE_PROJECT_ID.supabase.co
   VITE_SUPABASE_ANON_KEY=VOTRE_ANON_KEY
   ```

---

### Étape 3 — Tester en local (optionnel)

```bash
npm install
npm run dev
```
Ouvrez [http://localhost:5173](http://localhost:5173)

---

### Étape 4 — Déployer sur Vercel (2 min)

1. Créez un repo GitHub et poussez ce dossier :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/VOTRE_NOM/asthmacare.git
   git push -u origin main
   ```
2. Allez sur [vercel.com](https://vercel.com), connectez-vous avec GitHub
3. Cliquez **"Add New Project"**, sélectionnez votre repo
4. Dans **"Environment Variables"**, ajoutez :
   - `VITE_SUPABASE_URL` → votre URL Supabase
   - `VITE_SUPABASE_ANON_KEY` → votre clé anon
5. Cliquez **Deploy** — votre site est en ligne ! 🎉

---

## 🔧 Structure du projet

```
asthmacare/
├── src/
│   ├── main.jsx          # Point d'entrée React
│   ├── App.jsx           # Application complète
│   └── supabase.js       # Client Supabase
├── index.html
├── vite.config.js
├── package.json
├── supabase-schema.sql   # SQL à exécuter dans Supabase
├── .env.example          # Template des variables d'environnement
└── .gitignore
```

## ✨ Fonctionnalités

- **Authentification** : inscription / connexion sécurisée via Supabase Auth
- **Crises** : ajout avec description, lieu, Ventoline, intensité (1-5), date/heure
- **Accueil** : crises regroupées par jour, ordre chronologique décroissant
- **Statistiques** : total, crises cette semaine, prises de Ventoline, intensité moyenne
- **Suppression** : suppression individuelle d'une crise
- **Données persistantes** : PostgreSQL via Supabase, isolées par utilisateur
