"use strict";

// Data
const account1 = {
  owner: "Jamie McIntyre",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementDates: [
    "2019-01-28T09:15:04.904Z",
    "2019-04-01T10:17:24.185Z",
    "2019-05-27T17:01:17.194Z",
    "2019-07-11T23:36:17.929Z",
    "2019-11-18T21:31:17.178Z",
    "2023-01-01T07:42:02.383Z",
    "2023-01-02T14:11:59.604Z",
    "2023-01-06T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementDates: [
    "2019-01-28T09:15:04.904Z",
    "2019-04-01T10:17:24.185Z",
    "2019-05-27T17:01:17.194Z",
    "2019-07-11T23:36:17.929Z",
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-03-08T14:11:59.604Z",
    "2020-03-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementDates: [
    "2019-01-28T09:15:04.904Z",
    "2019-04-01T10:17:24.185Z",
    "2019-05-27T17:01:17.194Z",
    "2019-07-11T23:36:17.929Z",
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-03-08T14:11:59.604Z",
    "2020-03-12T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementDates: [
    "2019-01-28T09:15:04.904Z",
    "2019-04-01T10:17:24.185Z",
    "2019-05-27T17:01:17.194Z",
    "2019-07-11T23:36:17.929Z",
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-03-08T14:11:59.604Z",
    "2020-03-12T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

//USER LOGIN
//Compute Usernames
const createUsernames = function (accts) {
  accts.forEach(function (acct) {
    acct.username = acct.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (account) {
  displayTransactions(account);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
};

//Login User
const userNameEl = document.querySelector(".username");
const pinEl = document.querySelector(".pin");
const loginBtn = document.querySelector(".login-btn");
const welcomeMsgEl = document.querySelector("nav span");
const userInterface = document.querySelector("main");
let currentAccount;

loginBtn.addEventListener("click", function (e) {
  e.preventDefault();

  //locate account using username
  currentAccount = accounts.find(
    (account) => account.username === userNameEl.value
  );
  //if username and pin match
  if (currentAccount?.pin === +pinEl.value) {
    //display welcome message
    welcomeMsgEl.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }!`;
    //populate current date and time
    const todaysDate = document.querySelector(".current-balance .date");

    //input current date based on user location
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };

    todaysDate.textContent = `As of ${new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now)}`;
    //show UI
    userInterface.style.opacity = 100;
    updateUI(currentAccount);
    //clear input fields
    userNameEl.value = pinEl.value = "";
    pinEl.blur();
  }
});

//HANDLE DATES
const formatTransactionDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};

//TRANSACTIONS
//Populate transactions
const transactionsEl = document.querySelector(".transactions");

const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const isDeposit = (transaction) => transaction > 0;

const displayTransactions = function (account, sort = false) {
  //Clear transactions
  transactionsEl.innerHTML = "";

  // Sorts a shallow copy of the transactions
  const transacts = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  transacts.forEach(function (transaction, i) {
    const type = transaction > 0 ? "deposit" : "withdrawal";
    const date = new Date(account.movementDates[i]);
    const displayDate = formatTransactionDate(date, account.locale);

    //create each transaction
    const formTransact = formatCurr(
      transaction,
      account.locale,
      account.currency
    );

    const html = `
  <div class="transaction">
  <div class="td-container">
    <span class="tag ${type}">${i + 1} ${type}</span>
    <span class="date">${displayDate}</span>
  </div>
  <span class="amount">${formTransact}</span>
</div>
  `;
    //insert each transaction on top
    transactionsEl.insertAdjacentHTML("afterbegin", html);
  });
};

const balanceEl = document.querySelector(".acct-balance");
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(
    (acc, transaction) => acc + transaction,
    0
  );

  balanceEl.textContent = formatCurr(
    account.balance,
    account.locale,
    account.currency
  );
};

const totalDepositsEl = document.querySelector(".in .mvmt");
const totalWithdrawalsEl = document.querySelector(".out .mvmt");
const totalInterestEl = document.querySelector(".interest .mvmt");

const calcDisplaySummary = function (account) {
  const totalDeposits = account.movements
    .filter(isDeposit)
    .reduce((acc, transaction) => acc + transaction, 0);
  totalDepositsEl.innerText = formatCurr(
    totalDeposits,
    account.locale,
    account.currency
  );
  const totalWithdrawals = account.movements
    .filter((transaction) => transaction < 0)
    .reduce((acc, transaction) => acc + transaction, 0);
  totalWithdrawalsEl.innerText = formatCurr(
    Math.abs(totalWithdrawals),
    account.locale,
    account.currency
  );
  const interest = account.movements
    .filter(isDeposit)
    .map((deposit) => (deposit * account.interestRate) / 100)
    //bank only gives interest if the interest generated is more than $1
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  totalInterestEl.innerText = formatCurr(
    interest,
    account.locale,
    account.currency
  );
};

//SORT TRANSACTIONS
let sorted = false;
const sortBtn = document.querySelector(".sort");
sortBtn.addEventListener("click", function () {
  displayTransactions(currentAccount, !sorted);
  sorted = !sorted;
});

//TRANSFER MONEY
const txfAcctEl = document.querySelector(".txf-to");
const txfAmtEl = document.querySelector(".txf-amt");
const txfBtn = document.querySelector(".txf-btn");

txfBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +txfAmtEl.value;
  const recipientAcct = accounts.find(
    (account) => account.username === txfAcctEl.value
  );

  txfAcctEl.value = txfAmtEl.value = "";
  txfAmtEl.blur();

  if (
    amount > 0 &&
    recipientAcct &&
    currentAccount.balance >= amount &&
    recipientAcct.username !== currentAccount?.username
  ) {
    //make the transfer
    currentAccount.movements.push(-amount);
    recipientAcct.movements.push(amount);
    recipientAcct.movementDates.push(new Date().toISOString());
    //add date of transfer
    currentAccount.movementDates.push(new Date().toISOString());

    updateUI(currentAccount);
  }
});

//CLOSE AN ACCOUNT
const closeUser = document.querySelector(".confirm-user");
const closePin = document.querySelector(".confirm-pin");
const closeBtn = document.querySelector(".close-btn");

closeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentAccount.username === closeUser.value &&
    +closePin.value === currentAccount.pin
  ) {
    //find the user and delete it from the array
    const index = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );
    accounts.splice(index, 1); //remove the account from accounts
    // Hide UI
    userInterface.style.opacity = 0;
    closeUser.value = closePin.value = "";
    closePin.blur();
  }
});

//REQUEST A LOAN
// The bank only approves a loan if there is at least one deposit with at least 10% of the requested loan amount.
const requestLoanBtn = document.querySelector(".request-btn");
const loanAmtEl = document.querySelector(".loan-amt");

requestLoanBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const loanAmt = Math.floor(loanAmtEl.value);

  if (
    loanAmt > 0 &&
    currentAccount.movements.some((mov) => mov >= loanAmt * 0.1)
  ) {
    // Add the loan to the account
    currentAccount.movements.push(loanAmt);
    // Add loan date
    currentAccount.movementDates.push(new Date().toISOString());
    updateUI(currentAccount);
    loanAmtEl.value = "";
  }
});

//FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
userInterface.style.opacity = 100;

// TODO:
// 1. allow sorting of transactions by deposit or withdrawal using the filter method
// 2. change login to log out when a user is signed in
// When logged out or closed account, change welcome message
// 3. Throw an error message when a wrong pin is entered
// 4. Throw an error message when trying to transfer to an account that doesn't exist
// 5. Throw an error message when trying to transfer more money than available
// 6. Throw an error message when trying to close an account using the wrong username or pin
// 7. Create a denial alert for a loan amount that is more than 10% of at least one deposit
