// BUDGET CONTROLLER

// How to have hover and click events be triggered by separate taps on iPhone
//     document.body.addEventListener('touchstart',function(){},false);

$(document).ready(function () {
    $(".ion-ios-close-outline").click(function () {
        $("#myModal").modal();
    });
});

var budgetController = (function () {
    // debugger;
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };


    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };


    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };


    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };


    return {
        addItem: function (type, des, val) {
            // debugger;
            var newItem, ID, key;
            // ID = last ID + 1
            // if (allItems.exp === 0) {
            //     return 'There is no income item';
            // } else if (allItems.inc === 0) {
            //     return 'There is no expense item';
            // }
            var element = document.querySelector(`.no-item-${type}`);
            element.style.display = 'none';

            //Create unique key for every item
            key = Math.floor((Math.random() * 10) + 1);
            // Create new ID
            // debugger;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                
            } else {
                ID = 0;
            }

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val, key);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val, key);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },


        deleteItem: function (type, id, key) {
            // debugger;
            // debugger;
            var ids, index;

            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            console.log('inside of delete item', ids)
            index = ids.indexOf(id);
            // index = ids.id;
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

            if (data.allItems[type].length === 0){
                var element = document.querySelector(`.no-item-${type}`);
                element.style.display = 'inline-block';
            }
        },


        calculateBudget: function () {
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

            // Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100
        },

        calculatePercentages: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },


        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },


        getBudget: function () {
            // debugger;
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function () {
            console.log(data);
        }
    };

})();




// UI CONTROLLER
var UIController = (function () {
    // debugger;
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
        rightClearFix: '.right clearfix'
        // deleteBtn: '.item__delete--btn'
    };


    var formatNumber = function (num, type) {
        // debugger;
        var numSplit, int, dec, type;
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };


    var nodeListForEach = function (list, callback) {
        // debugger;
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };




    return {
        getInput: function () {
            // debugger;
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
                key: Math.floor((Math.random() * 20) + 1)
            };
        },


        addListItem: function (obj, type) {
            // debugger;
            var html, newHtml, element;
            // Create HTML string with placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

            // Search for item__delete--btn element and add click event for modal
            // document.querySelector(element).getElementsByClassName('item__delete--btn')[0].addEventListener('click', function (event) {
                
            //     document.getElementById("myModal").style.display = "block";
            // })
        },
        


        deleteListItem: function (selectorID, type) {
            // debugger;
            // debugger;
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            // if (allItems[type].length === 0){
            //     var element = document.querySelector(`.no-item-${type}`);
            //     element.style.display = 'inline-block';
            // }
            
        },


        clearFields: function () {
            // debugger;
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },


        displayBudget: function (obj) {
            // debugger;
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },


        displayPercentages: function (percentages) {
            // debugger;
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function (current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

        },


        displayMonth: function () {
            var now, months, month, year;

            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },


        changedType: function () {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);

            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },


        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();




// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
// debugger;
    console.log('controller', UICtrl.getDOMstrings().container)
    // document.querySelector(UICtrl.getDOMstrings().deleteBtn).addEventListener('click', deleteConfirmationModal);

    var setupEventListeners = function (event) {
        // debugger;
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };


    var updateBudget = function () {
        // debugger;
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };


    var updatePercentages = function () {

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };


    var ctrlAddItem = function () {
        // debugger;
        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value, input.key);
            console.log('inside of ctrlAddItem', newItem)
            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type, input.key);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();

            // 6. Calculate and update percentages
            updatePercentages();
            // document.querySelector(element).insertAdjacentHTML('hiii', newHtml);
            console.log('the div', document.querySelector('.item'));
        }
    };


// document.querySelector()


    // $(".ion-ios-close-outline").click(function (event) {
    //     document.getElementById("myModal").style.display = "block";
    // });

    var ctrlDeleteItem = function (event) {
        console.log('inside 487',event.target.matches('.ion-ios-close-outline'))
        console.log('inside 487 event', event.target)
        if (!event.target.matches('.ion-ios-close-outline')){
            console.log(false)
            return true;
        } 
        // debugger;
        console.log('delete confirmation modal', event.target)
        // // debugger;
        // document.getElementsByClassName('item__delete').addEventListener("click", function(){
        //     console.log('line 482')
        // });
        if (document.getElementById("myModal").style.display = "none"){
            event.preventDefault()
            console.log('inside of open modal', event.target.parentNode.parentNode.parentNode.parentNode.id)
            var itemEvent = event;
            document.getElementById("myModal").style.display = "block";
        }
        $(".confirm-no-btn").off().click(function () {
            console.log('clicked on no button')
            document.getElementById("myModal").style.display = "none";
        });
        $(".confirm-yes-btn").off().click(function () {
            document.getElementById("myModal").style.display = "none";
            console.log('yes clicked for delete', event.target.parentNode.parentNode.parentNode.parentNode.id);
            // var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
            deleteItem(itemEvent);
        })
        $(".close").click(function () {
            document.getElementById("myModal").style.display = "none";
        })
        //     var itemID, splitID, type, ID;
            
        //     itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        // console.log('inside ctrldeleteitem', itemID)
        //     if (itemID) {

        //         //inc-1
        //         splitID = itemID.split('-');
        //         type = splitID[0];
        //         ID = parseInt(splitID[1]);

        //         // 1. delete the item from the data structure
        //         budgetCtrl.deleteItem(type, ID);

        //         // 2. Delete the item from the UI
        //         UICtrl.deleteListItem(itemID, type);

        //         // 3. Update and show the new budget
        //         updateBudget();

        //         // 4. Calculate and update percentages
        //         updatePercentages();
        //     }
        // });
    };
    var deleteItem = function(event){
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log('inside ctrldeleteitem', itemID)
        if (itemID) {

            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID, type);

            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();
        }
    };

    var deleteConfirmationModal = function (event) {
        console.log('delete confirmation modal', event.target)
        // debugger;
        document.getElementById("myModal").style.display = "block";
        $(".confirm-no-btn").click(function () {
            console.log('clicked on no button')
            document.getElementById("myModal").style.display = "none";
        });
        $(".confirm-yes-btn").click(function () {
            document.getElementById("myModal").style.display = "none";
            console.log('yes clicked for delete', event.target);
            // var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
            // ctrlDeleteItem(event);
        })
        $(".close").click(function () {
            document.getElementById("myModal").style.display = "none";
        })
    }

    return {
        init: function () {
            // debugger;
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);


controller.init();