import type { SimOrder, StoreAlert, Product, RiskAssessment, RiskLevel, RiskCategory, ActionType } from '@/types';

const storeNames = [
  'Bharat Super Mart - Indiranagar',
  'FreshGo Daily - Koramangala',
  'Kirana Plus - Whitefield',
  'Spencer Express - Jayanagar',
  'QuickMart - HSR Layout',
  'Daily Needs Store - Malleshwaram',
  'BigBasket Local - JP Nagar',
  'Sharma Grocers - RT Nagar',
  'Metro Convenience - Electronic City',
  'Green Leaf Mart - Banashankari',
];

const storeAreas = [
  'Indiranagar', 'Koramangala', 'Whitefield', 'Jayanagar',
  'HSR Layout', 'Malleshwaram', 'JP Nagar', 'RT Nagar',
  'Electronic City', 'Banashankari',
];

const customers = [
  'Arjun R.', 'Priya S.', 'Vikram M.', 'Sneha K.', 'Rahul D.',
  'Anjali P.', 'Karthik N.', 'Divya R.', 'Suresh B.', 'Meera L.',
  'Aditya T.', 'Pooja G.',
];

const orderTimes = [
  '10:24 AM', '10:31 AM', '10:38 AM', '10:45 AM', '10:52 AM',
  '10:58 AM', '11:04 AM', '11:10 AM', '11:15 AM', '11:22 AM',
  '11:28 AM', '11:35 AM',
];

export function analyzeOrder(order: SimOrder): RiskAssessment {
  const factors: RiskAssessment['factors'] = [];

  let invScore = 0;
  const uncertainItems = order.products.filter(p => p.available === 'uncertain');
  const unavailableItems = order.products.filter(p => p.available === 'no');

  if (order.inventoryLastUpdated >= 48) {
    invScore += 40;
    factors.push({
      label: 'Inventory Freshness',
      detail: `Stock last updated ${order.inventoryLastUpdated}h ago — manually maintained, high staleness.`,
      severity: 'critical',
    });
  } else if (order.inventoryLastUpdated >= 24) {
    invScore += 25;
    factors.push({
      label: 'Inventory Freshness',
      detail: `Stock last updated ${order.inventoryLastUpdated}h ago — moderate staleness.`,
      severity: 'warning',
    });
  } else {
    factors.push({
      label: 'Inventory Freshness',
      detail: `Stock last updated ${order.inventoryLastUpdated}h ago — reasonably fresh.`,
      severity: 'info',
    });
  }

  if (unavailableItems.length > 0) {
    invScore += 35;
    factors.push({
      label: 'Product Availability',
      detail: `${unavailableItems.length} item(s) marked unavailable — likely to cause cancellation.`,
      severity: 'critical',
    });
  } else if (uncertainItems.length > 0) {
    invScore += 20;
    factors.push({
      label: 'Product Availability',
      detail: `${uncertainItems.length} item(s) with uncertain availability — substitution or cancellation risk.`,
      severity: 'warning',
    });
  } else {
    factors.push({
      label: 'Product Availability',
      detail: 'All items appear available.',
      severity: 'info',
    });
  }

  if (order.hasHighDemandItem) {
    invScore += 10;
    factors.push({
      label: 'Demand Pressure',
      detail: 'High-demand item detected — stock may deplete between order and packing.',
      severity: 'warning',
    });
  }

  let delayScore = 0;
  const timeRatio = order.currentDeliveryTime / order.estimatedDelivery;
  if (timeRatio >= 1.4) {
    delayScore += 40;
    factors.push({
      label: 'Delivery Progress',
      detail: `${order.currentDeliveryTime} min elapsed vs ${order.estimatedDelivery} min estimate — significantly delayed.`,
      severity: 'critical',
    });
  } else if (timeRatio >= 1.15) {
    delayScore += 25;
    factors.push({
      label: 'Delivery Progress',
      detail: `${order.currentDeliveryTime} min elapsed vs ${order.estimatedDelivery} min estimate — running late.`,
      severity: 'warning',
    });
  } else {
    factors.push({
      label: 'Delivery Progress',
      detail: `${order.currentDeliveryTime} min elapsed vs ${order.estimatedDelivery} min estimate — on track.`,
      severity: 'info',
    });
  }

  if (order.distanceKm > 6) {
    delayScore += 15;
    factors.push({
      label: 'Delivery Distance',
      detail: `${order.distanceKm} km — longer route increases delay exposure.`,
      severity: 'warning',
    });
  }

  const totalScore = invScore + delayScore;

  let overallRisk: RiskLevel = 'LOW';
  if (totalScore >= 55) overallRisk = 'HIGH';
  else if (totalScore >= 30) overallRisk = 'MEDIUM';

  let category: RiskCategory = 'None';
  let explanation = '';
  let recommendedAction = '';

  if (unavailableItems.length > 0) {
    category = 'Cancellation';
    explanation = `${unavailableItems.length} product(s) are marked as unavailable. Combined with ${order.inventoryLastUpdated}h-old inventory data, this order has a high probability of cancellation unless action is taken immediately.`;
    recommendedAction = 'Request stock confirmation from the partner store now. If unconfirmed, offer the customer an alternative product or preemptively cancel to avoid a poor delivery experience.';
  } else if (invScore > delayScore && invScore >= 25) {
    category = 'Inventory Unavailability';
    explanation = `Inventory was last updated ${order.inventoryLastUpdated} hours ago and ${uncertainItems.length} item(s) have uncertain availability. ${order.hasHighDemandItem ? 'A high-demand item is in the order, increasing stock-depletion risk. ' : ''}This order is vulnerable to product unavailability after confirmation.`;
    recommendedAction = 'Request stock confirmation from the partner store before dispatch. Consider routing a low-demand alternative if confirmation is not received within 5 minutes.';
  } else if (delayScore >= 25) {
    category = 'Delivery Delay';
    explanation = `Current delivery time (${order.currentDeliveryTime} min) is significantly over the estimated ${order.estimatedDelivery} min. ${order.distanceKm > 6 ? `The ${order.distanceKm} km delivery distance adds further risk. ` : ''}The customer is likely to experience a late delivery.`;
    recommendedAction = 'Monitor delivery closely. Proactively notify the customer about the potential delay. Consider an alternative fulfilment option (e.g., closer backup store) if available.';
  } else if (uncertainItems.length > 0) {
    category = 'Substitution';
    explanation = `${uncertainItems.length} item(s) have uncertain availability with stale inventory data. If the store cannot confirm stock, substitution may be required, which impacts customer trust.`;
    recommendedAction = 'Request stock confirmation from the partner store. Pre-identify substitute products so a swap can be made quickly if needed.';
  } else {
    category = 'None';
    explanation = 'All indicators are within acceptable range. No preventive action is needed at this time. Continue routine monitoring.';
    recommendedAction = 'No action required. Monitor the order through standard fulfilment.';
  }

  return { overallRisk, category, explanation, recommendedAction, factors };
}

