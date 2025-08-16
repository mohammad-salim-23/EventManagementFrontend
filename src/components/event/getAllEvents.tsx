/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useEffect, useState } from 'react';
import { getAllEvents, registerForEvent, getMyRegistrations } from '@/services/eventServices';
import { toast } from 'sonner';

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
}

export default function EventListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [registeredIds, setRegisteredIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const eventsRes = await getAllEvents();
      const regsRes = await getMyRegistrations();

      if (eventsRes.success) setEvents(eventsRes.data);
      if (regsRes.success) setRegisteredIds(regsRes.data.map((e: any) => e.event_id));
    };
    fetchData();
  }, []);

  const handleRegister = async (eventId: number) => {
    setLoading(true);
    const res = await registerForEvent(eventId);
    setLoading(false);

    if (res.success) {
      toast.success('Successfully registered');
      setRegisteredIds([...registeredIds, eventId]);
    } else {
      toast.error(res.message);
    }
  };

  // Filter events based on search term (case-insensitive)
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search events by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-1/2"
        />
      </div>

      {/* Event List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="border rounded-xl p-4 shadow-md flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                <p className="text-gray-600 text-sm">{event.description}</p>
                <p className="text-gray-500 text-xs mt-2">📍 {event.location}</p>
                <p className="text-gray-500 text-xs">🗓️ {new Date(event.date).toLocaleString()}</p>
              </div>
              <button
                className={`mt-4 py-2 px-4 rounded-lg text-white cursor-pointer ${
                  registeredIds.includes(event.id)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700'
                }`}
                onClick={() => handleRegister(event.id)}
                disabled={registeredIds.includes(event.id) || loading}
              >
                {registeredIds.includes(event.id) ? 'Registered' : 'Register'}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No events found.</p>
        )}
      </div>
    </div>
  );
}
