document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("transaction-form");
    const descriptionInput = document.getElementById("description");
    const amountInput = document.getElementById("amount");
    const typeInput = document.getElementById("type");
    const transactionList = document.getElementById("transaction-list");
    const totalDisplay = document.getElementById("total");
    const spentDisplay = document.getElementById("spent");
    const netDisplay = document.getElementById("net");

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let editId = null;

    function updateSummary() {
        const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
        const spent = transactions.reduce((acc, transaction) => transaction.type === "saida" ? acc + transaction.amount : acc, 0);
        const net = total - spent;

        totalDisplay.textContent = `R$${total.toFixed(2)}`;
        spentDisplay.textContent = `R$${spent.toFixed(2)}`;
        netDisplay.textContent = `R$${net.toFixed(2)}`;
    }

    function saveTransactions() {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    function addTransaction(description, amount, type) {
        const transaction = { description, amount: parseFloat(amount), type, id: Date.now() };
        transactions.push(transaction);
        saveTransactions();
        renderTransactions();
        updateSummary();
    }

    function updateTransaction(id, description, amount, type) {
        const transaction = transactions.find(transaction => transaction.id === id);
        if (transaction) {
            transaction.description = description;
            transaction.amount = parseFloat(amount);
            transaction.type = type;
            saveTransactions();
            renderTransactions();
            updateSummary();
        }
    }

    function deleteTransaction(id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        saveTransactions();
        renderTransactions();
        updateSummary();
    }

    function editTransaction(id) {
        const transaction = transactions.find(transaction => transaction.id === id);
        if (transaction) {
            descriptionInput.value = transaction.description;
            amountInput.value = transaction.amount;
            typeInput.value = transaction.type;
            editId = id;
        }
    }

    function renderTransactions() {
        transactionList.innerHTML = "";
        transactions.forEach(transaction => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${transaction.description} - R$${transaction.amount.toFixed(2)} (${transaction.type})
                <button class="edit" data-id="${transaction.id}">Editar</button>
                <button class="delete" data-id="${transaction.id}">Excluir</button>
            `;
            transactionList.appendChild(li);
        });
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const description = descriptionInput.value;
        const amount = amountInput.value;
        const type = typeInput.value;

        if (editId) {
            updateTransaction(editId, description, amount, type);
            editId = null;
        } else {
            addTransaction(description, amount, type);
        }

        form.reset();
    });

    transactionList.addEventListener("click", function(event) {
        if (event.target.classList.contains("delete")) {
            const id = event.target.getAttribute("data-id");
            deleteTransaction(id);
        }

        if (event.target.classList.contains("edit")) {
            const id = event.target.getAttribute("data-id");
            editTransaction(id);
        }
    });

    renderTransactions();
    updateSummary();
});
