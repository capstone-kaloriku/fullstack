interface ProgressBarDetailProps {
  kcal: number;
  target: number;
}

function ProgressBarDetail({ kcal, target }: ProgressBarDetailProps) {
  return (
    <>
      <div className="absolute right-40 left-20 top-20 inset-0 size-36 rounded-full bg-linear-to-br from-primary to-secondary-foreground opacity-30 blur-2xl" />
      {/* Responsive Mobile :v */}
      <div className="flex flex-col items-center justify-center text-xs lg:text-base text-muted-foreground md:hidden">
        Sisa Kalori Hari ini
        <span className="text-3xl lg:text-4xl xl:text-6xl font-extrabold text-black">{kcal}</span>
        <span className="text-base lg:text-xl text-primary font-medium">kcal</span>
      </div>
      <div className="text-xs font-medium text-muted-foreground bg-muted-foreground/20 backdrop-blur-xl rounded-full mt-4 px-2 py-2 md:hidden">
        Target : <span className="font-bold text-black">{target} kcal</span>
      </div>
      <div className="hidden md:flex flex-col items-center justify-center text-sm text-muted-foreground">
        <p>TARGET</p>
        <span className="text-2xl font-bold text-black">{target}</span>
        kcal
      </div>
    </>
  )
}

export default ProgressBarDetail;