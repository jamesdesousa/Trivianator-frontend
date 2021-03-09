const startGameForm = document.querySelector('#user-form')
const gameMenu = document.querySelector('.gameMenu')
const logo = document.querySelector('#logo')
const settingsMenu = document.querySelector('.settingsMenu')
const submitUserButton = document.querySelector('#submitButton')
const deleteButton = document.querySelector('.deleteButton')
const startGameButton = document.querySelector('.startButton')
const scoresButton = document.querySelector('.scoresButton')
const gameStart = document.querySelector('.gameStart')
const answer1 = document.querySelector("label#a1")
const answer2 = document.querySelector("label#a2")
const answer3 = document.querySelector("label#a3")
const answer4 = document.querySelector("label#a4")
const answerButton = document.querySelector('.answerButton')
const gameOver = document.querySelector('.gameOver')
const rightOrWrong = document.querySelector('#right-or-wrong')
const numberOfLives = document.querySelector('#livesCounter')
const userScore = document.querySelector('.userScore')
const tryAgainButton = document.querySelector('.tryAgain')
const changeUsernameButton = document.querySelector('.saveButton')
let currentGameData;
let currentUserId = 1 
let counter = 0

//stretch: make text to speech an option


// enter username to open menu event
startGameForm.addEventListener('submit', (e) => {
    startGameForm.style.display = 'none'
    gameMenu.style.display = 'block'
    settingsMenu.style.display = 'block'
    e.preventDefault() 
    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            
        },
        body: JSON.stringify({
            username: e.target.username.value,
        })
    })
    .then(response => response.json())
    .then(newUserObj => {
        currentUserId = newUserObj.id
        console.log(newUserObj)
    })
})







//start game
        startGameButton.addEventListener("click", (event) => {
            event.preventDefault();
            console.log('click')
            fetch("http://localhost:3000/games", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                        user: currentUserId, 
                        category: 'sports'
                    })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    currentGameData = data
                    console.log('click')
                    playGame()
                })
            
        })






    function playGame() {
        if(gameStart.querySelector('input[name="answers"]:checked')){
            gameStart.querySelector('input[name="answers"]:checked').checked = false
        }
        console.log(currentGameData.lives_remaining)
        if(currentGameData.lives_remaining > 0) {
            livesCounter.innerText = `Lives: ${currentGameData.lives_remaining}`
            numberOfLives.value = `${currentGameData.lives_remaining}`
            gameStart.querySelector("p#question").textContent = currentGameData.questions[counter].the_question
            gameStart.querySelector("label#a1").innerText = currentGameData.questions[counter].answer1
            gameStart.querySelector("label#a2").innerText = currentGameData.questions[counter].answer2
            gameStart.querySelector("label#a3").innerText = currentGameData.questions[counter].answer3
            gameStart.querySelector("label#a4").innerText = currentGameData.questions[counter].answer4
            //gameStart.querySelector("p#hint").textContent = data.questions[i].hint
        
            gameStart.style.display = "block"
            startGameForm.style.display = 'none'
            gameMenu.style.display = 'none'
            settingsMenu.style.display = 'none'
            livesCounter.style.display = 'block'
        }
    }


        answerButton.addEventListener("click", event =>{
        let guessedAnswer = "";
        event.preventDefault();
        if(gameStart.querySelector("input#answerone").checked){
            guessedAnswer = currentGameData.questions[counter].answer1
        }else if (gameStart.querySelector("input#answertwo").checked){
            guessedAnswer = currentGameData.questions[counter].answer2
        }else if (gameStart.querySelector("input#answerthree").checked){
            guessedAnswer = currentGameData.questions[counter].answer3
        }else if(gameStart.querySelector("input#answerfour").checked){
            guessedAnswer = currentGameData.questions[counter].answer4
        }
        if (guessedAnswer === currentGameData.questions[counter].correct_answer){
            currentGameData.score +=currentGameData.questions[counter].point_value
            rightOrWrong.innerText = "Correct!"
            rightOrWrong.style.color = 'green'
            rightOrWrong.style.display = 'block'
            setTimeout(function(){ rightOrWrong.style.display = 'none'; }, 800)
            console.log("called from right")
            ++counter;
            playGame();
        }else{
            rightOrWrong.innerText = "Incorrect";
            rightOrWrong.style.color = 'red'
            rightOrWrong.style.display = 'block'
            livesCounter.style.color = 'red'
            setTimeout(function(){livesCounter.style.color = 'white'}, 200)
            setTimeout(function(){ rightOrWrong.style.display = 'none'; }, 800)
            currentGameData.lives_remaining = currentGameData.lives_remaining - 1;
            if(currentGameData.lives_remaining > 0){
                console.log("called from wrong");
                ++counter;
                playGame();
            }
            else{
                counter = 0
                endGame()
            }
        }
    })


    function endGame() {
        gameStart.style.display = 'none'
        settingsMenu.style.display = 'block'
        gameOver.style.display = 'block'
        userScore.style.color = 'white'
        userScore.innerText = `Final Score: ${currentGameData.score}`
    
        tryAgainButton.addEventListener('click', (e) => {
            settingsMenu.style.display = 'block'
            gameMenu.style.display = 'block'
            gameOver.style.display = 'none'
            userScore.style.display = 'none'
    
    
    
        })
    
        //try and make logo color red 
    }







// ****************************************************SETTINGS MENU*******************************************************

//scores for user 
scoresButton.addEventListener('click', (e) => {
    gameMenu.style.display = 'none'
    gameStart.style.display = 'none'
    e.preventDefault();
    fetch("http://localhost:3000/games", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
                        user: currentUserId,
                        category: 'sports'
                            })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data.scores)
            
            // playGame(data, 0)
        })
})


//change username button 
changeUsernameButton.addEventListener('click', (e) => {
    gameMenu.style.display = 'none'
    gameStart.style.display = 'none'
    startGameForm.style.display = 'block'




})

//delete user 
deleteButton.addEventListener("click", event => {
    event.preventDefault();
    fetch(`http://localhost:3000/users`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({user_id: currentUserId})
    })
    currentUserId = 1
    //emulates 'logging out' and going back to the homepage -- sets user back equal to 1
    gameMenu.style.display = 'none'
    startGameForm.style.display = 'block'
    settingsMenu.style.display = 'none'
})





















