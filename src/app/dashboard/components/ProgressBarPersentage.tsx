interface ProgressBarPersentageProps {
  Percentage: string;
}

function ProgressBarPersentage({ Percentage }: ProgressBarPersentageProps) {
  return (
    <div className="w-auto h-auto">
      <div className="flex flex-col items-center justify-center">
        <span className="text-xs font-bold">{Percentage}</span>
      </div>
    </div>
  )
}

export default ProgressBarPersentage;