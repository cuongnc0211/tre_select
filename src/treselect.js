export class TreSelect {
  constructor(selectElement, options = {}) {
    this.selectEl = selectElement;
    this.options = options;
    this.wrapper = null;
    this.dropdown = null;
    this.input = null;
    this.selected = new Set();

    this.init();
  }

  init() {
    this.selectEl.style.display = 'none';
    this.buildUI();
    this.bindEvents();
  }

  buildUI() {
    // Wrapper
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'treselect relative w-full';

    // Selected tags + input
    const inputContainer = document.createElement('div');
    inputContainer.className = 'flex flex-wrap items-center border rounded p-2 gap-2';

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.className = 'flex-1 outline-none';
    inputContainer.appendChild(this.input);

    // Dropdown
    this.dropdown = document.createElement('ul');
    this.dropdown.className = 'absolute z-10 w-full bg-white border mt-1 rounded shadow max-h-60 overflow-y-auto hidden';

    // Populate options
    Array.from(this.selectEl.options).forEach(opt => {
      const li = document.createElement('li');
      li.textContent = opt.textContent;
      li.dataset.value = opt.value;
      li.className = 'px-3 py-2 hover:bg-gray-100 cursor-pointer';
      this.dropdown.appendChild(li);
    });

    this.wrapper.appendChild(inputContainer);
    this.wrapper.appendChild(this.dropdown);
    this.selectEl.parentNode.insertBefore(this.wrapper, this.selectEl.nextSibling);
  }

  bindEvents() {
    // Focus shows dropdown
    this.input.addEventListener('focus', () => {
      this.dropdown.classList.remove('hidden');
    });

    // Blur hides dropdown (with timeout to allow click)
    this.input.addEventListener('blur', () => {
      setTimeout(() => this.dropdown.classList.add('hidden'), 100);
    });

    // Input filter
    this.input.addEventListener('input', () => {
      const query = this.input.value.toLowerCase();
    
      Array.from(this.dropdown.children).forEach(li => {
        const value = li.dataset.value;
        const label = li.textContent.toLowerCase();
        const alreadySelected = this.selected.has(value);

        const shouldShow = query === '' 
          ? !alreadySelected
          : label.includes(query) && !alreadySelected;

        li.classList.toggle('hidden', !shouldShow);
      });
    });

    // Select option
    this.dropdown.addEventListener('click', (e) => {
      if (e.target.tagName !== 'LI') return;
      const value = e.target.dataset.value;
      const label = e.target.textContent;

      if (this.selected.has(value)) return;

      this.selected.add(value);
      this.selectEl.querySelector(`option[value="${value}"]`).selected = true;
      this.addTag(label, value);
      this.input.value = '';
      this.filterOptions();

    });
  }

  addTag(label, value) {
    const tag = document.createElement('span');
    tag.className = 'bg-green-100 text-green-800 text-sm px-2 py-1 rounded flex items-center gap-1';
    tag.textContent = label;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '×';
    remove.className = 'text-red-500 hover:text-red-700 font-bold';
    remove.addEventListener('click', () => {
      tag.remove();
      this.selectEl.querySelector(`option[value="${value}"]`).selected = false;
      this.selected.delete(value);
      this.filterOptions();
    });

    tag.appendChild(remove);
    this.input.parentNode.insertBefore(tag, this.input);
  }

  filterOptions() {
    const query = this.input.value.toLowerCase();
  
    Array.from(this.dropdown.children).forEach(li => {
      const value = li.dataset.value;
      const label = li.textContent.toLowerCase();
      const alreadySelected = this.selected.has(value);
  
      const shouldShow = query === ''
        ? !alreadySelected
        : label.includes(query) && !alreadySelected;
  
      li.classList.toggle('hidden', !shouldShow);
    });
  }  
}
