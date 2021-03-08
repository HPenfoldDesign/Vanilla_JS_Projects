//This app is build using modulation with IIFE's Split up into 3 modules. This makes the javascript private and therefore more secure.

//BUDGET CONTROLLER-----------------
const budgetController = (function () {
  //The Expense Object
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  //calculate and get percentage of each expense element with prototype.
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

  //The Income Object
  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //calculating the total value of incomes and expenses.
  const calculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach((cur) => {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  //Building data arrays inside of our objects with ID, description value and percentage.
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

  //Returning functions in IIFE's allows them to be publically accessible to other functions.
  return {
    //Creating a new item, either expense or income.
    addItem: function (type, des, val) {
      let newItem, ID;

      //creates new ID and adds to to the end of the exp or Inc array.
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //creates a new expense or income object dependant on whats selected along with the ID.
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

    //identifies the correct item to delete and maps it to a seporate number in an array which is returned by map().

    deleteItem: function (type, id) {
      let ids, index;

      ids = data.allItems[type].map(function (current) {
        return current.id;
      });

      //Removes items by splicing array.
      index = ids.indexOf(id);
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

    //Calculate and get the percentage of each exp.
    calculatePercentages: function () {
      data.allItems.exp.forEach((cur) => {
        cur.calcPercentages(data.totals.inc);
      });
    },

    getPercentages: function () {
      const allPerc = data.allItems.exp.map((cur) => {
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
const UIController = (function () {
  // Query selector references in once place as an object, which are referenced inside of UIController inner functions.
  const DOMstrings = {
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
    dateLabel: ".budget__title--month",
  };

  // Adds + or - before each inc or exp number. Each number should have 2 decimal points and comma seporating thousands.
  const formatNumber = function (num, type) {
    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split(".");
    int = numSplit[0];

    if (int.length > 3) {
      int =
        int.substr(0, int.length - 3) +
        "," +
        int.substr(int.length - 3, int.length);
    }

    dec = numSplit[1];
    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };

  const nodeListForEach = function (list, callback) {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  //returns inputted text as an object, which is called in the Global app controller.
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
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
      const el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      //clears the description and value fields after submitting a inc or exp.
      let fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((current, index, array) => {
        current.value = "";
      });

      // puts curser back in description box ready for next entry.
      fieldsArr[0].focus();
    },

    displayBudget: function (obj) {
      let type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        DOMstrings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, "exp");

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages: function (percentages) {
      const fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, (current, index) => {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },

    //Displays month and year.
    displayMonth: function () {
      let now, year, months, month;

      now = new Date();
      year = now.getFullYear();

      month = now.getMonth(); //generates a number of relevent month, which you can pass into months as shown below.
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      document.querySelector(DOMstrings.dateLabel).textContent =
        months[month] + " " + year;
    },

    //Changes type, description, value boxes and tick icon to red if expense.
    changedType: function () {
      const fields = document.querySelectorAll(
        DOMstrings.inputType +
          "," +
          DOMstrings.inputDescription +
          "," +
          DOMstrings.inputValue
      );

      nodeListForEach(fields, (cur) => {
        cur.classList.toggle("red-focus");
      });

      document.querySelector(DOMstrings.inputButton).classList.toggle("red");
    },

    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

//GLOBAL APP CONTROLLER--------------
//links to UIController and calls the getDOMstrings object to be able to use in global app controller
const controller = ((budgetCtrl, UICtrl) => {
  //event listeners for the Type, description, value and tick circle. works with either on click or enter button push.
  const setupEventlisteners = function () {
    const DOM = UICtrl.getDOMstrings();

    document
      .querySelector(DOM.inputButton)
      .addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", (event) => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
    document
      .querySelector(DOM.inputType)
      .addEventListener("change", UICtrl.changedType);
  };

  const updateBudget = function () {
    //1. calculate the budget
    budgetCtrl.calculateBudget();
    //2. return the budget
    const budget = budgetCtrl.getBudget();
    //3. display the buget on the UI
    UICtrl.displayBudget(budget);
  };

  const updatePercentages = function () {
    //1. calculate percentages of each expense item
    budgetCtrl.calculatePercentages();
    //2. Read the percentages from the budget controller
    const percentages = budgetCtrl.getPercentages();
    //3. Update the UI
    UICtrl.displayPercentages(percentages);
  };

  const ctrlAddItem = function () {
    let input, newItem;

    input = UICtrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //1. Add item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      //2. Add new item to user interface
      UICtrl.addListItem(newItem, input.type);
      //3. clear the fields.
      UICtrl.clearFields();
      //4. calculate and update budget
      updateBudget();
      //5. calculate and update expense percentages
      updatePercentages();
    }
  };

  const ctrlDeleteItem = function (event) {
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
