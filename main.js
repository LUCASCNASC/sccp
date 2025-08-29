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

// Busca elenco de um ano via API (agora retorna agrupado por posição)
async function fetchElencoFromAPI(ano) {
  try {
    const resp = await fetch(`http://localhost:3001/api/elencos/${ano}`);
    if (!resp.ok) return {};
    const data = await resp.json();
    return data || {};
  } catch {
    return {};
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

// Nova função showElencoTitle para exibir por grupos de posição
async function showElencoTitle(ano) {
  mainContent.innerHTML = "";
  // Título
  const titulo = document.createElement('h1');
  titulo.className = 'elenco-title';
  titulo.textContent = `Elenco do timão na temporada de ${ano}`;
  mainContent.appendChild(titulo);

  // Busca do backend (agora vem agrupado)
  const elencoData = await fetchElencoFromAPI(ano);
  const elenco = elencoData.elenco || {};

  // Ordem fixa das posições
  const posicoesOrdem = [
    "Goleiro",
    "Zagueiro",
    "Lateral Direito",
    "Lateral Esquerdo",
    "Meio Campo",
    "Atacante"
  ];

  const elencoDiv = document.createElement('div');
  elencoDiv.className = "elenco-lista";

  let temJogador = false;

  posicoesOrdem.forEach(posicao => {
    if (elenco[posicao] && elenco[posicao].length > 0) {
      temJogador = true;
      const grupo = document.createElement("div");
      grupo.style.marginBottom = "20px";
      grupo.innerHTML = `<div class="elenco-lista-title">${posicao}${posicao !== "Goleiro" ? "s" : "s"} (${elenco[posicao].length}):</div>`;
      const lista = document.createElement("ul");
      elenco[posicao].forEach(nome => {
        const li = document.createElement("li");
        li.textContent = nome;
        lista.appendChild(li);
      });
      grupo.appendChild(lista);
      elencoDiv.appendChild(grupo);
    }
  });

  if (!temJogador) {
    elencoDiv.innerHTML = `<div class="elenco-lista-title">Sem elenco cadastrado para esse ano.</div>`;
  }
  mainContent.appendChild(elencoDiv);
}

// SPA / ROTEAMENTO
function renderHome() {
  document.getElementById("search-area").style.display = "";
  mainContent.innerHTML = "";
  mainContent.style.animation = "fadein 0.5s";
}

function renderCadastro() {
  document.getElementById("search-area").style.display = ""; // mantém a barra de pesquisa

  mainContent.innerHTML = `
    <h1 class="cadastro-title">CADASTRE-SE NO ELENCOS CORINTHIANS</h1>
    <div class="cadastro-container">
      <form class="cadastro-form" id="cadastro-form" autocomplete="off">
        <div class="form-row">
          <div class="form-col">
            <label for="nome">NOME COMPLETO</label>
            <input type="text" id="nome" name="nome" required placeholder="Nome completo" autocomplete="name">
          </div>
          <div class="form-col">
            <label for="nascimento">DATA DE NASCIMENTO</label>
            <input type="text" id="nascimento" name="nascimento" placeholder="dd/mm/aaaa">
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <label for="email">E-MAIL</label>
            <input type="email" id="email" name="email" required placeholder="nome@email.com" autocomplete="email">
          </div>
          <div class="form-col">
            <label for="genero">GÊNERO:</label>
            <select id="genero" name="genero">
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
              <option value="N">Prefiro não informar</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <label for="email-confirm">CONFIRMAR E-MAIL</label>
            <input type="email" id="email-confirm" name="email-confirm" required placeholder="nome@email.com">
          </div>
          <div class="form-col file-col">
            <label for="foto">FOTO</label>
            <input type="file" id="foto" name="foto" accept="image/*">
            <div class="foto-preview" id="foto-preview">CLIQUE AQUI PARA ADICIONAR UMA FOTO</div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <label for="apelido">APELIDO</label>
            <input type="text" id="apelido" name="apelido" placeholder="Apelido">
          </div>
          <div class="form-col">
            <label for="cidade">CIDADE</label>
            <input type="text" id="cidade" name="cidade" placeholder="Cidade">
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <label for="senha">SENHA</label>
            <input type="password" id="senha" name="senha" required placeholder="Senha" autocomplete="new-password">
          </div>
          <div class="form-col">
            <label for="senha-confirm">CONFIRMAR SENHA</label>
            <input type="password" id="senha-confirm" name="senha-confirm" required placeholder="Confirmar senha" autocomplete="new-password">
          </div>
        </div>
        <div class="form-row">
          <label class="checkbox-label">
            <input type="checkbox" id="novidades" name="novidades" checked>
            QUERO RECEBER AS NOTÍCIAS DO CORINTHIANS E NOVIDADES DO ELENCOS CORINTHIANS POR EMAIL.
          </label>
        </div>
        <div class="form-row">
          <small class="form-info">Site protegido pelo reCAPTCHA e esses <a href="#">Termos</a> e <a href="#">Política</a> do Google se aplicam.</small>
        </div>
        <button type="submit" class="cadastro-btn-full">CADASTRAR NO ELENCOS CORINTHIANS</button>
      </form>
    </div>
  `;

  // Preview foto
  const fotoInput = document.getElementById("foto");
  const fotoPreview = document.getElementById("foto-preview");
  fotoInput?.addEventListener("change", function() {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        fotoPreview.style.background = `url('${e.target.result}') center/cover no-repeat`;
        fotoPreview.textContent = "";
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  document.getElementById("cadastro-form").addEventListener("submit", async function(e) {
    e.preventDefault();
    const dados = {
      nome: document.getElementById("nome").value,
      data_nascimento: document.getElementById("nascimento").value,
      genero: document.getElementById("genero").value,
      email: document.getElementById("email").value,
      apelido: document.getElementById("apelido").value,
      cidade: document.getElementById("cidade").value,
      senha: document.getElementById("senha").value,
      foto_url: "", // implementar upload depois se quiser
      receber_novidades: document.getElementById("novidades").checked
    };
    const resp = await fetch("http://localhost:3001/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    const res = await resp.json();
    showToast(res.message || res.error);
  });
}

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

// SPA INIT
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