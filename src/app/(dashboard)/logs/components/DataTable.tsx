"use client"

import * as React from "react"
import { useState, useTransition, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
} from "@tanstack/react-table"
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconFlame,
    IconLoader,
    IconSearch,
    IconTrash,
    IconSortAscending,
    IconSortDescending,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { getConsumptionHistory, deleteConsumptionLog } from "../../actions"

// ============================================================
// Types
// ============================================================

interface LogEntry {
    id: string
    nama: string
    gambar: string
    kalori: number
    porsi: number
    mealType: string
    loggedAt: string
}

interface DayGroup {
    date: string
    logs: LogEntry[]
    totalKalori: number
}

// ============================================================
// Helpers
// ============================================================

/** Format YYYY-MM-DD → "Senin, 5 Mei 2026" */
function formatDateLabel(dateStr: string): string {
    const date = new Date(dateStr + "T00:00:00")
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    const todayStr = today.toLocaleDateString("sv-SE")
    const yesterdayStr = yesterday.toLocaleDateString("sv-SE")

    if (dateStr === todayStr) return "Hari Ini"
    if (dateStr === yesterdayStr) return "Kemarin"

    return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}

/** Format ISO timestamp → "09:47" */
function formatTime(isoStr: string): string {
    return new Date(isoStr).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    })
}

/** Get start/end of a week (Monday–Sunday) */
function getWeekRange(weeksAgo: number) {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

    const monday = new Date(now)
    monday.setDate(now.getDate() + mondayOffset - weeksAgo * 7)
    monday.setHours(0, 0, 0, 0)

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 7)

    return {
        start: monday.toISOString(),
        end: sunday.toISOString(),
        label:
            weeksAgo === 0
                ? "Minggu Ini"
                : weeksAgo === 1
                    ? "Minggu Lalu"
                    : `${weeksAgo} Minggu Lalu`,
        rangeText: `${monday.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
        })} – ${new Date(sunday.getTime() - 1).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })}`,
    }
}

// ============================================================
// Meal type styling
// ============================================================

const MEAL_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
    makanan_berat: {
        bg: "bg-amber-50 dark:bg-amber-950/40",
        text: "text-amber-700 dark:text-amber-300",
        dot: "bg-amber-400",
    },
    makanan_ringan: {
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        text: "text-emerald-700 dark:text-emerald-300",
        dot: "bg-emerald-400",
    },
    minuman: {
        bg: "bg-sky-50 dark:bg-sky-950/40",
        text: "text-sky-700 dark:text-sky-300",
        dot: "bg-sky-400",
    },
    camilan: {
        bg: "bg-orange-50 dark:bg-orange-950/40",
        text: "text-orange-700 dark:text-orange-300",
        dot: "bg-orange-400",
    },
}

const DEFAULT_MEAL_STYLE = {
    bg: "bg-muted/50",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground/50",
}

function getMealStyle(mealType: string) {
    return MEAL_STYLES[mealType] || DEFAULT_MEAL_STYLE
}

// ============================================================
// Flat row type for the table
// ============================================================

interface FlatLogRow {
    id: string
    nama: string
    gambar: string
    kalori: number
    porsi: number
    mealType: string
    loggedAt: string
    date: string
    dateLabel: string
}

// ============================================================
// Component
// ============================================================

