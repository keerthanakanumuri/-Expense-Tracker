// Firebase + Expense Tracker Combined Logic (Modular Firebase SDK)

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.24.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const tracker = document.getElementById("tracker");

// Authentication Handlers
document.querySelector("button[onclick='signup()']").onclick = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Signup successful");
  } catch (err) {
    alert(err.message);
  }
};

document.querySelector("button[onclick='login()']").onclick = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful");
  } catch (err) {
    alert(err.message);
  }
};

document.querySelector("button[onclick='logout()']").onclick = async function () {
  try {
    await signOut(auth);
    alert("Logged out");
  } catch (err) {
    alert(err.message);
  }
};

onAuthStateChanged(auth, (user) => {
  tracker.style.display = user ? "block" : "none";
});

// Expense Tracker Logic
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
updateUI();

function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function addTransaction() {
  const text = document.getElementById('text').value;
  const amount = parseFloat(document.getElementById('amount').value);
  if (text === '' || isNaN(amount)) return alert('Please enter text and amount');
  const transaction = {
    id: Date.now(),
    text,
    amount
  };
  transactions.push(transaction);
  updateUI();
  saveTransactions();
  document.getElementById('text').value = '';
  document.getElementById('amount').value = '';
}

function deleteTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateUI();
  saveTransactions();
}

function updateUI() {
  list.innerHTML = '';
  transactions.forEach(transaction => {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
      ${transaction.text} <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
      <button class="delete-btn" onclick="deleteTransaction(${transaction.id})"><i class="fas fa-trash"></i></button>
    `;
    list.appendChild(item);
  });
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(i => i > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = amounts.filter(i => i < 0).reduce((acc, item) => acc + item, 0).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `+$${income}`;
  money_minus.innerText = `-$${Math.abs(expense)}`;
}

// Assign addTransaction to global scope
window.addTransaction = addTransaction;
window.deleteTransaction = deleteTransaction;
window.signup = () => {};
window.login = () => {};
window.logout = () => {}; // these will be overridden above
