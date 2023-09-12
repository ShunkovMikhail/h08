import { DB } from './mongo-db'
import { PostInputModel, PostViewModel } from '../types/models'
import { generateID } from '../utils/generateID'

export const postsRepo = {

    async create(input: PostViewModel) {
        await DB.create('posts', input)
    },

    async update(id: string, input: PostInputModel) {
        await DB.update('posts', id, input)
    },

    async delete(id: string): Promise<number> {
        return DB.delete('posts', id)
    },

    newID(): string {
        return generateID.pretty(16)
    }

}


