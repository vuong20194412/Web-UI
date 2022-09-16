document.addEventListener("DOMContentLoaded", () => {

    for (const selectElement of document.getElementsByClassName("select")) {
        let iconElement = selectElement.querySelector(".icon");
        let textElement = selectElement.querySelector(".text");
        let itemElements = selectElement.querySelectorAll(".item");

        textElement.innerHTML = textElement.getAttribute("hint");

        const left =  textElement.style.offsetleft + 'px';
        let top = textElement.offsetTop;
        let width = textElement.offsetWidth + iconElement.offsetWidth;
        
        for (const item of itemElements) {
            item.style.display = "block";
            item.style.left = left;
            item.style.top = (top += 40) + 'px';
            width = Math.max(item.offsetWidth, width);
        }
       
        textElement.style.width = (width - iconElement.offsetWidth) + 'px';
        width = width + 'px';
        for (const item of itemElements) {
            item.style.width = width;
            item.style.display = "none";
        }

        iconElement.addEventListener("click", () => {
            for (const select of document.getElementsByClassName("select")) {
                let icon = select.querySelector(".icon");
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
        if (!e.target.closest(".select, .select text, .select .icon, .select .item")) {
            for (const select of document.getElementsByClassName("select")) {
                const icon = select.querySelector(".icon");
                if (icon.classList.contains("icon--up")) {
                    action(icon);
                }
            }
        }
    })
})

function action(iconElement) {
    let selectElement = iconElement.parentNode;
    let textElement = selectElement.querySelector(".text");
    let itemElements = selectElement.querySelectorAll(".item");

    if (iconElement.classList.contains("icon--up")) {
        selectElement.classList.remove("border--expan")
        iconElement.classList.remove("icon--up")

        const selectedItemElement = selectElement.querySelector(".item--selected");
        if (selectedItemElement != null) {
            textElement.innerHTML = selectedItemElement.innerHTML;
            selectElement.setAttribute("value", selectedItemElement.getAttribute("value"));
        }
        else {
            let bool = true;
            for (const item of itemElements) {
                if (textElement.innerHTML == item.innerHTML) {
                    bool = false;
                    break;
                }
            }

            if (textElement.innerHTML == "" || bool) {
                textElement.classList.add("hint");
                textElement.innerHTML = textElement.getAttribute("hint");
                selectElement.setAttribute("value", "");
            }
        }

        for (const item of itemElements) {
            item.style.display = "none";
        }
    }
    else {
        selectElement.classList.add("border--expan")
        iconElement.classList.add("icon--up")

        if (textElement.classList.contains("hint")) {
            textElement.classList.remove("hint");
            textElement.innerHTML = "";
        }
        
        for (const item of itemElements) {
            item.style.display = "block";
        }
    }
}