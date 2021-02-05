export default class Select {
    constructor(element) {
        this.element = element
        this.options = getFormattedOptions(element.querySelectorAll('option'))
        this.customElement = document.createElement("div")
        this.labelElement = document.createElement("span")
        this.optionsCustomElement = document.createElement("ul")
        setupCustomElement(this)
        element.style.display = "none";
        element.after(this.customElement)
    }

    get selectedOption() {
        return this.options.find(opt => opt.selected);
    }

    get selectOptionIndex() {
        return this.options.indexOf(this.selectedOption)
    }

    selectValue(value) {
        const newSelectedOption = this.options.find(opt => opt.value === value);
        const prevSelectedOption = this.selectedOption;
        prevSelectedOption.selected = false;
        prevSelectedOption.element.selected = false;

        newSelectedOption.selected = true;
        newSelectedOption.element.selected = true;

        this.labelElement.innerText = newSelectedOption.label;
        this.optionsCustomElement.querySelector(`[data-value="${prevSelectedOption.value}"]`).classList.remove('selected');
        const newCustomElement = this.optionsCustomElement.querySelector(`[data-value="${newSelectedOption.value}"]`);
        newCustomElement.classList.add('selected');
        newCustomElement.scrollIntoView({ block: 'nearest' })
    }
}

function setupCustomElement(select) {
    select.customElement.classList.add('custom-select-container');
    select.customElement.tabIndex = 0;
    select.labelElement.classList.add('custom-select-value');
    // select.labelElement.style.background = "blacsk"
    select.labelElement.innerText = select.selectedOption.label
    select.customElement.append(select.labelElement)
    select.optionsCustomElement.classList.add('custom-select-options');


    select.options.forEach(option => {
        const optionElement = document.createElement("li");
        optionElement.classList.add('custom-select-option');
        optionElement.classList.toggle('selected', option.selected)
        optionElement.innerText = option.label;
        optionElement.dataset.value = option.value;


        optionElement.addEventListener('click', () => {
            select.selectValue(option.value);
            // optionElement.classList.add('selected');
            select.optionsCustomElement.classList.remove('show');
        })

        select.optionsCustomElement.append(optionElement)
    })


    select.labelElement.addEventListener('click', () => {
        select.optionsCustomElement.classList.toggle('show')
    })

    select.customElement.addEventListener('blur', () => {
        select.optionsCustomElement.classList.remove('show')
    })


    let DebounceTimeout;
    let SearchTerm = '';

    select.customElement.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'Space':
                select.optionsCustomElement.classList.toggle('show')
                break;
            case 'ArrowUp': {
                const prevOption = select.options[select.selectOptionIndex - 1];
                console.log(select.selectOptionIndex)
                if (prevOption) {
                    select.selectValue(prevOption.value)
                }
                break;
            }
            case 'ArrowDown': {
                const nextOption = select.options[select.selectOptionIndex + 1];
                if (nextOption) {
                    select.selectValue(nextOption.value)
                }
                break;
            }
            case 'Escape':
            case 'Enter':
                select.optionsCustomElement.classList.remove('show')
                break;
            default: {
                clearTimeout(DebounceTimeout);
                SearchTerm += e.key;
                DebounceTimeout = setTimeout(() => {
                    SearchTerm = '';
                }, 500)
                console.log(SearchTerm)
                const searchOption = select.options.find((option) => {
                    return option.label.toLowerCase().startsWith(SearchTerm);
                })

                if (searchOption) {
                    select.selectValue(searchOption.value);
                }
            }
        }
    })

    select.customElement.append(select.optionsCustomElement)
}

function getFormattedOptions(optionElements) {
    return [...optionElements].map(opt => {
        return {
            value: opt.value,
            label: opt.label,
            selected: opt.selected,
            element: opt
        }
    })
}