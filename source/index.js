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
const categoryDropDown = document.querySelector("select#category")
const editNameForm = document.querySelector("div.userInfo > form#update-user-form")
editNameForm.style.display = "none";
let currentGameData;
let currentUserId; 
let counter = 0;

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
        console.log(`currentID is: ${currentUserId} and the user ID of of who you just entered is ${newUserObj.id}`)
    })
    startGameForm.querySelector("input#username").value = "";
    startGameForm.querySelector("input#username").placeholder = "Enter Username";
})


//start game
startGameButton.addEventListener("click", (event) => {

    event.preventDefault();
    fetch("http://localhost:3000/games", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
                user: currentUserId, 
                category: categoryDropDown.value
            })
    })
        .then(res => res.json())
        .then(data => {
            currentGameData = data;
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
        ++counter;
        if(counter === currentGameData.questions.length){
            wonGame();
        }else{
            playGame();
        }
    }else{
        ++counter;
        rightOrWrong.innerText = "Incorrect";
        rightOrWrong.style.color = 'red'
        rightOrWrong.style.display = 'block'
        livesCounter.style.color = 'red'
        setTimeout(function(){livesCounter.style.color = 'white'}, 200)
        setTimeout(function(){ rightOrWrong.style.display = 'none'; }, 800)
        currentGameData.lives_remaining -= 1;
        if(counter === currentGameData.questions.length && currentGameData.lives_remaining > 0){
            wonGame();
        }else if(currentGameData.lives_remaining > 0){
            playGame();
        }else{
            endGame()
        }
    }
})

const wonGame = () =>{
     ///update backend with game info
     fetch("http://localhost:3000/users/game/final",{
        method: "PATCH",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({gameInfo: currentGameData})
    })
    counter = 0;
    gameOver.querySelector("h1").textContent = `You completed all of the questions in the ${currentGameData.category.category} category!`;
    gameOver.querySelector("h1").style.color = "green";
    gameStart.style.display = 'none'
    settingsMenu.style.display = 'block'
    gameOver.style.display = 'block'
    userScore.style.color = 'white'
    userScore.innerText = `Final Score: ${currentGameData.score}`
}


function endGame() {
    ///update backend with game info
    fetch("http://localhost:3000/users/game/final",{
        method: "PATCH",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({gameInfo: currentGameData})
    })
    counter = 0;
    gameOver.querySelector("h1").textContent = "GAME OVER! You ran out of lives"
    gameOver.querySelector("h1").style.color = "red";
    gameStart.style.display = 'none'
    settingsMenu.style.display = 'block'
    gameOver.style.display = 'block'
    userScore.style.color = 'white'
    userScore.innerText = `Final Score: ${currentGameData.score}`

    //try and make logo color red 
}


tryAgainButton.addEventListener('click', (e) => {
    settingsMenu.style.display = 'block'
    gameMenu.style.display = 'block'
    gameOver.style.display = 'none'
    userScore.style.display = 'none'

})




// ****************************************************SETTINGS MENU*******************************************************

//scores for user 
scoresButton.addEventListener('click', (e) => {
    gameMenu.style.display = 'none'
    gameStart.style.display = 'none'
    e.preventDefault();
    fetch("http://localhost:3000/users/scores", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user: currentUserId })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data) 
        })
})


//change username button 
changeUsernameButton.addEventListener('click', (e) => {
    gameMenu.style.display = 'none'
    gameStart.style.display = 'none'
    //startGameForm.style.display = 'block'
    editNameForm.style.display = "block";

})

editNameForm.addEventListener("submit", event => {
    event.preventDefault();
    const newName = editNameForm.querySelector("input#new-username").value
    console.log(newName);
    fetch("http://localhost:3000/users/edit",{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({userId: currentUserId, newName })
    })
    event.target.reset();
    editNameForm.style.display = "none";
    startGameForm.style.display = 'block'
    
})

//delete user 
deleteButton.addEventListener("click", event => {
    event.preventDefault();
    fetch("http://localhost:3000/users", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({user_id: currentUserId})
    })
    //emulates 'logging out' and going back to the homepage
    gameMenu.style.display = 'none'
    startGameForm.style.display = 'block'
    settingsMenu.style.display = 'none'
})





















