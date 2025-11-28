import axiosInstance from "../utils/axios";
import { Registration } from "../types";

export const registrationService = {
  async registerForEvent(eventId: number): Promise<Registration> {
    const response = await axiosInstance.post<Registration>(
      `/api/registrations/events/${eventId}/register`
    );
    return response.data;
  },

  async unregisterFromEvent(eventId: number): Promise<void> {
    await axiosInstance.delete(`/api/registrations/events/${eventId}/register`);
  },

  async getEventRegistrations(eventId: number): Promise<Registration[]> {
    const response = await axiosInstance.get<Registration[]>(
      `/api/registrations/events/${eventId}/registrations`
    );
    return response.data;
  },

  async getMyRegistrations(): Promise<Registration[]> {
    const response = await axiosInstance.get<Registration[]>(
      "/api/registrations/my-registrations"
    );
    return response.data;
  },
};
