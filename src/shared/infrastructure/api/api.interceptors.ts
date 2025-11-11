import axios, { AxiosError, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios'

import { SERVER_URL } from '../../../config/api.config'

import {
    getAccessToken,
    removeFromStorage
} from '@/src/services/auth/auth-token.service'
import { authService } from '@/src/services/auth/auth.service'

import { errorCatch, getContentType } from './api.helper'

const options: CreateAxiosDefaults = {
	baseURL: SERVER_URL,
	headers: getContentType(),
	withCredentials: true
}

const axiosClassic = axios.create(options)
const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.request.use(config => {
	const accessToken = getAccessToken()

	if (config?.headers && accessToken)
		config.headers.Authorization = `Bearer ${accessToken}`

	return config
})

axiosWithAuth.interceptors.response.use(
	config => config,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & { _isRetry?: boolean }

		if (
			(error?.response?.status === 401 ||
				errorCatch(error) === 'jwt expried' ||
				errorCatch(error) === 'jwt must be provided') &&
			error.config &&
			!error.config._isRetry
		) {
			originalRequest._isRetry = true
			try {
				await authService.getNewTokens()
				return axiosWithAuth.request(originalRequest)
			} catch (err) {
				if (err instanceof AxiosError && errorCatch(error) === 'jwt expired') removeFromStorage()
			}
		}

		throw error
	}
)

export { axiosClassic, axiosWithAuth }
