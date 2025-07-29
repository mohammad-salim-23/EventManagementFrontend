/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createEvent } from "@/services/eventServices";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import toast from "react-hot-toast";

interface CreateEventFormProps {
  closeModal: () => void;
}

const CreateEventForm = ({ closeModal }: CreateEventFormProps) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    setImagePreview(files.map((file) => URL.createObjectURL(file)));
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (imageFiles.length === 0) {
      toast.error("Please upload an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", imageFiles[0]);

      const imgbbRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_HOSTING_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await imgbbRes.json();
      if (!result.success) {
        toast.error("Image upload failed");
        return;
      }

      const imageUrl = result.data.display_url;

      const eventData = {
        ...data,
        image_url: imageUrl,
      };

      const res = await createEvent(eventData);
      if (res?.success) {
        toast.success(res?.message || "Event created successfully");
        reset();
        setImageFiles([]);
        setImagePreview([]);
        closeModal();
      } else {
        toast.error(res?.message || "Failed to create event");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-gray-800">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold mb-1">Title</label>
        <input
          type="text"
          {...register("title", { required: true })}
          className="w-full p-2 border rounded-md"
        />
        {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea
          {...register("description", { required: true })}
          className="w-full p-2 border rounded-md"
          rows={4}
        ></textarea>
        {errors.description && <p className="text-red-500 text-sm">Description is required</p>}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-semibold mb-1">Date</label>
        <input
          type="date"
          {...register("date", { required: true })}
          className="w-full p-2 border rounded-md"
        />
        {errors.date && <p className="text-red-500 text-sm">Date is required</p>}
      </div>

      {/* Time */}
      <div>
        <label className="block text-sm font-semibold mb-1">Time</label>
        <input
          type="time"
          {...register("time", { required: true })}
          className="w-full p-2 border rounded-md"
        />
        {errors.time && <p className="text-red-500 text-sm">Time is required</p>}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold mb-1">Location</label>
        <input
          type="text"
          {...register("location", { required: true })}
          className="w-full p-2 border rounded-md"
        />
        {errors.location && <p className="text-red-500 text-sm">Location is required</p>}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-semibold mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
        {imagePreview.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {imagePreview.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt="Preview"
                width={150}
                height={150}
                className="rounded-md object-cover"
              />
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition"
      >
        {isSubmitting ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
};

export default CreateEventForm;
