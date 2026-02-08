        let transactions = [];
        let editingId = null;

        // Carregar dados do storage ao iniciar
        async function loadTransactions() {
            try {
                const result = await window.storage.get('transactions');
                if (result && result.value) {
                    transactions = JSON.parse(result.value);
                    renderTransactions();
                    updateSummary();
                }
            } catch (error) {
                console.log('Nenhum dado anterior encontrado');
            }
        }

        // Salvar dados no storage
        async function saveTransactions() {
            try {
                await window.storage.set('transactions', JSON.stringify(transactions));
            } catch (error) {
                console.error('Erro ao salvar:', error);
            }
        }

        // Adicionar transação
        document.getElementById('transactionForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const descricao = document.getElementById('descricao').value;
            const valor = parseFloat(document.getElementById('valor').value);
            const tipo = document.getElementById('tipo').value;

            const transaction = {
                id: Date.now(),
                descricao,
                valor,
                tipo,
                data: new Date().toLocaleDateString('pt-BR')
            };

            transactions.unshift(transaction);
            await saveTransactions();
            renderTransactions();
            updateSummary();

            // Limpar formulário
            this.reset();
        });

        // Iniciar edição
        function startEdit(id) {
            editingId = id;
            renderTransactions();
        }

        // Cancelar edição
        function cancelEdit() {
            editingId = null;
            renderTransactions();
        }

        // Salvar edição
        async function saveEdit(id) {
            const descricao = document.getElementById(`edit-desc-${id}`).value;
            const valor = parseFloat(document.getElementById(`edit-valor-${id}`).value);
            const tipo = document.getElementById(`edit-tipo-${id}`).value;

            const index = transactions.findIndex(t => t.id === id);
            if (index !== -1) {
                transactions[index] = {
                    ...transactions[index],
                    descricao,
                    valor,
                    tipo
                };
                await saveTransactions();
                editingId = null;
                renderTransactions();
                updateSummary();
            }
        }

        // Deletar transação
        async function deleteTransaction(id) {
            if (confirm('Tem certeza que deseja excluir esta transação?')) {
                transactions = transactions.filter(t => t.id !== id);
                await saveTransactions();
                renderTransactions();
                updateSummary();
            }
        }

        // Renderizar transações
        function renderTransactions() {
            const list = document.getElementById('transactionList');
            
            if (transactions.length === 0) {
                list.innerHTML = `
                    <div class="empty-state">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                        </svg>
                        <p>Nenhuma transação ainda</p>
                        <p style="font-size: 0.9em; margin-top: 10px;">Adicione sua primeira transação acima</p>
                    </div>
                `;
                return;
            }

            list.innerHTML = transactions.map(t => {
                if (editingId === t.id) {
                    // Modo de edição
                    return `
                        <li class="transaction-item editing">
                            <div class="edit-form">
                                <input type="text" id="edit-desc-${t.id}" value="${t.descricao}" required>
                                <input type="number" id="edit-valor-${t.id}" value="${t.valor}" step="0.01" min="0.01" required>
                                <select id="edit-tipo-${t.id}">
                                    <option value="entrada" ${t.tipo === 'entrada' ? 'selected' : ''}>Entrada</option>
                                    <option value="saida" ${t.tipo === 'saida' ? 'selected' : ''}>Saída</option>
                                </select>
                            </div>
                            <div class="action-buttons">
                                <button class="save-btn" onclick="saveEdit(${t.id})">Salvar</button>
                                <button class="cancel-btn" onclick="cancelEdit()">Cancelar</button>
                            </div>
                        </li>
                    `;
                } else {
                    // Modo de visualização
                    return `
                        <li class="transaction-item ${t.tipo}">
                            <div class="transaction-info">
                                <div class="transaction-description">${t.descricao}</div>
                                <div class="transaction-type">${t.tipo} • ${t.data}</div>
                            </div>
                            <div style="display: flex; align-items: center;">
                                <div class="transaction-value ${t.tipo}">
                                    ${t.tipo === 'entrada' ? '+' : '-'} R$ ${t.valor.toFixed(2).replace('.', ',')}
                                </div>
                                <div class="action-buttons">
                                    <button class="edit-btn" onclick="startEdit(${t.id})">Editar</button>
                                    <button class="delete-btn" onclick="deleteTransaction(${t.id})">Excluir</button>
                                </div>
                            </div>
                        </li>
                    `;
                }
            }).join('');
        }

        // Atualizar resumo
        function updateSummary() {
            const entradas = transactions
                .filter(t => t.tipo === 'entrada')
                .reduce((sum, t) => sum + t.valor, 0);

            const saidas = transactions
                .filter(t => t.tipo === 'saida')
                .reduce((sum, t) => sum + t.valor, 0);

            const liquido = entradas - saidas;

            document.getElementById('totalEntradas').textContent = `R$ ${entradas.toFixed(2).replace('.', ',')}`;
            document.getElementById('totalSaidas').textContent = `R$ ${saidas.toFixed(2).replace('.', ',')}`;
            document.getElementById('saldoLiquido').textContent = `R$ ${liquido.toFixed(2).replace('.', ',')}`;
        }

        // Carregar ao iniciar
        loadTransactions();