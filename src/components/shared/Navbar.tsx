/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { Skeleton } from "../ui/skeleton";

import { getProfile, logout } from "@/services/AuthService";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleLogOut = async () => {
    await logout();
    setUser(null);
    toast.success("Logged out successfully", {
      style: { backgroundColor: "green", color: "white" },
    });
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "All Events" },
    { href: "/my-events", label: "My Created Events" },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const res = await getProfile();
      if (res.success) {
        setUser(res.data);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  return (
    <header className="border-b w-full sticky top-0 z-50 bg-white shadow-sm">
      <div className="container flex justify-between items-center mx-auto h-16 px-3">
        {/* Logo */}
        <Link href={"/"}>
          <h1 className="text-2xl md:text-3xl font-bold text-teal-600">
            EventManager
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-center flex-1">
          <ul className="flex space-x-6 text-sm text-gray-800 font-medium">
            {navLinks.map((link) => (
              <li
                key={link.href}
                className={clsx(
                  pathname === link.href && "text-teal-600",
                  "font-bold"
                )}
              >
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center">
          <nav className="md:flex gap-2 items-center">
            {loading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-200" />
                  <Skeleton className="h-4 w-16 bg-gray-200" />
                </div>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none cursor-pointer">
                  <Avatar className="border-2 border-teal-500 rounded-full">
                    <AvatarImage src={user?.image || "https://i.pravatar.cc/300"} />
                    <AvatarFallback>Profile</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogOut}
                    className="cursor-pointer text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href={"/sign-in"}>
                  <button className="mr-2 text-sm border border-teal-500 px-4 py-2 rounded-md text-teal-500 hover:bg-teal-500 hover:text-white transition cursor-pointer">
                    Sign In
                  </button>
                </Link>
                <Link href={"/sign-up"}>
                  <button className="text-sm border border-teal-500 px-4 py-2 rounded-md text-teal-500 hover:bg-teal-500 hover:text-white transition cursor-pointer">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="space-y-4 mt-4 p-5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={clsx(
                        pathname === link.href && "text-teal-600",
                        "block text-sm font-semibold"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
