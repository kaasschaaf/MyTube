import React, { useState } from 'react';
import { X, Upload, LogIn, FileSpreadsheet, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { parseYouTubeSubscriptionsCSV } from '../services/storage';
import { Channel } from '../types';

interface ImportOrLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportChannels: (newChannels: Channel[]) => void;
  onGoogleLogin: (clientId?: string) => void;
  hasGoogleClientId: boolean;
  currentClientId: string;
  onSaveClientId: (id: string) => void;
}

export const ImportOrLoginModal: React.FC<ImportOrLoginModalProps> = ({
  isOpen,
  onClose,
  onImportChannels,
  onGoogleLogin,
  hasGoogleClientId,
  currentClientId,
  onSaveClientId,
}) => {
  const [activeTab, setActiveTab] = useState<'csv' | 'google'>('csv');
  const [clientIdInput, setClientIdInput] = useState(currentClientId);
  const [csvStatus, setCsvStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseYouTubeSubscriptionsCSV(text);

        if (parsed.length === 0) {
          setCsvStatus({
            success: false,
            message: 'Geen kanalen gevonden in dit bestand. Zorg dat het een subscriptions.csv is.',
          });
          return;
        }

        const newChannels: Channel[] = parsed.map((p) => ({
          id: p.id,
          title: p.title,
          thumbnail: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80`,
          isFavorite: false,
          isMuted: false,
        }));

        onImportChannels(newChannels);
        setCsvStatus({
          success: true,
          message: `Succes! ${parsed.length} kanalen zijn succesvol geïmporteerd!`,
        });

        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (err) {
        setCsvStatus({
          success: false,
          message: `Fout bij verwerken bestand: ${err}`,
        });
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientIdInput.trim()) {
      onSaveClientId(clientIdInput.trim());
      onGoogleLogin(clientIdInput.trim());
    } else {
      onGoogleLogin();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-yt-surface border border-yt-border rounded-2xl shadow-2xl flex flex-col overflow-hidden text-yt-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-yt-border/40">
          <div>
            <h2 className="text-base font-bold">Koppel je YouTube Abonnementen</h2>
            <p className="text-xs text-yt-textSec">
              Kies hoe je jouw subscriptions wilt inladen
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-yt-pillHover text-yt-textSec hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-yt-border/40 bg-yt-bg/50">
          <button
            type="button"
            onClick={() => setActiveTab('csv')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'csv'
                ? 'border-yt-red text-white bg-yt-surface'
                : 'border-transparent text-yt-textSec hover:text-yt-text'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Bestand Uploaden (Snelst)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'google'
                ? 'border-blue-500 text-white bg-yt-surface'
                : 'border-transparent text-yt-textSec hover:text-yt-text'
            }`}
          >
            <LogIn className="w-4 h-4 text-blue-400" />
            <span>Google Inloggen</span>
          </button>
        </div>

        {/* Tab 1: CSV Upload */}
        {activeTab === 'csv' && (
          <div className="p-6 space-y-4">
            <div className="text-xs text-yt-textSec leading-relaxed">
              Geen gedoe met developer accounts of API keys! Je kunt je abonnementen direct als bestand downloaden van YouTube en hieronder uploaden.
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition cursor-pointer ${
                isDragging
                  ? 'border-yt-red bg-yt-red/10'
                  : 'border-yt-border hover:border-yt-border/80 bg-yt-bg/40'
              }`}
            >
              <Upload className="w-10 h-10 text-yt-textSec mb-3 opacity-60" />
              <div className="text-sm font-bold text-white mb-1">
                Sleep je <code className="text-amber-300 font-mono">subscriptions.csv</code> hierheen
              </div>
              <p className="text-xs text-yt-textSec mb-4">of klik om een bestand te kiezen</p>

              <label className="px-5 py-2 rounded-full bg-yt-pill hover:bg-yt-pillHover text-white text-xs font-bold cursor-pointer transition shadow border border-yt-border">
                Bestand kiezen
                <input
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                  }}
                />
              </label>
            </div>

            {/* Status Feedback */}
            {csvStatus && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  csvStatus.success
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                {csvStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{csvStatus.message}</span>
              </div>
            )}

            {/* How to get CSV guide */}
            <div className="p-3.5 rounded-xl bg-yt-bg/60 border border-yt-border/40 text-xs space-y-1.5">
              <span className="font-bold text-white block">Hoe download ik mijn abonnementenbestand?</span>
              <p className="text-[11px] text-yt-textSec">
                1. Ga naar{' '}
                <a
                  href="https://takeout.google.com/takeout/custom/youtube"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 font-semibold underline inline-flex items-center gap-0.5"
                >
                  Google Takeout YouTube Export <ExternalLink className="w-3 h-3 inline" />
                </a>
              </p>
              <p className="text-[11px] text-yt-textSec">
                2. Vink alleen <strong>Abonnementen</strong> aan en klik op exporteren.
              </p>
              <p className="text-[11px] text-yt-textSec">
                3. Open het zipje en sleep het bestand <code className="text-amber-300">subscriptions.csv</code> hier naar binnen!
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Google Inloggen */}
        {activeTab === 'google' && (
          <form onSubmit={handleGoogleSubmit} className="p-6 space-y-5">
            <div className="text-xs text-yt-textSec leading-relaxed">
              Google staat om veiligheidsredenen alleen toe dat apps inloggen als er een geregistreerde Google Client ID aanwezig is.
            </div>

            {hasGoogleClientId ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <div className="text-xs text-blue-200">
                    Klaar om in te loggen via de officiële Google popup!
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onGoogleLogin()}
                  className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Nu inloggen met Google</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-yt-text">
                    Google OAuth Client ID:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123456789-xxxxxx.apps.googleusercontent.com"
                    value={clientIdInput}
                    onChange={(e) => setClientIdInput(e.target.value)}
                    className="w-full bg-yt-bg border border-yt-border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <p className="text-[11px] text-yt-textSec">
                    Vul hier je OAuth Client ID in om de Google popup direct te activeren.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!clientIdInput.trim()}
                  className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Opslaan & Inlogvenster Openen</span>
                </button>
              </div>
            )}
          </form>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-yt-border/40 bg-yt-bg/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-yt-textSec hover:text-white"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
