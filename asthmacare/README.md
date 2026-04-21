# AsthmaCare 🫁 v2 — Site Web

## 🚀 Déploiement

### 1. Supabase
- Créez un projet sur supabase.com
- SQL Editor → collez `supabase-schema.sql` → Run
- Settings → API → notez URL et anon key

### 2. Variables d'environnement
```bash
cp .env.example .env
# Remplissez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
```

### 3. En local
```bash
npm install
npm run dev
```

### 4. Déployer sur Vercel
1. Poussez sur GitHub
2. Importez sur vercel.com
3. Ajoutez les 2 variables d'environnement
4. Deploy 🎉

## ⭐ Premier compte Admin
Dans Supabase SQL Editor :
```sql
UPDATE public.profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'votre@email.com');
```
