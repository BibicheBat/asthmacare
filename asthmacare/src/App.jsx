import { useState, useEffect } from 'react'
import { supabase } from './supabase'

/* ─── Icons ────────────────────────────────────────────────────── */
const Icon = ({ name, size = 20 }) => {
  const icons = {
    lung:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 4c0 0-2-1-4 1s-3 5-3 8 1 6 3 7 4 0 4-2V4z"/><path d="M12 4c0 0 2-1 4 1s3 5 3 8-1 6-3 7-4 0-4-2V4z"/><path d="M12 4v14"/></svg>,
    plus:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    logout:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    map:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    close:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    wind:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>,
    stats:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    trash:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  }
  return icons[name] || null
}

/* ─── Intensity ─────────────────────────────────────────────────── */
const INTENSITY = {
  1: { label: 'Légère',     bg: '#d1fae5', color: '#065f46', accent: '#10b981' },
  2: { label: 'Modérée',    bg: '#fef3c7', color: '#92400e', accent: '#f59e0b' },
  3: { label: 'Importante', bg: '#fed7aa', color: '#9a3412', accent: '#f97316' },
  4: { label: 'Sévère',     bg: '#fecaca', color: '#991b1b', accent: '#ef4444' },
  5: { label: 'Critique',   bg: '#f3e8ff', color: '#6b21a8', accent: '#8b5cf6' },
}

