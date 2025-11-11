import { ICommentRdo } from './comment.interface';
import { IAuthUserLite } from './user.interface';

export interface IPhotoRdo {
    id: string
    title: string
    imageUrl: string
    latitude: number
    longitude: number
    aiDescription: string | null
    createdAt: Date

    user: IAuthUserLite 
    commentsCount: number
}

// Interface for photo details GET /photos/:id
export interface IPhotoDetails extends Omit<IPhotoRdo, 'commentsCount'> {
    comments: ICommentRdo[] 
}

export interface ICreatePhotoForm {
    title: string
    latitude: number
    longitude: number
    image: File // For the file input
}
