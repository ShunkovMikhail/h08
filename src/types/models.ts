import { Request } from 'express'

export type TypeOfRequestBody< T > = Request< {},{},T >
export type TypeOfRequestP< T > = Request< T >
export type TypeOfRequestQuery< T > = Request< {},{},{},T >
export type TypeOfRequestP_Query< T,U > = Request< T,{},{},U >
export type TypeOfRequestP_Body< T,U > = Request< T,{},U >

export type BlogViewModel = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type BlogInputModel = {
    name: string
    description: string
    websiteUrl: string
}

export type BlogPostInputModel = {
    title: string
    shortDescription: string
    content: string
}

export type PostViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type PostInputModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type APIErrorResult = {
    errorsMessages: FieldError[]
}

export type FieldError = {
    message: string | null
    field: string | null
}

export type Paginator<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<T>
}

export type LoginInputModel = {
    loginOrEmail: string
    password: string
}

export type UserInputModel = {
    login: string
    password: string
    email: string
}

export type UserViewModel = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type UserDataModel = {
    id: string
    login: string
    email: string
    createdAt: string
    meta: { password: string }
}

export type unconfirmedUserDataModel = {
    id: string
    login: string
    email: string
    meta: {
        password: string
        code: string
        expirationDate: string
        cooldowns: {
            codeResent: number
        }
    }
}

export type MeViewModel = {
    email: string
    login: string
    userId: string
}

export type LoginSuccessViewModel = {
    accessToken: string
}

export type CommentatorInfo = {
    userId: string
    userLogin: string
}

export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}

export type CommentDataModel = {
    id: string
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}

export type CommentInputModel = {
    content: string
}

export type RegistrationConfirmationCodeModel = {
    code: string
}

export type RegistrationEmailResending = {
    email: string
}

export type JwtBlacklistModel = {
    jwt: string
    exp: number
}


