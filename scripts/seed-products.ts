// Seed script for FlightFuel Premium subscription product
// Run with: npx tsx scripts/seed-products.ts

import { getUncachableStripeClient } from '../server/stripeClient';

async function createProducts() {
  const stripe = await getUncachableStripeClient();

  try {
    const existing = await stripe.products.search({ query: "name:'FlightFuel Premium'" });
    if (existing.data.length > 0) {
      console.log('FlightFuel Premium product already exists:', existing.data[0].id);
      const prices = await stripe.prices.list({ product: existing.data[0].id, active: true });
      console.log('Existing prices:', prices.data.map(p => ({ id: p.id, amount: p.unit_amount })));
      return;
    }

    console.log('Creating FlightFuel Premium product...');
    const product = await stripe.products.create({
      name: 'FlightFuel Premium',
      description: 'Unlock all premium features: AI meal scanning, advanced analytics, personalized training plans, and more.',
      metadata: {
        app: 'flightfuel',
        tier: 'premium',
      }
    });
    console.log('Created product:', product.id);

    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 999,
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: { plan: 'monthly' }
    });
    console.log('Created monthly price:', monthlyPrice.id, '($9.99/month)');

    const yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 7999,
      currency: 'usd',
      recurring: { interval: 'year' },
      metadata: { plan: 'yearly' }
    });
    console.log('Created yearly price:', yearlyPrice.id, '($79.99/year - save 33%)');

    console.log('\nProduct seeding complete!');
    console.log('Monthly price ID:', monthlyPrice.id);
    console.log('Yearly price ID:', yearlyPrice.id);
  } catch (error) {
    console.error('Error creating products:', error);
  }
}

createProducts();
