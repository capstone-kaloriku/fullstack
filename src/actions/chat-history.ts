"use server";

import { createClient } from "@/lib/supabase/server";
import Groq from "groq-sdk";

// ============================================================
// Chat History & Conversations — server actions
// ============================================================
// Flow (persis ChatGPT):
//  1. User kirim pesan pertama → buat conversation baru
//  2. AI jawab → generate judul otomatis via AI → update conversation
//  3. Pesan berikutnya tetap di conversation yang sama
//  4. "Chat Baru" → set conversation aktif = null (next message buat conversation baru)
// ============================================================

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export interface ConversationItem {
  id: string;
  title: string;
  preview: string | null;
  message_count: number;
  updated_at: string;
}

export interface ChatHistoryMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  image_url?: string | null;
  created_at: string;
}

// ─── 1. Ambil daftar conversations (untuk sidebar) ───────────

export async function getConversations(): Promise<ConversationItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("conversations")
    .select("id, title, preview, message_count, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[Conversations] Gagal ambil:", error.message);
    return [];
  }

  return (data ?? []) as ConversationItem[];
}

// ─── 2. Ambil pesan dalam satu conversation ──────────────────

export async function getChatHistory(
  conversationId: string,
): Promise<ChatHistoryMessage[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("chat_history")
    .select("id, role, content, image_url, created_at")
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[ChatHistory] Gagal ambil pesan:", error.message);
    return [];
  }

  return (data ?? []) as ChatHistoryMessage[];
}

// ─── 3. Buat conversation baru (dipanggil saat pesan pertama) ─
// Limit: maks 20 conversation per user. Jika lebih, hapus yang paling lama.
const MAX_CONVERSATIONS_PER_USER = 20;

export async function createConversation(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Cek jumlah conversation user saat ini
  const { data: existing } = await supabase
    .from("conversations")
    .select("id, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: true }); // paling lama dulu

  // Hapus yang paling lama kalau sudah melebihi batas
  if (existing && existing.length >= MAX_CONVERSATIONS_PER_USER) {
    const toDelete = existing.slice(0, existing.length - MAX_CONVERSATIONS_PER_USER + 1);
    const ids = toDelete.map((c) => c.id);
    await supabase.from("conversations").delete().in("id", ids);
    // chat_history terhapus otomatis via ON DELETE CASCADE
  }

  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: user.id, title: "Percakapan Baru" })
    .select("id")
    .single();

  if (error) {
    console.error("[Conversations] Gagal buat:", error.message);
    return null;
  }

  return data.id;
}

// ─── 4. Update judul conversation via AI ─────────────────────

export async function updateConversationTitle(
  conversationId: string,
  userMessage: string,
  aiResponse: string,
): Promise<void> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Buat judul singkat (maks 6 kata) untuk percakapan ini.
Judul harus menggambarkan topik utama pertanyaan user.
Gunakan Bahasa Indonesia. JANGAN pakai tanda kutip.
Output HANYA judulnya saja, tanpa penjelasan.`,
        },
        {
          role: "user",
          content: `Pertanyaan: "${userMessage.slice(0, 200)}"\nJawaban AI: "${aiResponse.slice(0, 200)}"`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 30,
    });

    const title =
      completion.choices[0]?.message?.content?.trim() ?? "Percakapan Baru";

    const supabase = await createClient();
    await supabase
      .from("conversations")
      .update({
        title: title.slice(0, 100),
        preview: aiResponse.slice(0, 120),
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId);
  } catch (err) {
    console.error("[Conversations] Gagal update judul:", err);
  }
}

// ─── 5. Hapus satu conversation ──────────────────────────────

export async function deleteConversation(
  conversationId: string,
): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };

  // chat_history akan terhapus otomatis via ON DELETE CASCADE
  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[Conversations] Gagal hapus:", error.message);
    return { success: false };
  }

  return { success: true };
}

// ─── 6. Update message_count setelah pesan baru ──────────────

export async function incrementMessageCount(
  conversationId: string,
): Promise<void> {
  const supabase = await createClient();
  // Hitung ulang dari DB (lebih akurat daripada increment)
  const { count } = await supabase
    .from("chat_history")
    .select("*", { count: "exact", head: true })
    .eq("conversation_id", conversationId);

  await supabase
    .from("conversations")
    .update({ message_count: count ?? 0, updated_at: new Date().toISOString() })
    .eq("id", conversationId);
}
