/*

1. when fetching information from a particular api/ .json file you will get information back which is called a promise
this is caught using .then which you can then attach a function to, in this case I called the function parametre 'resp' for responce. 

2. the promise doesnt give you a readable responce automatically so a second function is required to turn it to a .json file.

From the .json file you can then grab anything from it, in this case I grabbed the body of the document and put in the first line of the items.json file and grabbed the text. which outputs 'Item One'.

*/

// function calculate() {
//   fetch("/js/items.json").then((resp) => {
//     resp.json().then((data) => {
//       document.body.innerHTML = data[0].text;
//     });
//   });
// }

// calculate();

const currencyEl_one = document.querySelector("#currency-one");
const amountEl_one = document.querySelector("#amount-one");
const currencyEl_two = document.querySelector("#currency-two");
const amountEl_two = document.querySelector("#amount-two");
const rateEl = document.querySelector("#rate");
const swap = document.querySelector("#swap");

//fetch exchange rate and update the DOM
function calculate() {
  currency_one = currencyEl_one.value;
  currency_two = currencyEl_two.value;

  fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
    .then((resp) => resp.json())
    .then((data) => {
      // console.log(data);
      const rate = data.rates[currency_two];

      rateEl.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;

      amountEl_two.value = (amountEl_one.value * rate).toFixed(2); //tofixed changes decimal place by 2.
    });
}

function swapRates() {
  const temp = currencyEl_one.value;
  currencyEl_one.value = currencyEl_two.value;
  currencyEl_two.value = temp;
  calculate();
}

//event listeners
currencyEl_one.addEventListener("change", calculate);
amountEl_one.addEventListener("input", calculate);
currencyEl_two.addEventListener("change", calculate);
amountEl_two.addEventListener("input", calculate);
swap.addEventListener("click", swapRates);

calculate();

//can use this later on in the page.

// const timeID = document.querySelector("#time");

// const fullDate = new Date();
// const date = fullDate.getDate();
// const year = fullDate.getFullYear();

// const monthNames = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// const month = monthNames[fullDate.getMonth()];

// timeID.innerHTML = `${date}th ${month} ${year}`;
