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
const userScoresOl = document.querySelector('#scores')
const userScoresHead = document.querySelector('.yourScoresHead')
const userScoresDiv = document.querySelector('div#user-scores')
const allScoresButton = document.querySelector('.allScoresButton')
const newUserForm = document.querySelector('#update-user-form')
const homeButton = document.querySelector('.homeButton')
const allTimeHighScoresButton = document.querySelector('.all-time-scores-button')
const allTimeHeader = document.querySelector('.allTimeHeader')
const allTimeList = document.querySelector('#all-time-list')
const allTimeDiv = document.querySelector('#all-time-scores')
editNameForm.style.display = "none";
let currentGameData;
let currentUserId; 
let counter = 0;
let questionsUsedCounter = 0;
let usedNums = [];
let i = 1
let p = 1
let currentUserName;
//stretch: make text to speech an option
const changeAccountDiv = document.querySelector("div#change-account");
const changeAccountSelect = changeAccountDiv.querySelector("select#change-account-select");
changeAccountSelect.style.display ="none";
const changeConfirm = changeAccountDiv.querySelector("button#confirm-button");
const correctSound = new Audio("assets/correct.wav");
const incorrectSound = new Audio("assets/wrong.mp3");
incorrectSound.volume = .4;
const introSong = new Audio("assets/introsong.wav");
const clockTickingSound = new Audio("assets/clockticking.wav");
const musicDiv = document.querySelector("div#music");
const muteToggle = musicDiv.querySelector("input#mute-toggle");
musicDiv.style.display = "none";
let introIsPlaying = false;

muteToggle.addEventListener("change", e =>{
    if(introIsPlaying){
        introSong.pause();
        introIsPlaying = false;
    }else{
        introSong.play();
        introIsPlaying = true;
    }

})

changeAccountDiv.style.display="none";
changeConfirm.style.display = "none";

changeAccountDiv.addEventListener("click", e => {
    if(e.target.id === "change-account-button"){
        console.log("change users")
        fetch("http://localhost:3000/users")
            .then(r => r.json())
            .then(data => data.forEach(createChangeAccountList))
        changeAccountSelect.style.display ="inline"

        changeConfirm.style.display = "inline"
    }else if (e.target.id === "confirm-button"){
        fetch(`http://localhost:3000/users/change/${changeAccountSelect.value}`)
            .then(r => r.json())
            .then(data => { console.log(data)
                currentUserId = data.id
                currentUserName = data.username
            })
        changeConfirm.style.display = "none"
        changeAccountSelect.style.display = "none"

    }
})

const createChangeAccountList = data => {
    if(data.username != currentUserName){
        const ele = document.createElement("option");
        ele.setAttribute("value", data.username);
        ele.innerText = data.username;
        changeAccountSelect.append(ele);
    }

}

// enter username to open menu event
startGameForm.addEventListener('submit', (e) => {
    introSong.play();
    introIsPlaying = true;
    musicDiv.style.display = "block";
    startGameForm.style.display = 'none'
    newUserForm.style.display = 'none'
    gameMenu.style.display = 'block'
    settingsMenu.style.display = 'block'
    userScoresHead.style.display = 'none'
    userScoresDiv.style.display = 'none'
    userScoresOl.style.display = 'none'
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
    changeAccountDiv.style.display="block";
    currentUserName = e.target.username.value
    startGameForm.querySelector("input#username").value = "";
    startGameForm.querySelector("input#username").placeholder = "Enter Username";
})


//start game
startGameButton.addEventListener("click", (event) => {
    introSong.pause();
    introIsPlaying = false;
    musicDiv.style.display = "none";
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
            changeAccountDiv.style.display = "none"
            playGame()
        })
    
})



