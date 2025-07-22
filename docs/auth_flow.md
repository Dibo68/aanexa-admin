# 🔐 Aanexa Auth Flow (Subdomain JWT Setup)

## 1. Ziel

Da Cookies im Free-Tier von Supabase nicht domainübergreifend funktionieren, basiert die Aanexa-Authentifizierung auf **Access Tokens (JWT)**, die manuell vom Client übergeben und auf dem Server verifiziert werden.

---

## 2. Login Ablauf (Kunde/Admin/Partner)

- Benutzer loggt sich auf `aanexa.com` ein
- Supabase setzt `supabase-access-token` und `supabase-refresh-token` als Cookies
- Diese Cookies sind **nicht** auf `admin.aanexa.com` gültig

---

## 3. Token Sync auf Subdomains (Client)

### Datei: `src/context/AuthContext.tsx`

```tsx
useEffect(() => {
  const cookies = document.cookie.split(';').map(c => c.trim().split('='))
  const access = cookies.find(c => c[0] === 'supabase-access-token')?.[1]
  const refresh = cookies.find(c => c[0] === 'supabase-refresh-token')?.[1]

  if (access && refresh) {
    supabase.auth.setSession({ access_token: access, refresh_token: refresh })
  }
}, [])
```

- Token wird aus dem Cookie gelesen und direkt an Supabase übergeben
- Supabase kennt dann den eingeloggten User auch auf der Subdomain

---

## 4. Token an Server senden (Client ➝ API)

### Datei: `src/app/dashboard/admins/page.tsx`

```ts
const res = await fetch('/api/admin/update', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ id: adminId, update: values })
})
```

- Der Token wird im `Authorization` Header mitgesendet
- Gilt für alle Aktionen, bei denen Rollenprüfung notwendig ist

---

## 5. Server: Token-basierten Supabase Client verwenden

### Datei: `src/utils/supabase/server.ts`

```ts
const authHeader = headers().get('authorization')

return createServerClient(..., {
  headers: {
    Authorization: authHeader ?? ''
  },
  cookies: { ... }
})
```

- Damit kann `supabase.auth.getUser()` den Benutzer korrekt laden

---

## 6. Rollenprüfung auf dem Server

### Datei: `src/app/api/admin/update/route.ts`

```ts
const { data: profile } = await supabase
  .from('admin_users')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile.role !== 'super_admin') {
  return Response.json({ message: 'Permission denied' }, { status: 403 })
}
```

- Nur `super_admin` darf Admins bearbeiten oder löschen

---

## 7. Hinweise

- Diese Methode ist sicher, weil der Access Token signiert und zeitlich limitiert ist
- Token kann clientseitig gespeichert, aber nicht manipuliert werden
- Server prüft Token bei jedem Request erneut → keine Gefahr durch JS-Manipulation

---

> Dokument gepflegt von ChatGPT – Stand: 2025-07-22

