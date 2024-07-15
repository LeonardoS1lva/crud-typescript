interface Tarefa {
    id: number;
    nome: string;
    status: boolean;
}

const formularioTarefa = document.getElementById('form') as HTMLFormElement;
const inputTarefa = document.getElementById('task') as HTMLInputElement;

const carregarTarefas = (): Tarefa[] => {
    const tarefas = localStorage.getItem('tarefas');
    return tarefas ? JSON.parse(tarefas) : [];
};

const salvarTarefas = (tarefas: Tarefa[]) => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
};

const adicionarTarefa = (nome: string) => {
    const tarefas = carregarTarefas();
    const ultimoId = tarefas.length > 0 ? tarefas[tarefas.length - 1].id : 0;
    const novaTarefa: Tarefa = {
        id: ultimoId + 1,
        nome,
        status: false
    };
    tarefas.push(novaTarefa);
    salvarTarefas(tarefas);
    renderizarTarefas();
};

const removerTarefa = (id: number) => {
    if (!confirm('Deseja realmente excluir esta tarefa?')) return;
    const tarefas = carregarTarefas();
    const tarefasAtualizadas = tarefas.filter(tarefa => tarefa.id !== id);
    salvarTarefas(tarefasAtualizadas);
};

const editarTarefa = (id: number, novoNome: string) => {
    const tarefas = carregarTarefas();
    const tarefa = tarefas.find(tarefa => tarefa.id === id);
    if (tarefa) {
        tarefa.nome = novoNome;
        salvarTarefas(tarefas);
    }
};

const alternarStatusTarefa = (id: number) => {
    const tarefas = carregarTarefas();
    const tarefa = tarefas.find(tarefa => tarefa.id === id);
    if (tarefa) {
        tarefa.status = !tarefa.status;
        salvarTarefas(tarefas);
    }
};

const renderizarTarefas = () => {
    const tarefas = carregarTarefas();
    const listaTarefas = document.getElementById('taskList') as HTMLTableElement;
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
            </td>`
        listaTarefas.appendChild(listItem);

        const btnConfirmar = document.getElementById(`btn-confirmar-${tarefa.id}`) as HTMLButtonElement;
        btnConfirmar.addEventListener('click', () => {
            alternarStatusTarefa(tarefa.id);
            renderizarTarefas();
        });

        const btnEditar = document.getElementById(`btn-edit-${tarefa.id}`) as HTMLButtonElement;
        btnEditar.addEventListener('click', () => {
            const novoNome = prompt('Informe o nome atualizado:', tarefa.nome);
            if (novoNome !== null) editarTarefa(tarefa.id, novoNome);
            renderizarTarefas();
        });

        const btnExcluir = document.getElementById(`btn-del-${tarefa.id}`) as HTMLButtonElement;
        btnExcluir.addEventListener('click', () => {
            removerTarefa(tarefa.id);
            renderizarTarefas();
        });
    });
}

formularioTarefa.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = inputTarefa.value.trim();
    if (nome) {
        adicionarTarefa(nome);
        inputTarefa.value = '';
    }
});

renderizarTarefas();