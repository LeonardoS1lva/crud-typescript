"use strict";
const formularioTarefa = document.getElementById('form');
const inputTarefa = document.getElementById('task');
const carregarTarefas = () => {
    const tarefas = localStorage.getItem('tarefas');
    return tarefas ? JSON.parse(tarefas) : [];
};
const salvarTarefas = (tarefas) => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
};
const adicionarTarefa = (nome) => {
    const tarefas = carregarTarefas();
    const ultimoId = tarefas.length > 0 ? tarefas[tarefas.length - 1].id : 0;
    const novaTarefa = {
        id: ultimoId + 1,
        nome,
        status: false
    };
    tarefas.push(novaTarefa);
    salvarTarefas(tarefas);
    renderizarTarefas();
};
const removerTarefa = (id) => {
    if (!confirm('Deseja realmente excluir esta tarefa?'))
        return;
    const tarefas = carregarTarefas();
    const tarefasAtualizadas = tarefas.filter(tarefa => tarefa.id !== id);
    salvarTarefas(tarefasAtualizadas);
};
const editarTarefa = (id, novoNome) => {
    const tarefas = carregarTarefas();
    const tarefa = tarefas.find(tarefa => tarefa.id === id);
    if (tarefa) {
        tarefa.nome = novoNome;
        salvarTarefas(tarefas);
    }
};
const alternarStatusTarefa = (id) => {
    const tarefas = carregarTarefas();
    const tarefa = tarefas.find(tarefa => tarefa.id === id);
    if (tarefa) {
        tarefa.status = !tarefa.status;
        salvarTarefas(tarefas);
    }
};
const renderizarTarefas = () => {
    const tarefas = carregarTarefas();
    const listaTarefas = document.getElementById('taskList');
    listaTarefas.innerHTML = '';
    tarefas.forEach(tarefa => {
        const listItem = document.createElement('tr');
        listItem.innerHTML = `
            <td class="text-center ${tarefa.status ? "text-decoration-line-through fst-italic" : ""} align-middle">${tarefa.id}</td>
            <td class="text-center ${tarefa.status ? "text-decoration-line-through fst-italic" : ""} align-middle">${tarefa.nome}</td>
            <td class="text-center ${tarefa.status ? "text-decoration-line-through fst-italic" : ""} align-middle">${tarefa.status ? 'Concluída' : 'Pendente'}</td>
            <td class="d-flex justify-content-around">
                <button id="btn-confirmar-${tarefa.id}" class="btn btn-success">
                    <i class="fas fa-check"></i>
                </button>
                <button id="btn-edit-${tarefa.id}" class="btn btn-primary">
                    <i class="fas fa-edit"></i>
                </button>
                <button id="btn-del-${tarefa.id}" class="btn btn-danger">
                    <i class="fas fa-trash"></i>
                </button>
            </td>`;
        listaTarefas.appendChild(listItem);
        const btnConfirmar = document.getElementById(`btn-confirmar-${tarefa.id}`);
        btnConfirmar.addEventListener('click', () => {
            alternarStatusTarefa(tarefa.id);
            renderizarTarefas();
        });
        const btnEditar = document.getElementById(`btn-edit-${tarefa.id}`);
        btnEditar.addEventListener('click', () => {
            const novoNome = prompt('Informe o nome atualizado:', tarefa.nome);
            if (novoNome !== null)
                editarTarefa(tarefa.id, novoNome);
            renderizarTarefas();
        });
        const btnExcluir = document.getElementById(`btn-del-${tarefa.id}`);
        btnExcluir.addEventListener('click', () => {
            removerTarefa(tarefa.id);
            renderizarTarefas();
        });
    });
};
formularioTarefa.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = inputTarefa.value.trim();
    if (nome) {
        adicionarTarefa(nome);
        inputTarefa.value = '';
    }
});
renderizarTarefas();
