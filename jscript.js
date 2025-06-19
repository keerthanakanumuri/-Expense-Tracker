// ====== AUTH + EXPENSE TRACKER JS (UPDATED) ======

// SIGNUP function
function signup() {
  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!username || !email || !password) {
    alert("All fields are required!");
    return;
  }

  const user = { username, email, password };
  localStorage.setItem("user", JSON.stringify(user));
  alert("Sign-up successful. You can now log in.");
}

// LOGIN function
function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser || storedUser.email !== email || storedUser.password !== password) {
    alert("Invalid email or password!");
    return;
  }

  alert("Login successful!");
  document.getElementById("auth").style.display = "none";
  document.getElementById("tracker").style.display = "block";
  init();
}

// LOGOUT function
function logout() {
  alert("Logged out successfully!");
  document.getElementById("auth").style.display = "block";
  document.getElementById("tracker").style.display = "none";
}

// ====== EXPENSE TRACKER LOGIC ======

const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a text and amount");
    return;
  }

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  text.value = "";
  amount.value = "";
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">❌</button>
  `;

  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balance.innerText = `₹${total}`;
  money_plus.innerText = `₹${income}`;
  money_minus.innerText = `₹${expense}`;
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

form.addEventListener("submit", addTransaction);
