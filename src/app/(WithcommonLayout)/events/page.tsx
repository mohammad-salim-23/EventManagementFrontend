import EventListPage from "@/components/event/getAllEvents";

const Page = ()=>{
    return (
        <div className="font-sans min-h-screen flex flex-col items-center gap-16 pb-20">
            <div className="w-full">
                <EventListPage/>
            </div>
        </div>
    );
}
export default Page;