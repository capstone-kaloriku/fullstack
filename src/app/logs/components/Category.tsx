import { Card, CardContent } from '@/components/ui/card';
import { CategoryProps } from '@/types';


function Category({ data }: CategoryProps) {
  return (
    <div className="w-full flex flex-col gap-6 my-6">
      <span className="text-lg font-bold">Kategori</span>
      <div className="w-full flex flex-row items-center justify-around gap-3">
        {data.map((item) => (
          <div className="flex w-5 flex-col items-center text-center justify-center gap-3" key={item.id}>
            <Card key={item.id} className="w-16 h-16 flex items-center justify-center rounded-full border border-gray-300">
              <CardContent>
                {item.icon}
              </CardContent>
            </Card>
            <span className="text-muted-foreground text-[13px] font-medium">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Category