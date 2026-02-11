//DOM = Document Object Model, é uma árvore de nós junção de vários elementos HTML, CSS , JS, API's, juntando tudo e fazendo uma representação estruturada no navegador.
const html = document.querySelector('html');
const focoButton = document.querySelector('.app__card-button--foco');
const curtoButton = document.querySelector('.app__card-button--curto');
const longoButton = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const musicaFocoInput = document.querySelector('#alternar-musica');
const startPauseBt = document.querySelector('#start-pause');
const musica = new Audio('/sons/luna-rise-part-one.mp3'); //pode ser usado também o readFile(), mas pode atrasar o carregamento da página, pois se for um arquivo grande, o navegador pode demorar para ler o arquivo, piorando a experiência do usuário.
const musicaComecar = new Audio('/sons/play.wav');
const musicaPausar = new Audio('/sons/pause.mp3');
const musicaTempoFinal = new Audio('/sons/beep.mp3'); 
const iniciarOuPausarBt = document.querySelector('#start-pause span');  
const iniciarOuPausarIcone = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.querySelector('#timer');

let tempoDecorridoEmSegundos = 1500; //let, pq está alterando o valor dinâmicamente.
let intervaloId = null;

musica.loop = true; 

musicaFocoInput.addEventListener('change', () => {
    if (musica.paused){ //paused é uma propriedade do objeto Audio, booleana que indica se o áudio está pausado ou não.
        musica.play();
    }
    else{
        musica.pause(); //há currentTime e volume também como propriedades.
    }
});

focoButton.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500; //25 minutos em segundos.
    alternarContexto('foco');
    focoButton.classList.add('active');
});

curtoButton.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300; //5 minutos em segundos.
    alternarContexto('descanso-curto');
    curtoButton.classList.add('active');
});

longoButton.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900; //15 minutos em segundos.
    alternarContexto('descanso-longo');
    longoButton.classList.add('active');
});

function alternarContexto(contexto) {
    mostrarTempo();
    botoes.forEach(function(contexto){
        contexto.classList.remove('active');
    })
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
        case 'descanso-curto':
            titulo.innerHTML = `
            Que tal dar uma respirada? <br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
            break;
        case 'descanso-longo':
            titulo.innerHTML = `
            Hora de voltar à superfície.<br>
                <strong class="app__title-strong">Faça uma pausa longa!</strong>
            `
            break;
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0){
        musicaTempoFinal.play();
        alert('O tempo acabou!');
        const focoAtivo = html.getAttribute('data-contexto') == 'foco' //broadcast de evento
        if(focoAtivo){
            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento) //despachar o evento
        }
        zerar(); //torna o temporizador nulo, parando a contagem.
        return;
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if(intervaloId) {
        musicaPausar.play();
        zerar();
        return;
    }
    musicaComecar.play();
    intervaloId = setInterval(contagemRegressiva, 1000); //recebe sempre um método e um intervalo em milissegundos (de quanto em quanto tempo você quer que alterar/executar, necessário um outro método para interromper sua execução).
    iniciarOuPausarBt.textContent = 'Pausar';
    iniciarOuPausarIcone.setAttribute('src', `/imagens/pause.png`);
}

function zerar(){

    clearInterval(intervaloId); //método para limpar o intervalo iniciado pelo setInterval.
    iniciarOuPausarBt.textContent = 'Começar'; //textContent altera é para texto, apenas! Diferente do innerHTML que pode alterar o HTML inteiro, usando tags.
    iniciarOuPausarIcone.setAttribute('src', `/imagens/play_arrow.png`);
    intervaloId = null;
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-BR', { minute: '2-digit', second: '2-digit' });
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();