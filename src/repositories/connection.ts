import { MongoClient } from 'mongodb'
import { mongoURI } from '../settings'

export const client = new MongoClient(mongoURI)

export async function runDb() {
    try {
        await client.connect()
        await client.db('data').command({ ping: 1 })
        console.log('DB: Connected!')
    } catch {
        console.log('DB: Error!')
        await client.close()
    }
}