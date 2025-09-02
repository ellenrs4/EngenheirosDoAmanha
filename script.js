// ========= LOGIN / CADASTRO =========
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const btnFecharLogin = document.getElementById("btnFecharLogin");

// Botões que abrem o login
const btnAbrirLogin = document.getElementById("openLogin"); 
const btnCta = document.getElementById("ctaComecar");
const btnFloating = document.getElementById("floatingCta");

function openLoginModal() {
  loginModal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeLoginModal() {
  loginModal.classList.remove("open");
  document.body.style.overflow = "";
}

btnAbrirLogin?.addEventListener("click", openLoginModal);
btnCta?.addEventListener("click", openLoginModal);
btnFloating?.addEventListener("click", openLoginModal);
btnFecharLogin?.addEventListener("click", closeLoginModal);
loginModal?.addEventListener("click", (e) => {
  if (e.target === loginModal) closeLoginModal();
});

// ========= LOCALSTORAGE =========
function loadUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
function setSession(user) {
  localStorage.setItem("sessionUser", JSON.stringify(user));
}
function getSession() {
  return JSON.parse(localStorage.getItem("sessionUser"));
}
function clearSession() {
  localStorage.removeItem("sessionUser");
}

// ========= SKIN MODAL =========
const skinModal = document.getElementById("skinModal");
const btnFecharSkin = document.getElementById("btnFecharSkin");
const btnSalvarSkin = document.getElementById("btnSalvarSkin");
const nicknameInput = document.getElementById("nickname");
let selectedSkin = null;

function openSkinModal() {
  skinModal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeSkinModal() {
  skinModal.classList.remove("open");
  document.body.style.overflow = "";
}

btnFecharSkin?.addEventListener("click", closeSkinModal);
skinModal?.addEventListener("click", (e) => {
  if (e.target === skinModal) closeSkinModal();
});

document.querySelectorAll(".skin").forEach((img) => {
  img.addEventListener("click", () => {
    document.querySelectorAll(".skin").forEach((s) =>
      s.classList.remove("selected")
    );
    img.classList.add("selected");
    selectedSkin = img.dataset.skin;
  });
});

btnSalvarSkin?.addEventListener("click", () => {
  const nickname = nicknameInput.value.trim();
  if (!selectedSkin || !nickname) {
    alert("Escolha uma skin e digite um nickname!");
    return;
  }

  // Recupera usuário em sessão
  let user = getSession();
  if (!user) {
    alert("Erro: nenhuma sessão encontrada!");
    return;
  }

  user.skin = selectedSkin;
  user.nickname = nickname;

  // Atualiza lista de usuários
  let users = loadUsers();
  const idx = users.findIndex((u) => u.email === user.email);
  if (idx !== -1) users[idx] = user;
  saveUsers(users);

  setSession(user);
  closeSkinModal();
  alert("Conta criada com sucesso! Seja bem-vindo, " + nickname + " 🦊");
});

// ========= LOGIN FORM SUBMIT =========
loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const tipo = document.getElementById("tipo").value;
  const newUserCheck = document.getElementById("new-user").checked;

  let users = loadUsers();
  let existingUser = users.find((u) => u.email === email);

  if (newUserCheck) {
    if (existingUser) {
      alert("Esse email já está cadastrado!");
      return;
    }

    const newUser = {
      email,
      senha,
      tipo,
      skin: null,
      nickname: null,
    };

    users.push(newUser);
    saveUsers(users);
    setSession(newUser);

    closeLoginModal();
    openSkinModal(); // abre escolha de skin
  } else {
    // Login normal
    if (!existingUser || existingUser.senha !== senha) {
      alert("Email ou senha inválidos!");
      return;
    }

    setSession(existingUser);
    closeLoginModal();

    // Se não tiver skin/nickname, abre o modal
    if (!existingUser.skin || !existingUser.nickname) {
      openSkinModal();
    } else {
      alert("Bem-vindo de volta, " + existingUser.nickname + "!");
    }
  }
});

// ========= NAVEGAÇÃO / MENU =========
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

menuToggle?.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

// Fecha menu ao clicar em um link
document.querySelectorAll("#nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
  });
});


