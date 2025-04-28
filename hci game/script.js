document.addEventListener('DOMContentLoaded', () => {
    const leftItems = document.querySelectorAll('.left-side .item');
    const rightShadows = document.querySelectorAll('.right-side .shadow-item');
    const timerDisplay = document.getElementById('time');
    const resetButton = document.querySelector('.reset-button');
    const gameBoard = document.querySelector('.game-board');
    const canvas = document.createElement('canvas'); // Create a canvas for drawing lines
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = gameBoard.offsetWidth + 'px';
    canvas.style.height = gameBoard.offsetHeight + 'px';
    gameBoard.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let draggableDot = null;
    let targetDot = null;
    let timeLeft = 15;
    let timerInterval;
    let lines = [];
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;

    // Update canvas size on resize
    window.addEventListener('resize', () => {
        canvas.style.width = gameBoard.offsetWidth + 'px';
        canvas.style.height = gameBoard.offsetHeight + 'px';
        // Redraw existing lines if needed, but for simplicity, we won't here.
    });

    // Shuffle the shadow items
    function shuffleShadows() {
        const shadowsArray = Array.from(rightShadows);
        for (let i = shadowsArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            rightShadows[i].parentNode.insertBefore(shadowsArray[j], rightShadows[i]);
        }
    }

    function startTimer() {
        clearInterval(timerInterval);
        timeLeft = 15;
        timerDisplay.textContent = timeLeft;
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert("Time's up! Better luck next time.");
                resetGame();
            }
        }, 1000);
    }

    function checkWin() {
        const matchedPairs = document.querySelectorAll('.shadow-item[data-matched="true"]').length;
        if (matchedPairs === leftItems.length) {
            clearInterval(timerInterval);
            alert("Congratulations! You matched them all!");
            resetGame();
        }
    }

    function drawLine(x1, y1, x2, y2, color = '#007bff', lineWidth = 3) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }

    function createPermanentLine(startDot, endDot) {
        const startRect = startDot.getBoundingClientRect();
        const endRect = endDot.getBoundingClientRect();

        const x1 = startRect.left + startRect.width / 2;
        const y1 = startRect.top + startRect.height / 2;
        const x2 = endRect.left + endRect.width / 2;
        const y2 = endRect.top + endRect.height / 2;

        const line = { x1, y1, x2, y2 };
        lines.push(line);
        redrawPermanentLines();
    }

    function redrawPermanentLines() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Redraw all permanent lines
        lines.forEach(line => {
            drawLine(line.x1, line.y1, line.x2, line.y2, '#5cb85c'); // Green for permanent lines
        });
    }

    function clearLines() {
        lines = [];
        redrawPermanentLines();
    }

    leftItems.forEach(item => {
        const dot = item.querySelector('.connector-dot');
        dot.addEventListener('mousedown', (e) => {
            draggableDot = e.target;
            draggableDot.classList.add('dragging');
            isDragging = true;
            const rect = draggableDot.getBoundingClientRect();
            currentX = rect.left + rect.width / 2;
            currentY = rect.top + rect.height / 2;
        });
    });

    gameBoard.addEventListener('mousemove', (e) => {
        if (isDragging && draggableDot) {
            const gameBoardRect = gameBoard.getBoundingClientRect();
            const mouseX = e.clientX - gameBoardRect.left;
            const mouseY = e.clientY - gameBoardRect.top;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas on each move
            redrawPermanentLines(); // Redraw permanent lines
            const dotRect = draggableDot.getBoundingClientRect();
            const startX = dotRect.left + dotRect.width / 2 - gameBoardRect.left;
            const startY = dotRect.top + dotRect.height / 2 - gameBoardRect.top;
            drawLine(startX, startY, mouseX, mouseY);
        }
    });

    rightShadows.forEach(shadowItem => {
        const dot = shadowItem.querySelector('.connector-dot-shadow');
        dot.addEventListener('mouseup', (e) => {
            targetDot = e.target;
            if (draggableDot) {
                const sourceItem = draggableDot.parentNode.dataset.item;
                const targetShadow = targetDot.parentNode.dataset.shadow;
                const connectsTo = targetDot.dataset.connectsTo;

                draggableDot.classList.remove('dragging');
                isDragging = false;
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the temporary line

                if (sourceItem === connectsTo && targetDot.parentNode.dataset.matched === "") {
                    createPermanentLine(draggableDot, targetDot);
                    draggableDot.classList.add('matched');
                    targetDot.classList.add('matched');
                    targetDot.parentNode.dataset.matched = "true";
                    checkWin();
                }
                draggableDot = null;
                targetDot = null;
            }
        });
    });

    document.addEventListener('mouseup', () => {
        if (draggableDot) {
            draggableDot.classList.remove('dragging');
            isDragging = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the temporary line if drag ends off target
            draggableDot = null;
            targetDot = null;
        }
    });

    resetButton.addEventListener('click', resetGame);

    function resetGame() {
        clearLines();
        rightShadows.forEach(shadow => shadow.dataset.matched = "");
        const matchedDots = document.querySelectorAll('.matched');
        matchedDots.forEach(dot => dot.classList.remove('matched'));
        shuffleShadows();
        startTimer();
    }

    // Initial shuffle and timer start
    shuffleShadows();
    startTimer();
});