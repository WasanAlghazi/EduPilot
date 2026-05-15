export async function fetchDashboardData() {
  const token = localStorage.getItem('edupilot_token');
  const response = await fetch('/api/dashboard', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return response.json();
}

export async function fetchStudentProfile(studentId: string) {
  const response = await fetch(`/api/student/${studentId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch student profile');
  }
  return response.json();
}

export async function sendChatMessage(message: string, studentId: string) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, student_id: studentId })
  });
  if (!response.ok) {
    throw new Error('Chat failed');
  }
  return response.json();
}
