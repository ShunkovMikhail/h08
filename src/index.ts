import { serverApp } from './app'
import { runDb } from './repositories/connection'
const port = 5000

const startApp = async () => {
    await runDb()
    serverApp(port)
}

startApp()

module.exports = serverApp