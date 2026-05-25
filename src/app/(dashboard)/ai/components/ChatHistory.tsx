"use client";

import { useState, useMemo } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types/index";
import {
  LuMessageSquare,
  LuPlus,
  LuSearch,
  LuX,
  LuClock,
  LuPanelRightOpen,
  LuPanelRightClose,
} from "react-icons/lu";
import { BsStars } from "react-icons/bs";

// ─── Dummy Data ────────────────────────────────────────
// Ini akan diganti dengan data dari API/database nanti
const DUMMY_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    title: "Kalori nasi goreng spesial",
    preview: "Nasi goreng spesial dengan telur dan ayam mengandung sekitar...",
    timestamp: new Date(),
    messageCount: 6,
  },
  {
    id: "conv-2",
    title: "Menu diet sehat seminggu",
    preview: "Berikut rekomendasi menu diet sehat untuk 7 hari...",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 jam lalu
    messageCount: 12,
  },
  {
    id: "conv-3",
    title: "Protein dalam tempe vs tahu",
    preview: "Tempe mengandung protein lebih tinggi dibanding tahu...",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Kemarin
    messageCount: 4,
  },
  {
    id: "conv-4",
    title: "Kebutuhan kalori harian",
    preview: "Kebutuhan kalori harian tergantung pada usia, berat badan...",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    messageCount: 8,
  },
  {
    id: "conv-5",
    title: "Gula darah dan karbohidrat",
    preview: "Karbohidrat kompleks lebih baik untuk mengontrol gula darah...",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 hari lalu
    messageCount: 10,
  },
  {
    id: "conv-6",
    title: "Manfaat buah alpukat",
    preview: "Alpukat kaya akan lemak sehat, serat, dan vitamin...",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    messageCount: 3,
  },
  {
    id: "conv-7",
    title: "Cara menghitung BMI",
    preview: "BMI dihitung dengan rumus berat badan (kg) dibagi...",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    messageCount: 5,
  },
  {
    id: "conv-8",
    title: "Makanan tinggi serat",
    preview: "Beberapa makanan tinggi serat antara lain oatmeal, brokoli...",
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    messageCount: 7,
  },
];

// ─── Helper: group conversations by time ──────────────
interface GroupedConversations {
  label: string;
  conversations: Conversation[];
}

function groupConversationsByTime(
  conversations: Conversation[]
): GroupedConversations[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOf7Days = new Date(startOfToday);
  startOf7Days.setDate(startOf7Days.getDate() - 7);

  const groups: Record<string, Conversation[]> = {
    "Hari Ini": [],
    Kemarin: [],
    "7 Hari Terakhir": [],
    "Lebih Lama": [],
  };

  for (const conv of conversations) {
    const t = conv.timestamp;
    if (t >= startOfToday) {
      groups["Hari Ini"].push(conv);
    } else if (t >= startOfYesterday) {
      groups["Kemarin"].push(conv);
    } else if (t >= startOf7Days) {
      groups["7 Hari Terakhir"].push(conv);
    } else {
      groups["Lebih Lama"].push(conv);
    }
  }

  return Object.entries(groups)
    .filter(([, convs]) => convs.length > 0)
    .map(([label, conversations]) => ({ label, conversations }));
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

// ─── Conversation Item ────────────────────────────────
function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full flex-col gap-1 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
        "hover:bg-muted/80",
        isActive
          ? "bg-primary/8 ring-1 ring-primary/20"
          : "bg-transparent"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <LuMessageSquare
            className={cn(
              "size-3.5 shrink-0 mt-0.5",
              isActive ? "text-primary" : "text-muted-foreground/60"
            )}
          />
          <span
            className={cn(
              "truncate text-sm font-medium leading-tight",
              isActive ? "text-primary" : "text-foreground"
            )}
          >
            {conversation.title}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 pl-5.5">
        <p className="truncate text-xs text-muted-foreground leading-relaxed">
          {conversation.preview}
        </p>
      </div>
      <div className="flex items-center gap-2 pl-5.5">
        <LuClock className="size-3 text-muted-foreground/50" />
        <span className="text-[10px] text-muted-foreground/60">
          {formatRelativeTime(conversation.timestamp)}
        </span>
        <span className="text-[10px] text-muted-foreground/40">·</span>
        <span className="text-[10px] text-muted-foreground/60">
          {conversation.messageCount} pesan
        </span>
      </div>
    </button>
  );
}

