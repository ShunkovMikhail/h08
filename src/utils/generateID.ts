import { v4 as uuid } from 'uuid'
import { setDefault } from './setDefault'

export const generateID = {

    uu() {
        return uuid()
    },

    pretty(length?: number) {
        setDefault(length, 33)
        const id = uuid()
        return id.replace(/-/g, '').slice(0, length)
    }

}