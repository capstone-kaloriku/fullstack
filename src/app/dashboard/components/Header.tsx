import Image from "next/image";
import { BsBellFill } from "react-icons/bs";

interface HeaderProps {
  children: React.ReactNode;
  profileImageUrl?: string;
}

function Header({ children, profileImageUrl }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-6 border-b bg-primary-foreground shadow-sm z-99">
      <div className="flex items-center gap-4">
        <div>
          <Image
            src={profileImageUrl || "/profile.jpg"}
            width={50}
            height={50}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        <h1 className="text-xl font-bold text-primary">{children}</h1>
      </div>

      <BsBellFill className="text-xl text-primary" />
    </header>
  );
}

export default Header;
