let answer = Math.floor(Math.random() * 10000)
  .toString()
  .padStart(4, "0");

let time = 180;
let timerInterval;
let currentInput = "";
let gameOver = false;

startTimer();
generateKeypad();

function log(msg) {
  const logDiv = document.getElementById("log");
  logDiv.innerHTML += "> " + msg + "<br>";
  logDiv.scrollTop = logDiv.scrollHeight;
}

function startTimer() {
  timerInterval = setInterval(() => {
    time--;
    document.getElementById("timer").innerText = "TIME LEFT: " + time + "s";

    if (time <= 0) endGame(false);
  }, 1000);
}

function generateKeypad() {
  const keypad = document.getElementById("keypad");
  keypad.innerHTML = "";

  let nums = [...Array(10).keys()];
  nums.sort(() => Math.random() - 0.5);

  for (let i = 0; i < 9; i++) {
    createNumberButton(nums[i], keypad);
  }

  const oddBtn = document.createElement("button");
  oddBtn.innerText = "Odd";
  oddBtn.classList.add("special");
  oddBtn.onclick = () => {
    let lastDigit = Number(answer[3]);
    log(lastDigit % 2 === 1 ? ">> ODD" : ">> NOT ODD");
  };
  keypad.appendChild(oddBtn);

  createNumberButton(nums[9], keypad);

  const evenBtn = document.createElement("button");
  evenBtn.innerText = "Even";
  evenBtn.classList.add("special");
  evenBtn.onclick = () => {
    let lastDigit = Number(answer[3]);
    log(lastDigit % 2 === 0 ? ">> EVEN" : ">> NOT EVEN");
  };
  keypad.appendChild(evenBtn);
}

function createNumberButton(num, parent) {
  const btn = document.createElement("button");
  btn.innerText = num;
  btn.onclick = () => pressNumber(num);
  parent.appendChild(btn);
}

function pressNumber(num) {
  if (gameOver) return;
  if (currentInput.length >= 4) return;

  currentInput += num;
  updateDisplay();
}

function updateDisplay() {
  document.getElementById("display").innerText =
    currentInput.padEnd(4, "-");
}

function clearInput() {
  currentInput = "";
  updateDisplay();
}

function submitGuess() {
  if (gameOver) return;

  if (currentInput.length !== 4) {
    log("ERROR: Enter a 4-digit number");
    return;
  }

  let guessNum = Number(currentInput);
  let answerNum = Number(answer);

  if (guessNum < answerNum) {
    log(">> TOO LOW");
  } else if (guessNum > answerNum) {
    log(">> TOO HIGH");
  } else {
    endGame(true);
    return;
  }

  currentInput = "";
  updateDisplay();

  generateKeypad();
}

function endGame(success) {
  gameOver = true;
  clearInterval(timerInterval);

  const result = document.getElementById("result");

  if (success) {
    result.innerHTML =
      `ACCESS GRANTED<br>password: ${answer}<br><br>SYSTEM REBOOT IN 10s...`;
  } else {
    result.innerHTML =
      `SYSTEM LOCKED<br>password: ${answer}<br><br>SYSTEM REBOOT IN 10s...`;
  }

  result.style.display = "block";

  // 🔥 10秒後リロード
  setTimeout(() => {
    location.reload();
  }, 10000);
}