/* script.js
   Controls:
   - Theme toggle (dark/light)
   - Animated cards in view
   - Responsive nav toggle
   - Floating navbar toggle
   - Contact form demo (toast)
   - Feature toggles stored to localStorage
*/

(function(){
  // Elements
  const themeBtns = document.querySelectorAll('#toggleTheme, #toggleTheme2, #toggleTheme3, #toggleTheme4');
  const toast = document.getElementById('toast');
  const yearEls = [document.getElementById('year'), document.getElementById('year2'), document.getElementById('year3'), document.getElementById('year4')];
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Apply current year in all pages (if present)
  const now = new Date().getFullYear();
  yearEls.forEach(el => { if(el) el.textContent = now; });

  // Feature flags (persist)
  const features = {
    animations: (localStorage.getItem('feat_animations') ?? '1') === '1',
    floatingNav: (localStorage.getItem('feat_floatingNav') ?? '1') === '1'
  };

  // Setup toggles if present
  const animCheckbox = document.getElementById('toggleAnim');
  const floatCheckbox = document.getElementById('toggleFloating');
  if(animCheckbox) animCheckbox.checked = features.animations;
  if(floatCheckbox) floatCheckbox.checked = features.floatingNav;
  applyFeatures();

  // Nav toggle for small screens
  if(navToggle && navLinks){
    navToggle.addEventListener('click', () => {
      const expanded = navLinks.classList.toggle('show');
      navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  // Theme toggle buttons
  themeBtns.forEach(btn => {
    if(!btn) return;
    btn.addEventListener('click', () => {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  });

  // Apply saved theme
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

  // Contact form demo
  const sendBtn = document.getElementById('sendBtn');
  if(sendBtn){
    sendBtn.addEventListener('click', () => {
      // simple validation demo
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      if(!name || !email || !message){
        showToast('Please fill all fields');
        return;
      }
      // frontend-only demo: show toast "Message Sent (demo)"
      showToast('Message Sent (demo)');
      // Clear form (demo)
      document.getElementById('contactForm').reset();
    });
  }

  // Toast helper
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

  // Intersection Observer for animations (if enabled)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(!features.animations) return;
      if(entry.isIntersecting){
        entry.target.classList.add('inview');
      }
    });
  }, {threshold: 0.12});

  document.querySelectorAll('.animated').forEach(el => observer.observe(el));

  // Feature toggles handlers
  if(animCheckbox){
    animCheckbox.addEventListener('change', (e) => {
      features.animations = e.target.checked;
      localStorage.setItem('feat_animations', features.animations ? '1' : '0');
      // toggle classes: if disabled, remove 'animated' & 'inview' to stop animations
      if(!features.animations){
        document.querySelectorAll('.animated').forEach(a => { a.classList.remove('inview'); a.style.transition = 'none'; });
      } else {
        document.querySelectorAll('.animated').forEach(a => { a.style.transition = ''; observer.observe(a); });
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

  // Floating nav application: toggles nav-wrap styles
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

  // Make nav links close on click (small screens)
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
    document.querySelectorAll('.nav-links').forEach(n => n.classList.remove('show'));
  }));

  // Keyboard accessibility: Escape closes menus
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
      document.querySelectorAll('.nav-links').forEach(n => n.classList.remove('show'));
    }
  });

  // Helper: inject a couple of latest games programmatically (optional)
  // You can replace / expand this with JSON or templating.
  function injectLatestGames(){
    const latest = document.getElementById('latestList');
    if(!latest) return;
    // If you prefer dynamic injection, uncomment and adapt:
    // const games = [
    //   {title:'Game One', thumb:'assets/images/game1-thumb.jpg', apk:'https://github.com/USERNAME/REPO/releases/download/v1.0/game.apk'},
    //   // more...
    // ];
    // games.forEach(g => { ...create DOM nodes... });
  }
  injectLatestGames();

})();