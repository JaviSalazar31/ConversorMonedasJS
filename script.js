/* script.js */

let rates = {};

async function fetchRates() {
    const response = await fetch('data.json');
    rates = await response.json();
    populateSelects();
}

function populateSelects() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');

    Object.keys(rates).forEach(currency => {
        let option1 = document.createElement('option');
        let option2 = document.createElement('option');
        option1.value = currency;
        option1.textContent = currency;
        option2.value = currency;
        option2.textContent = currency;
        fromCurrency.appendChild(option1);
        toCurrency.appendChild(option2);
    });
}

function convertCurrency() {
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!amount || amount <= 0) {
        Swal.fire('Error', 'Ingrese una cantidad válida', 'error');
        return;
    }

    const result = (amount / rates[from]) * rates[to];
    document.getElementById('result').textContent = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
}

document.getElementById('convertBtn').addEventListener('click', convertCurrency);

fetchRates();