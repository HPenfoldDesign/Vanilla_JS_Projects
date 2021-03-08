/*This app shall be written with modulation. Modules work the same way as multiple folders inside a larger folder. You can link the data between these modules to create the full program.
You could have a module which programs the UI, another module to program data like getting data or doing something mathematical with data, another for events etc. 
Heres an example of modules below. They are written with IIFE's */

/* If you tried to call the budgetController.add(5) it wouldnt work because its hidden inside the IIFE. by returning a function directly it makes it accessible.
The value of a value also becomes b, so if you called the function budgetController.publicTest(5), that would work. This is how you enable modules to interact with one another.*/

/*The publicTest function is a perfect example of a closure because it grabs the add function from inside the IIFE, even though the IFEE is called right away with this '();'  */

// let budgetController = (function() {
//     let x = 23;

//     let add = function (a) {
//        return x + a;
//     }

//     return {
//         publicTest: function (b) {
//             //console.log(add(b));
//             return add(b);
//         }
//     }
// })();

// let UIController = (function() {
//      //some code

// })();

// let controller = (function(budgetCtrl, UICtrl) {

//     let z = budgetController.publicTest(7);

//     return {
//         returnZ: function() {
//             console.log(z);
//         }
//     }

// })(budgetController, UIController);

//When calling the IIFE controller.returnZ() the answer returns as 30, as 23 + 7 = 30.
//For this to work you have to remove the console.log in publicTest and return the function.

//BUDGET CONTROLLER-----------------
let budgetController = (function () {
  let Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  //calculate and get percentage of each expense element.
  Expense.prototype.calcPercentages = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  let Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let calculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  let data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1, //set to -1 because even 0 has a value so -1 is absolute zero.
  };

  return {
    addItem: function (type, des, val) {
      let newItem, ID;

      //creates new ID and adds to to the end of the exp or Inc array, if there is already abject there it is put in afterwards.
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //creates a new expense or income object dependant on whats selected along with the ID
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      //data.allItems adds an Expence or income object in the inc or exp arrays inside of allItems.
      data.allItems[type].push(newItem);

      //returns the newItem element which also makes it available to other modules.
      return newItem;
    },

    //identify the correct item to delete as ID number and array number are different.
    /*map is like foreach but returns an array assigning values to other values. So far our script assigns a type (inc / exp) and an ID, lets say its 22 Returns new array of current insex id instead of ore generated ID name*/
    /* In this case you want to link the ID of 22 to an index array of numerical numbers for example link 22 to 3, so the computer knows to delete the 3rd ID in.*/
    deleteItem: function (type, id) {
      let ids, index;

      ids = data.allItems[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);
      //splice is used to delete items from an array. It takes 3 perimetres. what piece of the array you want to delete, how many pieces from that point to delete and if you want to replace with anything else, which is optional.
      // if the index is not (!==) -1, index's start at 0 so basically if index exists delete that index entry and no other index's.
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      // calculate total income and total expenses
      calculateTotal("exp");
      calculateTotal("inc");
      //calculate the budget income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // calculate percentage of income thats spent.
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentages(data.totals.inc);
      });
    },

    getPercentages: function () {
      let allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

    testing: function () {
      console.log(data);
    },
  };
})();

