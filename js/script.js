/* script.js — FIXED THEME TOGGLE + FULL FUNCTIONALITY */

(function(){
  // Elements
  const themeBtns = document.querySelectorAll('#toggleTheme, #toggleTheme2, #toggleTheme3, #toggleTheme4');
  const toast = document.getElementById('toast');
  const yearEls = [document.getElementById('year'), document.getElementById('year2'), document.getElementById('year3'), document.getElementById('year4')];
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Apply current year
  const now = new Date().getFullYear();
  yearEls.forEach(el => { if(el) el.textContent = now; });

  // Load saved theme (FIXED)
  const savedTheme = localStorage.getItem('theme') || "light";
  document.body.setAttribute("data-theme", savedTheme);

  // Theme toggle (FIXED)
  themeBtns.forEach(btn => {
    if(!btn) return;
    btn.addEventListener('click', () => {
      const body = document.body;
      const current = body.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      body.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  });

  // Feature flags
  const features = {
    animations: (localStorage.getItem('feat_animations') ?? '1') === '1',
    floatingNav: (localStorage.getItem('feat_floatingNav') ?? '1') === '1'
  };

  // Checkboxes
  const animCheckbox = document.getElementById('toggleAnim');
  const floatCheckbox = document.getElementById('toggleFloating');
  if(animCheckbox) animCheckbox.checked = features.animations;
  if(floatCheckbox) floatCheckbox.checked = features.floatingNav;
  applyFeatures();

  // Nav toggle
  if(navToggle && navLinks){
    navToggle.addEventListener('click', () => {
      const expanded = navLinks.classList.toggle('show');
      navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  // Contact form toast
  const sendBtn = document.getElementById('sendBtn');
  if(sendBtn){
    sendBtn.addEventListener('click', () => {
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      if(!name || !email || !message){
        showToast('Please fill all fields');
        return;
      }
      showToast('Message Sent (demo)');
      document.getElementById('contactForm').reset();
    });
  }

  function showToast(text){
    if(!toast) return alert(text);
    toast.textContent = text;
    toast.style.display = 'block';
    toast.style.opacity = 1;
    setTimeout(()=> {
      toast.style.opacity = 0;
      setTimeout(()=> toast.style.display = 'none', 400);
    }, 2000);
  }

  // Intersection animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(!features.animations) return;
      if(entry.isIntersecting) entry.target.classList.add('inview');
    });
  }, {threshold: 0.12});

  document.querySelectorAll('.animated').forEach(el => observer.observe(el));

  if(animCheckbox){
    animCheckbox.addEventListener('change', (e) => {
      features.animations = e.target.checked;
      localStorage.setItem('feat_animations', features.animations ? '1' : '0');
      if(!features.animations){
        document.querySelectorAll('.animated').forEach(a => {
          a.classList.remove('inview');
          a.style.transition = 'none';
        });
      } else {
        document.querySelectorAll('.animated').forEach(a => {
          a.style.transition = '';
          observer.observe(a);
        });
      }
    });
  }

  if(floatCheckbox){
    floatCheckbox.addEventListener('change', (e) => {
      features.floatingNav = e.target.checked;
      localStorage.setItem('feat_floatingNav', features.floatingNav ? '1' : '0');
      applyFeatures();
    });
  }

  function applyFeatures(){
    const header = document.getElementById('siteHeader') || document.querySelector('.nav-wrap');
    if(!header) return;
    if(features.floatingNav){
      header.style.position = 'sticky';
      header.style.top = '12px';
      header.style.backdropFilter = 'blur(8px)';
    } else {
      header.style.position = 'static';
      header.style.top = '';
      header.style.backdropFilter = '';
    }
  }

  // Close nav on link click
  document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => {
      document.querySelectorAll('.nav-links').forEach(n => n.classList.remove('show'));
    })
  );

  // Escape closes nav
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
      document.querySelectorAll('.nav-links').forEach(n => n.classList.remove('show'));
    }
  });

})();