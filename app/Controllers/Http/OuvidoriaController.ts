import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { inject } from '@adonisjs/fold';
import { MailSenderService } from 'App/Services/MailSenderService';
import OuvidoriaFormValidator from 'App/Validators/OuvidoriaFormValidator';

@inject()
export default class OuvidoriaController {
  constructor(
    private readonly mailSenderService: MailSenderService,
  ) { }

  async receiveForm({ request, response }: HttpContextContract) {
    const data = await request.validate(OuvidoriaFormValidator);

    await this.mailSenderService.sendOuvidoria(data);

    return response.json({ message: 'Mensagem enviada!' });
  }
}
