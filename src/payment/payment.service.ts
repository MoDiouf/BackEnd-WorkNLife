import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymentService {
  private readonly masterKey = process.env.PAYDUNYA_MASTER_KEY;
  private readonly privateKey = process.env.PAYDUNYA_PRIVATE_KEY;
  private readonly token = process.env.PAYDUNYA_TOKEN;
  private readonly mode = process.env.PAYDUNYA_MODE || 'test';

  private get apiBaseUrl() {
    return this.mode === 'live'
      ? 'https://app.paydunya.com/api/v1'
      : 'https://app.paydunya.com/sandbox-api/v1';
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      'PAYDUNYA-MASTER-KEY': this.masterKey,
      'PAYDUNYA-PRIVATE-KEY': this.privateKey,
      'PAYDUNYA-TOKEN': this.token,
    };
  }

  /** ✅ Créer une facture */
  async createInvoice(data: {
    total_amount: number;
    description: string;
    customer?: { name?: string; email?: string; phone?: string };
    cancel_url?: string;
    return_url?: string;
    callback_url?: string;
  }) {
const baseUrl = 'https://f27a88503f29.ngrok-free.app';

const payload = {
  invoice: {
    total_amount: data.total_amount,
    description: data.description,
    customer: data.customer,
  },
  store: {
    name: 'WorkNLife',
  },
  actions: {
    cancel_url: `${baseUrl}/payment/cancel`,
    return_url: `${baseUrl}/payment/success`,
    callback_url: `${baseUrl}/payment/paydunya/callback`,
  },
};

    const response = await axios.post(
      `${this.apiBaseUrl}/checkout-invoice/create`,
      payload,
      { headers: this.headers },
    );

    return response.data;
  }

  /** 🔎 Vérifier le statut du paiement */
  async confirmPayment(invoiceToken: string) {
    const response = await axios.get(
      `${this.apiBaseUrl}/checkout-invoice/confirm/${invoiceToken}`,
      { headers: this.headers },
    );
    return response.data;
  }
}
