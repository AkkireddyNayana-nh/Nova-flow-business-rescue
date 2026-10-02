export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type RiskCategory =
  | 'Inventory Unavailability'
  | 'Delivery Delay'
  | 'Cancellation'
  | 'Substitution'
  | 'None';

export type OrderStatus =
  | 'Pending'
  | 'Monitoring'
  | 'Confirmed'
  | 'Confirmation Requested'
  | 'Unavailable'
  | 'Delivered'
  | 'Cancelled';

export type AlertStatus = 'Pending' | 'Resolved' | 'Unavailable';

export interface Product {
  name: string;
  quantity: number;
  available: 'yes' | 'uncertain' | 'no';
  demand: 'low' | 'medium' | 'high';
}

export interface SimOrder {
  id: string;
  store: string;
  storeArea: string;
  customer: string;
  items: number;
  orderTime: string;
  estimatedDelivery: number;
  currentDeliveryTime: number;
  inventoryLastUpdated: number;
  distanceKm: number;
  hasHighDemandItem: boolean;
  products: Product[];
  status: OrderStatus;
  riskLevel: RiskLevel;
  mainRisk: RiskCategory;
  recommendedAction: string;
}

export interface StoreAlert {
  id: string;
  store: string;
  product: string;
  message: string;
  orderId: string;
  demand: 'low' | 'medium' | 'high';
  status: AlertStatus;
}

export interface RiskAssessment {
  overallRisk: RiskLevel;
  category: RiskCategory;
  explanation: string;
  recommendedAction: string;
  factors: { label: string; detail: string; severity: 'info' | 'warning' | 'critical' }[];
}

export type ActionType = 'request_confirmation' | 'monitor_delivery' | 'no_action';
