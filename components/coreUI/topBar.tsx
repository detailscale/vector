import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";
import CartButton from "./cartButton";

export default function TopBar() {
  return (
    <main>
      <div className="pt-5 max-w-2xl mx-auto">
        <div className="flex justify-between items-center w-full">
          <Button className="w-8 h-8 bg-[#171717] rounded-sm border border-[#2f2f2f] cursor-pointer hover:bg-[#262626] transition-all duration-150 ease-in-out">
            <User />
          </Button>

          <div className="flex gap-2">
            <div className="relative">
              <CartButton />
            </div>
            <Button className="w-8 h-8 bg-[#171717] rounded-sm border border-[#2f2f2f] p-2 cursor-pointer hover:bg-[#262626] transition-all duration-150 ease-in-out">
              <Bell />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
