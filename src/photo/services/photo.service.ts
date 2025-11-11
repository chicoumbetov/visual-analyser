import { API_URL } from '../../config/api.config'
import { ICommentRdo, ICreateCommentForm } from '../../shared/domain/entities/comment.interface'
import {
    ICreatePhotoForm,
    IPhotoDetails,
    IPhotoRdo
} from '../../shared/domain/entities/photo.interface'
import { axiosClassic, axiosWithAuth } from '../../shared/infrastructure/api/api.interceptors'

class PhotoService {
    // * PUBLIC: Fetch all photos for map visualization
    async getAll() {
        // * API Spec: GET /photos -> IPhotoRdo[]
        const { data } = await axiosClassic.get<IPhotoRdo[]>(API_URL.root('/photos'))
        return data
    }

    // * PUBLIC
    async getById(photoId: string) {
        // * API Spec: GET /photos/:id -> IPhotoDetails
        const { data } = await axiosClassic.get<IPhotoDetails>(API_URL.root(`/photos/${photoId}`))
        return data
    }

    // * PROTECTED: Upload a new photo
    // We take ICreatePhotoForm, but only process the file and metadata needed by the API.
    async upload(data: ICreatePhotoForm) {
        const formData = new FormData()
        formData.append('image', data.image)
        
        const metadata = {
            title: data.title,
            latitude: data.latitude,
            longitude: data.longitude,
        }
        // * NestJS can handle fields sent alongside the file in multipart form data
        formData.append('title', metadata.title)
        formData.append('latitude', metadata.latitude.toString())
        formData.append('longitude', metadata.longitude.toString())

        // * API Spec: POST /photos -> IPhoto (we assume IPhoto is just the created object, similar to IPhotoRdo without commentsCount)
        const { data: createdPhoto } = await axiosWithAuth.post<IPhotoRdo>(API_URL.root('/photos'), formData, {
            headers: {
                // * Important: 'Content-Type' header is set automatically to 'multipart/form-data' 
                // * For simplicity here, we let the browser handle it.
            },
        })
        return createdPhoto
    }

    // * PROTECTED
    async addComment(photoId: string, data: ICreateCommentForm) {
        // * API Spec: POST /photos/:photoId/comments -> ICommentRdo
        const url = API_URL.root(`/photos/${photoId}/comments`)
        const response = await axiosWithAuth.post<ICommentRdo>(url, data)
        return response.data
    }
    
    // * PUBLIC
    async getCommentsByPhotoId(photoId: string) {
        // * API Spec: GET /photos/:photoId/comments -> ICommentRdo[]
        const url = API_URL.root(`/photos/${photoId}/comments`)
        const { data } = await axiosClassic.get<ICommentRdo[]>(url)
        return data
    }
}

export const photoService = new PhotoService()
