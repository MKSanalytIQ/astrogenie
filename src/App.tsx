import React, { useState, useEffect } from 'react';
import { VedicKundli, ChatMessage, MembershipPlan } from './types/astrology';
import { PaymentTransaction, UserBillingState, AddonService } from './types/saas';
import { SupportedLanguage } from './i18n/translations';
import { SAMPLE_KUNDLIS, MEMBERSHIP_PLANS } from './data/defaultKundlis';
import { ADDON_SERVICES } from './data/addonServices';
import { Header } from './components/Header';
import { RevenueBanner } from './components/RevenueBanner';
import { AstrologerChat } from './components/AstrologerChat';
import { KundliView } from './components/KundliView';
import { MatchMakingStudio } from './components/MatchMakingStudio';
import { PrashnaKundliStudio } from './components/PrashnaKundliStudio';
import { HoroscopeAndMuhurat } from './components/HoroscopeAndMuhurat';
import { RemediesVault } from './components/RemediesVault';
import { SadeSatiAndTransitStudio } from './components/SadeSatiAndTransitStudio';
import { AddonServicesStore } from './components/AddonServicesStore';
import { MembershipPlansModal } from './components/MembershipPlansModal';
import { BirthDetailsModal } from './components/BirthDetailsModal';
import { PaymentCheckoutModal } from './components/PaymentCheckoutModal';
import { JanampatriPdfReportModal } from './components/JanampatriPdfReportModal';
import { OrdersAndBillingModal } from './components/OrdersAndBillingModal';
import { WhatsAppAlertsModal } from './components/WhatsAppAlertsModal';
import { AuthModal } from './components/AuthModal';
import { VoiceConsultationModal } from './components/VoiceConsultationModal';
import { auth } from './firebase';
import { onAuthStateChanged, signOut as fbSignOut, User } from 'firebase/auth';
import { 
  saveUserKundli, 
  getUserKundlis, 
  saveConsultationMessage, 
  getUserConsultations, 
  saveUserProfile 
} from './services/astroFirestore';

