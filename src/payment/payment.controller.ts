import { Controller, Post, Get, Body, Param, Req, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createInvoice(@Body() body) {
    return this.paymentService.createInvoice(body);
  }

  @Get('success')
  async paymentSuccess(@Query('token') token: string) {
    // Ici tu peux vérifier le statut via PayDunya
    // ou juste afficher un message de succès
    return {
      message: 'Paiement réussi !',
      invoice_token: token,
    };
  }

  // Endpoint redirection après annulation
  @Get('cancel')
  async paymentCancel() {
    return { message: 'Paiement annulé par l’utilisateur.' };
  }
}
