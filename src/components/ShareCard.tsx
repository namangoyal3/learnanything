"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import ModalShell from "@/components/ui/ModalShell";
import {
  Share2,
  Copy,
  Check,
  Twitter,
  Linkedin,
  Mail,
  MessageCircle,
  Flame,
  Zap,
  Trophy,
  X,
} from "lucide-react";

interface ShareCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareCard({ isOpen, onClose }: ShareCardProps) {
  const [shareData, setShareData] = useState<any>(null);
  const [cardData, setCardData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    Promise.all([
      fetch("/api/invite").then((r) => r.json()),
      fetch("/api/share").then((r) => r.json()),
    ]).then(([invite, share]) => {
      setShareData(invite);
      setCardData(share.card);
    });
  }, [isOpen]);

  const handleCopy = async () => {
    if (!shareData) return;
    await navigator.clipboard.writeText(shareData.shareLinks.copyLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (!shareData || !navigator.share) return;
    try {
      await navigator.share({
        title: "PM Streak - Duolingo for PMs",
        text: shareData.shareMessages.twitter,
        url: shareData.shareLinks.copyLink,
      });
    } catch {
      // User cancelled
    }
  };

  return (
    <ModalShell open={isOpen} onClose={onClose} label="Share your streak" overlayClassName="bg-black/60" align="items-end sm:items-center" zIndex="z-[100]">
      <div className="pointer-events-auto relative w-full max-w-sm mx-4 mb-4 sm:mb-0 self-end sm:self-center bg-[var(--bg-secondary)] rounded-2xl overflow-hidden animate-in slide-in-from-bottom">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
         aria-label="Close">
          <X size={16} aria-hidden />
        </button>

        {/* Streak Card Preview */}
        {cardData && (
          <div className="bg-gradient-to-br from-[#1a2b32] via-[#0f1f26] to-[#1a2b32] p-6 border-b border-[var(--border-color)]">
            <div className="text-center mb-4">
              <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-1">
                PM STREAK
              </div>
              <div className="text-lg font-bold">{cardData.name}</div>
            </div>

            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="text-center">
                <Flame size={24} className="mx-auto text-[var(--orange-primary)] streak-flame" />
                <div className="text-xl font-bold mt-1">{cardData.streakCount}</div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase">Streak</div>
              </div>
              <div className="text-center">
                <Zap size={24} className="mx-auto text-[var(--gold-primary)]" />
                <div className="text-xl font-bold mt-1">{cardData.xp}</div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase">XP</div>
              </div>
              <div className="text-center">
                <Trophy size={24} className="mx-auto text-[var(--purple-primary)]" />
                <div className="text-xl font-bold mt-1">Lv.{cardData.level}</div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase">Level</div>
              </div>
            </div>

            <div className="text-center text-xs text-[var(--text-secondary)]">
              {cardData.lessonsCompleted} lessons completed - Powered by Lenny&apos;s Podcast
            </div>
          </div>
        )}

        {/* Share Options */}
        <div className="p-4 space-y-3">
          <h3 className="text-sm font-bold">Invite Friends</h3>

          {/* Native share (mobile) */}
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 rounded-xl bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-black font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 size={16} /> Share
            </button>
          )}

          {/* Social buttons */}
          <div className="grid grid-cols-4 gap-2">
            {shareData && (
              <>
                <a
                  href={shareData.shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 py-3 rounded-xl bg-[var(--bg-card)] hover:bg-[#1DA1F2]/10 transition-colors"
                >
                  <Twitter size={20} className="text-[#1DA1F2]" />
                  <span className="text-[10px] text-[var(--text-secondary)]">Twitter</span>
                </a>
                <a
                  href={shareData.shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 py-3 rounded-xl bg-[var(--bg-card)] hover:bg-[#0A66C2]/10 transition-colors"
                >
                  <Linkedin size={20} className="text-[#0A66C2]" />
                  <span className="text-[10px] text-[var(--text-secondary)]">LinkedIn</span>
                </a>
                <a
                  href={shareData.shareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 py-3 rounded-xl bg-[var(--bg-card)] hover:bg-[#25D366]/10 transition-colors"
                >
                  <MessageCircle size={20} className="text-[#25D366]" />
                  <span className="text-[10px] text-[var(--text-secondary)]">WhatsApp</span>
                </a>
                <a
                  href={shareData.shareLinks.email}
                  className="flex flex-col items-center gap-1 py-3 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--orange-primary)]/10 transition-colors"
                >
                  <Mail size={20} className="text-[var(--orange-primary)]" />
                  <span className="text-[10px] text-[var(--text-secondary)]">Email</span>
                </a>
              </>
            )}
          </div>

          {/* Copy link */}
          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-xl border-2 border-[var(--border-color)] text-sm flex items-center justify-center gap-2 hover:border-[var(--green-primary)] transition-colors"
          >
            {copied ? (
              <>
                <Check size={14} className="text-[var(--green-primary)]" /> Copied!
              </>
            ) : (
              <>
                <Copy size={14} /> Copy Invite Link
              </>
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
