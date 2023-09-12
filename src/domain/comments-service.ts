import {
    CommentDataModel,
    CommentInputModel,
    CommentViewModel,
    TypeOfRequestBody,
    TypeOfRequestP,
    TypeOfRequestP_Body
} from '../types/models'
import { commentsRepo } from '../repositories/comments-repository'

export const commentsService = {

    async create(req: TypeOfRequestBody<CommentInputModel>, pId: string): Promise<CommentViewModel> {

        const newEntry: CommentDataModel = {
            id: commentsRepo.newID(),
            postId: pId,
            content: req.body.content,
            commentatorInfo: {
                userId: req.user!.id,
                userLogin: req.user!.login
            },
            createdAt: new Date().toISOString()
        }

        await commentsRepo.create({ ...newEntry })
        //exclude certain fields and return rest.
        const { postId, ...rest } = newEntry
        return rest as CommentViewModel
    },



    async update(req: TypeOfRequestP_Body<{ id: string },
        CommentInputModel>): Promise<number> {

        const updateEntry: CommentInputModel = {
            content: req.body.content
        }

        await commentsRepo.update(req.params.id, updateEntry)
        return 204
    },



    async delete(req: TypeOfRequestP<{ id: string }>): Promise<number> {
        return commentsRepo.delete(req.params.id)
    }

}