// ===== Hero Stars Canvas =====
(function () {
  const canvas = document.getElementById('heroStars');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const DPR = window.devicePixelRatio || 1;

  let cssW = 0, cssH = 0;
  let stars = [];

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    cssW = Math.max(0, rect.width);
    cssH = Math.max(0, rect.height);
    if (cssW === 0 || cssH === 0) return;

    canvas.width = Math.round(cssW * DPR);
    canvas.height = Math.round(cssH * DPR);
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    initStars();
  }

  function createStar() {
    return {
      x: Math.random() * cssW,
      y: Math.random() * cssH,
      r: (Math.random() * 1.6) + 0.3,
      alpha: Math.random() * 0.8 + 0.15,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      driftX: (Math.random() - 0.5) * 0.2,
      driftY: (Math.random() - 0.5) * 0.25,
      hueType: Math.random() < 0.09 ? 'gold' : 'white'
    };
  }

  function initStars() {
    stars = [];
    const density = 0.00012;
    const count = Math.max(28, Math.round(cssW * cssH * density));
    for (let i = 0; i < count; i++) stars.push(createStar());
  }

  let lastTs = 0;
  function draw(ts) {
    if (!cssW || !cssH) {
      requestAnimationFrame(draw);
      return;
    }
    const dt = lastTs ? (ts - lastTs) / 1000 : 0;
    lastTs = ts;

    ctx.clearRect(0, 0, cssW, cssH);

    for (let s of stars) {
      s.x += s.driftX * (dt * 60);
      s.y += s.driftY * (dt * 60);
      const tw = Math.sin(ts * s.twinkleSpeed + s.x * 0.01) * 0.5 + 0.5;
      const alpha = Math.max(0.06, Math.min(1, s.alpha * (0.6 + 0.8 * tw)));
      if (s.x < -10) s.x = cssW + 10;
      if (s.x > cssW + 10) s.x = -10;
      if (s.y < -10) s.y = cssH + 10;
      if (s.y > cssH + 10) s.y = -10;

      const radius = s.r;
      const gx = s.x;
      const gy = s.y;
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, radius * 6);
      if (s.hueType === 'gold') {
        g.addColorStop(0, `rgba(242,178,58,${alpha})`);
        g.addColorStop(0.4, `rgba(242,178,58,${alpha * 0.5})`);
      } else {
        g.addColorStop(0, `rgba(255,255,255,${alpha})`);
        g.addColorStop(0.4, `rgba(255,255,255,${alpha * 0.35})`);
      }
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.fillStyle = g;
      ctx.arc(gx, gy, Math.max(1, radius * 3), 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    clearTimeout(window._heroStarsResize);
    window._heroStarsResize = setTimeout(resizeCanvas, 80);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      resizeCanvas();
      requestAnimationFrame(draw);
    });
  } else {
    resizeCanvas();
    requestAnimationFrame(draw);
  }
})();

// === Stars per section ===
(function () {
  const targets = document.querySelectorAll('section, header.site-header, footer.site-footer');
  function createCanvasFor(el) {
    if (el.querySelector('.section-stars')) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'section-stars';
    canvas.setAttribute('aria-hidden', 'true');
    el.prepend(canvas);
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      const rect = el.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeStar(w, h) {
      return { x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.4 + 0.3,
               alpha: Math.random() * 0.9 + 0.1, speed: Math.random() * 0.6 + 0.05,
               drift: (Math.random() - 0.5) * 0.15 };
    }

    let stars = [];
    function buildStars() {
      const DENSITY_DIVISOR = 12000;
      const w = canvas.width, h = canvas.height;
      const count = Math.max(8, Math.round((w * h) / DENSITY_DIVISOR));
      stars = [];
      for (let i = 0; i < count; i++) stars.push(makeStar(w, h));
    }

    let lastTime = performance.now();
    function animate(now) {
      const dt = now - lastTime; lastTime = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const viewW = canvas.width / (window.devicePixelRatio || 1);
      const viewH = canvas.height / (window.devicePixelRatio || 1);

      for (let s of stars) {
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        s.y += s.speed * (dt * 0.06);
        s.x += s.drift * (dt * 0.06);
        if (s.y > viewH + 10) s.y = -10;
        if (s.x > viewW + 10) s.x = -10;
        if (s.x < -10) s.x = viewW + 10;
      }
      requestAnimationFrame(animate);
    }

    resizeCanvas();
    buildStars();
    requestAnimationFrame(animate);

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => { resizeCanvas(); buildStars(); });
      ro.observe(el);
    } else {
      window.addEventListener('resize', () => { resizeCanvas(); buildStars(); });
    }
  }
  targets.forEach(createCanvasFor);
  if (window.MutationObserver) {
    const mo = new MutationObserver(muts => {
      muts.forEach(m => {
        m.addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches && (node.matches('section') || node.matches('header.site-header') || node.matches('footer.site-footer'))) {
            createCanvasFor(node);
          }
          node.querySelectorAll && node.querySelectorAll('section, header.site-header, footer.site-footer').forEach(createCanvasFor);
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
})();
