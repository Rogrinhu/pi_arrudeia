
// ===== TROCA DE TEMA =====
const themeToggle = document.querySelector('.theme-toggle');
const currentTheme = localStorage.getItem('theme');
const icon = themeToggle.querySelector('i');

if (currentTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  icon.classList.replace('fa-moon', 'fa-sun');
} else {
  document.documentElement.removeAttribute('data-theme');
  icon.classList.replace('fa-sun', 'fa-moon');
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.hasAttribute('data-theme');
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    icon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    icon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'dark');
  }
});

// ===== UPLOAD DE MÍDIA =====
const uploadArea = document.getElementById('uploadArea');
const mediaInput = document.getElementById('mediaInput');
const mediaPreview = document.getElementById('mediaPreview');
const btnClearMedia = document.getElementById('btnClearMedia');
let currentFile = null;

uploadArea.addEventListener('click', () => mediaInput.click());
uploadArea.addEventListener('dragover', e => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});
uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

mediaInput.addEventListener('change', () => {
  const file = mediaInput.files[0];
  if (file) handleFile(file);
});

btnClearMedia.addEventListener('click', () => {
  currentFile = null;
  mediaPreview.innerHTML = '';
  mediaPreview.style.display = 'none';
  btnClearMedia.style.display = 'none';
  mediaInput.value = '';
});

function handleFile(file) {
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    alert('Por favor, envie uma imagem ou vídeo.');
    return;
  }

  currentFile = file;
  const reader = new FileReader();
  reader.onload = e => {
    mediaPreview.innerHTML = '';
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = e.target.result;
      mediaPreview.appendChild(img);
    } else {
      const video = document.createElement('video');
      video.src = e.target.result;
      video.controls = true;
      mediaPreview.appendChild(video);
    }
    mediaPreview.style.display = 'block';
    btnClearMedia.style.display = 'inline-block';
  };
  reader.readAsDataURL(file);
}

// ===== AVALIAÇÃO COM ESTRELAS =====
function updateRatingDisplay(post) {
  const ratings = JSON.parse(post.dataset.ratings || '[]');
  const total = ratings.length;
  if (total === 0) return;

  const avg = ratings.reduce((a, b) => a + b, 0) / total;
  const avgRounded = avg.toFixed(1);
  const fullStars = Math.floor(avg);
  const hasHalf = avg % 1 >= 0.3;

  const display = post.querySelector('.rating-display');
  display.querySelector('.rating-average').textContent = avgRounded;

  const stars = display.querySelectorAll('.stars i');
  stars.forEach((star, i) => {
    if (i < fullStars) {
      star.className = 'fas fa-star';
    } else if (i === fullStars && hasHalf) {
      star.className = 'fas fa-star-half-alt';
    } else {
      star.className = 'far fa-star';
    }
  });
}

// Inicializar estrelas de avaliação
function initRatingInput(post) {
  const stars = post.querySelectorAll('.star-rating i');
  let selected = 0;

  stars.forEach(star => {
    star.addEventListener('click', () => {
      selected = parseInt(star.dataset.value);
      stars.forEach((s, i) => {
        if (i < selected) {
          s.className = 'fas fa-star';
        } else {
          s.className = 'far fa-star';
        }
      });

      // Salvar avaliação
      const ratings = JSON.parse(post.dataset.ratings || '[]');
      ratings.push(selected);
      post.dataset.ratings = JSON.stringify(ratings);
      post.dataset.totalRatings = ratings.length;

      updateRatingDisplay(post);
    });

    star.addEventListener('mouseover', () => {
      if (selected === 0) {
        const hoverValue = parseInt(star.dataset.value);
        stars.forEach((s, i) => {
          s.className = i < hoverValue ? 'fas fa-star' : 'far fa-star';
        });
      }
    });
  });

  post.querySelector('.star-rating').addEventListener('mouseleave', () => {
    if (selected === 0) {
      stars.forEach(s => s.className = 'far fa-star');
    }
  });
}

