import React, { useState } from 'react';
import { VedicKundli } from '../types/astrology';
import { X, Sparkles, RefreshCw, Calendar, Clock, MapPin, User } from 'lucide-react';

interface BirthDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKundliCreated: (newKundli: VedicKundli) => void;
}

export const BirthDetailsModal: React.FC<BirthDetailsModalProps> = ({
  isOpen,
  onClose,
  onKundliCreated,
}) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [dob, setDob] = useState('1998-08-15');
  const [tob, setTob] = useState('09:45');
  const [pob, setPob] = useState('New Delhi, India');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const popularCities = [
    'New Delhi, Delhi, India',
    'Mumbai, Maharashtra, India',
    'Bengaluru, Karnataka, India',
    'Hyderabad, Telangana, India',
    'Kolkata, West Bengal, India',
    'Chennai, Tamil Nadu, India',
    'Pune, Maharashtra, India',
    'Ahmedabad, Gujarat, India',
    'Jaipur, Rajasthan, India',
    'Varanasi, Uttar Pradesh, India',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dob || !tob || !pob.trim()) {
      setErrorMsg('Please fill in all birth details for exact planetary degree calculation.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/generate-kundli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          gender,
          dateOfBirth: dob,
          timeOfBirth: tob,
          placeOfBirth: pob.trim(),
        }),
      });

      const data = await res.json();
      if (data?.plan) {
        onKundliCreated(data.plan);
        onClose();
      } else {
        setErrorMsg(data?.error || 'Failed to generate Kundli. Please check details.');
      }
    } catch (err: any) {
      console.error('Error generating Kundli:', err);
      setErrorMsg(err?.message || 'Network error while synthesizing Janampatri.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0C101D] border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 border-b border-stone-800 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create New Janam Kundli</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-100">
            Enter Birth Details (जन्म विवरण)
          </h2>
          <p className="text-xs text-stone-400">
            Lahiri Ayanamsha ephemeris calculates your exact Ascendant degree, Moon Nakshatra, and Navagraha positions.
          </p>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Birth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ananya Sen, Rohan Gupta"
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['male', 'female', 'other'] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize border transition ${
                    gender === g
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                      : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Date of Birth</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Time of Birth (Exact)</span>
              </label>
              <input
                type="time"
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Place of Birth */}
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Place of Birth (City, State, Country)</span>
            </label>
            <input
              type="text"
              value={pob}
              onChange={(e) => setPob(e.target.value)}
              placeholder="e.g. New Delhi, Mumbai, Jaipur, Varanasi"
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
              required
            />

            {/* Quick city suggestions */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 text-[10px]">
              <span className="text-stone-500 flex-shrink-0">Popular:</span>
              {popularCities.slice(0, 5).map((city) => (
                <button
                  type="button"
                  key={city}
                  onClick={() => setPob(city)}
                  className="flex-shrink-0 px-2 py-0.5 rounded-md bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-300 border border-stone-800 transition"
                >
                  {city.split(',')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-stone-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 transition flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Ephemeris...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Vedic Kundli</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
