import MyCreatedEventsPage from "@/components/event/myEvents";
import { getProfile } from "@/services/AuthService";
import { redirect } from "next/navigation";

export default async function Page() {
  const profileRes = await getProfile();

  if (!profileRes.success) {
    // redirect if not logged in
    redirect("/sign-in");
  }

  return (
    <div className="font-sans min-h-screen flex flex-col items-center gap-16 pb-20">
      <div className="w-full">
        <MyCreatedEventsPage />
      </div>
    </div>
  );
}
