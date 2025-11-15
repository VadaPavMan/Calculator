const display = document.getElementById("display");
const theme = document.getElementById("theme");


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('SW registered'))
      .catch(e => console.log('SW failed', e));
  });
}

theme.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    theme.textContent = "☀️ Light Mode";
    theme.classList.remove("btn-dark");
    theme.classList.add("btn-light");
  } else {
    theme.textContent = "🌙 Dark Mode";
    theme.classList.remove("btn-light");
    theme.classList.add("btn-dark");
  }
});

let currentInput = "0";
let previousInput = "";
let operator = null;
let overwrite = false;

function updateDisplay() {
  display.value = currentInput === "" ? "0" : currentInput;
}
updateDisplay();

function inputDigit(digit) {
  if (overwrite) {
    currentInput = digit;
    overwrite = false;
  } else {
    if (currentInput === "0") {
      currentInput = digit;
    } else {
      currentInput += digit;
    }
  }
  updateDisplay();
}

function inputDot() {
  if (overwrite) {
    currentInput = "0.";
    overwrite = false;
  } else if (currentInput === ".") return;
  else {
    currentInput += ".";
  }

  updateDisplay();
}

function clearAll() {
  currentInput = "0";
  previousInput = "";
  operator = null;
  overwrite = false;
  updateDisplay();
}

function backspace() {
  if (overwrite) {
    currentInput = "0";
    overwrite = false;
  } else {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === "") currentInput = "0";
    if (currentInput === "Error") clearAll();
  }
  updateDisplay();
}

function operate(a, b, opt) {
  a = parseFloat(a);
  b = parseFloat(b);

  if (isNaN(a) || isNaN(b)) return;

  switch (opt) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) return "Error";
      return a / b;
    case "%":
      return a % b;

    default:
      return;
  }
}

function calculate() {
  if (!operator || previousInput === "") return;

  const a = Number(previousInput);
  const b = Number(currentInput);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    currentInput = "Error";
    overwrite = true;
    updateDisplay();
    return;
  }

  const result = operate(a, b, operator);

  if (result === "Error") {
    currentInput = "Error";
    previousInput = "";
    operator = null;
    overwrite = true;
    updateDisplay();
    return;
  }

  const tidy =
    typeof result === "number"
      ? Number(result.toFixed(10)).toString()
      : String(result);

  currentInput = tidy;
  previousInput = "";
  operator = null;
  overwrite = true;
  updateDisplay();
}

function chooseOperator(op) {
  if (op === "x" || op === "X") op = "*";
  if (op === "÷") op = "/";

  if (operator && overwrite) {
    operator = op;
    return;
  }

  if (operator && !overwrite) {
    calculate();
  }

  previousInput = currentInput;
  operator = op;
  overwrite = true;
}

function ClickButton(element) {
  const value = element.innerText.trim();
  if (/^\d$/.test(value)) {
    inputDigit(value);
    return;
  }

  if (value === ".") {
    inputDot();
    return;
  }

  if (value === "AC") {
    clearAll();
    return;
  }

  if (value === "C") {
    backspace();
    return;
  }

  if (value === "=" || value === "Enter") {
    calculate();
    return;
  }

  if (["+", "-", "x", "X", "÷", "/", "%"].includes(value)) {
    chooseOperator(value);
    return;
  }
}
