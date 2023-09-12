import nodemailer from 'nodemailer'
import { emailPass } from '../settings'

export const emailAdapter = {

    async send(email: string, subject: string, html: string) {
        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '5p311bm@gmail.com',
                pass: emailPass
            }
        })

        let info = await transport.sendMail({
            from: 'nodemailer <5p311bm@gmail.com>',
            to: email,
            subject: subject,
            html: html
        })
    }

}