function playGame() {
    generateQuestion();
    clockTickingSound.play();
    if(gameStart.querySelector('input[name="answers"]:checked')){
        gameStart.querySelector('input[name="answers"]:checked').checked = false
    }
    console.log(`counter is: ${counter}`);
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
        correctSound.play();
        rightOrWrong.innerHTML = "Correct!".bold()
        rightOrWrong.style.color = 'green'
        rightOrWrong.style.display = 'block'
        setTimeout(function(){ rightOrWrong.style.display = 'none'; }, 1200)
        ++questionsUsedCounter;
        if(questionsUsedCounter === currentGameData.questions.length){
            wonGame();
        }else{
            playGame();
        }
    }else{
        ++questionsUsedCounter;
        incorrectSound.play();
        rightOrWrong.innerHTML = "Wrong!".bold();
        rightOrWrong.style.color = 'red'
        rightOrWrong.style.display = 'block'
        livesCounter.style.color = 'red'
        setTimeout(function(){livesCounter.style.color = 'white'}, 200)
        setTimeout(function(){ rightOrWrong.style.display = 'none'; }, 1200)
        currentGameData.lives_remaining -= 1;
        if(questionsUsedCounter === currentGameData.questions.length && currentGameData.lives_remaining > 0){
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
     musicDiv.style.display= "block";
     clockTickingSound.pause();
     introSong.currentTime = 0;
     introSong.play();
     introIsPlaying = true;
     fetch("http://localhost:3000/users/game/final",{
        method: "PATCH",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({gameInfo: currentGameData})
    })
    usedNums =[];
    questionsUsedCounter = 0;
    gameOver.querySelector("h1").textContent = `You completed all of the questions in the ${currentGameData.category.category} category!`;
    gameOver.querySelector("h1").style.color = "green";
    gameStart.style.display = 'none'
    settingsMenu.style.display = 'block'
    gameOver.style.display = 'block'
    userScore.style.color = 'white'
    userScore.innerText = `Final Score: ${currentGameData.score}`
    userScoresHead.style.display = 'none'
    userScoresDiv.style.display = 'none'
    userScoresOl.style.display = 'none'
}


function endGame() {
    ///update backend with game info
    musicDiv.style.display= "block";
    clockTickingSound.pause();
    introSong.currentTime = 0;
    introSong.play();
    introIsPlaying = true;
    fetch("http://localhost:3000/users/game/final",{
        method: "PATCH",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({gameInfo: currentGameData})
    })
    usedNums = [];
    questionsUsedCounter = 0;
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
    userScoresHead.style.display = 'none'
    userScoresDiv.style.display = 'none'
    userScoresOl.style.display = 'none'

})




// ****************************************************SETTINGS MENU*******************************************************

//scores for user 
scoresButton.addEventListener('click', (e) => {
    i = 1
    newUserForm.style.display = 'none'
    gameMenu.style.display = 'none'
    gameStart.style.display = 'none'
    allTimeHeader.style.display = 'none'
    allTimeDiv.style.display = 'none'
    allTimeList.style.display = 'none'
    userScoresHead.style.display = 'block'
    userScoresDiv.style.display = 'block'
    userScoresOl.style.display = 'block'
    startGameForm.style.display = 'none'
    gameOver.style.display = 'none'
    userScore.style.display = 'none'
    gameMenu.style.display = 'none'
    userScoresOl.innerHTML = ""
    e.preventDefault();
    fetch(`http://localhost:3000/users/${currentUserId}/scores`)
        .then(res => res.json())
        .then(data => {
            data.forEach((score) => renderScores(score))
            }) 
        })


function renderScores(score) {
    userScoresOl.style.display = 'block'
    userScoresDiv.style.display = 'block'
    const oneScore = document.createElement('li')
    //oneScore.setAttribute('id', 'scores')
    //oneScore.textContent = score
    oneScore.setAttribute('id', 'scoresList')
    oneScore.style.display = 'block'
    oneScore.innerHTML = `${i}. ${score}   <button type="button" class="deletescore" id=${score}>Delete Score</button`
    userScoresOl.append(oneScore)
    console.log(score)
    i = i+1

}

