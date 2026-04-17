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
      href: "/",
    },
    {
      id: 2,
      name: "Logs",
      icon: <FaArrowTrendUp />,
      href: "/",
    },
    {
      id: 3,
      name: "AI",
      icon: <FaCommentDots />,
      href: "/",
    },
    {
      id: 4,
      name: "Profile",
      icon: <FaCircleUser />,
      href: "/",
    },
  ];

  return (
    <div className="max-w-4xl p-6">
      <div className="flex justify-around">
        {icon.map((icon) => {
          return (
            <Link key={icon.id} href={icon.href}>
              <div className="flex flex-col items-center justify-center p-2.5 text-muted-foreground">
                {icon.icon}
                <span>{icon.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Footer;
