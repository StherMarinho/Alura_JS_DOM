const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea'); //seletor css
const ulTarefas = document.querySelector('.app__section-task-list');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
const btnCancelar = document.querySelector('.app__form-footer__button.app__form-footer__button--cancel');
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');

let listaTarefas = JSON.parse(localStorage.getItem('tarefas')) || []; //parse é o inverso do stringfy
let tarefaSelecionada = null; //será constantemente sobreescrita
let liTarefaSelecionada = null; //item de lista da tarefa selecionada

function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(listaTarefas)); 
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');
    
    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;

    const paragrafo = document.createElement('p');
    paragrafo.textContent =  tarefa.descriacao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botao = document.createElement('button'); 
    botao.classList.add('app_button-edit');

    botao.onclick = () => { //capturou o botão e sobreescreveu a propriedade onclick, passando uma função 
        //debugger
        const novaDescricao = prompt('Qual é o novo nome da tarefa?'); //guardar o retorno do prompt
        //console.log('Nova descrição da tarefa: ', novaDescricao);
        if(novaDescricao) { //se tem descrição é true
            paragrafo.textContent = novaDescricao; //sobreescrever a descrição da tarefa na camada visual
            tarefa.descriacao = novaDescricao; //atualiza referência da tarefa (camada de dados)
            atualizarTarefas(); //update do localstorage
        }
    }

    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', '/imagens/edit.png' );
    botao.append(imagemBotao); //append é um método que adiciona um elemento como filho de outro elemento, ou seja, o botão é filho do li, e a imagem é filha do botão. O append pode receber vários argumentos, e todos eles serão adicionados como filhos do elemento. O append é diferente do appendChild, que só aceita um argumento e retorna o elemento adicionado, enquanto o append não retorna nada.

    li.append(svg, paragrafo, botao);

    if(tarefa.completa) { //adicionar a classe e desabilitar o botão
        li.classList.add('app__section-task-list-item-complete')

        botao.setAttribute('disabled', 'disabled');
    }
    else{
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active') //pega todos os seletores com essa classe. 
                    .forEach(elemento => {
                        elemento.classList.remove('app__section-task-list-item-active') //para remover a classe (que faz a estética de borda) do elemento
                    })
                    
            if(tarefaSelecionada == tarefa) { 
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return; //early return
            }
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li; //ter a referência
            paragrafoDescricaoTarefa.textContent = tarefa.descriacao; //muda o status da tarefa
    
            li.classList.add('app__section-task-list-item-active'); //coloca um visual de que ela está selecionada
        }
    }

    return li;
}

btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden'); //toggle = alterna a visibilidade da classe hidden no formulário ao clicar no botão.
})

btnCancelar.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden'); //toggle = alterna a visibilidade da classe hidden no formulário ao clicar no botão.
})

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault(); //previne o comportamento padrão do formulário, que é recarregar a página.
    const tarefa = { //objeto
        descriacao: textArea.value,
    }
    listaTarefas.push(tarefa); //adiciona a tarefa na lista de tarefas.
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas(); //salva a lista de tarefas no localStorage (para persistência dos dados), stringfy, por meio da API do JSON, convertendo o array em string. O localStorage só armazena strings.
    textArea.value = ''; //apos o setItem, finaliza-se o ciclo de adição. Aqui limpa-se o textArea
    formAdicionarTarefa.classList.add('hidden'); //hidden esconde o formulário 
})

listaTarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
});

document.addEventListener('FocoFinalizado', () =>{
    if(tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');

        tarefaSelecionada.completa = true;
        atualizarTarefas();
    }
});

const removerTarefas = (somenteCompletas) => {
    const seletor  = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(seletor)  //pega todos os elementos que atendem ao criterio de tarefa completa - gerando um node list que da p/ iterar sobre ele 
            .forEach(elemento =>{
                elemento.remove();
    })
    listaTarefas = somenteCompletas ? listaTarefas.filter(tarefa => !tarefa.completa) : []; //filtrar por todas as tarefas que n estejam completas, pois só é para remover oq estiver completa - se somente completas true, filtra, se não deleta tudo
    atualizarTarefas();
}

btnRemoverConcluidas.onclick = () => removerTarefas(true); //passando por referência, diferen
btnRemoverTodas.onclick = () => removerTarefas(false);