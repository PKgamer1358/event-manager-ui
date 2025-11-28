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

  async deleteEvent(id: number): Promise<void> {
    await axiosInstance.delete(`/api/events/${id}`);
  },
};
