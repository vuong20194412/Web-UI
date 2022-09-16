const keys = ["Tab", "Enter", "Backspace", "ArrowLeft", "ArrowRight", "Left", "Right"];
const numberCodes = ["Digit0", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9"];

document.addEventListener("DOMContentLoaded", () => {
    // input 
    for (const input of document.getElementsByClassName("input")) {

        const inputElement = input.querySelector("input");

        if (inputElement.value == "") {
            inputElement.classList.add("hint");
            inputElement.value = inputElement.getAttribute("hint");
        }

        inputElement.addEventListener("focus", () => {

            inputElement.parentNode.classList.add("focus");

            if (inputElement.classList.contains("hint")) {
                inputElement.value = "";
                inputElement.classList.remove("hint");
            }
        })

        inputElement.addEventListener("blur", () => {

            inputElement.parentNode.classList.remove("focus");

            if (inputElement.value == "") {
                inputElement.classList.add("hint");
                inputElement.value = inputElement.getAttribute("hint");
            }
        })
    }

    // input label
    for (const input of document.getElementsByClassName("input")) {

        if (input.querySelector(".input-label") != null) {

            const inputElement = input.querySelector("input");
            const iconElement = input.querySelector(".icon");

            if (!inputElement.classList.contains("date")) {

                inputElement.addEventListener("focus", () => {
                    iconElement.classList.add("icon--circle-x");
                })

                inputElement.addEventListener("blur", () => {
                    if (inputElement.classList.contains("hint")) {
                        iconElement.classList.remove("icon--circle-x");
                    }
                })
                
                iconElement.addEventListener("click", () => {
                    if (iconElement.classList.contains("icon--circle-x")) {
                        inputElement.value = "";
                        iconElement.classList.remove("icon--circle-x");
                        inputElement.classList.add("hint");
                        inputElement.value = inputElement.getAttribute("hint");
                    }
                })
            }
        }
    }

    // input date
    for (const input of document.getElementsByClassName("input")) {

        if (input.querySelector(".input-label") != null) {

            const inputElement = input.querySelector("input");
            const iconElement = input.querySelector(".icon");

            if (inputElement.classList.contains("date")) {

                const fallbackPicker = document.querySelector('.fallbackDatePicker');

                const yearSelect = document.querySelector('#year');
                const monthSelect = document.querySelector('#month');
                const daySelect = document.querySelector('#day');

                // hide fallback initially
                fallbackPicker.style.display = 'none';

                try {
                    inputElement.type = 'text';
                } catch (e) {
                    console.log(e.message);
                }

                // if it does, run the code inside the if () {} block
                if (inputElement.type === 'text') {
                    // hide the native picker and show the fallback
                    inputElement.style.display = 'none';
                    iconElement.style.display = 'none';
                    fallbackPicker.style.display = 'block';
                    fallbackPicker.style.width = '300px';
                    fallbackPicker.parentNode.style.width = fallbackPicker.offsetWidth + 'px';
                    fallbackPicker.parentNode.parentNode.style.width = fallbackPicker.offsetWidth + 'px';

                    //preserve day selection
                    let previousDay;

                    // populate the days and years dynamically
                    // (the months are always the same, therefore hardcoded)
                    populateDays(monthSelect.value, daySelect, yearSelect, previousDay);
                    populateYears(yearSelect);
                    // when the month or year <select> values are changed, rerun populateDays()
                    // in case the change affected the number of available days
                    yearSelect.onchange = () => {
                        populateDays(monthSelect.value, daySelect, yearSelect, previousDay);
                    }
    
                    monthSelect.onchange = () => {
                        populateDays(monthSelect.value, daySelect, yearSelect, previousDay);
                    }
    
                    // update what day has been set to previously
                    // see end of populateDays() for usage
                    daySelect.onchange = () => {
                        previousDay = daySelect.value;
                    }
                }
                else {
                    iconElement.addEventListener("click", () => {
                        inputElement.showPicker();
                        inputElement.focus();
                    })
                }
            }
        }
    }
    
    // input currency
    for (const input of document.getElementsByClassName("input")) {

        if (input.querySelector(".input-label") != null) {

            const inputElement = input.querySelector("input");

            if (inputElement.hasAttribute("currency")) {

                inputElement.setAttribute("type", "text");

                inputElement.addEventListener("keydown", (e) => {
                    if (keys.indexOf(e.key) === -1 && numberCodes.indexOf(e.code) === -1) {
                        e.preventDefault();
                    }
                })

                inputElement.addEventListener("change", () => {
                    inputElement.value = formatCurrency(inputElement.value, inputElement.getAttribute("currency"));
                })

                inputElement.addEventListener("blur", () => {
                    inputElement.value = formatCurrency(inputElement.value, inputElement.getAttribute("currency"));
                })

                inputElement.addEventListener("focus", () => {
                    inputElement.value = inputElement.value.replace(/[^0-9]+/g, "");
                })
            }
        }
    }
})

function populateDays(month, daySelect, yearSelect, previousDay) {
    // delete the current set of <option> elements out of the
    // day <select>, ready for the next set to be injected
    while (daySelect.firstChild) {
      daySelect.removeChild(daySelect.firstChild);
    }
  
    // Create variable to hold new number of days to inject
    let dayNum;
  
    // 31 or 30 days?
    if (['January', 'March', 'May', 'July', 'August', 'October', 'December'].includes(month)) {
      dayNum = 31;
    } else if (['April', 'June', 'September', 'November'].includes(month)) {
      dayNum = 30;
    } else {
      // If month is February, calculate whether it is a leap year or not
      const year = yearSelect.value;
      const isLeap = new Date(year, 1, 29).getMonth() === 1;
      dayNum = isLeap ? 29 : 28;
    }
  
    // inject the right number of new <option> elements into the day <select>
    for (let i = 1; i <= dayNum; i++) {
      const option = document.createElement('option');
      option.textContent = i;
      daySelect.appendChild(option);
    }
  
    // if previous day has already been set, set daySelect's value
    // to that day, to avoid the day jumping back to 1 when you
    // change the year
    if (previousDay) {
        daySelect.value = previousDay;

        // If the previous day was set to a high number, say 31, and then
        // you chose a month with less total days in it (e.g. February),
        // this part of the code ensures that the highest day available
        // is selected, rather than showing a blank daySelect
        if (daySelect.value === "") {
        daySelect.value = previousDay - 1;
        }

        if (daySelect.value === "") {
        daySelect.value = previousDay - 2;
        }

        if (daySelect.value === "") {
        daySelect.value = previousDay - 3;
        }
    }
}
  
function populateYears(yearSelect) {
    // get this year as a number
    const date = new Date();
    const year = date.getFullYear();

    // Make this year, and the 100 years before it available in the year <select>
    for (let i = 0; i <= 100; i++) {
        const option = document.createElement('option');
        option.textContent = year - i;
        yearSelect.appendChild(option);
    }
}

function formatCurrency(text, currency) {
    const value = text.replace(/[^0-9]+/g, "");
    const begin = value.length % 3; 
    text = value.substring(begin).match(/[0-9]{1,3}/g);
    return value.substring(0, begin)
                + (begin > 0 ? "." : "")
                + (text != null ? text.join(".") : "") 
                + currency;
}