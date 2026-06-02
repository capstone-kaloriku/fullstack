import { ChevronLeft } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
    food: {
        id: string;
        nama: string;
        kalori: number;
    };
}

function Header({ food }: HeaderProps) {
    return (
        <header className="sticky top-0 z-35 w-full bg-neutral-100/50 backdrop-blur-md px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link
                    href="/all-foods"
                    className="flex items-center justify-center p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-600 hover:text-neutral-900"
                >
                    <ChevronLeft size={20} className="stroke-[2.5]" />
                </Link>
                <div>
                    <span className="text-xs font-semibold text-primary/80 uppercase tracking-wider">Detail Makanan</span>
                    <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                        {food.nama}
                    </h1>
                </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold border border-primary/20 shadow-sm">
                <span>{food.kalori} kcal / porsi</span>
            </div>
        </header>
    )
}

export default Header