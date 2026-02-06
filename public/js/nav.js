function goToPage(page) {
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.nav-btn[data-page="${page}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  document.querySelectorAll('.page-content').forEach((p) => p.classList.add('hidden'));
  const target = document.getElementById(`page${page.charAt(0).toUpperCase() + page.slice(1)}`);
  if (target) target.classList.remove('hidden');
  if (page === 'profile') window.dispatchEvent(new CustomEvent('profilepageview'));
}

document.querySelectorAll('.nav-btn').forEach((btn) => {
  btn.addEventListener('click', () => goToPage(btn.dataset.page));
});

document.querySelector('.nav-logo')?.addEventListener('click', (e) => {
  e.preventDefault();
  goToPage('home');
});
