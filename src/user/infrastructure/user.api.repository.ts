import { IUserRepository } from "../application/ports/user.repository"
import { userService } from "./user.service"

export class UserApiRepository implements IUserRepository {
  async getProfile() {
    return userService.getProfile()
  }
}