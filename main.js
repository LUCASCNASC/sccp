// Gera os anos de 1910 até 2025
const years = [];
for (let y = 1910; y <= 2025; y++) years.push(y.toString());

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
document.getElementById("filter-btn").addEventListener("click", function() {
  const selectedYear = yearInput.value;
  if (years.includes(selectedYear)) {
    showElencoTitle(selectedYear);
  } else {
    showToast("Ano inválido. Por favor, escolha um ano da lista.");
  }
});

function showElencoTitle(ano) {
  mainContent.innerHTML = "";
  // Título
  const titulo = document.createElement('h1');
  titulo.className = 'elenco-title';
  titulo.textContent = `Elenco do timão na temporada de ${ano}`;
  mainContent.appendChild(titulo);

  // Lista de jogadores
  if (ELENCOS[ano]) {
    const elencoDiv = document.createElement('div');
    elencoDiv.className = "elenco-lista";
    elencoDiv.innerHTML = `<div class="elenco-lista-title">Jogadores (${ELENCOS[ano].length}):</div>`;
    const lista = document.createElement("ul");
    lista.setAttribute("role", "list");
    ELENCOS[ano].forEach(j => {
      const li = document.createElement("li");
      li.textContent = j;
      lista.appendChild(li);
    });
    elencoDiv.appendChild(lista);
    mainContent.appendChild(elencoDiv);
  } else {
    const elencoDiv = document.createElement('div');
    elencoDiv.className = "elenco-lista";
    elencoDiv.innerHTML = `<div class="elenco-lista-title">Sem elenco cadastrado para esse ano.</div>`;
    mainContent.appendChild(elencoDiv);
  }
}

// ---- SPA / ROTEAMENTO ----

function renderHome() {
  document.getElementById("search-area").style.display = "";
  mainContent.innerHTML = "";
  mainContent.style.animation = "fadein 0.5s";
}

