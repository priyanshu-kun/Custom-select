import Select from "./select.js";

const selectElement = document.querySelectorAll('[data-custom]');

selectElement.forEach(selEle => {
    console.log(new Select(selEle))
})