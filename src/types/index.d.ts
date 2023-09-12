import { UserDataModel } from './models'

declare global {
    namespace Express {
        export interface Request {
            user: UserDataModel | null
        }
    }
}