// ─── Conversation List (shared between desktop + mobile) ───
function ConversationList({
  activeId,
  onSelect,
  onNewChat,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return DUMMY_CONVERSATIONS;
    const q = search.toLowerCase();
    return DUMMY_CONVERSATIONS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => groupConversationsByTime(filtered), [filtered]);

  return (
    <div className="flex h-full flex-col">
      {/* New chat button */}
      <div className="px-3 pt-1 pb-2">
        <Button
          variant="default"
          size="sm"
          className="w-full gap-2 rounded-xl font-semibold"
          onClick={onNewChat}
        >
          <LuPlus className="size-4" />
          Chat Baru
        </Button>
      </div>

      {/* Search bar */}
      <div className="px-3 pb-2">
        <div className="relative">
          <LuSearch className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari percakapan..."
            className="w-full rounded-lg border border-border bg-muted/30 py-2 pl-8 pr-8 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              <LuX className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {grouped.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                <LuSearch className="size-4 text-muted-foreground/60" />
              </div>
              <p className="text-xs text-muted-foreground">
                {search
                  ? "Tidak ada percakapan yang cocok"
                  : "Belum ada riwayat chat"}
              </p>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.label} className="mb-1">
                <div className="px-3 py-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    {group.label}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {group.conversations.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={conv.id === activeId}
                      onClick={() => onSelect(conv.id)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <Separator />
      <div className="flex items-center justify-center gap-1.5 px-3 py-2.5">
        <BsStars className="size-3 text-primary/60" />
        <span className="text-[10px] text-muted-foreground/50">
          KalorAI — Riwayat Percakapan
        </span>
      </div>
    </div>
  );
}

// ─── Desktop Sidebar (lg+) ────────────────────────────
function DesktopSidebar({
  isOpen,
  onToggle,
  activeId,
  onSelect,
  onNewChat,
}: {
  isOpen: boolean;
  onToggle: () => void;
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}) {
  return (
    <div
      className={cn(
        "hidden lg:flex flex-col h-full border-l border-border bg-card/50 transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "w-80 opacity-100" : "w-0 opacity-0"
      )}
    >
      {isOpen && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
                <LuMessageSquare className="size-3.5 text-primary" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Riwayat</h2>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggle}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Tutup riwayat chat"
            >
              <LuPanelRightClose className="size-4" />
            </Button>
          </div>

          {/* Content */}
          <ConversationList
            activeId={activeId}
            onSelect={onSelect}
            onNewChat={onNewChat}
          />
        </>
      )}
    </div>
  );
}

// ─── Main Export: ChatHistory ──────────────────────────
interface ChatHistoryProps {
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
}

export function ChatHistory({
  activeConversationId,
  onSelectConversation,
  onNewChat,
}: ChatHistoryProps) {
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (id: string) => {
    onSelectConversation(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── Desktop toggle button (when sidebar is closed) ── */}
      {!desktopOpen && (
        <div className="hidden lg:flex fixed right-4 top-20 z-40">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDesktopOpen(true)}
            className="rounded-xl shadow-md bg-card hover:bg-muted"
            aria-label="Buka riwayat chat"
          >
            <LuPanelRightOpen className="size-4" />
          </Button>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <DesktopSidebar
        isOpen={desktopOpen}
        onToggle={() => setDesktopOpen(false)}
        activeId={activeConversationId}
        onSelect={handleSelect}
        onNewChat={onNewChat}
      />

      {/* ── Mobile sheet trigger (visible below lg) ── */}
      <div className="lg:hidden fixed right-4 top-3 z-40">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl shadow-md bg-card hover:bg-muted"
                aria-label="Buka riwayat chat"
              >
                <LuClock className="size-4" />
              </Button>
            }
          />
          <SheetContent side="right" className="w-[85vw] sm:w-[350px] p-0">
            <SheetHeader className="px-4 pt-4 pb-2">
              <SheetTitle className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
                  <LuMessageSquare className="size-3.5 text-primary" />
                </div>
                Riwayat Chat
              </SheetTitle>
              <SheetDescription>
                Lihat dan lanjutkan percakapan sebelumnya
              </SheetDescription>
            </SheetHeader>
            <Separator />
            <div className="flex-1 overflow-hidden h-[calc(100vh-8rem)]">
              <ConversationList
                activeId={activeConversationId}
                onSelect={handleSelect}
                onNewChat={() => {
                  onNewChat();
                  setMobileOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
