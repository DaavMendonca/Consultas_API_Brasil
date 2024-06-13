

async function ConsultarCNPJ() {
  event.preventDefault();
  cnpj_temp = document.getElementById("cnpj").value;
  cnpj = cnpj_temp.replace(/[./-]/g, '');

  //Valida CNPJ
  if (cnpj.length != 14) {
    window.alert('CNPJ Inválido')
  } else {

    const url = `https://publica.cnpj.ws/cnpj/${cnpj}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na requisição');
        }
        return response.json();
      })

      .then(data => {

        const dataFormatada = formatarData(data['atualizado_em']);
        const cnae = data['estabelecimento']['atividade_principal']['id']
        const desc_cnae = data['estabelecimento']['atividade_principal']['descricao']

        document.getElementById("razao_social").value = data['razao_social']
        document.getElementById("situacao_cadastral").value = data['estabelecimento']['situacao_cadastral']
        document.getElementById("tipo").value = data['estabelecimento']['tipo']
        document.getElementById("nome_fantasia").value = data['estabelecimento']['nome_fantasia'];
        document.getElementById("atualizado_em").value = dataFormatada;
        document.getElementById("atividade_principal").value = cnae + ' - ' + desc_cnae;

        //Atividades Secundarias
        list_cnae_secundario = data['estabelecimento']['atividades_secundarias'];
        const lista = document.getElementById('cnaesecundario');
        lista.innerHTML = '';

        list_cnae_secundario.forEach(item => {
          const novoItem = document.createElement('li');
          novoItem.className = 'list-group-item';
          novoItem.textContent = item['id'] + ' - ' + item['descricao'];

          lista.appendChild(novoItem);
        });

        tipo_logradouro = data['estabelecimento']['tipo_logradouro'];
        logradouro = data['estabelecimento']['logradouro'];
        numero = data['estabelecimento']['numero'];
        enderecocompleto = tipo_logradouro + ' ' + logradouro + ', ' + numero;

        document.getElementById("endereco").value = enderecocompleto;
        document.getElementById("cep").value = data['estabelecimento']['cep'];
        document.getElementById("cidade").value = data['estabelecimento']['cidade']['nome'];
        document.getElementById("uf").value = data['estabelecimento']['estado']['sigla'];
        document.getElementById("pais").value = data['estabelecimento']['pais']['nome'];
        document.getElementById("email").value = data['estabelecimento']['email']
        document.getElementById("telefone").value = data['estabelecimento']['ddd1'] + ' ' + data['estabelecimento']['telefone1']

        if (data['simples'] == null) {
          document.getElementById("simples").value = "Não Optante Pelo Simples Nacional"
        } else {
          if (data['simples']['simples'] == 'Sim') {
            document.getElementById("simples").value = "Optante Pelo Simples Nacional"
          } else {
            document.getElementById("simples").value = "Não Optante Pelo Simples Nacional"
          }

        }

        document.getElementById("situacao_especial").value = data['estabelecimento']['situacao_especial'];
        document.getElementById("data_situacao_especial").value = data['estabelecimento']['data_situacao_especial']

        lista_ie = data['estabelecimento']['inscricoes_estaduais'];
        const listaIE = document.getElementById('ie');
        listaIE.innerHTML = '';

        lista_ie.forEach(item => {
          const novoItem = document.createElement('li');
          novoItem.className = 'list-group-item';

          if (item['ativo'] == false) {
            status = 'Inativa';
          } else {
            status = 'Ativa  ';
          }

          estado = item['estado']['sigla'];
          insc = item['inscricao_estadual'];

          novoItem.textContent = status + ' - ' + estado + ' - ' + insc
          listaIE.appendChild(novoItem);
        });

      })
      .catch(error => {
        if (error == 'Error: Erro na requisição') {
          window.alert('Você Excedeu o limite de 3 requisições por minuto')
        } else {
          console.error('Erro:', error.textContent);

        }
      });
  }
}

function formatarData(dataString) {

  const data = new Date(dataString);
  const dia = data.getDate();
  const mes = data.getMonth() + 1; // Os meses são indexados a partir de 0
  const ano = data.getFullYear();

  const diaFormatado = dia < 10 ? '0' + dia : dia;
  const mesFormatado = mes < 10 ? '0' + mes : mes;
  return diaFormatado + '/' + mesFormatado + '/' + ano;
}


async function ConsultarCEP() {
  cep_temp = document.getElementById("cep").value;
  cep = cep_temp.replace(/[./-]/g, '');

  //Valida CEP
  if (cep.length != 8) {
    window.alert('CEP Inválido')
  } else {

  }
  const url = `https://brasilapi.com.br/api/cep/v1/${cep}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }
      return response.json();
    })

    .then(data => {

      document.getElementById('rua').value = data['street'];
      document.getElementById('bairro').value = data['neighborhood'];
      document.getElementById('cidade').value = data['city'];
      document.getElementById('uf').value = data['state'];


    })
    .catch(error => {
      if (error == 'Error: Erro na requisição') {
        window.alert('Você Excedeu o limite de 3 requisições por minuto')
      } else {
        console.error('Erro:', error.textContent);

      }
    });
}



