// Shared utilities

function showToast(message, type = 'success') {
  // Remove any existing toasts
  const existingToasts = document.querySelectorAll('.toast');
  existingToasts.forEach(t => t.remove());
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // Add styles if not already in CSS
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 100);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function countWords(html) {
  const text = html.replace(/<[^>]*>/g, '').trim();
  const words = text.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

function getIconEmoji(iconName) {
  const icons = {
    'brain': '🧠',
    'landmark': '🏛️',
    'trending-up': '📈',
    'book-open': '📖',
    'heart': '❤️',
    'church': '⛪'
  };
  return icons[iconName] || '📝';
}

async function updateNavigation() {
  const user = await getCurrentUser();
  const authLinks = document.querySelector('.auth-links');
  
  if (!authLinks) return;
  
  if (user) {
    authLinks.innerHTML = `
      <a href="categories.html" data-testid="nav-categories">Categories</a>
      <a href="leaderboard.html" data-testid="nav-leaderboard">Leaderboard</a>
      <a href="dashboard.html" data-testid="nav-dashboard">Dashboard</a>
      ${user.role === 'admin' ? '<a href="admin.html">Admin</a>' : ''}
      <button onclick="handleLogout()" class="btn-ghost" data-testid="logout-button">Logout</button>
    `;
  } else {
    authLinks.innerHTML = `
      <a href="categories.html" data-testid="nav-categories">Categories</a>
      <a href="leaderboard.html" data-testid="nav-leaderboard">Leaderboard</a>
      <a href="auth.html" class="btn-primary" data-testid="nav-login">Login</a>
    `;
  }
}

async function handleLogout() {
  try {
    await signOut();
    showToast('Logged out successfully');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    console.error('Logout error:', error);
    showToast('Logout failed', 'error');
  }
}