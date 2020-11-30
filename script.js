const transactionsUl = document.querySelector("#transactions");
const balanceDisplay = document.querySelector(".balance");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

const removeTransaction = (ID) => {
  transactions = transactions.filter((transaction) => transaction.id !== ID);
  updateLocalStorage();
  init();
};

const addTransactionIntoDOM = ({ amount, name, id }) => {
  const operator = amount < 0 ? "-" : "+";
  const CSSClass = amount < 0 ? "minus" : "plus";
  const amountWithoutOperator = Math.abs(amount);
  const li = document.createElement("li");

  li.classList.add(CSSClass);
  li.innerHTML = `
  ${name} <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">
    x
    </button>
  `;
  transactionsUl.prepend(li);
};

const getExpenses = (transactionsAmounts) =>
  Math.abs(
    transactionsAmounts
      .filter((value) => value < 0)
      .reduce((accumulator, value) => accumulator + value, 0)
  ).toFixed(2);

const getIncomes = (transactionsAmounts) =>
  transactionsAmounts
    .filter((value) => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);

const getTotal = (transactionsAmounts) =>
  transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);

const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(({ amount }) => amount);
  const total = getTotal(transactionsAmounts);
  const income = getIncomes(transactionsAmounts);
  const expense = getExpenses(transactionsAmounts);

  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
};

const init = () => {
  transactionsUl.innerHTML = "";
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
};

init();

const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionsAmount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: +transactionsAmount,
  });
};

const cleanInputs = () => {
  inputTransactionName.value = "";
  inputTransactionAmount.value = "";
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionsAmount = inputTransactionAmount.value.trim();
  const isSomeInput = transactionName === "" || transactionsAmount === "";

  if (isSomeInput) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  addToTransactionsArray(transactionName, transactionsAmount);
  init();
  updateLocalStorage();

  cleanInputs();
};

form.addEventListener("submit", handleFormSubmit);
