import { create } from 'zustand';
import client from '../api/client';

export const useDashboardStore = create((set) => ({
  overview: null,
  messages: [],
  leads: [],
  loading: false,
  async fetchAll() {
    set({ loading: true });
    const [overviewRes, messagesRes, leadsRes] = await Promise.all([
      client.get('/metrics/overview'),
      client.get('/metrics/messages/recent'),
      client.get('/leads')
    ]);
    set({
      overview: overviewRes.data,
      messages: messagesRes.data,
      leads: leadsRes.data,
      loading: false
    });
  }
}));
