document.addEventListener('DOMContentLoaded', () => {
  // Verifica se o usuário está logado em páginas protegidas
  const protectedPages = ['index.html', 'dashboard.html'];
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (protectedPages.includes(currentPage)) {
    const loggedUser = localStorage.getItem('loggedUser');
    if (!loggedUser) {
      window.location.href = 'login.html';
    }
  }

  // Inicializa dados no localStorage se não existirem
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
      { email: "teste@mercado.com", password: "123456", nome: "Teste", tipo: "comprador" }
    ]));
  }
  if (!localStorage.getItem('cotacoes')) {
    localStorage.setItem('cotacoes', JSON.stringify([]));
  }

  // Login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const users = JSON.parse(localStorage.getItem('users'));
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('loggedUser', JSON.stringify(user));
        window.location.href = 'index.html';
      } else {
        alert('Email ou senha inválidos!');
      }
    });
  }

  // Cadastro
  const cadastroForm = document.getElementById('cadastro-form');
  if (cadastroForm) {
    cadastroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const tipo = document.getElementById('tipo').value;
      const users = JSON.parse(localStorage.getItem('users'));
      if (users.find(u => u.email === email)) {
        alert('Email já cadastrado!');
        return;
      }
      users.push({ nome, email, password, tipo });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Cadastro realizado com sucesso!');
      window.location.href = 'login.html';
    });
  }

  // Upload
  const uploadForm = document.getElementById('upload-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fileInput = document.getElementById('file-input');
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          localStorage.setItem('cotacoes', JSON.stringify(jsonData));
          alert('Arquivo processado com sucesso!');
          window.location.href = 'dashboard.html';
        };
        reader.readAsArrayBuffer(file);
      }
    });
  }

  // Dashboard
  const cotacoesBody = document.getElementById('cotacoes-body');
  if (cotacoesBody) {
    const cotacoes = JSON.parse(localStorage.getItem('cotacoes')) || [];
    cotacoes.forEach(cotacao => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${cotacao.Produto || 'N/A'}</td>
        <td>${cotacao.Preço || 'N/A'}</td>
        <td>${cotacao.Fornecedor || 'N/A'}</td>
      `;
      cotacoesBody.appendChild(row);
    });
  }

  // Logout
  const logoutLink = document.getElementById('logout');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('loggedUser');
      window.location.href = 'login.html';
    });
  }
});
