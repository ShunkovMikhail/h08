import { emailAdapter } from '../adapters/email-adapter'
import { baseUrl } from '../app'

export const emailManager = {
    async accountConfirmation(email: string, code: string) {
        await emailAdapter.send(email, 'Confirm your email',
            " <h1>Thank for your registration</h1>\n" +
            " <p>To finish registration please follow the link below:\n" +
            "     <a href='" + baseUrl + "/auth/confirm-email?code=" + code + "'>complete registration</a>\n" +
            " </p>\n"
        )
    }
}