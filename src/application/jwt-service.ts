import jwt from 'jsonwebtoken'
import { UserDataModel } from '../types/models'
import { jwtSecret } from '../settings'
import {jwtBlacklistRepo} from "../repositories/jwt-blacklist-repository";

export const jwtService = {
    async createToken(user: UserDataModel, duration: string | number): Promise<string> {
        return jwt.sign({userId: user.id}, jwtSecret, {expiresIn: duration})
    },

    async verifyToken(token: string): Promise<string | null> {
        if (await jwtBlacklistRepo.get(token)) {
            try {
                const result: any = jwt.verify(token, jwtSecret)
                return result.userId
            } catch (e) {
                return null
            }
        } else {
            return null
        }
    }
}