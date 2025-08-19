// Gera os anos de 1910 até 2025
const years = [];
for (let y = 1910; y <= 2025; y++) {
  years.push(y.toString());
}

const yearInput = document.getElementById("year-input");
const autocompleteList = document.getElementById("autocomplete-list");
const mainContent = document.getElementById("main-content");
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
    item.addEventListener("mousedown", function(e) {
      yearInput.value = year;
      autocompleteList.classList.remove("show");
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

// Botão FILTRAR
document.getElementById("filter-btn").addEventListener("click", function() {
  const selectedYear = yearInput.value;
  if (years.includes(selectedYear)) {
    showElencoTitle(selectedYear);
  } else {
    alert("Ano inválido. Por favor, escolha um ano da lista.");
  }
});

// Função para mostrar o título do elenco no body
function showElencoTitle(ano) {
  let titulo = document.querySelector('.elenco-title');
  if (!titulo) {
    titulo = document.createElement('h1');
    titulo.className = 'elenco-title';
    mainContent.innerHTML = ''; // Limpa o conteúdo anterior
    mainContent.appendChild(titulo);
  }
  titulo.textContent = `Elenco do timão na temporada de ${ano}`;
}

// ---- SPA / ROTEAMENTO ----

// Renderiza tela inicial
function renderHome() {
  document.getElementById("search-area").style.display = "";
  mainContent.innerHTML = "";
}

// Renderiza tela de cadastro
function renderCadastro() {
  document.getElementById("search-area").style.display = "none";
  mainContent.innerHTML = `
    <div class="cadastro-novo-bg">
      <div class="cadastro-novo-title">CADASTRE-SE NO ELENCOS CORINTHIANS</div>
      <div class="cadastro-novo-container">
        <div class="cadastro-novo-section-title">
          PREENCHA SEUS DADOS E FAÇA PARTE DA NOSSA COMUNIDADE.
        </div>
        <form class="cadastro-novo-form" id="cadastroForm" autocomplete="off">
          <div class="cadastro-novo-group">
            <label for="nome">NOME COMPLETO</label>
            <input type="text" id="nome" name="nome" maxlength="100" placeholder="Nome completo" required>
            <div id="nome-error" class="cadastro-novo-error" style="display:none;"></div>
          </div>
          <div class="cadastro-novo-group short">
            <label for="nascimento">DATA DE NASCIMENTO</label>
            <input type="text" id="nascimento" name="nascimento" placeholder="dd/mm/aaaa" maxlength="10" required>
            <div id="nascimento-error" class="cadastro-novo-error" style="display:none;"></div>
          </div>
          <div class="cadastro-novo-group">
            <label for="email">E-MAIL</label>
            <input type="email" id="email" name="email" placeholder="nome@email.com" required>
          </div>
          <div class="cadastro-novo-group short">
            <label for="genero">GÊNERO:</label>
            <select id="genero" name="genero" required>
              <option value="">Selecione</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
              <option value="nao_dizer">Prefiro não dizer</option>
            </select>
          </div>
          <div class="cadastro-novo-group">
            <label for="email-confirm">CONFIRMAR E-MAIL</label>
            <input type="email" id="email-confirm" name="email-confirm" placeholder="nome@email.com" required>
          </div>
          <div class="cadastro-novo-foto">
            <label for="foto">
              <span class="foto-placeholder" id="foto-placeholder">
                CLIQUE AQUI<br>PARA ADICIONAR<br>UMA FOTO
              </span>
              <input type="file" id="foto" name="foto" accept="image/*">
            </label>
            <img id="foto-preview" class="foto-preview" style="display:none" src="#" alt="Prévia da foto">
          </div>
          <div class="cadastro-novo-group">
            <label for="apelido">APELIDO</label>
            <input type="text" id="apelido" name="apelido" placeholder="www.elencostimao.com.br/torcida/ Apelido" required>
          </div>
          <div class="cadastro-novo-group">
            <label for="cidade">CIDADE</label>
            <input type="text" id="cidade" name="cidade" placeholder="Cidade" required>
          </div>
          <div class="cadastro-novo-group">
            <label for="senha">SENHA</label>
            <input type="password" id="senha" name="senha" placeholder="Senha" required>
          </div>
          <div class="cadastro-novo-group">
            <label for="senha-confirm">CONFIRMAR SENHA</label>
            <input type="password" id="senha-confirm" name="senha-confirm" placeholder="Confirmar senha" required>
          </div>
          <div class="cadastro-novo-group" style="flex-basis:100%;max-width:100%;">
            <div class="cadastro-novo-checkbox-row">
              <input type="checkbox" id="novidades" name="novidades" checked>
              <label for="novidades" style="color:#fff; font-size:1em; font-weight:700;">
                QUERO RECEBER AS NOTÍCIAS DO CORINTHIANS E NOVIDADES DO ELENCOS CORINTHIANS POR EMAIL.
              </label>
            </div>
            <div class="cadastro-novo-termos">
              Site protegido pelo reCAPTCHA e esses
              <a href="#">Termos</a> e <a href="#">Política</a> do Google se aplicam.
            </div>
          </div>
          <button class="cadastro-novo-btn" id="cadastroBtn" type="submit" disabled>CADASTRAR NO ELENCOS CORINTHIANS</button>
        </form>
      </div>
    </div>
  `;

  // Foto preview e obrigatoriedade
  const inputFoto = document.getElementById("foto");
  const previewFoto = document.getElementById("foto-preview");
  const fotoPlaceholder = document.getElementById("foto-placeholder");
  if (inputFoto) {
    inputFoto.addEventListener("change", function(event) {
      if (inputFoto.files && inputFoto.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          previewFoto.src = e.target.result;
          previewFoto.style.display = "block";
          fotoPlaceholder.style.display = "none";
        }
        reader.readAsDataURL(inputFoto.files[0]);
      } else {
        previewFoto.style.display = "none";
        fotoPlaceholder.style.display = "block";
      }
    });
  }

  // ======= Validação campo NOME COMPLETO =======
  const nomeInput = document.getElementById('nome');
  const nomeError = document.getElementById('nome-error');
  nomeInput.addEventListener('keypress', function(e) {
    const char = e.key;
    if (!/^[a-zA-ZáÁãÃâÂàÀéÉêÊíÍóÓôÔõÕúÚçÇ\s]$/.test(char)) {
      e.preventDefault();
    }
  });
  nomeInput.addEventListener('paste', function(e) {
    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    if (!/^[a-zA-ZáÁãÃâÂàÀéÉêÊíÍóÓôÔõÕúÚçÇ\s]*$/.test(pasted)) {
      e.preventDefault();
    }
  });
  function validateNome() {
    let value = nomeInput.value;
    let onlyLetters = value.replace(/[^a-zA-ZáÁãÃâÂàÀéÉêÊíÍóÓôÔõÕúÚçÇ\s]/g, '');
    if (onlyLetters !== value) {
      nomeInput.value = onlyLetters;
      value = onlyLetters;
    }
    if (value.length > 100) {
      nomeError.innerText = "Limite de 100 caracteres excedido.";
      nomeError.style.display = "block";
      return false;
    }
    if (!value.trim()) {
      nomeError.innerText = "";
      nomeError.style.display = "none";
      return false;
    }
    const words = value.trim().split(/\s+/).filter(w => w.length >= 2);
    if (words.length < 2) {
      nomeError.innerText = "Digite nome e sobrenome.";
      nomeError.style.display = "block";
      return false;
    }
    nomeError.innerText = "";
    nomeError.style.display = "none";
    return true;
  }
  nomeInput.addEventListener('input', function() {
    validateNome();
    checkFormValidity();
  });

  // ======= Validação e formatação campo DATA DE NASCIMENTO =======
  const nascInput = document.getElementById('nascimento');
  const nascError = document.getElementById('nascimento-error');

  nascInput.addEventListener('input', function(e) {
    let v = nascInput.value.replace(/\D/g, '');
    if (v.length > 8) v = v.substr(0, 8);
    if (v.length > 4) v = v.replace(/^(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,2})/, "$1/$2");
    nascInput.value = v;
    validateNascimento();
    checkFormValidity();
  });
  nascInput.addEventListener('keypress', function(e) {
    // Só permite número, Backspace e Tab
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
      e.preventDefault();
    }
  });
  nascInput.addEventListener('paste', function(e) {
    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    if (!/^[0-9\/]*$/.test(pasted)) {
      e.preventDefault();
    }
  });
  function validateNascimento() {
    let value = nascInput.value;
    // Formato dd/mm/aaaa
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      nascError.innerText = "";
      nascError.style.display = "none";
      return false;
    }
    // Checa validade da data (não precisa ser data real, só formato)
    nascError.innerText = "";
    nascError.style.display = "none";
    return true;
  }

  // Validação dinâmica dos campos do formulário
  const form = document.getElementById('cadastroForm');
  const btn = document.getElementById('cadastroBtn');
  const requiredFields = [
    'nome', 'nascimento', 'email', 'genero', 'email-confirm',
    'apelido', 'cidade', 'senha', 'senha-confirm'
  ];
  function checkFormValidity() {
    let valid = true;
    if (!validateNome()) valid = false;
    if (!validateNascimento()) valid = false;
    for (const id of requiredFields) {
      const el = document.getElementById(id);
      if (!el.value || (id === 'genero' && el.value === "")) {
        valid = false;
        break;
      }
    }
    // Foto NÃO é mais obrigatória
    btn.disabled = !valid;
  }
  form.addEventListener('input', checkFormValidity);
  if (inputFoto) inputFoto.addEventListener('change', checkFormValidity);
  checkFormValidity();
}

// ---- Roteamento SPA ----
function navigate(path, addToHistory=true) {
  if (path === "/" || path === "") {
    renderHome();
  } else if (path === "/cadastro") {
    renderCadastro();
  }
  if (addToHistory) {
    history.pushState({path}, "", path);
  }
}

function initSPA() {
  if (location.pathname === "/cadastro") {
    renderCadastro();
  } else {
    renderHome();
  }
  document.getElementById("register-link").addEventListener("click", function(e) {
    e.preventDefault();
    navigate("/cadastro");
  });
  document.getElementById("reload-home").addEventListener("click", function() {
    navigate("/");
  });
  window.onpopstate = function(event) {
    if (event.state && event.state.path) {
      if (event.state.path === "/cadastro") renderCadastro();
      else renderHome();
    } else {
      if (location.pathname === "/cadastro") renderCadastro();
      else renderHome();
    }
  };
}

initSPA();