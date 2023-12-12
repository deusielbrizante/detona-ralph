// definição das variáveis de visualização e de funcionamento do jogo
const state = {
    //variáveis de visualização
    view: {
        //variáveis por classe
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),

        //variáveis por id
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
        menu: document.querySelector(".alert"),
        scoreMenu: document.querySelector("#score-menu"),
        titleMenu: document.querySelector("#title-menu"),
        bestScoreMenu: document.querySelector("#best-score-menu"),
        newRecord: document.querySelector("#new-record")
    },

    //variáveis de funcionamento
    values: {
        gameVelocity: 1000,
        hitPosition: null,
        result: 0,
        currentTime: 60,
        life: 3,
        alreadyClicked: false,
        bestScore: 0
    },

    //variáveis de tempo que rodam constantemente
    actions: {
        //variável que controla o contador decrementando ele a cada 1s
        countDownTimerId: setInterval(countDown, 1000),

        //variável que faz a movimentação do Ralph nos quadrados
        timerId: setInterval(ramdomSquare, 700),

        //variável para verificar a morte ou o tempo esgotado
        checkGameOverOrTimeStopped: setInterval(gameOverOrTimeStopped, 100)
    }
}

//função para o contador de tempo
function countDown() {
    //decrementa 1s do tempo corrido e atualiza a escrita
    state.values.currentTime--
    state.view.timeLeft.textContent = state.values.currentTime
}

function gameOverOrTimeStopped() {

    //verifica se o tempo acabou para limpar as variáveis de tempo e exibe o alert
    if (state.values.currentTime <= 0) {
        //limpa o tempo corrido das variáveis de ações
        clearInterval(state.actions.countDownTimerId)
        clearInterval(state.actions.timerId)

        //define o menu com o display flex e atribui os valores nas variáveis da tela
        state.view.menu.style.display = "flex"
        state.view.titleMenu.textContent = "Time Stopped"
        state.view.scoreMenu.textContent = state.values.result
        state.view.bestScoreMenu.textContent = state.values.bestScore

        //verifica se o novo score é maior que o anterior e faz as alterações nele caso for
        if (state.values.result > state.values.bestScore) {
            state.view.newRecord.style.display = "block"
            state.values.bestScore = state.values.result
            state.view.bestScoreMenu.textContent = state.values.bestScore
        } else {
            state.view.newRecord.style.display = "none"
            state.view.bestScoreMenu.textContent = state.values.bestScore
        }

        //limpa o tempo corrido da variável que chama esta verificação
        clearInterval(state.actions.checkGameOverOrTimeStopped)
    }

    //verifica se a vida acabou para limpar as variáveis de tempo e exibe o alert
    if (state.values.life === 0) {
        //limpa o tempo corrido das variáveis de ações
        clearInterval(state.actions.countDownTimerId)
        clearInterval(state.actions.timerId)

        //define o menu com o display flex e atribui os valores nas variáveis da tela
        state.view.menu.style.display = "flex"
        state.view.titleMenu.textContent = "Game Over"
        state.view.scoreMenu.textContent = state.values.result
        state.view.bestScoreMenu.textContent = state.values.bestScore

        //verifica se o novo score é maior que o anterior e faz as alterações nele caso for
        if (state.values.result > state.values.bestScore) {
            state.view.newRecord.style.display = "block"
            state.values.bestScore = state.values.result
            state.view.bestScoreMenu.textContent = state.values.bestScore
        } else {
            state.view.newRecord.style.display = "none"
            state.view.bestScoreMenu.textContent = state.values.bestScore
        }

        //limpa o tempo corrido da variável que chama esta verificação
        clearInterval(state.actions.checkGameOverOrTimeStopped)
    }
}

//função que aleatoriza o quadrado em que aparecerá o Ralph
function ramdomSquare() {
    //variável que define a posição atual do inimigo no quadrado
    let squareEnemy

    //verifica em qual posição a classe enemy se encontra e armazena a posição
    for (let i = 0; i < state.view.squares.length; i++) {

        if (state.view.squares[i].classList.contains("enemy")) {
            squareEnemy = i;
            break
        }
    }

    //remoção da classe enemy de todos os quadrados
    state.view.squares.forEach((square) => square.classList.remove("enemy"))

    //definição aleatória da nova posição do Ralph
    let ramdomNumber = Math.floor(Math.random() * 9)

    //verifica se é a mesma posição do que a anterior e se for altera
    while (ramdomNumber === squareEnemy) {
        ramdomNumber = Math.floor(Math.random() * 9)
    }

    //define qual quadrado que irá ter a classe enemy
    let ramdomSquare = state.view.squares[ramdomNumber]
    ramdomSquare.classList.add("enemy")

    //define a nova posição do Ralph para ser clicado
    state.values.hitPosition = ramdomSquare.id

    //redefine se já foi clicado para falso
    state.values.alreadyClicked = false
}

//função para rodar o som
function playSound(audioName) {

    //lugar onde o áudio se encontra
    let audio = new Audio(`./src/sounds/${audioName}.m4a`)

    //verifica qual áudio é para colocar o volume correto
    if (audioName == "hit") {
        audio.volume = 0.1
    } else {
        audio.volume = 0.5
    }

    //ativa o som do áudio
    audio.play()
}

//função do clique do mouse para acertar o Ralph
function addListenerHitBox() {
    //verifica em todos os quadrados qual deles foi clicado
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {

            //verifica se o quadrado clicado têm o mesmo id do Ralph
            if (square.id === state.values.hitPosition) {

                //adiciona o ponto no resultado, muda o valor do texto para o novo resultado
                state.values.result++
                state.view.score.textContent = state.values.result

                //passa a nova posição do Ralph para nulo para que o jogador só possa marcar 1 ponto por quadrado clicado
                state.values.hitPosition = null

                //chama o áudio passando seu nome
                playSound("hit")

                //define que já foi clicado
                state.values.alreadyClicked = true
            } else if (!state.values.alreadyClicked) { //verifica se não foi clicado e ele errou a posição
                //decrementa a vida do jogador e exibe na tela
                state.values.life--
                state.view.lives.textContent = "x" + state.values.life

                //chama o áudio passando seu nome
                playSound("life")
            }
        })
    })
}

//reinicia o jogo quando chamada
function resetGame() {
    //define o menu como invisível
    state.view.menu.style.display = "none"

    //reinicia a variável corrida do placar e atribui na tela
    state.values.result = 0
    state.view.score.textContent = state.values.result

    //reinicia a variável de vida e atribui na tela
    state.values.life = 3
    state.view.lives.textContent = "x" + state.values.life

    //reinicia a variável de tempo e atribui na tela
    state.values.currentTime = 60
    state.view.timeLeft.textContent = state.values.currentTime

    //redefine as variáveis de ações de tempo corrido no jogo
    state.actions.countDownTimerId = setInterval(countDown, 1000)
    state.actions.timerId = setInterval(ramdomSquare, 700)
    state.actions.checkGameOverOrTimeStopped = setInterval(gameOverOrTimeStopped, 100)
}

//função principal para o funcionamento do jogo
function main() {
    addListenerHitBox()
}

main()