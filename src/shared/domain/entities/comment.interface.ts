export interface ICommentRdo {
    id: string
    text: string
    createdAt: Date
    user: {
        id: string
        name: string | null
    }
}

export interface ICreateCommentForm {
    text: string
}