export default function App() {
  // Current Authenticated User (Firebase Auth)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Language State (en, hi, gu, mr, ta, te)
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('astrogenie_language');
      if (saved && ['en', 'hi', 'gu', 'mr', 'ta', 'te'].includes(saved)) {
        return saved as SupportedLanguage;
      }
    } catch (e) {
      console.error('Error loading language:', e);
    }
    return 'en';
  });

  // Saved Kundlis in state (with localStorage persistence)
  const [kundlis, setKundlis] = useState<VedicKundli[]>(() => {
    try {
      const saved = localStorage.getItem('astrogenie_kundlis');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading kundlis from localStorage:', e);
    }
    return SAMPLE_KUNDLIS;
  });

  // Active Kundli ID
  const [activeKundliId, setActiveKundliId] = useState<string>(() => {
    return kundlis[0]?.id || SAMPLE_KUNDLIS[0].id;
  });

  const activeKundli = kundlis.find((k) => k.id === activeKundliId) || kundlis[0] || SAMPLE_KUNDLIS[0];

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'chat' | 'kundli' | 'matching' | 'prashna' | 'transits' | 'horoscope' | 'remedies' | 'store'>('chat');

  // Consultation Chat History (with localStorage persistence)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('astrogenie_chat_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading chat history:', e);
    }
    return [];
  });

  const [isChatLoading, setIsChatLoading] = useState(false);
  const [prefillQuery, setPrefillQuery] = useState<string | undefined>(undefined);

  // Membership Plan state (defaulting to Kalyan Pro ₹499/mo)
  const [userPlan, setUserPlan] = useState<MembershipPlan>(() => {
    try {
      const saved = localStorage.getItem('astrogenie_user_plan');
      if (saved) {
        const found = MEMBERSHIP_PLANS.find((p) => p.id === saved);
        if (found) return found;
      }
    } catch (e) {
      console.error('Error loading user plan:', e);
    }
    return MEMBERSHIP_PLANS[1]; // Kalyan Pro (₹499/mo)
  });

  // Billing and Customer Account State
  const [billingState, setBillingState] = useState<UserBillingState>(() => {
    try {
      const saved = localStorage.getItem('astrogenie_billing_state');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading billing state:', e);
    }
    return {
      planId: 'pro',
      creditsRemaining: 9999, // Unlimited for Kalyan Pro
      isUnlimited: true,
      renewsOn: '2026-11-02',
      transactions: [
        {
          id: 'txn_init_01',
          orderId: 'ORD-ASTRO-849102',
          amount: 499,
          currency: 'INR',
          status: 'success',
          itemName: 'Kalyan Pro Membership (1 Month)',
          itemType: 'subscription',
          planId: 'pro',
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          paymentMethod: 'upi',
          paymentDetails: { upiId: 'seeker@okaxis' },
          invoiceNumber: 'INV-2026-9182',
          gstAmount: 76.12,
          netAmount: 422.88,
        }
      ],
      purchasedReports: ['addon-janampatri-pdf'],
      savedCards: []
    };
  });

  // Modals state
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isNewKundliModalOpen, setIsNewKundliModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false);
  
  // Checkout Modal State
  const [checkoutItem, setCheckoutItem] = useState<{
    isOpen: boolean;
    id: string;
    title: string;
    price: number;
    type: 'subscription' | 'report_pdf' | 'matchmaking_pdf' | 'puja_booking' | 'urgent_credits';
    planId?: string;
  }>({
    isOpen: false,
    id: '',
    title: '',
    price: 0,
    type: 'subscription',
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Save basic profile
        await saveUserProfile(user.uid, {
          email: user.email || 'anonymous@astrogenie.ai',
          displayName: user.displayName || 'Vedic Seeker',
          photoURL: user.photoURL || undefined,
        });

        // Load user's saved Kundlis from Firestore
        try {
          const userKundlis = await getUserKundlis(user.uid);
          if (userKundlis && userKundlis.length > 0) {
            setKundlis((prev) => {
              const ids = new Set(userKundlis.map((k) => k.id));
              const filteredPrev = prev.filter((k) => !ids.has(k.id));
              return [...userKundlis, ...filteredPrev];
            });
            setActiveKundliId(userKundlis[0].id);
          } else {
            // First time user: Prompt them to enter birth particulars (DOB, Time, Place)
            setIsNewKundliModalOpen(true);
          }

          // Load past consultations
          const userChats = await getUserConsultations(user.uid);
          if (userChats && userChats.length > 0) {
            setChatHistory(userChats);
          }
        } catch (e) {
          console.warn('Firestore fetch notice:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('astrogenie_language', currentLanguage);
    } catch (e) {
      console.error('Failed to sync language:', e);
    }
  }, [currentLanguage]);

  useEffect(() => {
    try {
      localStorage.setItem('astrogenie_kundlis', JSON.stringify(kundlis));
    } catch (e) {
      console.error('Failed to sync kundlis:', e);
    }
  }, [kundlis]);

  useEffect(() => {
    try {
      localStorage.setItem('astrogenie_chat_history', JSON.stringify(chatHistory));
    } catch (e) {
      console.error('Failed to sync chat history:', e);
    }
  }, [chatHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('astrogenie_user_plan', userPlan.id);
    } catch (e) {
      console.error('Failed to sync user plan:', e);
    }
  }, [userPlan]);

  useEffect(() => {
    try {
      localStorage.setItem('astrogenie_billing_state', JSON.stringify(billingState));
    } catch (e) {
      console.error('Failed to sync billing state:', e);
    }
  }, [billingState]);

  // Handle Astrologer Chat Message Send
  const handleSendMessage = async (text: string, category: 'career' | 'business' | 'marriage' | 'health' | 'remedies' | 'general') => {
    if (!billingState.isUnlimited && billingState.creditsRemaining <= 0) {
      setIsPricingModalOpen(true);
      return;
    }

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category,
    };

    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setIsChatLoading(true);

    // Save to Firestore if signed in
    if (currentUser) {
      saveConsultationMessage(currentUser.uid, userMsg, activeKundli.id).catch(console.warn);
    }

    if (!billingState.isUnlimited) {
      setBillingState((prev) => ({
        ...prev,
        creditsRemaining: Math.max(0, prev.creditsRemaining - 1),
      }));
    }

    try {
      const res = await fetch('/api/astrologer-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          activeKundli,
          chatHistory: newHistory.slice(-6),
          category,
          language: currentLanguage,
        }),
      });

      const data = await res.json();

      if (data?.reply) {
        const astrologerMsg: ChatMessage = {
          id: 'msg-astro-' + Date.now(),
          sender: 'astrologer',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: data.category || category,
          suggestedUpay: data.suggestedUpay,
          chartReference: data.chartReference,
        };
        setChatHistory([...newHistory, astrologerMsg]);

        // Save to Firestore if signed in
        if (currentUser) {
          saveConsultationMessage(currentUser.uid, astrologerMsg, activeKundli.id).catch(console.warn);
        }
      }
    } catch (err) {
      console.error('Error getting astrologer response:', err);
      const fallbackMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        sender: 'astrologer',
        text: `Namaste ${activeKundli.birthDetails.name}. Based on your ${activeKundli.ascendant.sign} Lagna and ${activeKundli.currentDasha.mahadasha} Dasha, celestial benefics are realigning in your favor. Recite "Om Namah Shivaya" 108 times daily facing East and practice Anna Daan.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category,
        suggestedUpay: {
          mantra: 'Om Namah Shivaya (ॐ नमः शिवाय)',
          charity: 'Donate whole wheat or feed cows on Friday',
        },
      };
      setChatHistory([...newHistory, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Cross-view trigger to consult Astrologer about a specific topic
  const handleAskAboutTopic = (topic: string) => {
    setPrefillQuery(topic);
    setActiveTab('chat');
  };

  // When user inputs DOB, Time & Place and creates their Janam Kundli
  const handleKundliCreated = async (newKundli: VedicKundli) => {
    setKundlis((prev) => [newKundli, ...prev]);
    setActiveKundliId(newKundli.id);

    // Save permanently to Firestore if signed in
    if (currentUser) {
      await saveUserKundli(currentUser.uid, newKundli).catch(console.warn);
      await saveUserProfile(currentUser.uid, {
        email: currentUser.email || 'anonymous@astrogenie.ai',
        displayName: currentUser.displayName || newKundli.birthDetails.name,
        birthDetails: newKundli.birthDetails,
        activeKundliId: newKundli.id,
      }).catch(console.warn);
    }

    // Automatically welcome the native with personal Astrologer guidance!
    const welcomeMsg: ChatMessage = {
      id: 'msg-welcome-' + Date.now(),
      sender: 'astrologer',
      text: `Pranam ${newKundli.birthDetails.name} Ji! 🕉️\n\nYour authentic Vedic Janam Kundli has been calculated adhering to Lahiri Ayanamsha.\n\n• **Lagna (Ascendant):** ${newKundli.ascendant.sign} (${newKundli.ascendant.degree.toFixed(1)}°)\n• **Moon Sign (Rashi):** ${newKundli.moonSign.sign}\n• **Janam Nakshatra:** ${newKundli.moonSign.nakshatra} (Pada ${newKundli.moonSign.pada})\n• **Active Mahadasha:** ${newKundli.currentDasha.mahadasha} - ${newKundli.currentDasha.antardasha}\n\nI am Acharya AstroGenie, your personal Vedic counselor. What area of your life would you like guidance on today? Career promotion, business ventures, marriage timing, or personal Vedic remedies (Upay)?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'general',
      suggestedUpay: {
        mantra: `Om Namah Shivaya (ॐ नमः शिवाय)`,
        gemstone: `${newKundli.ascendant.sign === 'Simha' ? 'Ruby (Manik)' : newKundli.ascendant.sign === 'Tula' ? 'Diamond / White Zircon' : 'Yellow Sapphire (Pukhraj)'}`,
      },
      chartReference: `${newKundli.ascendant.sign} Lagna / ${newKundli.currentDasha.mahadasha} Dasha`
    };

    setChatHistory((prev) => [...prev, welcomeMsg]);

    // Save welcome message to Firestore
    if (currentUser) {
      saveConsultationMessage(currentUser.uid, welcomeMsg, newKundli.id).catch(console.warn);
    }

    // Automatically switch to chat tab with astrologer
    setActiveTab('chat');
  };

  const handleSignOut = async () => {
    await fbSignOut(auth);
    setCurrentUser(null);
  };

  // Trigger Checkout for Subscription Plan
  const handleSelectPlanForCheckout = (plan: MembershipPlan) => {
    setCheckoutItem({
      isOpen: true,
      id: plan.id,
      title: `${plan.name} (${plan.sanskritName}) - 1 Month Access`,
      price: plan.pricePerMonth,
      type: 'subscription',
      planId: plan.id,
    });
  };

  // Trigger Checkout for Add-on Store Item
  const handleSelectAddonForCheckout = (service: AddonService) => {
    setCheckoutItem({
      isOpen: true,
      id: service.id,
      title: service.title,
      price: service.salePrice,
      type: service.type,
    });
  };

  // On Payment Completed
  const handlePaymentSuccess = (txn: PaymentTransaction) => {
    if (txn.itemType === 'subscription' && txn.planId) {
      const plan = MEMBERSHIP_PLANS.find((p) => p.id === txn.planId) || MEMBERSHIP_PLANS[1];
      setUserPlan(plan);
      setBillingState((prev) => ({
        ...prev,
        planId: plan.id as any,
        isUnlimited: plan.id === 'pro' || plan.id === 'annual',
        creditsRemaining: plan.id === 'pro' || plan.id === 'annual' ? 9999 : 5,
        transactions: [txn, ...prev.transactions],
      }));
    } else if (txn.itemType === 'urgent_credits') {
      setBillingState((prev) => ({
        ...prev,
        creditsRemaining: prev.creditsRemaining + 10,
        transactions: [txn, ...prev.transactions],
      }));
    } else {
      setBillingState((prev) => ({
        ...prev,
        purchasedReports: [...prev.purchasedReports, txn.itemName],
        transactions: [txn, ...prev.transactions],
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      
      {/* Top Conversion Ribbon */}
      <RevenueBanner
        onClaimOffer={() =>
          handleSelectPlanForCheckout({
            ...MEMBERSHIP_PLANS[1],
            pricePerMonth: 299, // Special promotional first month discount
          })
        }
      />

      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeKundli={activeKundli}
        allKundlis={kundlis}
        onSelectKundli={(k) => setActiveKundliId(k.id)}
        onOpenNewKundliModal={() => setIsNewKundliModalOpen(true)}
        onOpenPricingModal={() => setIsPricingModalOpen(true)}
        onOpenBillingModal={() => setIsBillingModalOpen(true)}
        onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        currentUser={currentUser}
        userPlan={userPlan}
        creditsRemaining={billingState.creditsRemaining}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'chat' && (
          <AstrologerChat
            activeKundli={activeKundli}
            chatHistory={chatHistory}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
            userPlan={userPlan}
            onOpenPricingModal={() => setIsPricingModalOpen(true)}
            onStartVoiceCall={() => setIsVoiceCallOpen(true)}
            prefillQuery={prefillQuery}
            onClearPrefillQuery={() => setPrefillQuery(undefined)}
          />
        )}

        {activeTab === 'kundli' && (
          <KundliView
            kundli={activeKundli}
            onAskAstrologerAboutTopic={handleAskAboutTopic}
          />
        )}

        {activeTab === 'matching' && (
          <MatchMakingStudio
            onAskAstrologerAboutMarriage={handleAskAboutTopic}
          />
        )}

        {activeTab === 'prashna' && (
          <PrashnaKundliStudio />
        )}

        {activeTab === 'transits' && (
          <SadeSatiAndTransitStudio
            kundli={activeKundli}
            onAskAstrologerAboutTransit={handleAskAboutTopic}
            onStartVoiceCall={() => setIsVoiceCallOpen(true)}
          />
        )}

        {activeTab === 'horoscope' && (
          <HoroscopeAndMuhurat
            onAskAstrologerAboutHoroscope={handleAskAboutTopic}
          />
        )}

        {activeTab === 'remedies' && (
          <RemediesVault
            kundli={activeKundli}
            onAskAstrologerAboutRemedy={handleAskAboutTopic}
          />
        )}

        {activeTab === 'store' && (
          <AddonServicesStore
            onSelectItemForCheckout={handleSelectAddonForCheckout}
            onPreviewReport={() => setIsPdfModalOpen(true)}
          />
        )}

      </main>

      {/* Mobile Quick Action Pill */}
      <div className="lg:hidden sticky bottom-0 z-30 bg-[#0C101D]/95 border-t border-amber-900/30 px-4 py-3 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xl">🕉️</span>
          <div className="text-left">
            <div className="text-[10px] text-amber-400 font-bold uppercase">{userPlan.name}</div>
            <div className="text-xs text-stone-200 font-semibold">
              {billingState.isUnlimited ? 'Unlimited Consultations' : `${billingState.creditsRemaining} Credits Left`}
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('chat')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20"
        >
          Talk to Astrologer
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950/80 py-8 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-amber-300 text-sm">AstroGenie AI</span>
            <span>•</span>
            <span>Personal Vedic Astrologer & Kundli Counselor SaaS</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>Plans: ₹299 – ₹499/mo</span>
            <span>•</span>
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-medium underline"
            >
              Membership Plans
            </button>
            <span>•</span>
            <button
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="text-[#25D366] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>WhatsApp Alerts</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="text-stone-300 hover:text-amber-300"
            >
              Printable Janampatri
            </button>
            <span>•</span>
            <button
              onClick={() => setIsBillingModalOpen(true)}
              className="text-stone-300 hover:text-amber-300"
            >
              Invoices & Billing
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      <MembershipPlansModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        currentPlan={userPlan}
        onSelectPlan={(plan) => handleSelectPlanForCheckout(plan)}
      />

      <BirthDetailsModal
        isOpen={isNewKundliModalOpen}
        onClose={() => setIsNewKundliModalOpen(false)}
        onKundliCreated={handleKundliCreated}
      />

      <PaymentCheckoutModal
        isOpen={checkoutItem.isOpen}
        onClose={() => setCheckoutItem((prev) => ({ ...prev, isOpen: false }))}
        item={checkoutItem}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <JanampatriPdfReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        kundli={activeKundli}
      />

      <OrdersAndBillingModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
        billingState={billingState}
        currentPlan={userPlan}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenStore={() => setActiveTab('store')}
      />

      <WhatsAppAlertsModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        defaultRashi={activeKundli.moonSign.sign}
        nativeName={activeKundli.birthDetails.name}
      />

      <VoiceConsultationModal
        isOpen={isVoiceCallOpen}
        onClose={() => setIsVoiceCallOpen(false)}
        activeKundli={activeKundli}
        onSendMessage={handleSendMessage}
        chatHistory={chatHistory}
        language={currentLanguage}
      />
    </div>
  );
}
