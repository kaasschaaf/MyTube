import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, LogIn, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleLogin: (clientId?: string) => void;
  hasGoogleClientId: boolean;
  currentClientId: string;
  onSaveClientId: (id: string) => void;
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
  onGoogleLogin,
  hasGoogleClientId,
  currentClientId,
  onSaveClientId,
}) => {
  const [clientIdInput, setClientIdInput] = useState(currentClientId);
  const [isEditing, setIsEditing] = useState(!hasGoogleClientId);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentOrigin = window.location.origin;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = clientIdInput.trim();
    if (trimmed) {
      onSaveClientId(trimmed);
      onGoogleLogin(trimmed);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-yt-surface border border-yt-border rounded-2xl shadow-2xl flex flex-col overflow-hidden text-yt-text max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-yt-border/40 bg-yt-bg/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs">
              {/* Google G logo */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Inloggen met Google</h2>
              <p className="text-xs text-yt-textSec">
                Synchroniseer je eigen YouTube abonnementen en uploads
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-yt-pillHover text-yt-textSec hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* If already has Client ID and not editing: show ready state */}
          {hasGoogleClientId && !isEditing ? (
            <div className="space-y-5 text-center py-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Klaar om in te loggen!</h3>
                <p className="text-xs text-yt-textSec mt-1 max-w-sm mx-auto">
                  Je Google Client ID is ingesteld. Klik op de knop hieronder om het officiële Google inlogvenster te openen.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onGoogleLogin();
                    onClose();
                  }}
                  className="w-full max-w-sm mx-auto py-3 px-6 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition flex items-center justify-center gap-2.5 shadow-lg shadow-blue-600/30 active:scale-98"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Nu inloggen met Google Account</span>
                </button>
              </div>

              <div className="text-xs text-yt-textSec pt-2">
                <span>Ingestelde Client ID: </span>
                <code className="text-yt-text font-mono text-[11px] bg-black/40 px-1.5 py-0.5 rounded">
                  {currentClientId.slice(0, 15)}...apps.googleusercontent.com
                </code>{' '}
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-blue-400 hover:underline ml-1 font-semibold"
                >
                  Wijzigen
                </button>
              </div>
            </div>
          ) : (
            /* Setup Guide & Client ID Input */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Friendly notification */}
              <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-100/90 leading-relaxed">
                  Google eist voor YouTube-toegang eenmalig een gratis <strong>Client ID</strong>.
                  Volg de onderstaande stappen om hem in 1 minuut op te halen en hier in te vullen.
                </div>
              </div>

              {/* Step 1: Open Google Cloud Console */}
              <div className="p-4 rounded-xl bg-yt-bg/60 border border-yt-border/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-yt-red text-white flex items-center justify-center text-[11px] font-black">
                      1
                    </span>
                    Open Google Cloud Console
                  </span>
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition"
                  >
                    <span>Open Credentials Pagina</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-[11px] text-yt-textSec pl-7 leading-relaxed">
                  • Klik op <strong>+ Create Credentials</strong> &gt; <strong>OAuth client ID</strong>.<br />
                  • Kies bij Application type: <strong>Web application</strong>.
                </p>
              </div>

              {/* Step 2: Authorized Origins */}
              <div className="p-4 rounded-xl bg-yt-bg/60 border border-yt-border/50 space-y-2.5">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yt-red text-white flex items-center justify-center text-[11px] font-black">
                    2
                  </span>
                  Voeg je website-adres toe bij "Authorized JavaScript origins"
                </span>
                <p className="text-[11px] text-yt-textSec pl-7">
                  Plak dit adres (of beide) in Google Cloud onder <em>Authorized JavaScript origins</em>:
                </p>

                <div className="pl-7 space-y-2">
                  {/* Current Origin */}
                  <div className="flex items-center justify-between bg-black/50 border border-yt-border/60 rounded-lg px-2.5 py-1.5 text-xs">
                    <code className="text-amber-300 font-mono text-[11px] truncate mr-2">
                      {currentOrigin}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentOrigin)}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-yt-pill hover:bg-yt-pillHover text-[11px] text-yt-text font-medium transition flex-shrink-0"
                    >
                      {copiedText === currentOrigin ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Gekopieerd</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Kopieer</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Localhost fallback if not on localhost */}
                  {currentOrigin !== 'http://localhost:5173' && (
                    <div className="flex items-center justify-between bg-black/50 border border-yt-border/60 rounded-lg px-2.5 py-1.5 text-xs">
                      <code className="text-yt-textSec font-mono text-[11px] truncate mr-2">
                        http://localhost:5173
                      </code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('http://localhost:5173')}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-yt-pill hover:bg-yt-pillHover text-[11px] text-yt-text font-medium transition flex-shrink-0"
                      >
                        {copiedText === 'http://localhost:5173' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Gekopieerd</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Kopieer</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Paste Client ID */}
              <div className="p-4 rounded-xl bg-yt-bg/60 border border-yt-border/50 space-y-2.5">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yt-red text-white flex items-center justify-center text-[11px] font-black">
                    3
                  </span>
                  Plak je Client ID en log direct in
                </span>

                <div className="pl-7 space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="123456789-xxxxxx.apps.googleusercontent.com"
                    value={clientIdInput}
                    onChange={(e) => setClientIdInput(e.target.value)}
                    className="w-full bg-yt-surface border border-yt-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono shadow-inner"
                  />
                  <p className="text-[11px] text-yt-textSec">
                    Kopieer de Client ID die Google je geeft en plak hem hier.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                {hasGoogleClientId && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-full text-xs font-semibold text-yt-textSec hover:text-white"
                  >
                    Annuleren
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!clientIdInput.trim()}
                  className="flex-1 py-3 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Opslaan & Direct Inloggen met Google</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-yt-border/40 bg-yt-bg/60 flex items-center justify-between text-xs text-yt-textSec">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5 text-yt-textSec" />
            <span>Wordt veilig en lokaal in je browser bewaard</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-yt-textSec hover:text-white hover:bg-yt-pill"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
