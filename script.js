let answer = Math.floor(Math.random() * 10000)
  .toString()
  .padStart(4, "0");

let time = 180;
let timerInterval;
let currentInput = "";
let gameOver = false;
let hintCount = 0; // 使用回数

startTimer();
createKeypad();

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

function createKeypad() {
  const keypad = document.getElementById("keypad");

  const layout = [
    "1","2","3",
    "4","5","6",
    "7","8","9",
    "Clear","0","Enter",
    "","Hint",""
  ];

  layout.forEach(key => {
    const btn = document.createElement("button");

    if (key === "") {
      btn.style.visibility = "hidden";
      keypad.appendChild(btn);
      return;
    }

    btn.innerText = key;

    if (key === "Clear") {
      btn.classList.add("special");
      btn.onclick = clearInput;

    } else if (key === "Enter") {
      btn.classList.add("special");
      btn.onclick = submitGuess;

    } else if (key === "Hint") {
      btn.classList.add("special");
      btn.onclick = useHint;

    } else {
      btn.onclick = () => pressNumber(key);
    }

    keypad.appendChild(btn);
  });
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
  if (gameOver) return;
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
}

function useHint() {
  if (gameOver) return;

  // 🔥 1回制限
  if (hintCount >= 1) {
    log("ERROR: Hint already used");
    return;
  }

  hintCount++;

  // 🔥 60秒減少
  time -= 60;
  if (time < 0) time = 0;

  let thousandDigit = answer[0];
  log(">> FIRST DIGIT IS: " + thousandDigit);

  document.getElementById("timer").innerText = "TIME LEFT: " + time + "s";

  if (time <= 0) endGame(false);
}

function vibrateOnFail() {
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200]);
  }
}

function calculateScore() {
  let usedTime = 180 - time;
  let score = 10000 - (usedTime * 30) - (hintCount * 1000);

  if (score < 0) score = 0;
  return score;
}

function getRank(score) {
  if (score >= 9000) return "S";
  if (score >= 7000) return "A";
  if (score >= 5000) return "B";
  return "C";
}

function endGame(success) {
  gameOver = true;
  clearInterval(timerInterval);

  const result = document.getElementById("result");
  let score = calculateScore();
  let rank = getRank(score);

  if (success) {
    result.innerHTML =
      `ACCESS GRANTED<br>
       CODE: ${answer}<br><br>
       SCORE: ${score}<br>
       RANK: ${rank}<br><br>
       SYSTEM REBOOT IN 10s...`;
  } else {
    vibrateOnFail();
    result.innerHTML =
      `SYSTEM LOCKED<br>
       CODE: ${answer}<br><br>
       SCORE: ${score}<br>
       RANK: ${rank}<br><br>
       SYSTEM REBOOT IN 10s...`;
  }

  result.style.display = "block";

  setTimeout(() => {
    location.reload();
  }, 10000);
}
