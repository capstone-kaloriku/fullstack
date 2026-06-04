'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Trash2, Loader2 } from 'lucide-react';

import { getConsumptionHistory, deleteConsumptionLog } from '../../actions';


// ============================================================
// Types
// ============================================================

interface LogEntry {
  id: string;
  nama: string;
  gambar: string;
  kalori: number;
  porsi: number;
  mealType: string;
  loggedAt: string;
}

interface DayGroup {
  date: string;
  logs: LogEntry[];
  totalKalori: number;
}

// ============================================================
// Helpers
// ============================================================

/** Format YYYY-MM-DD → "Senin, 5 Mei 2026" */
function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // Check if it's today or yesterday
  const todayStr = today.toLocaleDateString('sv-SE');
  const yesterdayStr = yesterday.toLocaleDateString('sv-SE');

  if (dateStr === todayStr) return 'Hari Ini';
  if (dateStr === yesterdayStr) return 'Kemarin';

  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Format ISO timestamp → "09:47" */
function formatTime(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Get start/end of a week (Monday–Sunday) */
function getWeekRange(weeksAgo: number) {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset - weeksAgo * 7);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 7);

  return {
    start: monday.toISOString(),
    end: sunday.toISOString(),
    label: weeksAgo === 0
      ? 'Minggu Ini'
      : weeksAgo === 1
        ? 'Minggu Lalu'
        : `${weeksAgo} Minggu Lalu`,
    rangeText: `${monday.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} – ${new Date(sunday.getTime() - 1).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`,
  };
}

// ============================================================
// Meal type badge color
// ============================================================

const MEAL_BADGE_COLORS: Record<string, string> = {
  makanan_berat: 'bg-amber-100 text-amber-700',
  makanan_ringan: 'bg-emerald-100 text-emerald-700',
  minuman: 'bg-sky-100 text-sky-700',
  camilan: 'bg-orange-100 text-orange-700',
  custom: 'bg-gray-100 text-gray-700',
};

// ============================================================
// Component — Consumption History with weekly navigation
// ============================================================

function ConsumptionHistory() {
  // Which week to show (0 = this week, 1 = last week, etc.)
  const [weeksAgo, setWeeksAgo] = useState(0);
  // Data from server
  const [data, setData] = useState<{ days: DayGroup[] }>({ days: [] });
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  // Fetch data when week changes
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const range = getWeekRange(weeksAgo);
    const result = await getConsumptionHistory(range.start, range.end);
    setData(result);
    setIsLoading(false);
  }, [weeksAgo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Navigate between weeks
  function goToPreviousWeek() {
    setWeeksAgo((prev) => prev + 1);
  }

  function goToNextWeek() {
    if (weeksAgo > 0) {
      setWeeksAgo((prev) => prev - 1);
    }
  }

  // Delete a consumption log
  function handleDelete(logId: string) {
    const confirmed = window.confirm('Hapus catatan makanan ini?');
    if (!confirmed) return;

    setDeletingId(logId);
    startTransition(async () => {
      const result = await deleteConsumptionLog(logId);
      if (!result.success) {
        alert(result.error || 'Gagal menghapus.');
      }
      setDeletingId(null);
      // Re-fetch data
      await fetchData();
      router.refresh();
    });
  }

  const weekRange = getWeekRange(weeksAgo);

  // Calculate total calories for the week
  const weeklyTotal = data.days.reduce((sum, day) => sum + day.totalKalori, 0);

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* Week navigator */}
      <Card className="bg-primary-foreground">
        <CardContent className="flex items-center justify-between py-3">
          {/* Previous week button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousWeek}
            className="text-primary"
          >
            <ChevronLeft size={20} />
          </Button>

          {/* Week label */}
          <div className="flex flex-col items-center">
            <span className="font-bold text-primary">{weekRange.label}</span>
            <span className="text-xs text-muted-foreground">{weekRange.rangeText}</span>
          </div>

          {/* Next week button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextWeek}
            disabled={weeksAgo === 0}
            className="text-primary"
          >
            <ChevronRight size={20} />
          </Button>
        </CardContent>
      </Card>

      {/* Weekly total */}
      {!isLoading && data.days.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <span className="text-sm text-muted-foreground">
            Total minggu ini
          </span>
          <span className="font-bold text-primary">{weeklyTotal} kcal</span>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={24} className="animate-spin text-primary mr-2" />
          <span className="text-muted-foreground">Memuat riwayat...</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && data.days.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            Tidak ada catatan konsumsi untuk minggu ini.
          </p>
        </div>
      )}

      {/* Day groups */}
      {!isLoading &&
        data.days.map((day) => (
          <div key={day.date} className="flex flex-col gap-2">
            {/* Day header */}
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-bold text-secondary-foreground">
                {formatDateLabel(day.date)}
              </span>
              <span className="text-xs font-bold text-primary">
                {day.totalKalori} kcal
              </span>
            </div>

            {/* Log entries for this day */}
            {day.logs.map((log) => (
              <Card
                key={log.id}
                className="py-3 rounded-lg border border-gray-300"
              >
                <CardContent>
                  <div className="flex items-center justify-between">
                    {/* Food info */}
                    <div className="flex items-center gap-3">
                      <Image
                        src={log.gambar}
                        alt={log.nama}
                        className="rounded-full"
                        width={44}
                        height={44}
                      />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold">{log.nama}</span>
                        <div className="flex items-center gap-2">
                          {/* Meal type badge */}
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${MEAL_BADGE_COLORS[log.mealType] || MEAL_BADGE_COLORS.custom}`}
                          >
                            {log.mealType?.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {log.porsi} porsi
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(log.loggedAt)}
                          </span>
                        </div>
                        <span className="bg-muted-foreground/10 px-2 py-0.5 rounded-full text-[11px] text-secondary-foreground w-fit">
                          {log.kalori} kcal
                        </span>
                      </div>
                    </div>

                    {/* Delete button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(log.id)}
                      disabled={isPending && deletingId === log.id}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      {isPending && deletingId === log.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
    </div>
  );
}

export default ConsumptionHistory;
