/**
 * Frontend - Main app logic & UI
 */

import { authApi, getToken, setToken, getStoredUser, setStoredUser } from './api.js';

// Elements
const authSection = document.getElementById('authSection');
const taskSection = document.getElementById('taskSection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  try {
    const res = await authApi.login({ email, password });
    setToken(res.token);
    showDashboard(res.user);
  } catch (err) {
    showError(err.message);
  }
});

// Register - saves to database, NO auto-login
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  if (password.length < 6) {
    showError('Password must be at least 6 characters');
    return;
  }
  try {
    await authApi.register({ name, email, password });
    registerForm.reset();
    showRegisterPopup();
  } catch (err) {
    showError(err.message);
  }
});

// Register success popup
function showRegisterPopup() {
  const popup = document.getElementById('registerPopup');
  if (popup) popup.classList.remove('hidden');
}

document.getElementById('closePopupBtn')?.addEventListener('click', () => {
  document.getElementById('registerPopup')?.classList.add('hidden');
  // Switch to Home so user can login
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
  const homeBtn = document.querySelector('.nav-btn[data-page="home"]');
  if (homeBtn) homeBtn.classList.add('active');
  document.querySelectorAll('.page-content').forEach((p) => p.classList.add('hidden'));
  const pageHome = document.getElementById('pageHome');
  if (pageHome) pageHome.classList.remove('hidden');
});

// Logout
logoutBtn.addEventListener('click', () => {
  setToken(null);
  setStoredUser(null);
  showAuthSection();
});

// Style buttons (placeholder for future functionality)
document.querySelectorAll('.style-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const style = btn.dataset.style;
    // Can add navigation or content based on style
    console.log('Selected:', style);
  });
});

function showAuthSection() {
  authSection.classList.remove('hidden');
  taskSection.classList.add('hidden');
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) heroTitle.classList.remove('hidden');
  setStoredUser(null);
  loginForm.reset();
  if (registerForm) registerForm.reset();
  // Nav: show Register, hide Profile
  document.querySelector('.nav-register')?.classList.remove('hidden');
  document.querySelector('.nav-profile')?.classList.add('hidden');
  logoutBtn.classList.add('hidden');
}

function showDashboard(user) {
  authSection.classList.add('hidden');
  taskSection.classList.remove('hidden');
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) heroTitle.classList.add('hidden');
  setStoredUser(user);
  // Nav: hide Register, show Profile; show Logout
  document.querySelector('.nav-register')?.classList.add('hidden');
  document.querySelector('.nav-profile')?.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');
  // Switch nav to Home
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
  const homeBtn = document.querySelector('.nav-btn[data-page="home"]');
  if (homeBtn) homeBtn.classList.add('active');
  document.querySelectorAll('.page-content').forEach((p) => p.classList.add('hidden'));
  const pageHome = document.getElementById('pageHome');
  if (pageHome) pageHome.classList.remove('hidden');
}

// --- Profile (editable) ---
let profilePictureBase64 = '';

function loadProfileForm() {
  authApi.getProfile().then((user) => {
    document.getElementById('profileName').value = user.name || '';
    document.getElementById('profileEmail').value = user.email || '';
    document.getElementById('profileLocation').value = user.location || '';
    document.getElementById('profileContact').value = user.contactNumber || '';
    const preview = document.getElementById('profilePicturePreview');
    if (user.profilePicture) {
      preview.innerHTML = `<img src="${user.profilePicture}" alt="Profile">`;
      profilePictureBase64 = user.profilePicture;
    } else {
      preview.innerHTML = '<span class="profile-picture-placeholder">No photo</span>';
      profilePictureBase64 = '';
    }
  }).catch(() => showError('Could not load profile'));
}

window.addEventListener('profilepageview', loadProfileForm);

document.getElementById('profilePictureInput')?.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = () => {
    profilePictureBase64 = reader.result;
    const preview = document.getElementById('profilePicturePreview');
    preview.innerHTML = `<img src="${profilePictureBase64}" alt="Profile">`;
  };
  reader.readAsDataURL(file);
});

document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('profileName').value.trim();
  const location = document.getElementById('profileLocation').value.trim();
  const contactNumber = document.getElementById('profileContact').value.trim();
  try {
    const user = await authApi.updateProfile({
      name,
      location,
      contactNumber,
      profilePicture: profilePictureBase64 || undefined
    });
    setStoredUser(user);
    showError('Profile saved.');
  } catch (err) {
    showError(err.message);
  }
});

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showError(message) {
  let el = document.querySelector('.error-message');
  if (!el) {
    el = document.createElement('div');
    el.className = 'error-message';
    document.querySelector('.container').insertBefore(el, document.querySelector('h1').nextSibling);
  }
  el.textContent = message;
  el.style.display = 'block';
  setTimeout(() => (el.style.display = 'none'), 3000);
}

// Init - check if already logged in
if (getToken()) {
  const user = getStoredUser();
  taskSection.classList.remove('hidden');
  authSection.classList.add('hidden');
  showDashboard(user || { name: 'User' });
} else {
  showAuthSection();
}
