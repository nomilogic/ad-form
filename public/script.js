document.getElementById('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const number = document.getElementById('number').value;

    const response = await fetch('http://localhost:3000/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, number }),
    });

    const result = await response.json();

    const messageDiv = document.getElementById('message');
    if (response.ok) {
        messageDiv.textContent = result.message;
    } else {
        messageDiv.textContent = result.error;
    }
});
