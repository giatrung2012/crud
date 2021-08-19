const languagesApi = 'http://localhost:3000/courses';

function start() {
  getLanguages(renderLanguages);
  handleCreateForm(); // Need click createBtn
}

// After loading
start();

// Functions
function getLanguages(renderLanguages) {
  fetch(languagesApi)
    .then((response) => response.json()) // Convert courses from json to html
    .then(renderLanguages); // renderLanguages(courses)
}

function createLanguage(formData, callback) {
  // Line 66
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  };
  fetch(languagesApi, options)
    .then((response) => response.json())
    .then(callback); // Line 66
}

function resetBtn() {
  handleCreateForm();
  document.querySelector('#create').innerHTML = 'Create';
  document.querySelector('input[name="name"]').value = '';
  document.querySelector('input[name="description"]').value = '';
}

function renderLanguages(languages) {
  // Line 17 and more
  const listLanguages = document.querySelector('#list-languages');
  const htmls = languages.map(
    (language) => `<li class="language-id-${language.id}">
      <h3>${language.name}</h3>
      <p>${language.description}</p>
      <div>
      <button onclick="getLanguageByID(${language.id})">Update</button>
      <button onclick="deleteLanguage(${language.id})">Delete</button>
      </div>
    </li>`
  );
  listLanguages.innerHTML = htmls.join('');
}

function handleCreateForm() {
  const createBtn = document.querySelector('#create');
  createBtn.onclick = function () {
    const name = document.querySelector('input[name="name"]').value;
    const description = document.querySelector(
      'input[name="description"]'
    ).value;
    const formData = {
      name,
      description,
    };
    createLanguage(formData, () => {
      getLanguages(renderLanguages);
    });
  };
}

function deleteLanguage(id) {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  fetch(`${languagesApi}/${id}`, options)
    .then((response) => response.json())
    .then(() => {
      const language = document.querySelector(`.language-id-${id}`);
      if (language) {
        language.remove();
      }
    });
}

function getLanguageByID(id) {
  // GET with id need options
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  fetch(`${languagesApi}/${id}`, options)
    .then((response) => response.json())
    .then((language) => {
      const name = document.querySelector('input[name="name"]');
      const description = document.querySelector('input[name="description"]');
      name.value = language.name;
      description.value = language.description;
      document.querySelector('#create').innerText = 'Update';
      handleUpdateLanguage(id);
    });
}

function handleUpdateLanguage(id) {
  const updateBtn = document.querySelector('#create');
  updateBtn.onclick = function () {
    const name = document.querySelector('input[name="name"]').value;
    const description = document.querySelector(
      'input[name="description"]'
    ).value;
    const formData = {
      name,
      description,
    };
    updateLanguage(formData, id, () => {
      getLanguages(renderLanguages);
    });
    resetBtn();
  };
}

function updateLanguage(formData, id, callback) {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  };
  fetch(`${languagesApi}/${id}`, options)
    .then((response) => response.json())
    .then(callback);
}
