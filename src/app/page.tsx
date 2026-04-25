import { Button } from "@/components/ui/button";
import Link from "next/link";

const Home = () => {
  return (
    <div className="max-w-lg p-6 mx-auto bg-accent-foreground">
      <div>
        <h1 className="text-xl font-bold mb-4">Welcome to KaloriKU</h1>
        <div className="flex flex-col gap-4">
          <Button
            nativeButton={false}
            render={<Link href="/login" />}
            variant="default"
            className="w-full"
          >
            Klik sini dulu buat ke login page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
