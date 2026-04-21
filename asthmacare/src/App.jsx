import { useState, useEffect } from 'react'
import { supabase } from './supabase'

/* ═══════════════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════════════ */
const Icon = ({ name, size = 20 }) => {
  const d = {
    lung:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 4c0 0-2-1-4 1s-3 5-3 8 1 6 3 7 4 0 4-2V4z"/><path d="M12 4c0 0 2-1 4 1s3 5 3 8-1 6-3 7-4 0-4-2V4z"/><path d="M12 4v14"/></svg>,
    plus:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    logout:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    map:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    close:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    wind:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>,
    stats:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    trash:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    user:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    print:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
    eye:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    shield:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    lock:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    edit:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    users:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    back:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,18 9,12 15,6"/></svg>,
    chev:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6,9 12,15 18,9"/></svg>,
  }
  return d[name] || null
}

/* ═══════════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════════ */
const INTENSITY = {
  1: { label: 'Légère',     bg: '#d1fae5', color: '#065f46', accent: '#10b981' },
  2: { label: 'Modérée',    bg: '#fef3c7', color: '#92400e', accent: '#f59e0b' },
  3: { label: 'Importante', bg: '#fed7aa', color: '#9a3412', accent: '#f97316' },
  4: { label: 'Sévère',     bg: '#fecaca', color: '#991b1b', accent: '#ef4444' },
  5: { label: 'Critique',   bg: '#f3e8ff', color: '#6b21a8', accent: '#8b5cf6' },
}
const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

