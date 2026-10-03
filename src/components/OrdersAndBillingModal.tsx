import React from 'react';
import { UserBillingState, PaymentTransaction } from '../types/saas';
import { MembershipPlan } from '../types/astrology';
import { X, Receipt, Crown, Clock, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface OrdersAndBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  billingState: UserBillingState;
  currentPlan: MembershipPlan;
  onOpenPricing: () => void;
  onOpenStore: () => void;
}

export const OrdersAndBillingModal: React.FC<OrdersAndBillingModalProps> = ({
  isOpen,
  onClose,
  billingState,
  currentPlan,
  onOpenPricing,
  onOpenStore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0B0F19] border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 border-b border-stone-800 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Receipt className="w-3.5 h-3.5" />
            <span>Customer Billing & Invoices</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-100">
            Subscription & Transaction History
          </h2>
          <p className="text-xs text-stone-400">
            Manage your personal astrologer plan, transaction receipts, and unlocked dossiers.
          </p>
        </div>

        {/* Active Plan Overview Card */}
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-stone-950 via-amber-950/30 to-stone-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="font-serif font-bold text-base text-stone-100">
                {currentPlan.name}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <div className="text-xs text-stone-400">
              ₹{currentPlan.pricePerMonth}/month • Next billing date: <strong className="text-stone-200">02 Nov 2026</strong>
            </div>
            <div className="text-xs text-amber-300 font-semibold">
              Consultation Credits: {currentPlan.consultationCredits}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenPricing();
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition"
            >
              Change Plan
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenStore();
              }}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-800 text-xs font-semibold transition"
            >
              Store
            </button>
          </div>
        </div>

        {/* Past Invoices & Transactions Table */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-sm font-bold text-stone-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Payment Transactions ({billingState.transactions.length})</span>
            </h3>
            <span className="text-[10px] text-stone-500">All invoices include 18% GST</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950 text-stone-400 uppercase text-[9px] border-b border-stone-800">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Item / Service</th>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800 bg-stone-900/60 font-sans">
                {billingState.transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-stone-800/40">
                    <td className="py-3 px-3 text-stone-400 text-[11px]">
                      {new Date(txn.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-3 font-semibold text-stone-200">
                      {txn.itemName}
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-stone-400">
                      {txn.orderId}
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-300">
                      ₹{txn.amount}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Paid
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer">
                        {txn.invoiceNumber}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security & GST footer */}
        <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>GST Registered Business • Automated Tax Invoices Generated</span>
          </div>
          <span>Need billing help? support@astrogenie.ai</span>
        </div>

      </div>
    </div>
  );
};
