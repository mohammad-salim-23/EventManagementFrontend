"use server";

import { cookies } from "next/headers";

/* eslint-disable @typescript-eslint/no-explicit-any */

const API_BASE = process.env.NEXT_PUBLIC_BASE_API;

export const getAllEvents = async () => {
  try {
    const res = await fetch(`${API_BASE}/events`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Failed to fetch events" };
    return { success: true, data };
  } catch (error: any) {
    console.error("Get Events Error:", error);
    return { success: false, message: error.message };
  }
};

export const getEventById = async (eventId: number) => {
  try {
    const res = await fetch(`${API_BASE}/events/${eventId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Failed to fetch event" };
    return { success: true, data };
  } catch (error: any) {
    console.error("Get Event By ID Error:", error);
    return { success: false, message: error.message };
  }
};

export const createEvent = async (eventData: any) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
    if (!accessToken) return { success: false, message: "No token found" };

    const res = await fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(eventData),
    });

    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Failed to create event" };
    return { success: true, data, message: "Event created successfully" };
  } catch (error: any) {
    console.error("Create Event Error:", error);
    return { success: false, message: error.message };
  }
};

export const updateEvent = async (eventId: number, eventData: any) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
    if (!accessToken) return { success: false, message: "No token found" };

    const res = await fetch(`${API_BASE}/events/${eventId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(eventData),
    });

    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Failed to update event" };
    return { success: true, data, message: "Event updated successfully" };
  } catch (error: any) {
    console.error("Update Event Error:", error);
    return { success: false, message: error.message };
  }
};

export const deleteEvent = async (eventId: number) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
    if (!accessToken) return { success: false, message: "No token found" };

    const res = await fetch(`${API_BASE}/events/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, message: data.message || "Failed to delete event" };
    }

    return { success: true, message: "Event deleted successfully" };
  } catch (error: any) {
    console.error("Delete Event Error:", error);
    return { success: false, message: error.message };
  }
};

export const registerForEvent = async (eventId: number) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
    if (!accessToken) return { success: false, message: "Please log in to continue." };

    const res = await fetch(`${API_BASE}/events/${eventId}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const contentType = res.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = { message: text };
    }

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to register for event" };
    }

    return { success: true, data, message: data.message || "Registered successfully" };
  } catch (error: any) {
    console.error("Register Event Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
};

export const getMyEvents = async () => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
    if (!accessToken) return { success: false, message: "No token found" };

    const res = await fetch(`${API_BASE}/events/my-events`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Failed to fetch my events" };
    return { success: true, data };
  } catch (error: any) {
    console.error("Get My Events Error:", error);
    return { success: false, message: error.message };
  }
};

export const getMyRegistrations = async () => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
    if (!accessToken) return { success: false, message: "No token found" };

    const res = await fetch(`${API_BASE}/events/my-registrations`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Failed to fetch registrations" };
    return { success: true, data };
  } catch (error: any) {
    console.error("Get My Registrations Error:", error);
    return { success: false, message: error.message };
  }
};

export const getEventParticipants = async (eventId: number) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
    if (!accessToken) return { success: false, message: "No token found" };

    const res = await fetch(`${API_BASE}/events/${eventId}/participants`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Failed to fetch participants" };
    return { success: true, data };
  } catch (error: any) {
    console.error("Get Participants Error:", error);
    return { success: false, message: error.message };
  }
};