function renderCadastro() {
  document.getElementById("search-area").style.display = "none";
  mainContent.innerHTML = `
    <div class="cadastro-novo-bg" tabindex="-1">
      <div class="cadastro-novo-title">CADASTRE-SE NO ELENCOS CORINTHIANS</div>
      <div class="cadastro-novo-container">
        <div class="cadastro-novo-section-title">
          PREENCHA SEUS DADOS E FAÇA PARTE DA NOSSA COMUNIDADE.
        </div>
        <form class="cadastro-novo-form" id="cadastroForm" autocomplete="off" aria-label="Formulário de cadastro">
          <div class="cadastro-novo-group">
            <label for="nome">NOME COMPLETO</label>
            <input type="text" id="nome" name="nome" maxlength="100" placeholder="Nome completo" required aria-required="true" autocomplete="name">
            <div id="nome-error" class="cadastro-novo-error" style="display:none;"></div>
          </div>
          <div class="cadastro-novo-group short">
            <label for="nascimento">DATA DE NASCIMENTO</label>
            <input type="text" id="nascimento" name="nascimento" placeholder="dd/mm/aaaa" maxlength="10" required aria-required="true" autocomplete="bday">
            <div id="nascimento-error" class="cadastro-novo-error" style="display:none;"></div>
          </div>
          <div class="cadastro-novo-group">
            <label for="email">E-MAIL</label>
            <input type="email" id="email" name="email" placeholder="nome@email.com" required aria-required="true" autocomplete="email">
            <div id="email-error" class="cadastro-novo-error" style="display:none;"></div>
          </div>
          <div class="cadastro-novo-group">
            <label for="email-confirm">CONFIRMAR E-MAIL</label>
            <input type="email" id="email-confirm" name="email-confirm" placeholder="nome@email.com" required aria-required="true" autocomplete="email">
            <div id="email-confirm-error" class="cadastro-novo-error" style="display:none;"></div>
          </div>
          <div class="cadastro-novo-group short">
            <label for="genero">GÊNERO:</label>
            <select id="genero" name="genero" required aria-required="true">
              <option value="">Selecione</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
              <option value="nao_dizer">Prefiro não dizer</option>
            </select>
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
            <input type="text" id="apelido" name="apelido" placeholder="www.elencostimao.com.br/torcida/ Apelido" required aria-required="true">
          </div>
          <div class="cadastro-novo-group">
            <label for="cidade">CIDADE</label>
            <input type="text" id="cidade" name="cidade" placeholder="Cidade" required aria-required="true">
          </div>
          <div class="cadastro-novo-group">
            <label for="senha">SENHA</label>
            <input type="password" id="senha" name="senha" placeholder="Senha" required aria-required="true" autocomplete="new-password">
            <div id="senha-error" class="cadastro-novo-error" style="display:none;"></div>
          </div>
          <div class="cadastro-novo-group">
            <label for="senha-confirm">CONFIRMAR SENHA</label>
            <input type="password" id="senha-confirm" name="senha-confirm" placeholder="Confirmar senha" required aria-required="true" autocomplete="new-password">
            <div id="senha-confirm-error" class="cadastro-novo-error" style="display:none;"></div>
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

  // ----- FOTO PREVIEW -----
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
      nomeInput.classList.add("error");
      return false;
    }
    if (!value.trim()) {
      nomeError.innerText = "";
      nomeError.style.display = "none";
      nomeInput.classList.remove("error");
      return false;
    }
    const words = value.trim().split(/\s+/).filter(w => w.length >= 2);
    if (words.length < 2) {
      nomeError.innerText = "Digite nome e sobrenome.";
      nomeError.style.display = "block";
      nomeInput.classList.add("error");
      return false;
    }
    nomeError.innerText = "";
    nomeError.style.display = "none";
    nomeInput.classList.remove("error");
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
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      nascError.innerText = "";
      nascError.style.display = "none";
      nascInput.classList.remove("error");
      return false;
    }
    nascError.innerText = "";
    nascError.style.display = "none";
    nascInput.classList.remove("error");
    return true;
  }

  // ======= Validação de e-mail e confirmação =======
  const emailInput = document.getElementById('email');
  const emailConfirmInput = document.getElementById('email-confirm');
  const emailError = document.getElementById('email-error');
  const emailConfirmError = document.getElementById('email-confirm-error');
  function validateEmailFields() {
    let valid = true;
    if (emailInput.value && emailConfirmInput.value && emailInput.value !== emailConfirmInput.value) {
      emailConfirmError.innerText = "Os e-mails não coincidem.";
      emailConfirmError.style.display = "block";
      emailConfirmInput.classList.add("error");
      valid = false;
    } else {
      emailConfirmError.innerText = "";
      emailConfirmError.style.display = "none";
      emailConfirmInput.classList.remove("error");
    }
    if (emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      emailError.innerText = "E-mail inválido.";
      emailError.style.display = "block";
      emailInput.classList.add("error");
      valid = false;
    } else {
      emailError.innerText = "";
      emailError.style.display = "none";
      emailInput.classList.remove("error");
    }
    return valid;
  }
  emailInput.addEventListener('input', function() {
    validateEmailFields();
    checkFormValidity();
  });
  emailConfirmInput.addEventListener('input', function() {
    validateEmailFields();
    checkFormValidity();
  });

  // ======= Validação de senha e confirmação =======
  const senhaInput = document.getElementById('senha');
  const senhaConfirmInput = document.getElementById('senha-confirm');
  const senhaError = document.getElementById('senha-error');
  const senhaConfirmError = document.getElementById('senha-confirm-error');

  function senhaForte(s) {
    // Mínimo 8 caracteres, pelo menos 1 letra e 1 número
    return /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(s);
  }
  function validateSenhaFields() {
    let valid = true;
    if (senhaInput.value && !senhaForte(senhaInput.value)) {
      senhaError.innerText = "Senha fraca. Mínimo 8 caracteres, letra e número.";
      senhaError.style.display = "block";
      senhaInput.classList.add("error");
      valid = false;
    } else {
      senhaError.innerText = "";
      senhaError.style.display = "none";
      senhaInput.classList.remove("error");
    }
    if (senhaInput.value && senhaConfirmInput.value && senhaInput.value !== senhaConfirmInput.value) {
      senhaConfirmError.innerText = "Senhas não coincidem.";
      senhaConfirmError.style.display = "block";
      senhaConfirmInput.classList.add("error");
      valid = false;
    } else {
      senhaConfirmError.innerText = "";
      senhaConfirmError.style.display = "none";
      senhaConfirmInput.classList.remove("error");
    }
    return valid;
  }
  senhaInput.addEventListener('input', function() {
    validateSenhaFields();
    checkFormValidity();
  });
  senhaConfirmInput.addEventListener('input', function() {
    validateSenhaFields();
    checkFormValidity();
  });

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
    if (!validateEmailFields()) valid = false;
    if (!validateSenhaFields()) valid = false;
    for (const id of requiredFields) {
      const el = document.getElementById(id);
      if (!el.value || (id === 'genero' && el.value === "")) {
        valid = false;
        break;
      }
    }
    btn.disabled = !valid;
  }
  form.addEventListener('input', checkFormValidity);
  if (inputFoto) inputFoto.addEventListener('change', checkFormValidity);
  checkFormValidity();

  // ====== Salvando no LocalStorage e feedback SPA ======
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    // Salvar cadastro no localStorage (apenas campos, não foto)
    const dados = {};
    requiredFields.forEach(id => dados[id] = document.getElementById(id).value);
    dados.novidades = document.getElementById('novidades').checked;
    dados.dataCadastro = (new Date()).toISOString();

    let cadastros = [];
    try {
      cadastros = JSON.parse(localStorage.getItem("cadastros_sccp") || "[]");
    } catch {}
    cadastros.push(dados);
    localStorage.setItem("cadastros_sccp", JSON.stringify(cadastros));

    // Feedback visual de sucesso
    showToast("Cadastro realizado com sucesso!");
    form.reset();
    setTimeout(() => navigate("/"), 1500);
  });
}

function renderLogin() {
  document.getElementById("search-area").style.display = "none";
  mainContent.innerHTML = `
    <div class="login-bg">
      <div class="login-title">ELENCOS CORINTHIANS - LOGIN / CADASTRO</div>
      <div class="login-container">
        <div class="login-left">
          <div class="login-section-title">JÁ SOU CADASTRADO</div>
          <form class="login-form" id="loginForm" autocomplete="off">
            <label for="login-email">E-MAIL</label>
            <input type="email" id="login-email" name="login-email" placeholder="seu email" required autocomplete="email">
            <label for="login-senha">SENHA</label>
            <input type="password" id="login-senha" name="login-senha" placeholder="sua senha" required autocomplete="current-password">
            <a href="#" class="login-forgot">Não lembro minha senha</a>
            <button class="login-btn" type="submit">LOGIN</button>
          </form>
        </div>
        <div class="login-right">
          <div class="login-section-title">AINDA NÃO ME CADASTREI</div>
          <div class="login-desc">
            Faça parte do Elencos Corinthians e acompanhe o TIMÃO mais de perto.
          </div>
          <button class="cadastro-btn" id="login-cadastro-btn">CADASTRO</button>
          <div class="login-ou">Ou</div>
          <button class="login-social fb"><span aria-hidden="true">📘</span> LOGIN COM FACEBOOK</button>
          <button class="login-social google"><span aria-hidden="true">🔵</span> Fazer Login com o Google</button>
        </div>
      </div>
    </div>
  `;

  // Botão "CADASTRO" vai para tela de cadastro
  document.getElementById("login-cadastro-btn").addEventListener("click", function() {
    navigate("/cadastro");
  });

  // Exemplo de submit fake
  document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    showToast("Login não implementado.");
  });
}

// ---- Roteamento SPA ----
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

// ---- SPA INIT com novo botão ENTRAR ----
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