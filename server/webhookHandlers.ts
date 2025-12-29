// Referenced from Stripe integration blueprint
import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import { storage } from './storage';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);

    const stripe = await getUncachableStripeClient();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      await getWebhookSecret()
    );

    await WebhookHandlers.handleStripeEvent(event);
  }

  static async handleStripeEvent(event: any): Promise<void> {
    const eventType = event.type;
    const data = event.data.object;

    switch (eventType) {
      case 'checkout.session.completed':
        await WebhookHandlers.handleCheckoutComplete(data);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await WebhookHandlers.handleSubscriptionUpdate(data);
        break;
      case 'customer.subscription.deleted':
        await WebhookHandlers.handleSubscriptionCanceled(data);
        break;
    }
  }

  static async handleCheckoutComplete(session: any): Promise<void> {
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    if (!customerId || !subscriptionId) return;

    const user = await storage.getUserByStripeCustomerId(customerId);
    if (user) {
      await storage.updateUserStripeInfo(user.id, {
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: 'active',
      });
      console.log(`Updated user ${user.id} with subscription ${subscriptionId}`);
    }
  }

  static async handleSubscriptionUpdate(subscription: any): Promise<void> {
    const customerId = subscription.customer;
    const subscriptionId = subscription.id;
    const status = subscription.status;

    if (!customerId) return;

    const user = await storage.getUserByStripeCustomerId(customerId);
    if (user) {
      await storage.updateUserStripeInfo(user.id, {
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: status,
      });
      console.log(`Updated user ${user.id} subscription status to ${status}`);
    }
  }

  static async handleSubscriptionCanceled(subscription: any): Promise<void> {
    const customerId = subscription.customer;

    if (!customerId) return;

    const user = await storage.getUserByStripeCustomerId(customerId);
    if (user) {
      await storage.updateUserStripeInfo(user.id, {
        subscriptionStatus: 'canceled',
      });
      console.log(`User ${user.id} subscription canceled`);
    }
  }
}

async function getWebhookSecret(): Promise<string> {
  const sync = await getStripeSync();
  const webhooks = await sync.listManagedWebhooks();
  if (webhooks && webhooks.length > 0) {
    return webhooks[0].secret;
  }
  throw new Error('No webhook secret found');
}
