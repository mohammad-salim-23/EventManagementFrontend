import EventBanner from "@/components/Banner";
import Image from "next/image";

export default function Home() {
  return (
     <div className="font-sans min-h-screen flex flex-col items-center gap-16 pb-20">
      <div className="w-full">
        <EventBanner />
      </div>
    </div>
  );
}