export function getActionType(assessment: RiskAssessment): ActionType {
  if (assessment.recommendedAction.startsWith('Request stock confirmation')) {
    return 'request_confirmation';
  }
  if (assessment.recommendedAction.startsWith('Monitor delivery')) {
    return 'monitor_delivery';
  }
  return 'no_action';
}

interface OrderSeed {
  invHours: number;
  estDelivery: number;
  currentDeliveryTime: number;
  distanceKm: number;
  hasHD: boolean;
  availabilityOverrides: { idx: number; available: Product['available'] }[];
  status: SimOrder['status'];
}

const orderSeeds: OrderSeed[] = [
  // 0: HIGH — stale inventory (72h) + uncertain product + high demand
  { invHours: 72, estDelivery: 30, currentDeliveryTime: 20, distanceKm: 3.2, hasHD: true,
    availabilityOverrides: [{ idx: 0, available: 'uncertain' }], status: 'Monitoring' },
  // 1: HIGH — stale inventory (60h) + unavailable product
  { invHours: 60, estDelivery: 28, currentDeliveryTime: 18, distanceKm: 4.5, hasHD: false,
    availabilityOverrides: [{ idx: 0, available: 'no' }, { idx: 1, available: 'uncertain' }], status: 'Pending' },
  // 2: HIGH — delivery delay (42 vs 35, 7.2km)
  { invHours: 6, estDelivery: 35, currentDeliveryTime: 42, distanceKm: 7.2, hasHD: false,
    availabilityOverrides: [], status: 'Monitoring' },
  // 3: MEDIUM — stale inventory (52h) + uncertain product
  { invHours: 52, estDelivery: 40, currentDeliveryTime: 38, distanceKm: 8.0, hasHD: true,
    availabilityOverrides: [{ idx: 0, available: 'uncertain' }], status: 'Pending' },
  // 4: MEDIUM — delivery delay (38 vs 25, close distance but very late ratio)
  { invHours: 4, estDelivery: 25, currentDeliveryTime: 38, distanceKm: 2.1, hasHD: false,
    availabilityOverrides: [], status: 'Monitoring' },
  // 5: MEDIUM — moderate stale inventory (30h) + uncertain + high demand
  { invHours: 30, estDelivery: 32, currentDeliveryTime: 20, distanceKm: 5.5, hasHD: true,
    availabilityOverrides: [{ idx: 0, available: 'uncertain' }], status: 'Monitoring' },
  // 6: MEDIUM — delivery delay (28 vs 22)
  { invHours: 12, estDelivery: 22, currentDeliveryTime: 28, distanceKm: 2.8, hasHD: false,
    availabilityOverrides: [], status: 'Monitoring' },
  // 7: LOW — stale but all available, fresh enough
  { invHours: 48, estDelivery: 22, currentDeliveryTime: 15, distanceKm: 1.8, hasHD: false,
    availabilityOverrides: [], status: 'Monitoring' },
  // 8: LOW — delivery delay (24 vs 38 — on track, no risk)
  { invHours: 4, estDelivery: 38, currentDeliveryTime: 24, distanceKm: 6.8, hasHD: false,
    availabilityOverrides: [], status: 'Monitoring' },
  // 9: LOW — delivered, all fresh, no risk
  { invHours: 6, estDelivery: 30, currentDeliveryTime: 29, distanceKm: 5.0, hasHD: false,
    availabilityOverrides: [], status: 'Delivered' },
  // 10: LOW — delivered, fresh, on time
  { invHours: 2, estDelivery: 26, currentDeliveryTime: 24, distanceKm: 3.0, hasHD: false,
    availabilityOverrides: [], status: 'Delivered' },
  // 11: LOW — delivered, fresh, short distance
  { invHours: 18, estDelivery: 34, currentDeliveryTime: 30, distanceKm: 7.5, hasHD: false,
    availabilityOverrides: [], status: 'Delivered' },
];

