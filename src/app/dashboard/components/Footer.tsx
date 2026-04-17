import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FaArrowTrendUp,
  FaCircleUser,
  FaCommentDots,
  FaHouseChimney,
} from "react-icons/fa6";

function Footer() {
  const icon = [
    {
      id: 1,
      name: "Home",
      icon: <FaHouseChimney />,
      href: "/dashboard",
    },
    {
      id: 2,
      name: "Logs",
      icon: <FaArrowTrendUp />,
      href: "/logs",
    },
    {
      id: 3,
      name: "AI",
      icon: <FaCommentDots />,
      href: "/ai",
    },
    {
      id: 4,
      name: "Profile",
      icon: <FaCircleUser />,
      href: "/profile",
    },
  ];

  return (
    <div className="max-w-4xl bg-primary/90 shadow rounded-t-2xl p-4 mx-auto w-full absolute bottom-0 left-0 right-0">
      <div className="flex flex-row items-center justify-around">
        {icon.map((icon) => {
          return (
            <Button nativeButton={false} render={<Link href={icon.href} />} key={icon.id} variant="link" className="w-auto h-fit p-0">
              <div className="flex flex-col items-center justify-center p-2.5 text-primary-foreground">
                {icon.icon}
                <span>{icon.name}</span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default Footer;
