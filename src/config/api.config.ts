export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL as string

export const API_URL = {
	root: (url = '') => `${SERVER_URL}${url}`,

	auth: (url = '') => API_URL.root(`/auth${url}`),
	users: (url = '') => API_URL.root(`/users${url}`),
	files: (url = '') => API_URL.root(`/files${url}`)
}
