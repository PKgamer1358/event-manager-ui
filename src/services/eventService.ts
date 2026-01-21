import axiosInstance from "../utils/axios";
import { Event, EventFormData } from "../types";

export const eventService = {
  async getAllEvents(): Promise<Event[]> {
    const response = await axiosInstance.get<Event[]>("/api/events");
    return response.data;
  },

  async getEventById(id: number): Promise<Event> {
    const response = await axiosInstance.get<Event>(`/api/events/${id}`);
    return response.data;
  },

  async createEvent(data: EventFormData): Promise<Event> {
    const response = await axiosInstance.post<Event>("/api/events", data);
    return response.data;
  },

  async updateEvent(id: number, data: EventFormData): Promise<Event> {
    const response = await axiosInstance.put<Event>(`/api/events/${id}`, data);
    return response.data;
  },

  async deleteEvent(id: number): Promise<void> {
    await axiosInstance.delete(`/api/events/${id}`);
  },

  async getEventMedia(id: number): Promise<import("../types").EventMedia[]> {
    const response = await axiosInstance.get<import("../types").EventMedia[]>(
      `/api/events/${id}/media`
    );
    return response.data;
  },

  async uploadEventMedia(id: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    await axiosInstance.post(`/api/events/${id}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async deleteEventMedia(eventId: number, mediaId: number): Promise<void> {
    await axiosInstance.delete(`/api/events/${eventId}/media/${mediaId}`);
  },

  async getEventInsights(id: number): Promise<import("../types").EventInsights> {
    const response = await axiosInstance.get<import("../types").EventInsights>(
      `/api/events/${id}/insights`
    );
    return response.data;
  },

  async getGlobalInsights(): Promise<import("../types").GlobalInsights> {
    const response = await axiosInstance.get<import("../types").GlobalInsights>(
      "/api/events/insights/global"
    );
    return response.data;
  },
};
