const addUserBtn = document.querySelector("#add-user");
const doubleBtn = document.querySelector("#double");
const showMillBtn = document.querySelector("#show-millionaires");
const sortBtn = document.querySelector("#sort");
const calcWealthbtn = document.querySelector("#calculate-wealth");
const main = document.querySelector("#main");

let data = [];

//fetch random user and add money using traditional method
// function getRandomUser() {
//   fetch("https://randomuser.me/api")
//     .then((resp) => resp.json())
//     .then((data) => {
//       console.log(data);

//     });
// }

//connects to api, sets 'user' to the location of info inside api,creates a random user from api and randomly generators a number insode an object called 'newUser'.
async function getRandomUser() {
  const resp = await fetch("https://randomuser.me/api");
  const data = await resp.json();

  const user = data.results[0]; //results[0] is reference to the api.

  const newUser = {
    name: `${user.name.first} ${user.name.last}`,
    money: Math.floor(Math.random() * 1000000),
  };
  addData(newUser);
}

//adds new object to data array
function addData(obj) {
  data.push(obj);

  updateDOM();
}

//you can now set default perams so if providedData doesnt equal anything else, it equals data.
function updateDOM(providedData = data) {
  main.innerHTML = "<h2><strong>Person</strong> Wealth</h2>";

  //with a forEach you can access to up to 3 params the items of the array, the index of those items and the entire array itself.
  providedData.forEach((item) => {
    const element = document.createElement("div");
    element.classList.add("person");
    element.innerHTML = `<strong>${item.name}</strong> ${formatMoney(item.money)}`;

    main.appendChild(element);
  });
}

//format number return from api as money
function formatMoney(number) {
  return '£' + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function doubleMoney() {
  data = data.map((user) => {
    return {...user, money: user.money * 2};
  });
  updateDOM();
}

//sorts richest first.
function sortByRichest() {
  data.sort((a, b) => {return b.money - a.money})
  updateDOM();
}

function showMillionaires() {
  data = data.filter((user) => {
    return user.money > 1000000;
  });
  updateDOM();
}

function calcTotalWealth() {

  const totalMoney = data.reduce((accumilator, item) => {return accumilator += item.money}, 0);

  const wealthEl = document.createElement('div');
  wealthEl.innerHTML = `<h3>Total Money: <strong>${formatMoney(totalMoney)}<strong></h3>`;
  main.appendChild(wealthEl);
}

//event listeners 
addUserBtn.addEventListener('click', getRandomUser);
doubleBtn.addEventListener('click', doubleMoney);
sortBtn.addEventListener('click', sortByRichest);
showMillBtn.addEventListener('click', showMillionaires);
calcWealthbtn.addEventListener('click', calcTotalWealth);

