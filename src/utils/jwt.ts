export function decodeJwt<T = any>(token: string): T | null {
  try {
    const base64 = token.split('.')[1]
    const normalized = base64.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(normalized)
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

export function getRoleFromToken(token?: string | null): string | undefined {
  if (!token) return
  const payload = decodeJwt<any>(token)
  return payload?.role
}
export function getUserIdFromToken(token?: string | null): string | undefined {
  if (!token) return
  const payload = decodeJwt<any>(token)
  return payload?.uid 
}

export function extractRoleFromPayload(payload: any): string | undefined {
  if (!payload) return
  let role: string | undefined =
    payload.role ||
    (Array.isArray(payload.roles) ? payload.roles[0] : undefined) ||
    (Array.isArray(payload.authorities) ? payload.authorities[0] : undefined) ||
    (typeof payload.scope === 'string'
      ? payload.scope.split(' ')[0]
      : undefined)

  role = role?.toString().toLowerCase()
  if (role?.startsWith('role_')) role = role.slice(5)
  return role
}
