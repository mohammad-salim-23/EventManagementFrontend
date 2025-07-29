'use client';

import { useEffect, useState } from 'react';
import { getMyEvents, deleteEvent, updateEvent } from '@/services/eventServices';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  status: string;
  image_url?: string;
}

export default function MyCreatedEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await getMyEvents();
      if (res.success) setEvents(res.data);
      else toast.error(res.message);
    };
    fetchData();
  }, []);

  const handleDelete = async (eventId: number) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      const res = await deleteEvent(eventId);
      if (res.success) {
        setEvents(events.filter(e => e.id !== eventId));
        toast.success(res.message);
      } else toast.error(res.message);
    }
  };

  const handleEditClick = (event: Event) => {
    setEditEvent(event);
    setFormData({ ...event });
  };

  const handleCloseEdit = () => {
    setEditEvent(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!editEvent) return;
    const res = await updateEvent(editEvent.id, formData);
    if (res.success) {
      setEvents(prev => prev.map(e => (e.id === editEvent.id ? res.data.event : e)));
      toast.success(res.message);
      setEditEvent(null); // auto close form on success
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Created Events</h1>

      {events.map(event => (
        <div key={event.id} className="border rounded-xl p-4 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p>{event.description}</p>
              <p className="text-gray-500 text-sm">📍 {event.location}</p>
              <p className="text-gray-500 text-sm">🗓️ {event.date} 🕒 {event.time}</p>
              <p className="text-sm text-blue-600">Status: {event.status}</p>
            </div>
            <div className="space-x-2">
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded cursor-pointer"
                onClick={() => handleEditClick(event)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded cursor-pointer"
                onClick={() => handleDelete(event.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {editEvent && (
        <div className="border mt-6 p-6 rounded-xl shadow-md relative">
          <h2 className="text-xl font-bold mb-4">Edit Event: {editEvent.title}</h2>

          <div className="space-y-4">
            <input
              name="title"
              value={formData.title || ''}
              onChange={handleFormChange}
              placeholder="Title"
              className="w-full p-2 border rounded"
            />
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleFormChange}
              placeholder="Description"
              className="w-full p-2 border rounded"
            />
            <input
              name="location"
              value={formData.location || ''}
              onChange={handleFormChange}
              placeholder="Location"
              className="w-full p-2 border rounded"
            />
            <input
              type="date"
              name="date"
              value={formData.date || ''}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="time"
              name="time"
              value={formData.time || ''}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
            />
            <input
              name="image_url"
              value={formData.image_url || ''}
              onChange={handleFormChange}
              placeholder="Image URL"
              className="w-full p-2 border rounded"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleUpdate}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
              >
                Update Event
              </button>
              <button
                onClick={handleCloseEdit}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
