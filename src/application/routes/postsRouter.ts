import { Response, Router } from 'express'
import { admins } from '../../repositories/mongo-db'
import {
    TypeOfRequestP,
    TypeOfRequestP_Body,
    PostInputModel,
    TypeOfRequestQuery,
    Paginator,
    PostViewModel,
    APIErrorResult,
    TypeOfRequestBody,
    CommentInputModel,
    CommentViewModel,
    TypeOfRequestP_Query
} from '../../types/models'

import basicAuth from 'express-basic-auth'
import { Result, validationResult } from 'express-validator'
import { CommentVdChain, postVdChain } from '../../inputValidation'
import { ErrorMapper } from '../../utils/errorMapper'
import { postsService } from '../../domain/posts-service'
import { postsQueryRepo } from '../../repositories/query/posts-query-repository'
import { authMiddleware } from '../../middlewares/auth-middlewares'
import { commentsService } from '../../domain/comments-service'
import { commentsQueryRepo } from '../../repositories/query/comments-query-repository'

export const postsRouter = Router({})



postsRouter.post('/', basicAuth({users: admins}), postVdChain, async (req: TypeOfRequestBody<PostInputModel>, res: Response<PostViewModel | APIErrorResult>) => {

    const result: Result = validationResult(req)

    if (result.isEmpty()) {
        res.status(201).json(await postsService.create(req))
    } else {
        res.status(400).json(await ErrorMapper(result))
    }
})



postsRouter.post('/:id/comments', authMiddleware, CommentVdChain, async (req: TypeOfRequestP_Body<{ id: string }, CommentInputModel>, res: Response<CommentViewModel | APIErrorResult>) => {

    const result: Result = validationResult(req)

    if (await postsQueryRepo.exists(req.params.id)) {
        if (result.isEmpty()) {
            res.status(201).json(await commentsService.create(req, req.params.id))
        } else {
            res.status(400).json(await ErrorMapper(result))
        }
    } else {
        res.sendStatus(404)
    }
})



postsRouter.get('/:id/comments', async (req: TypeOfRequestP_Query<{ id: string }, {
    searchNameTerm: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string }>, res: Response<Paginator<CommentViewModel | null>>) => {

    if (await postsQueryRepo.exists(req.params.id)) {
        res.status(200).json(await commentsQueryRepo.getAllByPost(req))
    } else {
        res.sendStatus(404)
    }
})



postsRouter.get('/', async (req: TypeOfRequestQuery<{
    searchNameTerm: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string }>, res: Response<Paginator<PostViewModel | null>>) => {

    res.status(200).json(await postsQueryRepo.getAll(req))
})



postsRouter.get('/:id', async (req: TypeOfRequestP<{ id: string }>, res: Response<PostViewModel | null>) => {

    if (await postsQueryRepo.exists(req.params.id)) {
        res.status(200).json(await postsQueryRepo.get(req.params.id))
    } else {
        res.sendStatus(404)
    }
})



postsRouter.put('/:id', basicAuth({users: admins}), postVdChain, async (req: TypeOfRequestP_Body<{ id: string },
    PostInputModel>, res: Response) => {
    if (await postsQueryRepo.exists(req.params.id)) {

        const result: Result = validationResult(req)

        if (result.isEmpty()) {
            res.sendStatus(await postsService.update(req))
        } else {
            res.status(400).json(await ErrorMapper(result))
        }
    } else {
        res.sendStatus(404)
    }
})



postsRouter.delete('/:id', basicAuth({users: admins}), async (req: TypeOfRequestP<{ id: string }>, res: Response) => {
    res.sendStatus(await postsService.delete(req))
})


