// script.js
document.getElementById('uploadForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const file = document.getElementById('cotacaoFile').files[0];

  if (!file) return alert('Por favor, selecione um arquivo.');

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonCotacao = XLSX.utils.sheet_to_json(firstSheet);

    buscarFornecedor(jsonCotacao);
  };
  reader.readAsArrayBuffer(file);
});

function buscarFornecedor(cotacoes) {
  fetch('data/fornecedores.json')
    .then(response => response.json())
    .then(fornecedores => {
      let resultadoHTML = '';

      cotacoes.forEach(item => {
        const fornecedor = fornecedores.find(f => f.produto === item.produto && f.regiao === item.regiao);
        if (fornecedor) {
          resultadoHTML += `<p><strong>${item.produto}</strong>: ${fornecedor.nome} - ${fornecedor.contato}</p>`;
        } else {
          resultadoHTML += `<p><strong>${item.produto}</strong>: Nenhum fornecedor encontrado.</p>`;
        }
      });

      document.getElementById('resultado').innerHTML = resultadoHTML;
    });
}
