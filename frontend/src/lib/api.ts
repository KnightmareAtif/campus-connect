/**
 * API Service
 * Handles all communication with the backend API
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  requiresAuth?: boolean;
}

class ApiService {
  private getToken(): string | null {
    const user = localStorage.getItem('campus_user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.token || null;
    }
    return null;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, requiresAuth = true } = options;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ token: string; user: unknown }>('/auth/login', {
      method: 'POST',
      body: { email, password },
      requiresAuth: false,
    });
  }

  async register(name: string, email: string, password: string, role: string) {
    return this.request<{ token: string; user: unknown }>('/auth/register', {
      method: 'POST',
      body: { name, email, password, role: role.toUpperCase() },
      requiresAuth: false,
    });
  }

  // Student - Timetable
  async getTimetable() {
    return this.request<{ timetable: unknown }>('/student/timetable');
  }

  async updateTimetable(slots: unknown[], config?: unknown) {
    return this.request<{ timetable: unknown }>('/student/timetable', {
      method: 'POST',
      body: { slots, config },
    });
  }

  // Student - Friends
  async getFriends() {
    return this.request<{ friends: unknown[] }>('/student/friends');
  }

  async sendFriendRequest(userId: string) {
    return this.request<{ message: string }>(`/student/friends/request/${userId}`, {
      method: 'POST',
    });
  }

  async getPendingRequests() {
    return this.request<{ received: unknown[]; sent: unknown[] }>('/student/friends/requests');
  }

  async acceptFriendRequest(requestId: string) {
    return this.request<{ message: string }>(`/student/friends/accept/${requestId}`, {
      method: 'POST',
    });
  }

  async rejectFriendRequest(requestId: string) {
    return this.request<{ message: string }>(`/student/friends/reject/${requestId}`, {
      method: 'POST',
    });
  }

  async getFriendAvailability(userId: string) {
    return this.request<{ availability: unknown }>(`/student/friends/${userId}/availability`);
  }

  // Student - Groups
  async getGroups() {
    return this.request<{ groups: unknown[] }>('/student/groups');
  }

  async createGroup(name: string, type: string, memberIds?: string[]) {
    return this.request<{ group: unknown }>('/student/groups', {
      method: 'POST',
      body: { name, type, memberIds },
    });
  }

  async addGroupMember(groupId: string, userId: string) {
    return this.request<{ group: unknown }>(`/student/groups/${groupId}/members`, {
      method: 'POST',
      body: { userId },
    });
  }

  async removeGroupMember(groupId: string, userId: string) {
    return this.request<{ group: unknown }>(`/student/groups/${groupId}/members/${userId}`, {
      method: 'DELETE',
    });
  }

  async getGroupMessages(groupId: string, page = 1) {
    return this.request<{ messages: unknown[] }>(`/student/groups/${groupId}/messages?page=${page}`);
  }

  async sendGroupMessage(groupId: string, content: string) {
    return this.request<{ message: unknown }>(`/student/groups/${groupId}/messages`, {
      method: 'POST',
      body: { content },
    });
  }

  // Student - Profile
  async updateStudentProfile(data: { phone?: string; email?: string }) {
    return this.request<{ user: unknown }>('/student/profile', {
      method: 'PUT',
      body: data,
    });
  }

  // Teacher
  async getAllTeachers() {
    return this.request<{ teachers: unknown[] }>('/teacher/all', { requiresAuth: false });
  }

  async getTeacherAvailability(teacherId: string) {
    return this.request<{ availability: unknown }>(`/teacher/${teacherId}/availability`, { requiresAuth: false });
  }

  async updateTeacherProfile(data: { phone?: string; email?: string; cabin?: string }) {
    return this.request<{ teacher: unknown }>('/teacher/profile', {
      method: 'PUT',
      body: data,
    });
  }

  async getTeacherTimetable() {
    return this.request<{ timetable: unknown }>('/teacher/timetable');
  }

  async updateTeacherTimetable(slots: unknown[], config?: unknown) {
    return this.request<{ timetable: unknown }>('/teacher/timetable', {
      method: 'POST',
      body: { slots, config },
    });
  }

  async updateOfficeHours(officeHours: unknown[]) {
    return this.request<{ officeHours: unknown[] }>('/teacher/office-hours', {
      method: 'POST',
      body: { officeHours },
    });
  }

  async getMyStudents() {
    return this.request<{ students: unknown[] }>('/teacher/students');
  }

  // Clubs
  async getAllClubs() {
    return this.request<{ clubs: unknown[] }>('/club/all', { requiresAuth: false });
  }

  async followClub(clubId: string) {
    return this.request<{ message: string }>(`/club/${clubId}/follow`, {
      method: 'POST',
    });
  }

  async unfollowClub(clubId: string) {
    return this.request<{ message: string }>(`/club/${clubId}/unfollow`, {
      method: 'POST',
    });
  }

  async getUpcomingEvents(followedOnly = false) {
    return this.request<{ events: unknown[] }>(`/club/events/upcoming?followedOnly=${followedOnly}`);
  }

  async getClubEvents() {
    return this.request<{ events: unknown[] }>('/club/events');
  }

  async createEvent(data: {
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    maxAttendees?: number;
    requiresRegistration?: boolean;
  }) {
    return this.request<{ event: unknown }>('/club/events', {
      method: 'POST',
      body: data,
    });
  }

  async updateEvent(eventId: string, data: unknown) {
    return this.request<{ event: unknown }>(`/club/events/${eventId}`, {
      method: 'PUT',
      body: data as Record<string, unknown>,
    });
  }

  async deleteEvent(eventId: string) {
    return this.request<{ message: string }>(`/club/events/${eventId}`, {
      method: 'DELETE',
    });
  }

  async registerForEvent(eventId: string) {
    return this.request<{ message: string }>(`/club/events/${eventId}/register`, {
      method: 'POST',
    });
  }

  async unregisterFromEvent(eventId: string) {
    return this.request<{ message: string }>(`/club/events/${eventId}/unregister`, {
      method: 'POST',
    });
  }

  async getEventRegistrations(eventId: string) {
    return this.request<{ registrations: unknown[] }>(`/club/events/${eventId}/registrations`);
  }

  async getClubProfile() {
    return this.request<{ club: unknown }>('/club/profile');
  }

  async updateClubProfile(data: { name?: string; description?: string; category?: string }) {
    return this.request<{ club: unknown }>('/club/profile', {
      method: 'PUT',
      body: data,
    });
  }

  // Admin
  async getAllUsers() {
    return this.request<{ users: unknown[] }>('/admin/users');
  }

  async blockUser(userId: string) {
    return this.request<{ message: string }>(`/admin/users/${userId}/block`, {
      method: 'POST',
    });
  }

  async unblockUser(userId: string) {
    return this.request<{ message: string }>(`/admin/users/${userId}/unblock`, {
      method: 'POST',
    });
  }

  async deleteUser(userId: string) {
    return this.request<{ message: string }>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async adminDeleteEvent(eventId: string) {
    return this.request<{ message: string }>(`/admin/events/${eventId}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
export default api;
