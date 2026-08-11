const BASE_URL = import.meta.env.VITE_API_URL

function getToken() {
  return localStorage.getItem("token")
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken")
}

function clearSessionAndRedirect() {
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("token")
  localStorage.removeItem("refreshToken")
  window.location.href = "/"
}

let refreshPromise = null

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      throw new Error("no-refresh-token")
    }

    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      throw new Error("refresh-failed")
    }

    localStorage.setItem("token", data.token)

    if (data.refreshToken) {
      localStorage.setItem(
        "refreshToken",
        data.refreshToken
      )
    }

    return data.token
  })()

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}

export async function authFetch(path, options = {}) {

  const token = getToken()

  const doFetch = (accessToken) =>
    fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body
          ? { "Content-Type": "application/json" }
          : {}),
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    })

  let res = await doFetch(token)

  if (res.status === 401) {

    try {

      const newToken =
        await refreshAccessToken()

      res = await doFetch(newToken)

    } catch {

      clearSessionAndRedirect()

      return new Promise(() => {})
    }
  }

  return res
}

/* LOGIN GEREKTİRMEYEN İSTEKLER */
export async function publicFetch(
  path,
  options = {}
) {

  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  })
}