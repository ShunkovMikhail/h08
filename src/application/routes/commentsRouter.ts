import { CommentVdChain } from '../../inputValidation'
import {
    CommentInputModel,
    CommentViewModel,
    TypeOfRequestP,
    TypeOfRequestP_Body
} from '../../types/models'
import { Request, Response, Router } from 'express'
import { Result, validationResult } from 'express-validator'
import { ErrorMapper } from '../../utils/errorMapper'
import { authMiddleware } from '../../middlewares/auth-middlewares'
import { commentsQueryRepo } from '../../repositories/query/comments-query-repository'
import { commentsService } from '../../domain/comments-service'

export const commentsRouter = Router({})

commentsRouter.put('/:id', authMiddleware, CommentVdChain, async (req: TypeOfRequestP_Body<{ id: string }, CommentInputModel>, res: Response) => {

    const result: Result = validationResult(req)
    const comment = await commentsQueryRepo.get(req.params.id)

    if (comment) {
        if (result.isEmpty()) {
            if (comment.commentatorInfo.userId === req.user!.id) {
                res.status(204).json(await commentsService.update(req))
            } else {
                res.sendStatus(403)
            }
        } else {
            res.status(400).json(await ErrorMapper(result))
        }
    } else {
        res.sendStatus(404)
    }
})

commentsRouter.get('/:id', async (req: Request, res: Response<CommentViewModel | null>) => {

    if (await commentsQueryRepo.exists(req.params.id)) {
        res.status(200).json(await commentsQueryRepo.get(req.params.id))
    } else {
        res.sendStatus(404)
    }
})

commentsRouter.delete('/:id', authMiddleware, async (req: TypeOfRequestP<{ id: string }>, res: Response) => {

    const comment = await commentsQueryRepo.get(req.params.id)

    if (comment) {
        if (comment.commentatorInfo.userId === req.user!.id) {
            res.sendStatus(await commentsService.delete(req))
        } else {
            res.sendStatus(403)
        }
    } else {
        res.sendStatus(404)
    }
})