// // Script.js

// const ball = document.getElementById("ball");
// const scoreDisplay = document.getElementById("score");
// let score = 0;

// // Function to move the ball to a random position
// function moveBall() {
//     const gameArea = document.getElementById("gameArea");
//     const maxX = gameArea.clientWidth - ball.clientWidth;
//     const maxY = gameArea.clientHeight - ball.clientHeight;

//     const randomX = Math.floor(Math.random() * maxX);
//     const randomY = Math.floor(Math.random() * maxY);

//     ball.style.left = `${randomX}px`;
//     ball.style.top = `${randomY}px`;
// }

// // Function to increase the score when the ball is clicked
// ball.addEventListener("click", () => {
//     score++;
//     scoreDisplay.textContent = score;
//     moveBall();
// });

// // Move the ball every second
// setInterval(() => {
//     moveBall();
// }, 1000);