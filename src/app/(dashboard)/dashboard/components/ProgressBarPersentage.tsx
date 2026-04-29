interface ProgressBarPersentageProps {
  Percentage: string;
}

function ProgressBarPersentage({ Percentage }: ProgressBarPersentageProps) {
  return (
    <div className="w-auto h-auto">
      <div className="flex flex-col items-center justify-center">
        <span className="text-xs md:text-base lg:text-2xl font-bold">{Percentage}</span>
      </div>
    </div>
  )
}

export default ProgressBarPersentage;