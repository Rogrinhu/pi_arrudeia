// Dados das atividades
const atividades = [
    // Roteiros
    {
      id: 1,
      categoria: 'roteiros',
      titulo: 'Patrimônios Históricos',
      descricao: 'Igrejas, fortes, mercados, pontes e museus que são um marco na história da cidade.',
      imagem: 'assets/roteiro1.jpg'
    },
    {
      id: 2,
      categoria: 'roteiros',
      titulo: 'Tradição e Memória',
      descricao: 'Estátuas e práticas que mantêm viva a identidade recifense: mestres de maracatu, rendeiras, blocos, bandas e guardiões de ofícios.',
      imagem: 'assets/roteiro2.jpg'
    },
    {
      id: 3,
      categoria: 'roteiros',
      titulo: 'Orgulho de Recifense',
      descricao: 'Espaços e práticas que mantêm viva a identidade recifense: mestres de maracatu, rendeiras, blocos, bandas e guardiões de ofícios.',
      imagem: 'assets/roteiro3.jpg'
    },
    {
      id: 4,
      categoria: 'roteiros',
      titulo: 'Pra forar o Bucho',
      descricao: 'Comida boa, feita do jeito certo. Da barraca de rua ao restaurante clássico.',
      imagem: 'assets/roteiro4.jpg'
    },
    // Eventos
    {
      id: 5,
      categoria: 'eventos',
      titulo: 'Música e Cultura',
      descricao: 'Bares, botecos, frevo e celebrações. Onde o Recife mostra sua alma festiva e noturna.',
      imagem: 'assets/evento1.jpg'
    },
    {
      id: 6,
      categoria: 'eventos',
      titulo: 'Acessibilidade',
      descricao: 'Experiências pensadas para todos, com informações sobre mobilidade urbana, calçadas acessíveis, etc.',
      imagem: 'assets/evento2.jpg'
    },
    {
      id: 7,
      categoria: 'eventos',
      titulo: 'Hoje é Aonde?',
      descricao: 'Aqui você encontra o que tá rolando no Recife: shows, eventos e festas promovidos pela prefeitura.',
      imagem: 'assets/evento3.jpg'
    },
    {
      id: 8,
      categoria: 'eventos',
      titulo: 'Aqui nessa Mesa de Bar',
      descricao: 'Onde o papo, a música e a saudade se encontram. Bares, botecos e histórias que fazem de Recife uma cidade boêmia.',
      imagem: 'assets/evento4.jpg'
    }
  ];
  
  // Elementos DOM
  const favoritosGrid = document.getElementById('favoritos-grid');
  const roteirosGrid = document.getElementById('roteiros-grid');
  const eventosGrid = document.getElementById('eventos-grid');
  const emptyMessage = document.getElementById('empty-favorites');
  
  // Carregar favoritos do localStorage
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  
  // Função para salvar favoritos
  function salvarFavoritos() {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }
  
  // Função para verificar se é favorito
  function ehFavorito(id) {
    return favoritos.includes(id);
  }
  
  // Função para alternar favorito
  function toggleFavorito(id, cardElement) {
    const index = favoritos.indexOf(id);
    if (index === -1) {
      favoritos.push(id);
    } else {
      favoritos.splice(index, 1);
    }
    salvarFavoritos();
    atualizarEstrela(cardElement, id);
    atualizarFavoritos();
  }
  
  // Atualizar ícone da estrela
  function atualizarEstrela(card, id) {
    const star = card.querySelector('.card-fav');
    if (ehFavorito(id)) {
        star.classList.add('active');
        star.innerHTML = '♥';
      } else {
        star.classList.remove('active');
        star.innerHTML = '♡';
      }
  }
  
  // Criar card
  function criarCard(atividade) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = atividade.id;
  
    card.innerHTML = `
      <img src="${atividade.imagem}" alt="${atividade.titulo}" class="card-img">
      <div class="card-fav ${ehFavorito(atividade.id) ? 'active' : ''}">
      ${ehFavorito(atividade.id) ? '♥' : '♡'}
      </div>
      <h3>${atividade.titulo}</h3>
      <p>${atividade.descricao}</p>
    `;
  
    // Evento de clique na estrela
    const star = card.querySelector('.card-fav');
    star.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorito(atividade.id, card);
    });
  
    return card;
  }
  
  // Renderizar seção
  function renderizarSecao(grid, categoria) {
    const itens = atividades.filter(a => a.categoria === categoria);
    grid.innerHTML = '';
    itens.forEach(atividade => {
      grid.appendChild(criarCard(atividade));
    });
  }
  
  // Atualizar seção de favoritos
  function atualizarFavoritos() {
    favoritosGrid.innerHTML = '';
    const favoritosAtividades = atividades.filter(a => favoritos.includes(a.id));
  
    if (favoritosAtividades.length === 0) {
      emptyMessage.style.display = 'block';
    } else {
      emptyMessage.style.display = 'none';
      favoritosAtividades.forEach(atividade => {
        const card = criarCard(atividade);
        // Atualiza estrela ao renderizar
        atualizarEstrela(card, atividade.id);
        favoritosGrid.appendChild(card);
      });
    }
  }
  
  // Inicialização
  document.addEventListener('DOMContentLoaded', () => {
    renderizarSecao(roteirosGrid, 'roteiros');
    renderizarSecao(eventosGrid, 'eventos');
    atualizarFavoritos();
  });