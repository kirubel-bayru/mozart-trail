/** Base API URL without trailing slash (avoids `//api/...` when env has a trailing `/`). */
export const API_BASE_URL = (process.env.API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '')