// ===== POSTAGEM =====
document.querySelector('.btn-publish').addEventListener('click', () => {
  const textarea = document.querySelector('.post-form textarea');
  const text = textarea.value.trim();
  if (!text && !currentFile) {
    alert('Escreva algo ou adicione uma mídia!');
    return;
  }

  const views = Math.floor(Math.random() * 50) + 5;

  const postHTML = `
    <article class="post" data-views="${views}" data-ratings="[]" data-total-ratings="0">
      <div class="post-header">
        <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Você" class="avatar" />
        <div>
          <h4>Você</h4>
          <span class="time">agora</span>
        </div>
        <div class="rating-display">
          <span class="rating-average">0.0</span>
          <div class="stars">
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
          </div>
        </div>
      </div>
      <p class="post-text">${text || ''}</p>
      ${currentFile ? `
        <div class="post-media">
          ${currentFile.type.startsWith('image/') 
            ? `<img src="${URL.createObjectURL(currentFile)}" alt="Mídia do post" />`
            : `<video controls><source src="${URL.createObjectURL(currentFile)}" type="${currentFile.type}">Seu navegador não suporta vídeo.</video>`
          }
        </div>
      ` : ''}
      <div class="post-stats">
        <span class="views"><i class="fas fa-eye"></i> ${views} visualizações</span>
      </div>
      <div class="rating-input">
        <span>Avalie:</span>
        <div class="star-rating">
          <i class="far fa-star" data-value="1"></i>
          <i class="far fa-star" data-value="2"></i>
          <i class="far fa-star" data-value="3"></i>
          <i class="far fa-star" data-value="4"></i>
          <i class="far fa-star" data-value="5"></i>
        </div>
      </div>
      <div class="comments-section">
        <div class="comment-form">
          <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Você" class="avatar-small" />
          <input type="text" placeholder="Escreva um comentário..." class="comment-input" />
          <button class="btn-comment">Comentar</button>
        </div>
        <div class="comments-list"></div>
      </div>
    </article>
  `;

  document.getElementById('postsContainer').insertAdjacentHTML('afterbegin', postHTML);
  textarea.value = '';
  btnClearMedia.click();
  const newPost = document.querySelector('.posts .post');
  initPostEvents(newPost);
});

// ===== VISUALIZAÇÕES E INICIALIZAÇÃO =====
function initPostEvents(post) {
  // Visualizações
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let views = parseInt(post.dataset.views) || 0;
        views++;
        post.dataset.views = views;
        post.querySelector('.views').innerHTML = `<i class="fas fa-eye"></i> ${views} visualizações`;
        observer.unobserve(post);
      }
    });
  }, { threshold: 0.7 });
  observer.observe(post);

  // Avaliação
  updateRatingDisplay(post);
  initRatingInput(post);

  // Comentários
  const btnComment = post.querySelector('.btn-comment');
  const input = post.querySelector('.comment-input');
  if (btnComment) addCommentEvent(btnComment);
  if (input) addEnterEvent(input);
}

// ===== COMENTÁRIOS =====
function addCommentEvent(button) {
  button.addEventListener('click', function () {
    const post = this.closest('.post');
    const input = post.querySelector('.comment-input');
    const text = input.value.trim();
    if (!text) return alert("Escreva um comentário!");

    const commentsList = post.querySelector('.comments-list');
    const now = new Date();
    const commentHTML = `
      <div class="comment">
        <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Você" class="avatar-small" />
        <div class="comment-content">
          <div class="comment-author">Você</div>
          <div class="comment-text">${text}</div>
          <div class="comment-time">${timeAgo(now)}</div>
        </div>
      </div>
    `;
    commentsList.insertAdjacentHTML('beforeend', commentHTML);
    input.value = '';
  });
}

function addEnterEvent(input) {
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.closest('.comment-form').querySelector('.btn-comment').click();
    }
  });
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return "agora";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  return `${Math.floor(hours / 24)} dia(s) atrás`;
}

// ===== INICIALIZAR =====
document.querySelectorAll('.post').forEach(initPostEvents);