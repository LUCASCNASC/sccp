// Busca os anos disponíveis da API
async function fetchYearsFromAPI() {
  try {
    const resp = await fetch("http://localhost:3001/api/elencos");
    if (!resp.ok) return [];
    const data = await resp.json();
    return data;
  } catch {
    return [];
  }
}

// Busca elenco de um ano via API
async function fetchElencoFromAPI(ano) {
  try {
    const resp = await fetch(`http://localhost:3001/api/elencos/${ano}`);
    if (!resp.ok) return [];
    const data = await resp.json();
    return data.jogadores || [];
  } catch {
    return [];
  }
}

// Gera os anos de 1910 até 2025 (fallback caso API falhe)
let years = [];
fetchYearsFromAPI().then(apiYears => {
  if (apiYears.length) {
    years = apiYears;
  } else {
    for (let y = 1910; y <= 2025; y++) years.push(y.toString());
  }
});

const yearInput = document.getElementById("year-input");
const autocompleteList = document.getElementById("autocomplete-list");
const mainContent = document.getElementById("main-content");
const toast = document.getElementById("toast");
let currentFocus = -1;

// Função para filtrar a lista de anos
function filterYears(val) {
  return years.filter((year) => year.startsWith(val));
}

// Exibe a lista de sugestões filtrada
function showAutocomplete(val) {
  autocompleteList.innerHTML = "";
  if (!val) {
    autocompleteList.classList.remove("show");
    return;
  }
  const filtered = filterYears(val);
  if (filtered.length === 0) {
    autocompleteList.classList.remove("show");
    return;
  }
  filtered.forEach((year, idx) => {
    const item = document.createElement("li");
    item.textContent = year;
    item.tabIndex = 0;
    item.addEventListener("mousedown", function(e) {
      yearInput.value = year;
      autocompleteList.classList.remove("show");
    });
    item.addEventListener("keydown", function(e) {
      if (e.key === "Enter" || e.key === " ") {
        yearInput.value = year;
        autocompleteList.classList.remove("show");
        yearInput.focus();
      }
    });
    autocompleteList.appendChild(item);
  });
  autocompleteList.classList.add("show");
}

// Fecha a lista de sugestões
function closeAutocomplete() {
  autocompleteList.innerHTML = "";
  autocompleteList.classList.remove("show");
  currentFocus = -1;
}

// Evento de input para filtrar sugestões
yearInput?.addEventListener("input", function(e) {
  showAutocomplete(this.value);
});

// Fecha autocomplete ao clicar fora
document.addEventListener("click", function(e) {
  if (!e.target.closest(".autocomplete")) {
    closeAutocomplete();
  }
});

// Suporte a teclado (setas e enter)
yearInput?.addEventListener("keydown", function(e) {
  const items = autocompleteList.getElementsByTagName("li");
  if (!autocompleteList.classList.contains("show")) return;
  if (e.key === "ArrowDown") {
    currentFocus++;
    if (currentFocus >= items.length) currentFocus = 0;
    updateActive(items);
    e.preventDefault();
  } else if (e.key === "ArrowUp") {
    currentFocus--;
    if (currentFocus < 0) currentFocus = items.length - 1;
    updateActive(items);
    e.preventDefault();
  } else if (e.key === "Enter") {
    if (currentFocus > -1 && items[currentFocus]) {
      yearInput.value = items[currentFocus].textContent;
      closeAutocomplete();
      e.preventDefault();
    }
  }
});

function updateActive(items) {
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("active");
  }
  if (currentFocus > -1 && items[currentFocus]) {
    items[currentFocus].classList.add("active");
    items[currentFocus].scrollIntoView({block: 'nearest'});
  }
}

// Toast simples para feedback
function showToast(msg, duration = 2500) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

// Botão FILTRAR
document.getElementById("filter-btn").addEventListener("click", async function() {
  const selectedYear = yearInput.value;
  if (years.includes(selectedYear)) {
    await showElencoTitle(selectedYear);
  } else {
    showToast("Ano inválido. Por favor, escolha um ano da lista.");
  }
});

async function showElencoTitle(ano) {
  mainContent.innerHTML = "";
  // Título
  const titulo = document.createElement('h1');
  titulo.className = 'elenco-title';
  titulo.textContent = `Elenco do timão na temporada de ${ano}`;
  mainContent.appendChild(titulo);

  // Busca do backend
  const jogadores = await fetchElencoFromAPI(ano);

  const elencoDiv = document.createElement('div');
  elencoDiv.className = "elenco-lista";
  if (jogadores && jogadores.length > 0) {
    elencoDiv.innerHTML = `<div class="elenco-lista-title">Jogadores (${jogadores.length}):</div>`;
    const lista = document.createElement("ul");
    lista.setAttribute("role", "list");
    jogadores.forEach(j => {
      const li = document.createElement("li");
      li.textContent = j;
      lista.appendChild(li);
    });
    elencoDiv.appendChild(lista);
    mainContent.appendChild(elencoDiv);
  } else {
    elencoDiv.innerHTML = `<div class="elenco-lista-title">Sem elenco cadastrado para esse ano.</div>`;
    mainContent.appendChild(elencoDiv);
  }
}

