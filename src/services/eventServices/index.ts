import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getAllEvents = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // if you always want fresh data
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to fetch events" };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Get Events Error:", error);
    return { success: false, message: error.message };
  }
};
export const createEvent = async (eventData: FieldValues) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
    if (!accessToken) return { success: false, message: "No token found" };

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(eventData),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to create event" };
    }

    return { success: true, data, message: "Event created successfully" };
  } catch (error: any) {
    console.error("Create Event Error:", error);
    return { success: false, message: error.message };
  }
};
export const registerForEvent = async (eventId: number) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
    if (!accessToken) return { success: false, message: "No token found" };

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/events/${eventId}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to register for event" };
    }

    return { success: true, data, message: "Registered successfully" };
  } catch (error: any) {
    console.error("Register Event Error:", error);
    return { success: false, message: error.message };
  }
};
export const getEventById = async (eventId: number) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/events/${eventId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to fetch event" };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Get Event By ID Error:", error);
    return { success: false, message: error.message };
  }
};
