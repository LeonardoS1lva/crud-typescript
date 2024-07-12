"use strict";
const formularioTarefa = document.getElementById('form');
const inputTarefa = document.getElementById('task');
const btnVisualizar = document.getElementById('visualizar');
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
};
const removerTarefa = (id) => {
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
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = tarefa.nome;
        listItem.style.textDecoration = tarefa.status ? 'line-through' : 'none';
        listaTarefas.appendChild(listItem);
        listItem.addEventListener('dblclick', () => {
            const novoNome = prompt('Editar tarefa:', tarefa.nome);
            if (novoNome !== null)
                editarTarefa(tarefa.id, novoNome);
            renderizarTarefas();
        });
        listItem.addEventListener('click', () => {
            alternarStatusTarefa(tarefa.id);
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
btnVisualizar.addEventListener('click', renderizarTarefas);
renderizarTarefas();
