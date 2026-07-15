const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:10000/api').replace(/\/$/, '');

export const getToken = () => sessionStorage.getItem('taskflow-token');

async function request(path, options = {}) {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers
    }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'Không thể kết nối máy chủ.');
  }
  return response.status === 204 ? null : response.json();
}

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  updateProfile: (changes) => request('/profile', { method: 'PATCH', body: JSON.stringify(changes) }),
  uploadAvatar: (file) => {
    const body = new FormData();
    body.append('avatar', file);
    return request('/profile/avatar', { method: 'POST', body });
  },
  register: (details) => request('/auth/register', { method: 'POST', body: JSON.stringify(details) }),
  users: () => request('/users'),
  reminders: () => request('/reminders'),
  createReminder: (details) => request('/reminders', { method: 'POST', body: JSON.stringify(details) }),
  reminderReports: () => request('/reminder-reports'),
  markWarning: (id, details) => request(`/users/${id}/warnings`, { method: 'POST', body: JSON.stringify(details) }),
  clearReminders: () => request('/reminders', { method: 'DELETE' }),
  tasks: () => request('/tasks'),
  departmentTasks: () => request('/tasks/department'),
  createTask: (task, files = []) => {
    const body = new FormData();
    body.append('task', JSON.stringify(task));
    files.forEach((file) => body.append('files', file, file.webkitRelativePath || file.name));
    return request('/tasks', { method: 'POST', body });
  },
  submitTask: (id, message, files = []) => {
    const body = new FormData();
    body.append('message', message || '');
    files.forEach((file) => body.append('files', file, file.webkitRelativePath || file.name));
    return request(`/tasks/${id}/submissions`, { method: 'POST', body });
  },
  reviewSubmission: (taskId, submissionId, action, comment = '') => request(`/tasks/${taskId}/submissions/${submissionId}`, {
    method: 'PATCH', body: JSON.stringify({ action, comment })
  }),
  markTaskReviewsRead: (id) => request(`/tasks/${id}/submissions/read`, { method: 'PATCH', body: '{}' }),
  updateTask: (id, changes) => request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' })
};

export const attachmentUrl = (file) => `${API_URL}/attachments/${encodeURIComponent(file.id)}?key=${encodeURIComponent(file.accessKey)}`;
export const avatarUrl = (avatar) => avatar?.id && avatar?.accessKey ? `${API_URL}/avatars/${encodeURIComponent(avatar.id)}?key=${encodeURIComponent(avatar.accessKey)}` : '';
