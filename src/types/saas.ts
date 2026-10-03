export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number; // in INR (₹)
  currency: 'INR' | 'USD';
  status: 'success' | 'pending' | 'failed';
  itemName: string;
  itemType: 'subscription' | 'report_pdf' | 'matchmaking_pdf' | 'puja_booking' | 'urgent_credits';
  planId?: string;
  date: string;
  paymentMethod: PaymentMethod;
  paymentDetails: {
    upiId?: string;
    cardLast4?: string;
    bankName?: string;
  };
  invoiceNumber: string;
  gstAmount: number; // 18% GST breakdown
  netAmount: number;
}

export interface AddonService {
  id: string;
  title: string;
  sanskritTitle: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  type: 'report_pdf' | 'matchmaking_pdf' | 'puja_booking' | 'urgent_credits';
  icon: string;
  badge?: string;
  deliveryTime: string;
  features: string[];
}

export interface UserBillingState {
  planId: 'free' | 'starter' | 'pro' | 'annual';
  creditsRemaining: number; // e.g. 5, or 9999 for unlimited
  isUnlimited: boolean;
  renewsOn: string;
  transactions: PaymentTransaction[];
  purchasedReports: string[]; // Report IDs unlocked
  savedCards: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  }[];
}
