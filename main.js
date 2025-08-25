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

let years = [];
let recentYears = [];

// Busca e ordena anos decrescentemente
fetchYearsFromAPI().then(apiYears => {
  if (apiYears.length) {
    years = apiYears.sort((a, b) => b - a); // decrescente
    recentYears = years.slice(0, 10); // 10 mais recentes
  } else {
    for (let y = 1910; y <= 2025; y++) years.push(y.toString());
    years = years.sort((a, b) => b - a);
    recentYears = years.slice(0, 10);
  }
  renderRecentYearsList();
});

const yearInput = document.getElementById("year-input");
const autocompleteList = document.getElementById("autocomplete-list");
const mainContent = document.getElementById("main-content");
const recentYearsList = document.getElementById("recent-years-list");
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

// Função para exibir os 10 anos mais recentes
function renderRecentYearsList() {
  if (!recentYearsList) return;
  recentYearsList.innerHTML = "";
  const ul = document.createElement("ul");
  ul.className = "years-list";
  recentYears.forEach(year => {
    const li = document.createElement("li");
    li.textContent = year;
    li.className = "year-item";
    li.addEventListener("click", async () => {
      yearInput.value = year;
      await showElencoTitle(year);
    });
    ul.appendChild(li);
  });
  recentYearsList.appendChild(ul);
}

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
  renderRecentYearsList();
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