document.addEventListener("DOMContentLoaded", () => {

    for (const cbb of document.getElementsByClassName("combo-box")) {
        let iconElement = cbb.querySelector(".icon");
        let inputElement = cbb.querySelector("input");
        let itemElements = cbb.querySelectorAll(".item");

        inputElement.value = inputElement.getAttribute("hint");

        const left =  inputElement.style.offsetleft + 'px';
        let top = inputElement.offsetTop;
        let width = inputElement.offsetWidth + iconElement.offsetWidth;
        
        for (const item of itemElements) {
            item.style.display = "block";
            item.style.left = left;
            item.style.top = (top += 40) + 'px';
            width = Math.max(item.offsetWidth, width);
        }
       
        inputElement.style.width = (width - iconElement.offsetWidth) + 'px';
        width = width + 'px';
        for (const item of itemElements) {
            item.style.width = width;
            item.style.display = "none";
        }

        inputElement.addEventListener("focus", () => {
            for (const combobox of document.getElementsByClassName("combo-box")) {
                let icon = combobox.querySelector(".icon");
                let input = combobox.querySelector("input");

                if (!icon.classList.contains("icon--up")) {
                    if (inputElement == input) {
                        action(icon);
                    }
                }
                else {
                    if (inputElement != input) {
                        action(icon);
                    }
                }
            }
        })

        iconElement.addEventListener("click", () => {
            for (const combobox of document.getElementsByClassName("combo-box")) {
                let icon = combobox.querySelector(".icon");
                if (iconElement === icon) {
                    action(iconElement);
                }
                else if (icon.classList.contains("icon--up")) {
                    action(icon);
                }
            }
        });
        
        for (const item of itemElements) {
            item.addEventListener("click", () => {
                const node = item.parentNode.querySelector(".item--selected");
                if (node != null) node.classList.remove("item--selected");
                item.classList.add("item--selected");
            })
        }
    }
    
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".combo-box, .combo-box input, .combo-box .icon, .combo-box .item")) {
            for (const combobox of document.getElementsByClassName("combo-box")) {
                const icon = combobox.querySelector(".icon");
                if (icon.classList.contains("icon--up")) {
                    action(icon);
                }
            }
        }
    })
})

function action(iconElement) {
    let comboboxElement = iconElement.parentNode;
    let inputElement = comboboxElement.querySelector("input");
    let itemElements = comboboxElement.querySelectorAll(".item");

    if (iconElement.classList.contains("icon--up")) {
        comboboxElement.classList.remove("border--expan")
        iconElement.classList.remove("icon--up")

        const selectedItemElement = comboboxElement.querySelector(".item--selected");
        if (selectedItemElement != null) {
            inputElement.value = selectedItemElement.innerHTML;
            comboboxElement.setAttribute("value", selectedItemElement.getAttribute("value"));
        }
        else {
            let bool = true;
            for (const item of itemElements) {
                if (inputElement.value == item.innerHTML) {
                    bool = false;
                    break;
                }
            }

            if (inputElement.value == "" || bool) {
                inputElement.classList.add("hint");
                inputElement.value = inputElement.getAttribute("hint");
                comboboxElement.setAttribute("value", "");
            }
        }

        for (const item of itemElements) {
            item.style.display = "none";
        }
    }
    else {
        comboboxElement.classList.add("border--expan")
        iconElement.classList.add("icon--up")

        if (inputElement.classList.contains("hint")) {
            inputElement.classList.remove("hint");
            inputElement.value = "";
        }
        
        for (const item of itemElements) {
            item.style.display = "block";
        }
    }
}