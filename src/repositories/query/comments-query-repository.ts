import { DB } from '../mongo-db'
import {
    CommentViewModel,
    Paginator,
    TypeOfRequestP_Query
} from '../../types/models'
import { setDefault } from '../../utils/setDefault'

export const commentsQueryRepo = {

    async get(id: string): Promise<CommentViewModel | null> {
        return await DB.getOne('comments', {id: id}, { postId: 0 }) as CommentViewModel | null
    },

    async getAllByPost(req: TypeOfRequestP_Query<{ id: string }, {
        sortBy: string,
        sortDirection: string,
        pageNumber: string,
        pageSize: string }>): Promise<Paginator<CommentViewModel | null>> {

        const sortBy = setDefault(req.query.sortBy, 'createdAt')
        const sortDirection = setDefault(req.query.sortDirection, 'desc')
        const pageNumber = parseInt( setDefault(req.query.pageNumber, 1), 10 )
        const pageSize = parseInt( setDefault(req.query.pageSize, 10), 10 )

        const resCount = await DB.countResults('comments', {postId: req.params.id})
        const pCount = Math.ceil(resCount / pageSize)
        const S = (pageNumber - 1) * pageSize
        const L = pageSize

        const page: Paginator<CommentViewModel | null> = {
            pagesCount: pCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: resCount,
            items: await DB.getAll('comments', {postId: req.params.id},
                { postId: 0 }, {[sortBy]: sortDirection}, S, L) as Array<CommentViewModel | null>
        }

        return page
    },

    async exists(id: string): Promise<boolean> {
        return DB.exists('comments', id)
    }

}