// SPA / ROTEAMENTO
function renderHome() {
  document.getElementById("search-area").style.display = "";
  mainContent.innerHTML = "";
  mainContent.style.animation = "fadein 0.5s";
}

function renderCadastro() {
  document.getElementById("search-area").style.display = ""; // mantem visível
  mainContent.innerHTML = `<div>Cadastro de usuário (exemplo, pode ser expandido)</div>`;
}

function renderLogin() {
  document.getElementById("search-area").style.display = ""; // mantem visível
  mainContent.innerHTML = `<div>Login de usuário (exemplo, pode ser expandido)</div>`;
}

// Roteamento SPA
function navigate(path, addToHistory=true) {
  if (path === "/" || path === "") {
    renderHome();
  } else if (path === "/cadastro") {
    renderCadastro();
  } else if (path === "/login") {
    renderLogin();
  }
  if (addToHistory) {
    history.pushState({path}, "", path);
  }
}

// SPA INIT com novo botão ENTRAR
function initSPA() {
  if (location.pathname === "/cadastro") {
    renderCadastro();
  } else if (location.pathname === "/login") {
    renderLogin();
  } else {
    renderHome();
  }
  document.getElementById("register-link").addEventListener("click", function(e) {
    e.preventDefault();
    navigate("/cadastro");
  });
  document.querySelector(".btn-login").addEventListener("click", function(e) {
    e.preventDefault();
    navigate("/login");
  });
  document.getElementById("reload-home").addEventListener("click", function() {
    navigate("/");
  });
  window.onpopstate = function(event) {
    if (event.state && event.state.path) {
      if (event.state.path === "/cadastro") renderCadastro();
      else if (event.state.path === "/login") renderLogin();
      else renderHome();
    } else {
      if (location.pathname === "/cadastro") renderCadastro();
      else if (location.pathname === "/login") renderLogin();
      else renderHome();
    }
  };
}

initSPA();

function renderLogin() {
  document.getElementById("search-area").style.display = ""; // mantém a barra de pesquisa
  mainContent.innerHTML = `
    <h1 class="login-title">ELENCOS CORINTHIANS - LOGIN / CADASTRO</h1>
    <div class="login-cadastro-box">
      <div class="login-col">
        <div class="login-col-title">JÁ SOU CADASTRADO</div>
        <form class="login-form" id="login-form">
          <label for="login-email">E-MAIL</label>
          <input type="email" id="login-email" name="login-email" placeholder="seu email" autocomplete="email" required>
          <label for="login-password">SENHA</label>
          <input type="password" id="login-password" name="login-password" placeholder="sua senha" autocomplete="current-password" required>
          <a href="#" class="forgot-link">Não lembro minha senha</a>
          <button type="submit" class="login-btn">LOGIN</button>
        </form>
      </div>
      <div class="cadastro-col">
        <div class="cadastro-col-title">AINDA NÃO ME CADASTREI</div>
        <p>Faça parte do Elencos Corinthians e acompanhe o CORINTHIANS mais de perto.</p>
        <button class="cadastro-btn-box" id="cadastro-btn-box">CADASTRO</button>
      </div>
    </div>
  `;

  document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    showToast("Login enviado! (exemplo de integração)");
  });

  document.getElementById("cadastro-btn-box").addEventListener("click", function() {
    navigate("/cadastro");
  });
}

function renderCadastro() {
  document.getElementById("search-area").style.display = ""; // mantém a barra de pesquisa
  mainContent.innerHTML = `
    <div class="cadastro-container">
      <h1 class="cadastro-title">Cadastre-se no Elencos Corinthians</h1>
      <form class="cadastro-form" id="cadastro-form">
        <label for="nome">Nome completo:</label>
        <input type="text" id="nome" name="nome" required autocomplete="name">

        <label for="email">E-mail:</label>
        <input type="email" id="email" name="email" required autocomplete="email">

        <label for="senha">Senha:</label>
        <input type="password" id="senha" name="senha" required autocomplete="new-password">

        <button type="submit" class="cadastro-btn">Cadastrar</button>
      </form>
    </div>
  `;
  document.getElementById("cadastro-form").addEventListener("submit", function(e) {
    e.preventDefault();
    showToast("Cadastro enviado! (exemplo de integração)");
  });
}