/* ═══════════════════════════════════════════════════════════════════
   SHARED STYLES
═══════════════════════════════════════════════════════════════════ */
const inp = { width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }
const lbl = { fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8, display: 'block' }
const errBox = { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', color: '#dc2626', fontSize: 13 }
const okBox  = { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', color: '#16a34a', fontSize: 13 }
const primBtn = { padding: '12px 20px', background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }
const ghostBtn = { padding: '9px 16px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 11, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }

/* ═══════════════════════════════════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════════════════════════════════ */
const IntensityBadge = ({ level }) => {
  const c = INTENSITY[level] || INTENSITY[1]
  return <span style={{ background: c.bg, color: c.color, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{'●'.repeat(level)}{'○'.repeat(5-level)} {c.label}</span>
}

const Logo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient></defs>
    <rect width="64" height="64" rx="16" fill="url(#lg)"/>
    <path d="M32 14c0 0-5-2-9 2s-7 10-7 17 3 12 7 14 9 0 9-4V14z" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M32 14c0 0 5-2 9 2s7 10 7 17-3 12-7 14-9 0-9-4V14z" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="32" y1="14" x2="32" y2="43" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
)

const Modal = ({ onClose, title, children, maxWidth = 480 }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
    <div style={{ background: 'white', borderRadius: 24, padding: '28px 28px 32px', width: '100%', maxWidth, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a', fontFamily: "'Fraunces',Georgia,serif" }}>{title}</h2>
        <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, padding: '7px 8px', cursor: 'pointer', color: '#64748b', lineHeight: 0 }}><Icon name="close" size={16}/></button>
      </div>
      {children}
    </div>
  </div>
)

/* ═══════════════════════════════════════════════════════════════════
   AUTH PAGE
═══════════════════════════════════════════════════════════════════ */
function AuthPage({ onLogin }) {
  const [mode, setMode]         = useState('login')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr]           = useState('')
  const [loading, setLoading]   = useState(false)

  const switchMode = m => { setMode(m); setErr(''); setName(''); setEmail(''); setPassword('') }

  const submit = async () => {
    setErr(''); setLoading(true)
    try {
      if (mode === 'register') {
        if (!name.trim() || !email.trim() || !password.trim()) { setErr('Tous les champs sont requis.'); setLoading(false); return }
        if (password.length < 6) { setErr('Minimum 6 caractères pour le mot de passe.'); setLoading(false); return }
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { name: name.trim() } } })
        if (error) { setErr(error.message); setLoading(false); return }
        await supabase.from('profiles').insert({ id: data.user.id, name: name.trim(), role: 'user' })
        onLogin(data.user, name.trim(), 'user')
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error) { setErr('Email ou mot de passe incorrect.'); setLoading(false); return }
        const { data: profile } = await supabase.from('profiles').select('name,role').eq('id', data.user.id).single()
        onLogin(data.user, profile?.name || data.user.email, profile?.role || 'user')
      }
    } catch { setErr('Une erreur est survenue.') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#e0f2fe 0%,#f0fdf4 50%,#fef9c3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 24, padding: '44px 36px', width: '100%', maxWidth: 400, boxShadow: '0 8px 40px rgba(0,100,200,0.12)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ margin: '0 auto 14px', width: 'fit-content' }}><Logo size={56}/></div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a', fontFamily: "'Fraunces',Georgia,serif", letterSpacing: '-0.03em' }}>AsthmaCare</h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>Suivi de vos crises d'asthme</p>
        </div>
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {[['login','Connexion'],['register','Créer un compte']].map(([m,l]) => (
            <button key={m} onClick={() => switchMode(m)} style={{ flex: 1, padding: '8px 6px', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', background: mode===m ? 'white' : 'transparent', color: mode===m ? '#0f172a' : '#64748b', boxShadow: mode===m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'register' && <input placeholder="Votre prénom" value={name} onChange={e => setName(e.target.value)} style={{ ...inp, padding: '12px 16px' }}/>}
          <input placeholder="Adresse email" type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ ...inp, padding: '12px 16px' }}/>
          <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ ...inp, padding: '12px 16px' }} onKeyDown={e => e.key==='Enter' && submit()}/>
          {err && <div style={errBox}>{err}</div>}
          <button onClick={submit} disabled={loading} style={{ ...primBtn, padding: '13px', fontSize: 15, opacity: loading ? 0.7 : 1, marginTop: 4 }}>
            {loading ? 'Chargement…' : mode==='login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   CRISIS MODAL (add / edit)
═══════════════════════════════════════════════════════════════════ */
function CrisisModal({ userId, existing, onClose, onSaved }) {
  const isEdit = !!existing
  const [description, setDescription] = useState(existing?.description || '')
  const [lieu,        setLieu]        = useState(existing?.lieu || '')
  const [ventoline,   setVentoline]   = useState(existing != null ? existing.ventoline : null)
  const [intensite,   setIntensite]   = useState(existing?.intensite || 3)
  const [date,        setDate]        = useState(existing ? new Date(existing.created_at).toISOString().slice(0,16) : new Date().toISOString().slice(0,16))
  const [err,         setErr]         = useState('')
  const [saving,      setSaving]      = useState(false)

  const save = async () => {
    if (!description.trim()) { setErr('La description est requise.'); return }
    if (ventoline === null)  { setErr('Indiquez si vous avez pris de la Ventoline.'); return }
    setSaving(true)
    const payload = { description: description.trim(), lieu: lieu.trim()||null, ventoline, intensite, created_at: new Date(date).toISOString() }
    let data, error
    if (isEdit) {
      ;({ data, error } = await supabase.from('crises').update(payload).eq('id', existing.id).select().single())
    } else {
      ;({ data, error } = await supabase.from('crises').insert({ ...payload, user_id: userId }).select().single())
    }
    setSaving(false)
    if (error) { setErr('Erreur lors de la sauvegarde.'); return }
    onSaved(data, isEdit); onClose()
  }

  return (
    <Modal onClose={onClose} title={isEdit ? 'Modifier la crise' : 'Nouvelle crise'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div><label style={lbl}>Date &amp; heure</label><input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} style={inp}/></div>
        <div><label style={lbl}>Description *</label><textarea placeholder="Symptômes, contexte, déclencheur…" value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ ...inp, resize: 'vertical' }}/></div>
        <div>
          <label style={lbl}>Lieu</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}><Icon name="map" size={15}/></span>
            <input placeholder="Domicile, bureau, extérieur…" value={lieu} onChange={e => setLieu(e.target.value)} style={{ ...inp, paddingLeft: 36 }}/>
          </div>
        </div>
        <div>
          <label style={lbl}>Prise de Ventoline *</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{v:true,txt:'✓  Oui',border:'#10b981',bg:'#d1fae5',col:'#065f46'},{v:false,txt:'✗  Non',border:'#ef4444',bg:'#fee2e2',col:'#991b1b'}].map(o => (
              <button key={String(o.v)} onClick={() => setVentoline(o.v)} style={{ flex:1, padding:'11px 8px', borderRadius:12, border:`2px solid ${ventoline===o.v?o.border:'#e2e8f0'}`, background:ventoline===o.v?o.bg:'white', color:ventoline===o.v?o.col:'#64748b', cursor:'pointer', fontWeight:700, fontSize:14, fontFamily:'inherit', transition:'all 0.15s' }}>{o.txt}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={lbl}>Intensité</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1,2,3,4,5].map(n => {
              const sel = intensite===n; const c = INTENSITY[n]
              return <button key={n} onClick={() => setIntensite(n)} style={{ flex:1, padding:'9px 4px', borderRadius:10, border:`2px solid ${sel?c.accent:'#e2e8f0'}`, background:sel?c.accent:'white', color:sel?'white':'#64748b', cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s', textAlign:'center', lineHeight:1.3 }}>
                <div style={{ fontSize:15, fontWeight:800 }}>{n}</div>
                <div style={{ fontSize:9, fontWeight:600, opacity:0.85 }}>{c.label}</div>
              </button>
            })}
          </div>
        </div>
        {err && <div style={errBox}>{err}</div>}
        <button onClick={save} disabled={saving} style={{ ...primBtn, padding:'14px', fontSize:15, opacity:saving?0.7:1, marginTop:2 }}>
          {saving ? 'Enregistrement…' : isEdit ? 'Enregistrer les modifications' : 'Enregistrer la crise'}
        </button>
      </div>
    </Modal>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   CRISIS CARD
═══════════════════════════════════════════════════════════════════ */
function CrisisCard({ crisis, onDelete, onEdit, readOnly=false }) {
  const time   = new Date(crisis.created_at).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })
  const accent = INTENSITY[crisis.intensite]?.accent || '#3b82f6'
  return (
    <div style={{ background:'white', borderRadius:16, padding:'16px 18px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)', display:'flex', gap:14, alignItems:'flex-start', borderLeft:`4px solid ${accent}` }}>
      <div style={{ width:42, height:42, borderRadius:11, background:`${accent}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:accent }}><Icon name="wind" size={19}/></div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8, marginBottom:8 }}>
          <p style={{ margin:0, fontSize:14, color:'#1e293b', fontWeight:500, lineHeight:1.5 }}>{crisis.description}</p>
          <span style={{ fontSize:12, color:'#94a3b8', whiteSpace:'nowrap', flexShrink:0 }}>{time}</span>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, alignItems:'center' }}>
          <IntensityBadge level={crisis.intensite}/>
          {crisis.lieu && <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:12, color:'#64748b' }}><Icon name="map" size={11}/> {crisis.lieu}</span>}
          <span style={{ fontSize:12, padding:'2px 10px', borderRadius:20, background:crisis.ventoline?'#eff6ff':'#fef2f2', color:crisis.ventoline?'#1d4ed8':'#dc2626', fontWeight:600 }}>
            {crisis.ventoline ? '💨 Ventoline prise' : '⚠ Sans Ventoline'}
          </span>
        </div>
      </div>
      {!readOnly && (
        <div style={{ display:'flex', gap:4, flexShrink:0 }}>
          <button onClick={() => onEdit(crisis)} style={{ background:'none', border:'none', cursor:'pointer', color:'#cbd5e1', padding:6, borderRadius:8, lineHeight:0, transition:'color 0.15s' }} onMouseEnter={e=>e.currentTarget.style.color='#3b82f6'} onMouseLeave={e=>e.currentTarget.style.color='#cbd5e1'}><Icon name="edit" size={15}/></button>
          <button onClick={() => onDelete(crisis.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#cbd5e1', padding:6, borderRadius:8, lineHeight:0, transition:'color 0.15s' }} onMouseEnter={e=>e.currentTarget.style.color='#ef4444'} onMouseLeave={e=>e.currentTarget.style.color='#cbd5e1'}><Icon name="trash" size={15}/></button>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   STATS BAR
═══════════════════════════════════════════════════════════════════ */
function StatsBar({ crises }) {
  const total = crises.length
  const withV = crises.filter(c => c.ventoline).length
  const avg   = total ? (crises.reduce((s,c)=>s+c.intensite,0)/total).toFixed(1) : '–'
  const week  = crises.filter(c => (Date.now()-new Date(c.created_at)) < 7*86400000).length
  const Stat  = ({ icon, label, value, color }) => (
    <div style={{ background:'white', borderRadius:16, padding:'14px 16px', flex:1, minWidth:110, display:'flex', alignItems:'center', gap:12, boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ width:38, height:38, borderRadius:11, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', color, flexShrink:0 }}><Icon name={icon} size={17}/></div>
      <div>
        <p style={{ margin:0, fontSize:22, fontWeight:800, color:'#0f172a', lineHeight:1, fontFamily:"'Fraunces',Georgia,serif" }}>{value}</p>
        <p style={{ margin:'3px 0 0', fontSize:11, color:'#94a3b8' }}>{label}</p>
      </div>
    </div>
  )
  return (
    <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:28 }}>
      <Stat icon="lung"     label="Total crises"    value={total} color="#3b82f6"/>
      <Stat icon="calendar" label="Cette semaine"   value={week}  color="#8b5cf6"/>
      <Stat icon="wind"     label="Ventoline prise" value={withV} color="#10b981"/>
      <Stat icon="stats"    label="Intensité moy."  value={avg}   color="#f97316"/>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   PROFILE MODAL
═══════════════════════════════════════════════════════════════════ */
function ProfileModal({ user, userName, onClose, onNameUpdated }) {
  const [name,    setName]    = useState(userName)
  const [oldPwd,  setOldPwd]  = useState('')
  const [newPwd,  setNewPwd]  = useState('')
  const [confPwd, setConfPwd] = useState('')
  const [msgName, setMsgName] = useState(null)
  const [msgPwd,  setMsgPwd]  = useState(null)
  const [loading, setLoading] = useState(false)

  const saveName = async () => {
    if (!name.trim()) return
    setLoading(true)
    const { error } = await supabase.from('profiles').update({ name: name.trim() }).eq('id', user.id)
    setLoading(false)
    if (error) { setMsgName({ ok:false, text:'Erreur.' }); return }
    onNameUpdated(name.trim()); setMsgName({ ok:true, text:'Prénom mis à jour !' })
  }

  const savePwd = async () => {
    if (!oldPwd||!newPwd||!confPwd) { setMsgPwd({ ok:false, text:'Tous les champs sont requis.' }); return }
    if (newPwd !== confPwd) { setMsgPwd({ ok:false, text:'Les mots de passe ne correspondent pas.' }); return }
    if (newPwd.length < 6)  { setMsgPwd({ ok:false, text:'Minimum 6 caractères.' }); return }
    setLoading(true)
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email: user.email, password: oldPwd })
    if (signInErr) { setMsgPwd({ ok:false, text:'Ancien mot de passe incorrect.' }); setLoading(false); return }
    const { error } = await supabase.auth.updateUser({ password: newPwd })
    setLoading(false)
    if (error) { setMsgPwd({ ok:false, text: error.message }); return }
    setMsgPwd({ ok:true, text:'Mot de passe mis à jour !' }); setOldPwd(''); setNewPwd(''); setConfPwd('')
  }

  const Sec = ({ title, children }) => (
    <div style={{ marginBottom:24 }}>
      <h3 style={{ margin:'0 0 14px', fontSize:12, fontWeight:700, color:'#64748b', letterSpacing:'0.05em', textTransform:'uppercase', borderBottom:'1px solid #f1f5f9', paddingBottom:10 }}>{title}</h3>
      {children}
    </div>
  )

  return (
    <Modal onClose={onClose} title="Mon compte">
      <Sec title="Informations personnelles">
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div><label style={lbl}>Prénom</label><input value={name} onChange={e=>setName(e.target.value)} style={inp}/></div>
          <div><label style={lbl}>Email</label><input value={user.email} disabled style={{ ...inp, background:'#f8fafc', color:'#94a3b8' }}/></div>
          {msgName && <div style={msgName.ok?okBox:errBox}>{msgName.text}</div>}
          <button onClick={saveName} disabled={loading} style={{ ...primBtn, alignSelf:'flex-start' }}>Enregistrer</button>
        </div>
      </Sec>
      <Sec title="Changer le mot de passe">
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div><label style={lbl}>Ancien mot de passe</label><input type="password" value={oldPwd} onChange={e=>setOldPwd(e.target.value)} style={inp}/></div>
          <div><label style={lbl}>Nouveau mot de passe</label><input type="password" value={newPwd} onChange={e=>setNewPwd(e.target.value)} style={inp}/></div>
          <div><label style={lbl}>Confirmer</label><input type="password" value={confPwd} onChange={e=>setConfPwd(e.target.value)} style={inp}/></div>
          {msgPwd && <div style={msgPwd.ok?okBox:errBox}>{msgPwd.text}</div>}
          <button onClick={savePwd} disabled={loading} style={{ ...primBtn, alignSelf:'flex-start' }}>Changer le mot de passe</button>
        </div>
      </Sec>
    </Modal>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   PRINT MODAL
═══════════════════════════════════════════════════════════════════ */
function PrintModal({ crises, userName, onClose }) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year,  setYear]  = useState(now.getFullYear())

  const filtered = crises.filter(c => { const d=new Date(c.created_at); return d.getMonth()===month && d.getFullYear()===year })

  const doPrint = () => {
    const win = window.open('','_blank')
    const total=filtered.length, withV=filtered.filter(c=>c.ventoline).length
    const avg=total?(filtered.reduce((s,c)=>s+c.intensite,0)/total).toFixed(1):'–'
    const rows=filtered.map(c=>`<tr><td>${new Date(c.created_at).toLocaleDateString('fr-FR')}</td><td>${new Date(c.created_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</td><td>${c.description}</td><td>${c.lieu||'–'}</td><td>${c.ventoline?'Oui':'Non'}</td><td>${c.intensite}/5 – ${INTENSITY[c.intensite]?.label}</td></tr>`).join('')
    win.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>AsthmaCare – ${MONTHS_FR[month]} ${year}</title><style>body{font-family:Arial,sans-serif;padding:32px;color:#1e293b}h1{font-size:22px;margin-bottom:4px}.sub{color:#64748b;font-size:13px;margin-bottom:24px}.stats{display:flex;gap:20px;margin-bottom:28px}.stat{background:#f8fafc;border-radius:10px;padding:12px 18px}.stat .val{font-size:24px;font-weight:800}.stat .lbl{font-size:11px;color:#64748b;text-transform:uppercase}table{width:100%;border-collapse:collapse}th{background:#f1f5f9;text-align:left;padding:10px 12px;font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#64748b}td{padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:13px}.footer{margin-top:32px;font-size:11px;color:#94a3b8;text-align:center}</style></head><body><h1>🫁 AsthmaCare – Récapitulatif mensuel</h1><p class="sub">${MONTHS_FR[month]} ${year} · ${userName}</p><div class="stats"><div class="stat"><div class="val">${total}</div><div class="lbl">Crises</div></div><div class="stat"><div class="val">${withV}</div><div class="lbl">Ventoline</div></div><div class="stat"><div class="val">${avg}</div><div class="lbl">Intensité moy.</div></div></div>${total===0?'<p>Aucune crise ce mois-ci.</p>':`<table><thead><tr><th>Date</th><th>Heure</th><th>Description</th><th>Lieu</th><th>Ventoline</th><th>Intensité</th></tr></thead><tbody>${rows}</tbody></table>`}<p class="footer">Généré le ${new Date().toLocaleDateString('fr-FR')} via AsthmaCare</p></body></html>`)
    win.document.close(); win.print()
  }

  return (
    <Modal onClose={onClose} title="Imprimer un récapitulatif" maxWidth={420}>
      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ display:'flex', gap:12 }}>
          <div style={{ flex:2 }}><label style={lbl}>Mois</label><select value={month} onChange={e=>setMonth(Number(e.target.value))} style={inp}>{MONTHS_FR.map((m,i)=><option key={i} value={i}>{m}</option>)}</select></div>
          <div style={{ flex:1 }}><label style={lbl}>Année</label><select value={year} onChange={e=>setYear(Number(e.target.value))} style={inp}>{[year-1,year,year+1].map(y=><option key={y} value={y}>{y}</option>)}</select></div>
        </div>
        <div style={{ background:'#f8fafc', borderRadius:12, padding:'14px 16px' }}>
          <p style={{ margin:'0 0 4px', fontSize:13, fontWeight:600, color:'#0f172a' }}>{MONTHS_FR[month]} {year}</p>
          <p style={{ margin:0, fontSize:13, color:'#64748b' }}><strong style={{ color:'#0f172a' }}>{filtered.length}</strong> crise{filtered.length!==1?'s':''} · <strong style={{ color:'#0f172a' }}>{filtered.filter(c=>c.ventoline).length}</strong> Ventoline</p>
        </div>
        <button onClick={doPrint} style={{ ...primBtn, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'13px' }}>
          <Icon name="print" size={17}/> Imprimer / Exporter PDF
        </button>
      </div>
    </Modal>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   ADMIN PANEL
═══════════════════════════════════════════════════════════════════ */
function AdminPanel({ currentUserId, onBack }) {
  const [profiles,    setProfiles]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [viewing,     setViewing]     = useState(null)
  const [editingRole, setEditingRole] = useState(null)
  const [search,      setSearch]      = useState('')

  useEffect(() => { loadProfiles() }, [])
  const loadProfiles = async () => { setLoading(true); const { data } = await supabase.from('profiles').select('*').order('name'); setProfiles(data||[]); setLoading(false) }

  const viewUser = async profile => {
    const { data } = await supabase.from('crises').select('*').eq('user_id', profile.id).order('created_at', { ascending:false })
    setViewing({ profile, crises: data||[] })
  }
  const changeRole = async (id, role) => { await supabase.from('profiles').update({ role }).eq('id', id); setProfiles(prev=>prev.map(p=>p.id===id?{...p,role}:p)); setEditingRole(null) }
  const deleteUser = async id => {
    if (!confirm('Supprimer ce compte et toutes ses données ?')) return
    await supabase.from('crises').delete().eq('user_id', id)
    await supabase.from('profiles').delete().eq('id', id)
    setProfiles(prev=>prev.filter(p=>p.id!==id))
  }

  const RoleBadge = ({ role }) => {
    const cfg={admin:{bg:'#fef3c7',color:'#92400e',label:'⭐ Admin'},viewer:{bg:'#eff6ff',color:'#1d4ed8',label:'👁 Viewer'},user:{bg:'#f1f5f9',color:'#475569',label:'👤 User'}}
    const c=cfg[role]||cfg.user
    return <span style={{ background:c.bg, color:c.color, padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>{c.label}</span>
  }

  if (viewing) {
    const grouped = {}
    viewing.crises.forEach(c => { const key=new Date(c.created_at).toLocaleDateString('fr-FR',{weekday:'long',year:'numeric',month:'long',day:'numeric'}); if(!grouped[key])grouped[key]=[]; grouped[key].push(c) })
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#f0f9ff 0%,#f8fafc 40%,#fefce8 100%)' }}>
        <header style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(20px)', borderBottom:'1px solid #e2e8f0', position:'sticky', top:0, zIndex:100 }}>
          <div style={{ maxWidth:720, margin:'0 auto', padding:'13px 20px', display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={()=>setViewing(null)} style={{ ...ghostBtn, display:'flex', alignItems:'center', gap:6 }}><Icon name="back" size={15}/> Retour</button>
            <p style={{ margin:0, fontSize:15, fontWeight:700, color:'#0f172a', fontFamily:"'Fraunces',Georgia,serif" }}>{viewing.profile.name} — {viewing.crises.length} crises</p>
          </div>
        </header>
        <main style={{ maxWidth:720, margin:'0 auto', padding:'28px 20px' }}>
          <StatsBar crises={viewing.crises}/>
          {viewing.crises.length===0 ? <p style={{ textAlign:'center', color:'#64748b', padding:40 }}>Aucune crise enregistrée</p>
          : Object.entries(grouped).map(([dl,items])=>(
            <div key={dl} style={{ marginBottom:28 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <span style={{ color:'#94a3b8' }}><Icon name="calendar" size={13}/></span>
                <h2 style={{ margin:0, fontSize:12, fontWeight:700, color:'#64748b', textTransform:'capitalize' }}>{dl}</h2>
                <span style={{ background:'#e0f2fe', color:'#0369a1', borderRadius:20, padding:'1px 9px', fontSize:11, fontWeight:700 }}>{items.length}</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>{items.map(c=><CrisisCard key={c.id} crisis={c} readOnly/>)}</div>
            </div>
          ))}
        </main>
      </div>
    )
  }

  const filtered = profiles.filter(p=>p.name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#f0f9ff 0%,#f8fafc 40%,#fefce8 100%)' }}>
      <header style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(20px)', borderBottom:'1px solid #e2e8f0', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:900, margin:'0 auto', padding:'13px 20px', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={onBack} style={{ ...ghostBtn, display:'flex', alignItems:'center', gap:6 }}><Icon name="back" size={15}/> Retour</button>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#f59e0b,#f97316)', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}><Icon name="shield" size={16}/></div>
            <h1 style={{ margin:0, fontSize:17, fontWeight:800, color:'#0f172a', fontFamily:"'Fraunces',Georgia,serif" }}>Administration</h1>
          </div>
          <span style={{ marginLeft:'auto', background:'#fef3c7', color:'#92400e', borderRadius:20, padding:'3px 12px', fontSize:12, fontWeight:700 }}>{profiles.length} comptes</span>
        </div>
      </header>
      <main style={{ maxWidth:900, margin:'0 auto', padding:'28px 20px' }}>
        <input placeholder="Rechercher un utilisateur…" value={search} onChange={e=>setSearch(e.target.value)} style={{ ...inp, marginBottom:20 }}/>
        {loading ? <p style={{ textAlign:'center', color:'#64748b', padding:40 }}>Chargement…</p> : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {filtered.map(p=>(
              <div key={p.id} style={{ background:'white', borderRadius:16, padding:'16px 20px', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b', flexShrink:0 }}><Icon name="user" size={18}/></div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:2 }}>
                    <span style={{ fontSize:14, fontWeight:600, color:'#0f172a' }}>{p.name}</span>
                    <RoleBadge role={p.role}/>
                    {p.id===currentUserId && <span style={{ fontSize:11, color:'#94a3b8' }}>(vous)</span>}
                  </div>
                  <span style={{ fontSize:12, color:'#94a3b8' }}>ID: {p.id.slice(0,8)}…</span>
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0, flexWrap:'wrap', justifyContent:'flex-end' }}>
                  <button onClick={()=>viewUser(p)} style={{ ...ghostBtn, display:'flex', alignItems:'center', gap:5 }}><Icon name="eye" size={13}/> Voir crises</button>
                  {editingRole===p.id ? (
                    <div style={{ display:'flex', gap:6 }}>
                      {['user','viewer','admin'].map(r=>(
                        <button key={r} onClick={()=>changeRole(p.id,r)} style={{ ...ghostBtn, padding:'8px 12px', fontSize:12, background:p.role===r?'#eff6ff':'#f1f5f9', color:p.role===r?'#1d4ed8':'#64748b', fontWeight:700 }}>{r}</button>
                      ))}
                      <button onClick={()=>setEditingRole(null)} style={{ ...ghostBtn, padding:'8px 10px' }}>✕</button>
                    </div>
                  ) : (
                    <button onClick={()=>setEditingRole(p.id)} style={{ ...ghostBtn, display:'flex', alignItems:'center', gap:5 }}><Icon name="settings" size={13}/> Rôle</button>
                  )}
                  {p.id!==currentUserId && (
                    <button onClick={()=>deleteUser(p.id)} style={{ padding:'9px 14px', background:'#fef2f2', color:'#dc2626', border:'1px solid #fecaca', borderRadius:11, cursor:'pointer', fontSize:13, fontWeight:600, fontFamily:'inherit', display:'flex', alignItems:'center', gap:5 }}><Icon name="trash" size={13}/> Supprimer</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   VIEWER PANEL
═══════════════════════════════════════════════════════════════════ */
function ViewerPanel({ onBack }) {
  const [profiles, setProfiles] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [viewing,  setViewing]  = useState(null)

  useEffect(() => { supabase.from('profiles').select('*').order('name').then(({data})=>{setProfiles(data||[]);setLoading(false)}) }, [])

  const viewUser = async profile => {
    const { data } = await supabase.from('crises').select('*').eq('user_id', profile.id).order('created_at', { ascending:false })
    setViewing({ profile, crises: data||[] })
  }

  if (viewing) {
    const grouped = {}
    viewing.crises.forEach(c=>{const key=new Date(c.created_at).toLocaleDateString('fr-FR',{weekday:'long',year:'numeric',month:'long',day:'numeric'});if(!grouped[key])grouped[key]=[];grouped[key].push(c)})
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#f0f9ff 0%,#f8fafc 40%,#fefce8 100%)' }}>
        <header style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(20px)', borderBottom:'1px solid #e2e8f0', position:'sticky', top:0, zIndex:100 }}>
          <div style={{ maxWidth:720, margin:'0 auto', padding:'13px 20px', display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={()=>setViewing(null)} style={{ ...ghostBtn, display:'flex', alignItems:'center', gap:6 }}><Icon name="back" size={15}/> Retour</button>
            <p style={{ margin:0, fontSize:15, fontWeight:700, color:'#0f172a', fontFamily:"'Fraunces',Georgia,serif" }}>{viewing.profile.name}</p>
          </div>
        </header>
        <main style={{ maxWidth:720, margin:'0 auto', padding:'28px 20px' }}>
          <StatsBar crises={viewing.crises}/>
          {viewing.crises.length===0 ? <p style={{ textAlign:'center', color:'#64748b', padding:40 }}>Aucune crise</p>
          : Object.entries(grouped).map(([dl,items])=>(
            <div key={dl} style={{ marginBottom:28 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <span style={{ color:'#94a3b8' }}><Icon name="calendar" size={13}/></span>
                <h2 style={{ margin:0, fontSize:12, fontWeight:700, color:'#64748b', textTransform:'capitalize' }}>{dl}</h2>
                <span style={{ background:'#e0f2fe', color:'#0369a1', borderRadius:20, padding:'1px 9px', fontSize:11, fontWeight:700 }}>{items.length}</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>{items.map(c=><CrisisCard key={c.id} crisis={c} readOnly/>)}</div>
            </div>
          ))}
        </main>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#f0f9ff 0%,#f8fafc 40%,#fefce8 100%)' }}>
      <header style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(20px)', borderBottom:'1px solid #e2e8f0', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:720, margin:'0 auto', padding:'13px 20px', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={onBack} style={{ ...ghostBtn, display:'flex', alignItems:'center', gap:6 }}><Icon name="back" size={15}/> Mon accueil</button>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#3b82f6' }}><Icon name="users" size={16}/></div>
            <h1 style={{ margin:0, fontSize:17, fontWeight:800, color:'#0f172a', fontFamily:"'Fraunces',Georgia,serif" }}>Tous les patients</h1>
          </div>
        </div>
      </header>
      <main style={{ maxWidth:720, margin:'0 auto', padding:'28px 20px' }}>
        {loading ? <p style={{ textAlign:'center', color:'#64748b', padding:40 }}>Chargement…</p> : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {profiles.map(p=>(
              <button key={p.id} onClick={()=>viewUser(p)} style={{ background:'white', borderRadius:16, padding:'16px 20px', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', display:'flex', alignItems:'center', gap:14, border:'none', cursor:'pointer', textAlign:'left', transition:'transform 0.15s,box-shadow 0.15s' }} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,0.1)'}} onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)'}}>
                <div style={{ width:40, height:40, borderRadius:12, background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#3b82f6', flexShrink:0 }}><Icon name="user" size={18}/></div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0, fontSize:14, fontWeight:600, color:'#0f172a' }}>{p.name}</p>
                  <p style={{ margin:0, fontSize:12, color:'#94a3b8' }}>Voir les crises</p>
                </div>
                <Icon name="chev" size={16}/>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [user,        setUser]        = useState(null)
  const [userName,    setUserName]    = useState('')
  const [userRole,    setUserRole]    = useState('user')
  const [crises,      setCrises]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [page,        setPage]        = useState('home')
  const [showAdd,     setShowAdd]     = useState(false)
  const [editCrisis,  setEditCrisis]  = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showPrint,   setShowPrint]   = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('name,role').eq('id', session.user.id).single()
        setUser(session.user); setUserName(profile?.name||session.user.email); setUserRole(profile?.role||'user')
        fetchCrises(session.user.id)
      } else { setLoading(false) }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) { setUser(null); setUserName(''); setUserRole('user'); setCrises([]); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchCrises  = async uid => { const { data } = await supabase.from('crises').select('*').eq('user_id', uid).order('created_at',{ascending:false}); setCrises(data||[]); setLoading(false) }
  const handleLogin  = (u,name,role) => { setUser(u); setUserName(name); setUserRole(role); fetchCrises(u.id) }
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setUserName(''); setUserRole('user'); setCrises([]) }
  const handleSaved  = (c,isEdit) => { if(isEdit) setCrises(prev=>prev.map(x=>x.id===c.id?c:x)); else setCrises(prev=>[c,...prev]) }
  const handleDelete = async id => { await supabase.from('crises').delete().eq('id',id); setCrises(prev=>prev.filter(c=>c.id!==id)) }

  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8fafc', color:'#64748b', fontSize:16 }}>Chargement…</div>
  if (!user)   return <AuthPage onLogin={handleLogin}/>
  if (page==='admin')  return <AdminPanel currentUserId={user.id} onBack={()=>setPage('home')}/>
  if (page==='viewer') return <ViewerPanel onBack={()=>setPage('home')}/>

  const grouped = {}
  crises.forEach(c => { const key=new Date(c.created_at).toLocaleDateString('fr-FR',{weekday:'long',year:'numeric',month:'long',day:'numeric'}); if(!grouped[key])grouped[key]=[]; grouped[key].push(c) })

  const menuItems = [
    { icon:'settings', label:'Mon compte',       action:()=>setShowProfile(true) },
    { icon:'print',    label:'Imprimer récap.',   action:()=>setShowPrint(true) },
    ...(userRole==='viewer'||userRole==='admin' ? [{ icon:'users', label:'Voir les patients', action:()=>setPage('viewer') }] : []),
    ...(userRole==='admin' ? [{ icon:'shield', label:'Administration', action:()=>setPage('admin') }] : []),
    null,
    { icon:'logout', label:'Se déconnecter', action:handleLogout, danger:true },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#f0f9ff 0%,#f8fafc 40%,#fefce8 100%)' }}>

      <header className="no-print" style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(20px)', borderBottom:'1px solid #e2e8f0', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:720, margin:'0 auto', padding:'13px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Logo size={36}/>
            <div>
              <h1 style={{ margin:0, fontSize:17, fontWeight:800, color:'#0f172a', fontFamily:"'Fraunces',Georgia,serif", letterSpacing:'-0.03em', lineHeight:1.1 }}>AsthmaCare</h1>
              <p style={{ margin:0, fontSize:11, color:'#94a3b8' }}>Bonjour, {userName} 👋</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button onClick={()=>setShowAdd(true)} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 15px', background:'linear-gradient(135deg,#3b82f6,#06b6d4)', color:'white', border:'none', borderRadius:11, cursor:'pointer', fontSize:13, fontWeight:600 }}>
              <Icon name="plus" size={13}/> Ajouter
            </button>
            <div style={{ position:'relative' }}>
              <button onClick={()=>setMenuOpen(o=>!o)} style={{ ...ghostBtn, padding:'8px 10px', lineHeight:0 }}><Icon name="user" size={16}/></button>
              {menuOpen && (
                <div onClick={()=>setMenuOpen(false)} style={{ position:'fixed', inset:0, zIndex:50 }}>
                  <div onClick={e=>e.stopPropagation()} style={{ position:'absolute', right:0, top:44, background:'white', borderRadius:16, boxShadow:'0 8px 32px rgba(0,0,0,0.15)', padding:'8px', minWidth:210, zIndex:51 }}>
                    {menuItems.map((item,i) => item===null ? (
                      <div key={i} style={{ height:1, background:'#f1f5f9', margin:'6px 4px' }}/>
                    ) : (
                      <button key={i} onClick={item.action} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 14px', border:'none', borderRadius:10, cursor:'pointer', fontSize:14, background:'none', color:item.danger?'#dc2626':'#0f172a', fontWeight:500, textAlign:'left', fontFamily:'inherit' }} onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background='none'}>
                        <span style={{ color:item.danger?'#dc2626':'#64748b' }}><Icon name={item.icon} size={15}/></span> {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth:720, margin:'0 auto', padding:'28px 20px' }}>
        <StatsBar crises={crises}/>
        {crises.length===0 ? (
          <div style={{ textAlign:'center', padding:'56px 20px', background:'white', borderRadius:20, boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize:52, marginBottom:14 }}>🫁</div>
            <h3 style={{ margin:'0 0 8px', fontSize:20, fontWeight:800, color:'#0f172a', fontFamily:"'Fraunces',Georgia,serif" }}>Aucune crise enregistrée</h3>
            <p style={{ margin:'0 0 22px', color:'#64748b', fontSize:14 }}>Commencez à suivre vos crises d'asthme</p>
            <button onClick={()=>setShowAdd(true)} style={{ ...primBtn, display:'inline-flex' }}>+ Ajouter une crise</button>
          </div>
        ) : Object.entries(grouped).map(([dl,items])=>(
          <div key={dl} style={{ marginBottom:28 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <span style={{ color:'#94a3b8' }}><Icon name="calendar" size={13}/></span>
              <h2 style={{ margin:0, fontSize:12, fontWeight:700, color:'#64748b', letterSpacing:'0.05em', textTransform:'capitalize' }}>{dl}</h2>
              <span style={{ background:'#e0f2fe', color:'#0369a1', borderRadius:20, padding:'1px 9px', fontSize:11, fontWeight:700 }}>{items.length} crise{items.length>1?'s':''}</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {items.map(c=><CrisisCard key={c.id} crisis={c} onDelete={handleDelete} onEdit={setEditCrisis}/>)}
            </div>
          </div>
        ))}
      </main>

      {showAdd    && <CrisisModal  userId={user.id} onClose={()=>setShowAdd(false)}     onSaved={handleSaved}/>}
      {editCrisis && <CrisisModal  userId={user.id} existing={editCrisis} onClose={()=>setEditCrisis(null)} onSaved={handleSaved}/>}
      {showProfile && <ProfileModal user={user} userName={userName} onClose={()=>setShowProfile(false)} onNameUpdated={setUserName}/>}
      {showPrint  && <PrintModal   crises={crises} userName={userName} onClose={()=>setShowPrint(false)}/>}
    </div>
  )
}
