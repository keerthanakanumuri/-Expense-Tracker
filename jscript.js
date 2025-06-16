// Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("Signup successful!"))
    .catch(err => alert(err.message));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => alert("Login successful!"))
    .catch(err => alert(err.message));
}

function logout() {
  auth.signOut().then(() => alert("Logged out"));
}

auth.onAuthStateChanged(user => {
  document.getElementById("tracker").style.display = user ? "block" : "none";
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
      <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">
        <i class="fas fa-times-circle"></i>
      </button>
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
