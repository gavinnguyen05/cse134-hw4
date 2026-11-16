const form = document.querySelector('form');
const submitButton = document.querySelector('button[type="submit"]');
const comments = document.querySelector('#contact-comments');
const charCount = document.querySelector('#char-count');
const errorArea = document.querySelector('#error-area');
const formErrorsInput = document.querySelector('#form-errors');

const fields = [
    document.querySelector('#contact-name'),
    document.querySelector('#contact-email'),
    comments
];

const form_errors = [];

function getErrorMessage(field) {
    if (field.validity.valueMissing) {
        return 'Please enter your ' + field.name + '.';
    }
    if (field.validity.typeMismatch) {
        return 'Please enter a valid email address, like name@example.com.';
    }
    if (field.validity.tooShort) {
        return 'Your comments must be at least ' + field.minLength + ' characters long.';
    }
    return '';
}

// checks one field, updates its error text, and returns the error message ('' if valid)
function checkField(field) {
    field.setCustomValidity('');
    const message = getErrorMessage(field);
    field.setCustomValidity(message);

    const errorText = document.querySelector('#' + field.name + '-error');
    let newText = '';
    if (message !== '') {
        newText = 'Error: ' + message;
    }
    // only change the text if it is different, so screen readers don't repeat it
    if (errorText.textContent !== newText) {
        errorText.textContent = newText;
    }
    return message;
}

function updateCounter() {
    const remaining = comments.maxLength - comments.value.length;

    if (remaining <= 0) {
        charCount.textContent = 'You have reached the ' + comments.maxLength + ' character limit.';
        charCount.className = 'limit';
    } else if (remaining <= 100) {
        charCount.textContent = 'Warning: only ' + remaining + ' characters left.';
        charCount.className = 'warning';
    } else {
        charCount.textContent = remaining + ' characters left.';
        charCount.className = '';
    }
}

for (const field of fields) {
    // change runs when the user leaves a field they edited
    field.addEventListener('change', function () {
        checkField(field);
    });

    // while typing, only update an error that is already showing
    field.addEventListener('input', function () {
        const errorText = document.querySelector('#' + field.name + '-error');
        if (errorText.textContent !== '') {
            checkField(field);
        }
    });
}

comments.addEventListener('input', updateCounter);

// the browser blocks the submit event when a field is invalid, so the errors are
// recorded on click instead (pressing Enter in a field also clicks this button)
submitButton.addEventListener('click', function () {
    for (const field of fields) {
        const message = checkField(field);
        if (message !== '') {
            form_errors.push({ field: field.name, error: message });
        }
    }
});

// submit only fires once every field is valid
form.addEventListener('submit', function () {
    formErrorsInput.value = JSON.stringify(form_errors);
});

charCount.hidden = false;
errorArea.hidden = false;
updateCounter();
