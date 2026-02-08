const tbody = document.querySelector("tbody");
const inputDescricao = document.querySelector("#desc");
const inputValor = document.querySelector("#val");
const selectTipo = document.querySelector("#tip");
const btnIncluir = document.querySelector("#btn-incluir");

const entrada = document.querySelector(".entrada");
const saida = document.querySelector(".saida");
const total = document.querySelector(".total");

let items;

btnIncluir.onclick = () => {
  if (inputDescricao.value === "" || inputValor.value === "") {
    return alert("Preencha todos os Campos 😜");
  }
  items.push({
    desc: inputDescricao.value,
    val: Math.abs(inputValor.value).toFixed(2),
    tip: selectTipo.value,
  });

  setItensBD();
  loadItens();

  inputDescricao.value = "";
  inputValor.value = "";
};

function deleteItem(index) {
  items.splice(index, 1);
  setItensBD();
  loadItens();
}

function editItem(index) {
  const item = items[index];
  inputDescricao.value = item.desc;
  
  btnIncluir.innerText = 'Salvar';
  btnIncluir.onclick = () => {
    if (inputDescricao.value === "" || inputValor.value === "") {
      return alert("Preencha todos os Campos 😜");
    }
    item.desc = inputDescricao.value;
    item.val = Math.abs(inputValor.value).toFixed(2);
    item.tip = selectTipo.value;
    
    setItensBD();
    loadItens();
    
    btnIncluir.innerText = 'Incluir';
    btnIncluir.onclick = () => {
      if (inputDescricao.value === "" || inputValor.value === "") {
        return alert("Preencha todos os Campos 😜");
      }
      items.push({
        desc: inputDescricao.value,
        val: Math.abs(inputValor.value).toFixed(2),
        tip: selectTipo.value,
      });

      setItensBD();
      loadItens();

      inputDescricao.value = "";
      inputValor.value = "";
    };

    inputDescricao.value = "";
    inputValor.value = "";
  };
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td class="td-desc">${item.desc}</td>
    <td>${item.val}</td>
    <td class="tabela-tipo">${
      item.tip === "Entrada"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td class="tabela-acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
    `;
  tbody.appendChild(tr);
}

function loadItens() {
  items = getItensBD();
  tbody.innerHTML = "";

  items.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals();
}

function getTotals() {
  const novaEntrada = items
    .filter((item) => item.tip === "Entrada")
    .map((transaction) => Number(transaction.val));

  const novaSaida = items
    .filter((item) => item.tip === "Saída")
    .map((transaction) => Number(transaction.val));

  const totalEntrada = novaEntrada
    .reduce((acc, cur) =>[_{{{CITATION{{{_1{](https://github.com/RTPorfirio/Carranca/tree/17488c2e139ffb19b9c44df95df7458a1a5bb090/index.php)