export function DataTable() {
    const [weeksAgo, setWeeksAgo] = useState(0)
    const [data, setData] = useState<{ days: DayGroup[] }>({ days: [] })
    const [isLoading, setIsLoading] = useState(true)
    const [isPending, startTransition] = useTransition()
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const router = useRouter()

    // Table state
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        setIsLoading(true)
        const range = getWeekRange(weeksAgo)
        const result = await getConsumptionHistory(range.start, range.end)
        setData(result)
        setIsLoading(false)
    }, [weeksAgo])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Week navigation
    function goToPreviousWeek() {
        setWeeksAgo((prev) => prev + 1)
    }

    function goToNextWeek() {
        if (weeksAgo > 0) {
            setWeeksAgo((prev) => prev - 1)
        }
    }

    // Delete handler
    function handleDelete(logId: string) {
        const confirmed = window.confirm("Hapus catatan makanan ini?")
        if (!confirmed) return

        setDeletingId(logId)
        startTransition(async () => {
            const result = await deleteConsumptionLog(logId)
            if (!result.success) {
                alert(result.error || "Gagal menghapus.")
            }
            setDeletingId(null)
            await fetchData()
            router.refresh()
        })
    }

    const weekRange = getWeekRange(weeksAgo)
    const weeklyTotal = data.days.reduce((sum, day) => sum + day.totalKalori, 0)

    // Flatten day groups into table rows
    const flatRows: FlatLogRow[] = React.useMemo(() => {
        return data.days.flatMap((day) =>
            day.logs.map((log) => ({
                ...log,
                date: day.date,
                dateLabel: formatDateLabel(day.date),
            }))
        )
    }, [data.days])

    // Column definitions
    const columns: ColumnDef<FlatLogRow>[] = React.useMemo(
        () => [
            {
                accessorKey: "nama",
                header: "Makanan",
                cell: ({ row }) => {
                    const log = row.original
                    return (
                        <div className="flex items-center gap-3 py-1">
                            <div className="relative size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-border/50">
                                <Image
                                    src={log.gambar}
                                    alt={log.nama}
                                    fill
                                    className="object-cover"
                                    sizes="40px"
                                />
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-sm font-semibold truncate max-w-[200px]">
                                    {log.nama}
                                </span>
                            </div>
                        </div>
                    )
                },
                enableHiding: false,
            },
            {
                accessorKey: "mealType",
                header: "Jenis Makanan",
                cell: ({ row }) => {
                    const style = getMealStyle(row.original.mealType)
                    return (
                        <div className="flex items-center gap-2">
                            <span
                                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${style.bg} ${style.text}`}
                            >
                                <span className={`size-1.5 rounded-full ${style.dot}`} />
                                {row.original.mealType?.replace('_', ' ') || "—"}
                            </span>
                        </div>
                    )
                },
                filterFn: (row, id, value) => {
                    if (!value || value === "all") return true
                    return row.getValue<string>(id) === value
                },
            },
            {
                accessorKey: "porsi",
                header: () => <div className="text-center">Porsi</div>,
                cell: ({ row }) => (
                    <div className="text-center tabular-nums">
                        <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-0.5 rounded-md bg-muted/60 text-sm font-medium">
                            {row.original.porsi}×
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: "loggedAt",
                header: "Jam",
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground tabular-nums">
                        {formatTime(row.original.loggedAt)}
                    </span>
                ),
                sortingFn: "datetime",
            },
            {
                accessorKey: "dateLabel",
                header: "Tanggal",
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">
                        {row.original.dateLabel}
                    </span>
                ),
            },
            {
                accessorKey: "kalori",
                header: () => <div className="text-right">Kalori</div>,
                cell: ({ row }) => (
                    <div className="flex items-center justify-end gap-1.5">
                        <IconFlame className="size-3.5 text-orange-400" />
                        <span className="text-sm font-semibold tabular-nums">
                            {row.original.kalori}
                        </span>
                        <span className="text-xs text-muted-foreground">kcal</span>
                    </div>
                ),
            },
            {
                id: "actions",
                header: () => <div className="text-center sr-only">Aksi</div>,
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            onClick={() => handleDelete(row.original.id)}
                            disabled={isPending && deletingId === row.original.id}
                        >
                            {isPending && deletingId === row.original.id ? (
                                <IconLoader className="size-4 animate-spin" />
                            ) : (
                                <IconTrash className="size-4" />
                            )}
                            <span className="sr-only">Hapus</span>
                        </Button>
                    </div>
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isPending, deletingId]
    )

    const table = useReactTable({
        data: flatRows,
        columns,
        state: {
            sorting,
            columnFilters,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    // Unique meal types for filter
    const mealTypes = React.useMemo(() => {
        const types = new Set(flatRows.map((r) => r.mealType).filter(Boolean))
        return Array.from(types).sort()
    }, [flatRows])

    return (
        <div className="flex w-full flex-col gap-4">
            {/* ── Week navigator ──────────────────────────────── */}
            <div className="flex items-center justify-between rounded-xl border bg-card/80 backdrop-blur-sm px-4 py-3 shadow-sm">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPreviousWeek}
                    className="size-9 rounded-lg text-primary hover:bg-primary/10"
                >
                    <IconChevronLeft className="size-5" />
                </Button>

                <div className="flex flex-col items-center gap-0.5">
                    <span className="text-sm font-bold text-primary">
                        {weekRange.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {weekRange.rangeText}
                    </span>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNextWeek}
                    disabled={weeksAgo === 0}
                    className="size-9 rounded-lg text-primary hover:bg-primary/10 disabled:opacity-30"
                >
                    <IconChevronRight className="size-5" />
                </Button>
            </div>

            {/* ── Weekly summary + filters ─────────────────── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Weekly total */}
                {!isLoading && data.days.length > 0 && (
                    <div className="flex items-center gap-2 px-1">
                        <div className="flex items-center gap-1.5 rounded-lg bg-primary/8 px-3 py-1.5 border border-primary/10">
                            <IconFlame className="size-4 text-primary" />
                            <span className="text-sm font-bold text-primary tabular-nums">
                                {weeklyTotal.toLocaleString("id-ID")}
                            </span>
                            <span className="text-xs text-primary/70">kcal total</span>
                        </div>
                    </div>
                )}

                {/* Search + filter controls */}
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Search */}
                    <div className="relative">
                        <IconSearch className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                        <Input
                            placeholder="Cari makanan…"
                            value={
                                (table.getColumn("nama")?.getFilterValue() as string) ?? ""
                            }
                            onChange={(e) =>
                                table.getColumn("nama")?.setFilterValue(e.target.value)
                            }
                            className="h-9 w-[180px] pl-8 text-sm"
                        />
                    </div>

                    {/* Meal type filter */}
                    <Label htmlFor="meal-filter" className="sr-only">
                        Filter Jenis Makanan
                    </Label>
                    <Select
                        value={
                            (table
                                .getColumn("mealType")
                                ?.getFilterValue() as string) || "all"
                        }
                        onValueChange={(value) =>
                            table
                                .getColumn("mealType")
                                ?.setFilterValue(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger className="h-9 w-[140px]" size="sm" id="meal-filter">
                            <SelectValue placeholder="Semua Jenis" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Jenis</SelectItem>
                            {mealTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* ── Data table ──────────────────────────────────── */}
            {isLoading ? (
                <div className="flex items-center justify-center rounded-xl border bg-card/50 py-16">
                    <IconLoader className="size-5 animate-spin text-primary mr-2" />
                    <span className="text-sm text-muted-foreground">
                        Memuat riwayat…
                    </span>
                </div>
            ) : flatRows.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border bg-card/50 py-16 gap-2">
                    <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center">
                        <IconFlame className="size-6 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Tidak ada catatan konsumsi untuk minggu ini.
                    </p>
                </div>
            ) : (
                <>
                    <div className="overflow-hidden rounded-xl border bg-card/50 shadow-sm">
                        <Table>
                            <TableHeader className="bg-muted/40">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow
                                        key={headerGroup.id}
                                        className="border-b border-border/50 hover:bg-transparent"
                                    >
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70"
                                            >
                                                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                                    <button
                                                        className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {header.column.getIsSorted() === "asc" ? (
                                                            <IconSortAscending className="size-3.5" />
                                                        ) : header.column.getIsSorted() === "desc" ? (
                                                            <IconSortDescending className="size-3.5" />
                                                        ) : (
                                                            <IconChevronDown className="size-3 opacity-0 group-hover:opacity-40" />
                                                        )}
                                                    </button>
                                                ) : (
                                                    flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )
                                                )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            className="border-b border-border/30 transition-colors hover:bg-muted/20"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell
                                                    key={cell.id}
                                                    className="py-2"
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            Tidak ada hasil yang cocok.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* ── Pagination ───────────────────────────── */}
                    <div className="flex items-center justify-between px-1">
                        <div className="hidden text-sm text-muted-foreground lg:block">
                            {table.getFilteredRowModel().rows.length} catatan
                        </div>
                        <div className="flex w-full items-center gap-6 lg:w-fit">
                            {/* Rows per page */}
                            <div className="hidden items-center gap-2 lg:flex">
                                <Label
                                    htmlFor="rows-per-page"
                                    className="text-xs text-muted-foreground whitespace-nowrap"
                                >
                                    Per halaman
                                </Label>
                                <Select
                                    value={`${table.getState().pagination.pageSize}`}
                                    onValueChange={(value) => {
                                        table.setPageSize(Number(value))
                                    }}
                                >
                                    <SelectTrigger
                                        size="sm"
                                        className="h-8 w-16"
                                        id="rows-per-page"
                                    >
                                        <SelectValue
                                            placeholder={table.getState().pagination.pageSize}
                                        />
                                    </SelectTrigger>
                                    <SelectContent side="top">
                                        {[10, 20, 30, 50].map((pageSize) => (
                                            <SelectItem
                                                key={pageSize}
                                                value={`${pageSize}`}
                                            >
                                                {pageSize}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Page indicator */}
                            <div className="flex w-fit items-center justify-center text-xs text-muted-foreground tabular-nums">
                                Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
                                {table.getPageCount()}
                            </div>

                            {/* Page nav buttons */}
                            <div className="ml-auto flex items-center gap-1 lg:ml-0">
                                <Button
                                    variant="outline"
                                    className="hidden size-8 lg:flex"
                                    size="icon"
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <span className="sr-only">Halaman pertama</span>
                                    <IconChevronsLeft className="size-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="size-8"
                                    size="icon"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <span className="sr-only">Halaman sebelumnya</span>
                                    <IconChevronLeft className="size-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="size-8"
                                    size="icon"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <span className="sr-only">Halaman berikutnya</span>
                                    <IconChevronRight className="size-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="hidden size-8 lg:flex"
                                    size="icon"
                                    onClick={() =>
                                        table.setPageIndex(table.getPageCount() - 1)
                                    }
                                    disabled={!table.getCanNextPage()}
                                >
                                    <span className="sr-only">Halaman terakhir</span>
                                    <IconChevronsRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