function genProducts(seed: number, overrides: { idx: number; available: Product['available'] }[]): Product[] {
  const productPool = [
    { name: 'Amul Butter 100g', demand: 'high' as const },
    { name: 'Aashirvaad Atta 5kg', demand: 'medium' as const },
    { name: 'Tata Salt 1kg', demand: 'low' as const },
    { name: 'Fresh Milk 1L', demand: 'high' as const },
    { name: 'Basmati Rice 2kg', demand: 'medium' as const },
    { name: 'Tomatoes 1kg', demand: 'high' as const },
    { name: 'Onions 2kg', demand: 'medium' as const },
    { name: 'Fortune Sunflower Oil 1L', demand: 'low' as const },
    { name: 'Nestle Maggi 12 Pack', demand: 'medium' as const },
    { name: 'Paneer 200g', demand: 'high' as const },
    { name: 'Toor Dal 1kg', demand: 'low' as const },
    { name: 'Britannia Bread', demand: 'medium' as const },
    { name: 'Coca-Cola 750ml', demand: 'low' as const },
    { name: 'Surf Excel Detergent', demand: 'low' as const },
    { name: 'Colgate Toothpaste', demand: 'low' as const },
    { name: 'Organic Bananas 1kg', demand: 'medium' as const },
    { name: 'Mother Dairy Curd 500g', demand: 'high' as const },
    { name: 'Fresh Eggs 6 Pack', demand: 'medium' as const },
  ];

  const count = 2 + (seed % 3);
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    const idx = (seed * 3 + i * 5) % productPool.length;
    const base = productPool[idx];
    const override = overrides.find(o => o.idx === i);
    products.push({
      name: base.name,
      quantity: 1 + (i % 3),
      available: override ? override.available : 'yes',
      demand: base.demand,
    });
  }
  return products;
}

export function getInitialOrders(): SimOrder[] {
  const orders: SimOrder[] = [];
  for (let i = 0; i < orderSeeds.length; i++) {
    const seed = orderSeeds[i];
    const products = genProducts(i + 1, seed.availabilityOverrides);

    const tempOrder = {
      ...({} as SimOrder),
      estimatedDelivery: seed.estDelivery,
      currentDeliveryTime: seed.currentDeliveryTime,
      inventoryLastUpdated: seed.invHours,
      distanceKm: seed.distanceKm,
      hasHighDemandItem: seed.hasHD,
      products,
    };

    const assessment = analyzeOrder(tempOrder);

    orders.push({
      id: `NC-${(1024 + i).toString()}`,
      store: storeNames[i % storeNames.length],
      storeArea: storeAreas[i % storeAreas.length],
      customer: customers[i],
      items: products.length,
      orderTime: orderTimes[i],
      estimatedDelivery: seed.estDelivery,
      currentDeliveryTime: seed.currentDeliveryTime,
      inventoryLastUpdated: seed.invHours,
      distanceKm: seed.distanceKm,
      hasHighDemandItem: seed.hasHD,
      products,
      status: seed.status,
      riskLevel: assessment.overallRisk,
      mainRisk: assessment.category,
      recommendedAction: assessment.recommendedAction,
    });
  }
  return orders;
}

export function getInitialAlerts(orders: SimOrder[]): StoreAlert[] {
  const alerts: StoreAlert[] = [];
  orders.forEach((order) => {
    if (order.status === 'Delivered' || order.status === 'Cancelled') return;

    const uncertainOrNo = order.products.filter(p => p.available !== 'yes');
    const shouldAlert =
      uncertainOrNo.length > 0 ||
      (order.riskLevel === 'HIGH' && order.mainRisk !== 'Delivery Delay');

    if (shouldAlert) {
      const targetProduct = uncertainOrNo[0] || order.products[0];
      const isUnavailable = targetProduct.available === 'no';
      alerts.push({
        id: `alert-${order.id}`,
        store: order.store,
        product: targetProduct.name,
        message: isUnavailable
          ? `Action required: Confirm availability for ${targetProduct.name}`
          : order.hasHighDemandItem
            ? `High-demand item with uncertain inventory: ${targetProduct.name}`
            : `Verify stock for ${targetProduct.name} — inventory not updated in ${order.inventoryLastUpdated}h`,
        orderId: order.id,
        demand: targetProduct.demand,
        status: 'Pending',
      });
    }
  });
  return alerts;
}