//UI CONTROLLER---------------------
let UIController = (function () {
  // a way of having all of your query selector references in once place as an object, which are referenced inside of UIController inner functions.
  let DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  let formatNumber = function (num, type) {
    // + or - before each inc or exp number.
    // each number should have 2 decimal points
    // comma seporating thousands.

    num = Math.abs(num); //abs() means make absolute number
    num = num.toFixed(2); //adds two decimals to the end of a number so 20 would be 20.00.

    numSplit = num.split(".");
    int = numSplit[0];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, int.length); //input 23510, output 23,510
    }

    dec = numSplit[1];

    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };

  let nodeListForEach = function (list, callback) {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  //returns inputted text as an object, which is called in the Global app controller.
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //will be either an income or expense;
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value), //parsefloat converts the number into a decimal number rather than a string.
      };
    },

    addListItem: function (obj, type) {
      let html, newHtml, element;
      //1. create HTML string with placeholder text
      if (type == "inc") {
        element = DOMstrings.incomeContainer;

        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;

        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //2. Replace placeholder text with the addItem text
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      //3. Insert that new data into the DOM (UI)
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml); //inserts html as the last div inside of either .income__list or .expenses__list.
    },

    DeleteListItem: function (selectorID) {
      let el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      //clears the description and value fields after submitting a inc or exp.
      //by default selecting these wont return an array but a list. This needs to be converted to an array.
      //to convert to an array you can use the slice() method which usually cuts up bits of arrays but in this case it will convert the list to an array.
      let fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields); //tricks slice method into thinking its slicing an array so returns array.
      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus(); // puts curser back in description box ready for next entry.
    },

    displayBudget: function (obj) {
      let type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,"inc");
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, "exp");

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages: function (percentages) {
      let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);


      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },

    displayMonth: function() {
      let now, year, months, month;
      
      now = new Date();
      year = now.getFullYear();
      
      month = now.getMonth(); //generates a number of relevent month, which you can pass into months as shown below.
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

    },

    changedType: function() {
      let fields = document.querySelectorAll(
        DOMstrings.inputType + ',' 
        + DOMstrings.inputDescription + ',' + 
        DOMstrings.inputValue);
        
      nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus');
      }); 
      
      document.querySelector(DOMstrings.inputButton).classList.toggle('red');
    },

    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

//GLOBAL APP CONTROLLER--------------
let controller = (function (budgetCtrl, UICtrl) {
  let setupEventlisteners = function () {
    //links to UIController and calls the getDOMstrings object to be able to use in global app controller
    let DOM = UICtrl.getDOMstrings();
    //When you click the button with a class of .add__btn, run the ctrlAddItem function.
    //keycode and which do the same thing but which is for older browsers.
    //Because we now have access to the DOM variable which links to DOMstrings object we can now reference inputButton from it.
    document
      .querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener("change", UICtrl.changedType);
  };

  let updateBudget = function () {
    //1. calculate the budget
    budgetCtrl.calculateBudget();
    //2. return the budget
    let budget = budgetCtrl.getBudget();
    //3. display the buget on the UI
    UICtrl.displayBudget(budget);
  };

  let updatePercentages = function () {
    //1. calculate percentages of each expense item
    budgetCtrl.calculatePercentages();
    //2. Read the percentages from the budget controller
    let percentages = budgetCtrl.getPercentages();
    //3. Update the UI
    UICtrl.displayPercentages(percentages);
  };

  let ctrlAddItem = function () {
    let input, newItem;

    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //if input.description is different to no string, the value is not NaN and input is more that 0.

      //2. Add item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      //3. Add new item to user interface
      UICtrl.addListItem(newItem, input.type);
      //4. clear the fields.
      UICtrl.clearFields();
      //5. calculate and update budget
      updateBudget();
      //6. calculate and update expense percentages
      updatePercentages();
    }
  };

  let ctrlDeleteItem = function (event) {
    let itemID, splitID, type, ID;
    //Selects the id in furthest parent element in the HTML (income-0).
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    //Returns an array with the type being inc or exp and a unique id number created when entering income or expense tabs.
    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]); //number is converted to a string when inside an array, parseInt converts back to a number again.

      //1. Delete the item from the data structure.
      budgetCtrl.deleteItem(type, ID);
      //2. Delete the item from the UI
      UICtrl.DeleteListItem(itemID);
      //3. Update UI to show new budget.
      updateBudget();
      //4. calculate and update expense percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log("The app has started");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventlisteners();
    },
  };
})(budgetController, UIController);

//This calls the function return from controller (init), which contains the setupEventlisteners function call for everything to work. Will be the only peice of code available globally.
controller.init();
