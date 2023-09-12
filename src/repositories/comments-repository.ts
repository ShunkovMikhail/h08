import { DB } from './mongo-db'
import { CommentInputModel, CommentViewModel } from '../types/models'
import { generateID } from '../utils/generateID'

export const commentsRepo = {

    async create(input: CommentViewModel) {
        await DB.create('comments', input)
    },

    async update(id: string, input: CommentInputModel) {
        await DB.update('comments', id, input)
    },

    async delete(id: string): Promise<number> {
        return DB.delete('comments', id)
    },

    newID(): string {
        return generateID.pretty()
    }

}


