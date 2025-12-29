// Update FlightFuel Premium prices
// Run with: npx tsx scripts/update-prices.ts

import { getUncachableStripeClient } from '../server/stripeClient';

async function updatePrices() {
  const stripe = await getUncachableStripeClient();

  try {
    const existing = await stripe.products.search({ query: "name:'FlightFuel Premium'" });
    if (existing.data.length === 0) {
      console.log('No FlightFuel Premium product found. Run seed-products.ts first.');
      return;
    }

    const product = existing.data[0];
    console.log('Found product:', product.id);

    const prices = await stripe.prices.list({ product: product.id, active: true });
    console.log('Current prices:', prices.data.map(p => ({ 
      id: p.id, 
      amount: p.unit_amount,
      interval: p.recurring?.interval 
    })));

    // Archive old prices
    for (const price of prices.data) {
      await stripe.prices.update(price.id, { active: false });
      console.log('Archived price:', price.id);
    }

    // Create new monthly price at $49.99
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 4999,
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: { plan: 'monthly' }
    });
    console.log('Created new monthly price:', monthlyPrice.id, '($49.99/month)');

    // Create new yearly price at $399.99 (save ~33%)
    const yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 39999,
      currency: 'usd',
      recurring: { interval: 'year' },
      metadata: { plan: 'yearly' }
    });
    console.log('Created new yearly price:', yearlyPrice.id, '($399.99/year - save ~33%)');

    console.log('\nPrice update complete!');
    console.log('New Monthly price ID:', monthlyPrice.id);
    console.log('New Yearly price ID:', yearlyPrice.id);
  } catch (error) {
    console.error('Error updating prices:', error);
  }
}

updatePrices();
