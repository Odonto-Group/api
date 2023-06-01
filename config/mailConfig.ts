import Env from '@ioc:Adonis/Core/Env'
import { mailConfig } from '@adonisjs/mail/build/config'

export default mailConfig({
    mailer: 'smtp',
    mailers: {
        smtp: {
        driver: 'smtp',
        host: Env.get('MAIL_HOST'),
        port: Env.get('MAIL_PORT'),
        secure: Env.get('MAIL_ENCRYPTION'),
        auth: {
            user: Env.get('MAIL_USERNAME'),
            pass: Env.get('MAIL_PASSWORD'),
        },
        },
    },
})