document.querySelector("div#user-scores").addEventListener("click", e =>{
    if(e.target.className === "deletescore"){
        fetch(`http://localhost:3000/users/${currentUserId}/deletescore/${e.target.id}`,{
            method: "DELETE"
        })
        e.target.parentNode.remove();
    }

})

homeButton.addEventListener('click', (e) => {
    newUserForm.style.display = 'none'
    gameMenu.style.display = 'block'
    gameStart.style.display = 'none'
    userScoresHead.style.display = 'none'
    userScoresDiv.style.display = 'none'
    userScoresOl.style.display = 'none'
    allTimeHeader.style.display = 'none'
    allTimeDiv.style.display = 'none'
    allTimeList.style.display = 'none'
})





//change username button 
changeUsernameButton.addEventListener('click', (e) => {
    gameMenu.style.display = 'none'
    gameStart.style.display = 'none'
    //startGameForm.style.display = 'block'
    editNameForm.style.display = "block";
    userScoresHead.style.display = 'none'
    userScoresDiv.style.display = 'none'
    userScoresOl.style.display = 'none'
    allTimeHeader.style.display = 'none'
    allTimeDiv.style.display = 'none'
    allTimeList.style.display = 'none'

})

editNameForm.addEventListener("submit", event => {
    event.preventDefault();
    const newName = editNameForm.querySelector("input#new-username").value
    console.log(newName);
    fetch(`http://localhost:3000/users/${currentUserId}/edit`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({userId: currentUserId, newName })
    })
    event.target.reset();
    currentUserName = newName
    editNameForm.style.display = "none";
    gameMenu.style.display = 'block'
    settingsMenu.style.display = 'block'
    allTimeHeader.style.display = 'none'
    allTimeDiv.style.display = 'none'
    allTimeList.style.display = 'none'
    
})

//delete user 
deleteButton.addEventListener("click", event => {
    event.preventDefault();
    fetch(`http://localhost:3000/users/${currentUserId}`, {
        method: "DELETE"
    })
    //emulates 'logging out' and going back to the homepage
    userScoresDiv.style.display = 'none'
    document.querySelector("div#user-scores").style.display = "none"
    gameMenu.style.display = 'none'
    startGameForm.style.display = 'block'
    settingsMenu.style.display = 'none'
    allTimeHeader.style.display = 'none'
    allTimeDiv.style.display = 'none'
    allTimeList.style.display = 'none'
    changeAccountDiv.style.display="none";
})


const generateQuestion = () => {
    let num = Math.round(Math.random() * (currentGameData.questions.length - 1));
    if (usedNums.includes(num)){
        generateQuestion();
    }else{
        usedNums.push(num);
        counter = num;
    }
}

allTimeHighScoresButton.addEventListener("click", e =>{
    p = 1
    newUserForm.style.display = 'none'
    gameMenu.style.display = 'none'
    gameStart.style.display = 'none'
    allTimeHeader.style.display = 'block'
    allTimeDiv.style.display = 'block'
    allTimeList.style.display = 'block'
    startGameForm.style.display = 'none'
    gameOver.style.display = 'none'
    userScore.style.display = 'none'
    gameMenu.style.display = 'none'
    userScoresHead.style.display = 'none'
    userScoresDiv.style.display = 'none'
    userScoresOl.style.display = 'none'
    allTimeList.innerHTML = ""
    fetch("http://localhost:3000/highscores")
        .then(r => r.json())
        .then(data => {
            data.forEach(renderAllTimeScores)
            //console.log(data[0]['user']["username"])
        })
})

const renderAllTimeScores = data => {
    const scoreLi = document.createElement("li")
    scoreLi.setAttribute('id', 'allTime')
    allTimeList.style.display = 'block'
    scoreLi.style.display = 'block'
    scoreLi.innerText = `${p}. ${data["user"]["username"]} scored a ${data["score"]} in ${data["category"]["category"]}`
    allTimeList.append(scoreLi);
    p = p + 1
}
















