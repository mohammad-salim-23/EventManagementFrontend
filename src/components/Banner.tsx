/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import './Banner.css';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import bannerEvent from "../app/assets/images/event.jpg";;
import CreateEventForm from "./event/createEventForm";
import { Dialog } from "@headlessui/react";
import { getProfile } from "@/services/AuthService";

export default function EventBanner() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
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

  const handleCreateEvent = () => {
    if (!user) {
      window.location.href = "/sign-in";
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative w-full">
      {/* Banner Image */}
      <div className="relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh]">
        <Image
          src={bannerEvent}
          alt="Event Banner"
          fill
          className="
            md:object-cover 
            lg:object-fill 
            lg:w-full lg:h-full
            brightness-75
          "
          priority
        />
      </div>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-xl">
          Host Your Next Event
        </h2>
        <p className="max-w-xl mb-6 text-gray-100">
          Create and manage events, invite participants, and share memorable moments.
        </p>

        <button
          onClick={handleCreateEvent}
          className="relative px-6 py-3 text-lg border-2 border-teal-500 text-teal-500 hover:bg-white hover:text-teal-700 transition font-bold rounded-md pulseBright cursor-pointer"
        >
          Create Event
        </button>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xl font-bold cursor-pointer"
              aria-label="Close"
            >
              ×
            </button>
            <CreateEventForm closeModal={() => setIsOpen(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