const IntensityBadge = ({ level }) => {
  const c = INTENSITY[level] || INTENSITY[1]
  return (
    <span style={{ background: c.bg, color: c.color, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
      {'●'.repeat(level)}{'○'.repeat(5 - level)} {c.label}
    </span>
  )
}

/* ─── Shared styles ─────────────────────────────────────────────── */
const S = {
  inp: { width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' },
  lbl: { fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8, display: 'block', fontFamily: "'DM Sans', sans-serif" },
  errBox: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', color: '#dc2626', fontSize: 13, fontFamily: "'DM Sans', sans-serif" },
  btn: { padding: '13px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
}

/* ─── Auth page ─────────────────────────────────────────────────── */
function AuthPage({ onLogin }) {
  const [mode, setMode]         = useState('login')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr]           = useState('')
  const [loading, setLoading]   = useState(false)

  const switchMode = (m) => { setMode(m); setErr(''); setName(''); setEmail(''); setPassword('') }

  const submit = async () => {
    setErr(''); setLoading(true)
    try {
      if (mode === 'register') {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setErr('Tous les champs sont requis.'); setLoading(false); return
        }
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { name: name.trim() } },
        })
        if (error) { setErr(error.message); setLoading(false); return }
        // Insert profile row
        await supabase.from('profiles').insert({ id: data.user.id, name: name.trim() })
        onLogin(data.user, name.trim())
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error) { setErr('Email ou mot de passe incorrect.'); setLoading(false); return }
        // Fetch profile name
        const { data: profile } = await supabase.from('profiles').select('name').eq('id', data.user.id).single()
        onLogin(data.user, profile?.name || data.user.email)
      }
    } catch (e) {
      setErr('Une erreur est survenue.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 50%, #fef9c3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 24, padding: '44px 36px', width: '100%', maxWidth: 400, boxShadow: '0 8px 40px rgba(0,100,200,0.12)' }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: 'white' }}>
            <Icon name="lung" size={28} />
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a', fontFamily: "'Fraunces', Georgia, serif", letterSpacing: '-0.03em' }}>AsthmaCare</h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Suivi de vos crises d'asthme</p>
        </div>

        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {[['login', 'Connexion'], ['register', 'Créer un compte']].map(([m, label]) => (
            <button key={m} onClick={() => switchMode(m)}
              style={{ flex: 1, padding: '8px 6px', border: 'none', borderRadius: 9, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, transition: 'all 0.2s', background: mode === m ? 'white' : 'transparent', color: mode === m ? '#0f172a' : '#64748b', boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'register' && (
            <input placeholder="Votre prénom" value={name} onChange={e => setName(e.target.value)} style={S.inp} />
          )}
          <input placeholder="Adresse email" type="email" value={email} onChange={e => setEmail(e.target.value)} style={S.inp} />
          <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} style={S.inp}
            onKeyDown={e => e.key === 'Enter' && submit()} />
          {err && <div style={S.errBox}>{err}</div>}
          <button onClick={submit} disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1, marginTop: 4 }}>
            {loading ? 'Chargement…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Add crisis modal ──────────────────────────────────────────── */
function AddModal({ userId, onClose, onSaved }) {
  const [description, setDescription] = useState('')
  const [lieu, setLieu]               = useState('')
  const [ventoline, setVentoline]     = useState(null)
  const [intensite, setIntensite]     = useState(3)
  const [date, setDate]               = useState(new Date().toISOString().slice(0, 16))
  const [err, setErr]                 = useState('')
  const [saving, setSaving]           = useState(false)

  const save = async () => {
    if (!description.trim()) { setErr('La description est requise.'); return }
    if (ventoline === null)  { setErr('Indiquez si vous avez pris de la Ventoline.'); return }
    setSaving(true)
    const { data, error } = await supabase.from('crises').insert({
      user_id:     userId,
      description: description.trim(),
      lieu:        lieu.trim() || null,
      ventoline,
      intensite,
      created_at:  new Date(date).toISOString(),
    }).select().single()
    setSaving(false)
    if (error) { setErr('Erreur lors de la sauvegarde.'); return }
    onSaved(data)
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 24, padding: '28px 28px 32px', width: '100%', maxWidth: 460, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.22)', fontFamily: "'DM Sans', sans-serif" }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a', fontFamily: "'Fraunces', Georgia, serif" }}>Nouvelle crise</h2>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, padding: '7px 8px', cursor: 'pointer', color: '#64748b', lineHeight: 0 }}><Icon name="close" size={16} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={S.lbl}>Date &amp; heure</label>
            <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} style={S.inp} />
          </div>

          <div>
            <label style={S.lbl}>Description *</label>
            <textarea placeholder="Symptômes, contexte, déclencheur…" value={description} onChange={e => setDescription(e.target.value)} rows={3}
              style={{ ...S.inp, resize: 'vertical' }} />
          </div>

          <div>
            <label style={S.lbl}>Lieu</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}><Icon name="map" size={15} /></span>
              <input placeholder="Domicile, bureau, extérieur…" value={lieu} onChange={e => setLieu(e.target.value)} style={{ ...S.inp, paddingLeft: 36 }} />
            </div>
          </div>

          <div>
            <label style={S.lbl}>Prise de Ventoline *</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { v: true,  txt: '✓  Oui', border: '#10b981', bg: '#d1fae5', col: '#065f46' },
                { v: false, txt: '✗  Non', border: '#ef4444', bg: '#fee2e2', col: '#991b1b' },
              ].map(o => (
                <button key={String(o.v)} onClick={() => setVentoline(o.v)}
                  style={{ flex: 1, padding: '11px 8px', borderRadius: 12, border: `2px solid ${ventoline === o.v ? o.border : '#e2e8f0'}`, background: ventoline === o.v ? o.bg : 'white', color: ventoline === o.v ? o.col : '#64748b', cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s' }}>
                  {o.txt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={S.lbl}>Intensité</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1,2,3,4,5].map(n => {
                const sel = intensite === n
                const c = INTENSITY[n]
                return (
                  <button key={n} onClick={() => setIntensite(n)}
                    style={{ flex: 1, padding: '9px 4px', borderRadius: 10, border: `2px solid ${sel ? c.accent : '#e2e8f0'}`, background: sel ? c.accent : 'white', color: sel ? 'white' : '#64748b', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s', textAlign: 'center', lineHeight: 1.3 }}>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>{n}</div>
                    <div style={{ fontSize: 9, fontWeight: 600, opacity: 0.85 }}>{c.label}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {err && <div style={S.errBox}>{err}</div>}

          <button onClick={save} disabled={saving}
            style={{ padding: '14px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: 'white', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: 2, opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Enregistrement…' : 'Enregistrer la crise'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Crisis card ───────────────────────────────────────────────── */
function CrisisCard({ crisis, onDelete }) {
  const time   = new Date(crisis.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const accent = INTENSITY[crisis.intensite]?.accent || '#3b82f6'

  return (
    <div style={{ background: 'white', borderRadius: 16, padding: '16px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', display: 'flex', gap: 14, alignItems: 'flex-start', borderLeft: `4px solid ${accent}` }}>
      <div style={{ width: 42, height: 42, borderRadius: 11, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: accent }}>
        <Icon name="wind" size={19} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#1e293b', fontWeight: 500, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{crisis.description}</p>
          <span style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>{time}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <IntensityBadge level={crisis.intensite} />
          {crisis.lieu && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#64748b', fontFamily: "'DM Sans', sans-serif" }}>
              <Icon name="map" size={11} /> {crisis.lieu}
            </span>
          )}
          <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 20, background: crisis.ventoline ? '#eff6ff' : '#fef2f2', color: crisis.ventoline ? '#1d4ed8' : '#dc2626', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            {crisis.ventoline ? '💨 Ventoline prise' : '⚠ Sans Ventoline'}
          </span>
        </div>
      </div>
      <button onClick={() => onDelete(crisis.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: 4, borderRadius: 8, flexShrink: 0, lineHeight: 0, transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}>
        <Icon name="trash" size={15} />
      </button>
    </div>
  )
}

/* ─── Stats bar ─────────────────────────────────────────────────── */
function StatsBar({ crises }) {
  const total = crises.length
  const withV = crises.filter(c => c.ventoline).length
  const avg   = total ? (crises.reduce((s, c) => s + c.intensite, 0) / total).toFixed(1) : '–'
  const week  = crises.filter(c => (Date.now() - new Date(c.created_at)) < 7 * 86400000).length

  const Stat = ({ icon, label, value, color }) => (
    <div style={{ background: 'white', borderRadius: 16, padding: '14px 16px', flex: 1, minWidth: 110, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        <Icon name={icon} size={17} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1, fontFamily: "'Fraunces', Georgia, serif" }}>{value}</p>
        <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94a3b8', fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
      <Stat icon="lung"     label="Total crises"    value={total} color="#3b82f6" />
      <Stat icon="calendar" label="Cette semaine"   value={week}  color="#8b5cf6" />
      <Stat icon="wind"     label="Ventoline prise" value={withV} color="#10b981" />
      <Stat icon="stats"    label="Intensité moy."  value={avg}   color="#f97316" />
    </div>
  )
}

/* ─── Main app ──────────────────────────────────────────────────── */
export default function App() {
  const [user, setUser]           = useState(null)
  const [userName, setUserName]   = useState('')
  const [crises, setCrises]       = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading]     = useState(true)

  // Restore session on mount
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('name').eq('id', session.user.id).single()
        setUser(session.user)
        setUserName(profile?.name || session.user.email)
        fetchCrises(session.user.id)
      } else {
        setLoading(false)
      }
    })
    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { setUser(null); setUserName(''); setCrises([]); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchCrises = async (uid) => {
    const { data } = await supabase
      .from('crises')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
    setCrises(data || [])
    setLoading(false)
  }

  const handleLogin = (u, name) => {
    setUser(u)
    setUserName(name)
    fetchCrises(u.id)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null); setUserName(''); setCrises([])
  }

  const handleSaved = (c) => setCrises(prev => [c, ...prev])

  const handleDelete = async (id) => {
    await supabase.from('crises').delete().eq('id', id)
    setCrises(prev => prev.filter(c => c.id !== id))
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: "'DM Sans', sans-serif", color: '#64748b', fontSize: 16 }}>
      Chargement…
    </div>
  )

  if (!user) return <AuthPage onLogin={handleLogin} />

  // Group crises by date
  const grouped = {}
  crises.forEach(c => {
    const key = new Date(c.created_at).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(c)
  })

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0f9ff 0%, #f8fafc 40%, #fefce8 100%)' }}>
      <style>{`* { box-sizing: border-box; }`}</style>

      <header style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '13px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Icon name="lung" size={18} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#0f172a', fontFamily: "'Fraunces', Georgia, serif", letterSpacing: '-0.03em', lineHeight: 1.1 }}>AsthmaCare</h1>
              <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontFamily: "'DM Sans', sans-serif" }}>Bonjour, {userName} 👋</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 15px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: 'white', border: 'none', borderRadius: 11, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>
              <Icon name="plus" size={13} /> Ajouter
            </button>
            <button onClick={handleLogout} title="Se déconnecter"
              style={{ display: 'flex', alignItems: 'center', padding: '8px 10px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 11, cursor: 'pointer', lineHeight: 0 }}>
              <Icon name="logout" size={15} />
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '28px 20px' }}>
        <StatsBar crises={crises} />

        {crises.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 20px', background: 'white', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🫁</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: '#0f172a', fontFamily: "'Fraunces', Georgia, serif" }}>Aucune crise enregistrée</h3>
            <p style={{ margin: '0 0 22px', color: '#64748b', fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Commencez à suivre vos crises d'asthme</p>
            <button onClick={() => setShowModal(true)}
              style={{ padding: '11px 24px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: 'white', border: 'none', borderRadius: 13, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              + Ajouter une crise
            </button>
          </div>
        ) : (
          Object.entries(grouped).map(([dateLabel, items]) => (
            <div key={dateLabel} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ color: '#94a3b8' }}><Icon name="calendar" size={13} /></span>
                <h2 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'capitalize', fontFamily: "'DM Sans', sans-serif" }}>{dateLabel}</h2>
                <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 20, padding: '1px 9px', fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                  {items.length} crise{items.length > 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(c => <CrisisCard key={c.id} crisis={c} onDelete={handleDelete} />)}
              </div>
            </div>
          ))
        )}
      </main>

      {showModal && <AddModal userId={user.id} onClose={() => setShowModal(false)} onSaved={handleSaved} />}
    </div>
  )
}
