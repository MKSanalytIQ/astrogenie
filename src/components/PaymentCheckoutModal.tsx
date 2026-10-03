import React, { useState } from 'react';
import { PaymentMethod, PaymentTransaction } from '../types/saas';
import { X, ShieldCheck, CheckCircle2, Lock, ArrowRight, RefreshCw, QrCode, CreditCard, Building2, Smartphone } from 'lucide-react';

interface CheckoutItem {
  id: string;
  title: string;
  price: number;
  type: 'subscription' | 'report_pdf' | 'matchmaking_pdf' | 'puja_booking' | 'urgent_credits';
  planId?: string;
}

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CheckoutItem;
  onPaymentSuccess: (transaction: PaymentTransaction) => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  item,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('qr');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('321');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successTxn, setSuccessTxn] = useState<PaymentTransaction | null>(null);

  if (!isOpen) return null;

  // Calculate pricing breakdown
  const gstRate = 0.18;
  const netAmount = Math.round((item.price / (1 + gstRate)) * 100) / 100;
  const gstAmount = Math.round((item.price - netAmount) * 100) / 100;

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const txn: PaymentTransaction = {
        id: 'txn_' + Date.now(),
        orderId: 'ORD-ASTRO-' + Math.floor(100000 + Math.random() * 900000),
        amount: item.price,
        currency: 'INR',
        status: 'success',
        itemName: item.title,
        itemType: item.type,
        planId: item.planId,
        date: new Date().toISOString(),
        paymentMethod: selectedMethod,
        paymentDetails: {
          upiId: selectedMethod === 'upi' ? upiId : undefined,
          cardLast4: selectedMethod === 'card' ? '8921' : undefined,
          bankName: selectedMethod === 'netbanking' ? selectedBank : undefined,
        },
        invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
        gstAmount,
        netAmount,
      };

      setIsProcessing(false);
      setSuccessTxn(txn);
      onPaymentSuccess(txn);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0B0F19] border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {successTxn ? (
          /* Payment Success Confirmation Screen */
          <div className="text-center py-6 space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-3xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                PAYMENT SUCCESSFUL
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 mt-1">
                Har Har Mahadev! Payment Verified
              </h2>
              <p className="text-xs text-stone-300 mt-1">
                Your order for <strong className="text-amber-300">{successTxn.itemName}</strong> is active.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-stone-950 border border-stone-800 text-left text-xs space-y-2">
              <div className="flex justify-between text-stone-400">
                <span>Transaction ID:</span>
                <span className="font-mono text-stone-200">{successTxn.id}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Order Reference:</span>
                <span className="font-mono text-stone-200">{successTxn.orderId}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Invoice Number:</span>
                <span className="font-mono text-stone-200">{successTxn.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Amount Paid:</span>
                <span className="font-bold text-amber-300">₹{successTxn.amount}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>GST (18% included):</span>
                <span>₹{successTxn.gstAmount}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Payment Mode:</span>
                <span className="uppercase text-stone-200">{successTxn.paymentMethod}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20"
              >
                Access My Purchase Now →
              </button>
            </div>
          </div>
        ) : (
          /* Payment Selection Form */
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider mb-2">
                <Lock className="w-3 h-3" />
                <span>256-bit Bank Grade Encrypted Checkout</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-stone-100">
                Secure Checkout & Instant Activation
              </h2>
              <p className="text-xs text-stone-400">
                Complete your order with instant access to your Vedic Astrologer features.
              </p>
            </div>

            {/* Order Summary Strip */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400">Selected Item</span>
                <div className="font-serif text-sm font-bold text-stone-100">{item.title}</div>
                <div className="text-[10px] text-stone-400">Includes 18% GST • Instant Access</div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-amber-300 font-serif">₹{item.price}</span>
                <span className="block text-[10px] text-stone-400">Total Payable</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('upi')}
                className={`py-3 px-2 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                  selectedMethod === 'upi'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold shadow-sm'
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:border-stone-700'
                }`}
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`py-3 px-2 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                  selectedMethod === 'card'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold shadow-sm'
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:border-stone-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Card (Debit/Credit)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('netbanking')}
                className={`py-3 px-2 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                  selectedMethod === 'netbanking'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold shadow-sm'
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:border-stone-700'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Net Banking</span>
              </button>
            </div>

            {/* Payment Method Forms */}
            {selectedMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-200">Pay via Instant UPI</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-stone-900 px-2 py-0.5 rounded text-amber-300 font-mono">GPay</span>
                    <span className="text-[10px] bg-stone-900 px-2 py-0.5 rounded text-purple-300 font-mono">PhonePe</span>
                    <span className="text-[10px] bg-stone-900 px-2 py-0.5 rounded text-sky-300 font-mono">Paytm</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setUpiApp('qr')}
                    className={`py-2 rounded-xl border flex items-center justify-center gap-1.5 ${
                      upiApp === 'qr' ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold' : 'bg-stone-900 border-stone-800 text-stone-400'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Scan QR Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiApp('gpay')}
                    className={`py-2 rounded-xl border flex items-center justify-center gap-1.5 ${
                      upiApp !== 'qr' ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold' : 'bg-stone-900 border-stone-800 text-stone-400'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Enter UPI ID</span>
                  </button>
                </div>

                {upiApp === 'qr' ? (
                  <div className="text-center py-3 space-y-2">
                    {/* Simulated High-Res UPI QR Code */}
                    <div className="inline-block p-3 rounded-2xl bg-white shadow-md">
                      <div className="w-32 h-32 bg-stone-100 flex items-center justify-center border-2 border-stone-900 rounded-lg p-2">
                        <QrCode className="w-24 h-24 text-stone-900" />
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Scan with any UPI App (GPay, PhonePe, Paytm, BHIM) to pay <strong className="text-amber-300">₹{item.price}</strong>
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Your Virtual Payment Address (UPI ID)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="mobilenumber@upi or name@okaxis"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {selectedMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-200">Debit or Credit Card</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-mono">
                    <span>RuPay</span> • <span>Visa</span> • <span>Mastercard</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-stone-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-1">Valid Thru (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'netbanking' && (
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="text-xs font-bold text-stone-200">Select Bank</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBank(b)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition ${
                        selectedBank === b
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Contacting Bank & Activating...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{item.price} & Activate Instantly</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Security Guarantee Footer */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 pt-2 border-t border-stone-800/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>PCI-DSS Level 1 Compliant • 100% Refund Guarantee if not satisfied</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
