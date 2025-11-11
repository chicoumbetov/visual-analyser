/** * IAuthUserLite: Represents the minimal user data attached to resources (like Photos/Comments).
 */
export interface IAuthUserLite {
    id: string
    name: string | null
}

/**
 * IUser: Represents the full user profile data retrieved from /users/profile.
 */
export interface IUser extends IAuthUserLite {
    email: string
    picture: string
}