async function ConsutarUF() {
  uf = document.getElementById("estado").value;


  //Valida UF
  if (uf == 'Selecione...') {
    window.alert('Selecione um Estado')
  } else {

    const url = `https://brasilapi.com.br/api/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na requisição');
        }
        return response.json();
      })

      .then(data => {
        var input = document.getElementById("pesquisar");
        input.style.display = "inline-block";

        const tabela = document.getElementById('municipios');
        const linhas = tabela.getElementsByTagName('tr');


        for (let i = linhas.length - 1; i > 0; i--) {
          tabela.deleteRow(i);
        }
        const municipioTable = document.getElementById("municipios");

        data.forEach(item => {
          const newRow = municipioTable.insertRow();
          const codigoCell = newRow.insertCell(0);
          const nomeCell = newRow.insertCell(1);

          codigoCell.textContent = item.codigo_ibge;
          nomeCell.textContent = item.nome;
        });

      })
      .catch(error => {
        if (error == 'Error: Erro na requisição') {
          window.alert('Você Excedeu o limite de 3 requisições por minuto')
        } else {
          console.error('Erro:', error.textContent);

        }
      });
  }
}

/*filtrar Municipio*/
function filtrarmunicipio() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("pesquisarcidade");
  filter = input.value.toUpperCase();
  table = document.getElementById("municipios");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}


/*filtrar NCM*/
function filtrarncm() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("codigoncm");
  filter = input.value.toUpperCase();
  table = document.getElementById("tabelancm");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}


async function consultarncm() {
  var ncm = document.getElementById('ncm').value;

  const url = `https://brasilapi.com.br/api/ncm/v1?search=${ncm}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }
      return response.json();
    })

    
    .then(data => {
     
      const tabela = document.getElementById('tabelancm');
      const linhas = tabela.getElementsByTagName('tr');

      for (let i = linhas.length - 1; i > 0; i--) {
          tabela.deleteRow(i);
      }


      const tabelancm = document.getElementById("tabelancm");

      data.forEach(item => {
        const newRow = tabelancm.insertRow();
        const codigon = newRow.insertCell(0);
        const descn = newRow.insertCell(1);
        const datai = newRow.insertCell(2);
        const dataf = newRow.insertCell(3);

        codigon.textContent = item.codigo;
        descn.textContent = item.descricao;
        datai.textContent = item.data_inicio;
        dataf.textContent = item.data_fim;

      });

    })

    .catch(error => {
      if (error == 'Error: Erro na requisição') {
        window.alert('Você Excedeu o limite de 3 requisições por minuto')
      } else {
        console.error('Erro:', error.textContent);

      }
    });
}


async function listarbancos() {

  const url = `https://brasilapi.com.br/api/banks/v1`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }
      return response.json();
    })

    
    .then(data => {
     
      const tabela = document.getElementById('tabelabanco');
      const linhas = tabela.getElementsByTagName('tr');

      for (let i = linhas.length - 1; i > 0; i--) {
          tabela.deleteRow(i);
      }


      const tabelancm = document.getElementById("tabelabanco");

      data.forEach(item => {
        const newRow = tabelancm.insertRow();
        const ispb = newRow.insertCell(0);
        const fullName = newRow.insertCell(1);
        const code = newRow.insertCell(2);


        ispb.textContent = item.ispb;
        fullName.textContent = item.fullName;
        code.textContent = item.code;


      });

    })

    .catch(error => {
      if (error == 'Error: Erro na requisição') {
        window.alert('Você Excedeu o limite de 3 requisições por minuto')
      } else {
        console.error('Erro:', error.textContent);

      }
    });
}

/*filtrar Banco*/
function filtrarbanco() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("banco");
  filter = input.value.toUpperCase();
  table = document.getElementById("tabelabanco");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}


async function listartaxas() {

  const url = `https://brasilapi.com.br/api/taxas/v1`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }
      return response.json();
    })
    
    .then(data => {
     
      const tabela = document.getElementById('tabelataxas');
      const linhas = tabela.getElementsByTagName('tr');

      for (let i = linhas.length - 1; i > 0; i--) {
          tabela.deleteRow(i);
      }

      data.forEach(item => {
        const newRow = tabelataxas.insertRow();
        const nome = newRow.insertCell(0);
        const valor = newRow.insertCell(1);

        nome.textContent = item.nome;
        valor.textContent = item.valor;

      });

    })

    .catch(error => {
      if (error == 'Error: Erro na requisição') {
        window.alert('Você Excedeu o limite de 3 requisições por minuto')
      } else {
        console.error('Erro:', error.textContent);

      }
    });
}