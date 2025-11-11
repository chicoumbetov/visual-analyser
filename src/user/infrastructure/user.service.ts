import { axiosWithAuth } from '../../shared/infrastructure/api/api.interceptors'

import { API_URL } from '../../config/api.config'

import { IUser } from '../../shared/domain/entities/user.interface'

class UserService {
	async getProfile() {
		const { data } = await axiosWithAuth<IUser>({
			url: API_URL.users('/profile'),
			method: 'GET'
		})

		return data
	}
}

export const userService = new UserService()
