import React, { useState } from 'react';
import { X, Settings, ShieldCheck, Download, Upload, LogIn, LogOut, Check, HelpCircle, Sparkles, GitBranch } from 'lucide-react';
import { AppSettings, UserProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  userProfile: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  onExport: () => void;
  onImport: (jsonStr: string) => boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  userProfile,
  onLogin,
  onLogout,
  onExport,
  onImport,
}) => {
  const [clientId, setClientId] = useState(settings.googleClientId);
  const [apiKey, setApiKey] = useState(settings.youtubeApiKey);
  const [dataSource, setDataSource] = useState<'demo' | 'google'>(settings.dataSource);
  const [showOAuthHelp, setShowOAuthHelp] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      googleClientId: clientId.trim(),
      youtubeApiKey: apiKey.trim(),
      dataSource,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = onImport(content);
      if (success) {
        setImportStatus('✅ Settings imported successfully!');
      } else {
        setImportStatus('❌ Invalid backup file.');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-yt-surface border border-yt-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] text-yt-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-yt-border/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-yt-pill text-yt-text">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Settings & accounts</h2>
              <p className="text-xs text-yt-textSec">
                YouTube connection and data management
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Section: Data Source */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-yt-textSec flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Active data source
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDataSource('demo')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  dataSource === 'demo'
                    ? 'bg-yt-red/15 border-yt-red text-white'
                    : 'bg-yt-bg/50 border-yt-border/50 hover:bg-yt-pill text-yt-textSec'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-yt-text flex items-center gap-1.5">
                    Demo Feed
                  </div>
                  <p className="text-[11px] text-yt-textSec mt-1">
                    Popular channels ready to explore (Veritasium, MKBHD, NOS op 3, etc.)
                  </p>
                </div>
                {dataSource === 'demo' && (
                  <span className="text-[10px] text-yt-red font-bold mt-2">✓ Active</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setDataSource('google')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  dataSource === 'google'
                    ? 'bg-blue-500/15 border-blue-500 text-white'
                    : 'bg-yt-bg/50 border-yt-border/50 hover:bg-yt-pill text-yt-textSec'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-yt-text flex items-center gap-1.5">
                    My YouTube account
                  </div>
                  <p className="text-[11px] text-yt-textSec mt-1">
                    Your subscribed channels and recent uploads
                  </p>
                </div>
                {dataSource === 'google' && (
                  <span className="text-[10px] text-blue-400 font-bold mt-2">✓ Active</span>
                )}
              </button>
            </div>
          </div>

          {/* Section: Google Account & OAuth */}
          <div className="space-y-3 pt-3 border-t border-yt-border/40">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-yt-textSec flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Google / YouTube OAuth
              </h3>
              <button
                type="button"
                onClick={() => setShowOAuthHelp(!showOAuthHelp)}
                className="text-xs text-blue-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>How do I set this up?</span>
              </button>
            </div>

            {/* Help instructions drawer */}
            {showOAuthHelp && (
              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200 space-y-2">
                <h4 className="font-bold text-white">Set up Google OAuth (about 2 minutes):</h4>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-blue-100/90 leading-relaxed">
                  <li>Open the <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline font-bold text-white">Google Cloud Console</a> and create a project.</li>
                  <li>Go to <em>APIs & Services &gt; Library</em> and enable the <strong>YouTube Data API v3</strong>.</li>
                  <li>Go to <em>APIs & Services &gt; Credentials</em> and choose <strong>Create Credentials &gt; OAuth client ID</strong>.</li>
                  <li>Set the application type to <strong>Web application</strong>.</li>
                  <li>Add these under <em>Authorized JavaScript origins</em>: <br />
                    • <code className="bg-black/40 px-1 rounded text-amber-300">http://localhost:5173</code> (local development)<br />
                    • <code className="bg-black/40 px-1 rounded text-amber-300">https://&lt;username&gt;.github.io</code> (your GitHub Pages site)
                  </li>
                  <li>Copy your <strong>client ID</strong> and enter it below.</li>
                </ol>
              </div>
            )}

            {/* Current user status */}
            {userProfile ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-yt-bg/60 border border-yt-border/50">
                <div className="flex items-center gap-3">
                  {userProfile.avatar && (
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-9 h-9 rounded-full border border-yt-border"
                    />
                  )}
                  <div>
                    <div className="text-xs font-bold text-yt-text">{userProfile.name}</div>
                    <div className="text-[11px] text-yt-textSec">{userProfile.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yt-pill hover:bg-yt-pillHover text-xs text-yt-textSec hover:text-white transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-yt-bg/60 border border-yt-border/50">
                <span className="text-xs text-yt-textSec">Not signed in</span>
                <button
                  type="button"
                  onClick={onLogin}
                  disabled={!clientId}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign in with Google</span>
                </button>
              </div>
            )}

            {/* Client ID input */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-yt-textSec block">
                Google OAuth Client ID (.apps.googleusercontent.com)
              </label>
              <input
                type="text"
                placeholder="Bijv. 123456789-abcdef.apps.googleusercontent.com"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-yt-bg border border-yt-border rounded-xl px-3 py-2 text-xs text-yt-text focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* Optional YouTube API Key */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-yt-textSec block">
                Optional YouTube Data API key (v3)
              </label>
              <input
                type="text"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-yt-bg border border-yt-border rounded-xl px-3 py-2 text-xs text-yt-text focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Section: Backup & Cross-device Sync */}
          <div className="space-y-3 pt-3 border-t border-yt-border/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-yt-textSec flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Transfer settings between devices
            </h3>
            <p className="text-[11px] text-yt-textSec">
              Export your favorites, settings, and preferences as a backup or to transfer them to another device.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onExport}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-yt-pill hover:bg-yt-pillHover text-xs font-semibold text-yt-text border border-yt-border/50 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-yt-pill hover:bg-yt-pillHover text-xs font-semibold text-yt-text border border-yt-border/50 transition cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <div className="p-2 text-center text-xs font-medium rounded-lg bg-yt-pill">
                {importStatus}
              </div>
            )}
          </div>

          {/* Section: GitHub Pages Hosting Info */}
          <div className="p-3.5 rounded-xl bg-yt-bg/60 border border-yt-border/50 flex items-start gap-3">
            <GitBranch className="w-5 h-5 text-yt-textSec flex-shrink-0 mt-0.5" />
            <div className="text-xs text-yt-textSec space-y-1">
              <span className="font-bold text-yt-text block">GitHub Pages deployment</span>
              <p>
                The repository includes a GitHub Actions workflow at{' '}
                <code className="bg-black/40 px-1 py-0.5 rounded text-white font-mono">.github/workflows/deploy.yml</code>.
                Push the code to GitHub to publish the site automatically.
              </p>
            </div>
          </div>
          <p className="text-xs text-yt-textSec">
            Read the <a href="./privacy.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Privacy Policy</a> for information about local storage and third-party services.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-yt-border/40 flex items-center justify-between bg-yt-bg/40">
          <span className="text-xs text-emerald-400 font-semibold">
            {savedSuccess ? '✓ Settings saved!' : ''}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-yt-textSec hover:text-white transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-full bg-yt-red hover:bg-yt-redHover text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
