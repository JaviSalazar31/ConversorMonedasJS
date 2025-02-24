// Inicialización de variables
let rates = {};
let conversionHistory = [];
let conversionCount = 0; // Contador de conversiones

// API de ExchangeRate
const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

// Obtener tasas de cambio
async function fetchRates() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Error al obtener datos: ${response.status}`);

        const data = await response.json();
        rates = data.rates;
        populateSelects();
        showLastUpdate(data.time_last_updated);
        initializeSelect2();
    } catch (error) {
        console.error('Error al obtener tasas de cambio:', error);
        Swal.fire('Error', 'No se pudieron obtener las tasas de cambio en tiempo real.', 'error');
    }
}

// Llenar los selectores de monedas
function populateSelects() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');

    fromCurrency.innerHTML = '';
    toCurrency.innerHTML = '';

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

    fromCurrency.value = 'USD';
    toCurrency.value = 'EUR';
}

// Convertir moneda
function convertCurrency() {
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const loader = document.getElementById('loader');
    const result = document.getElementById('result');

    if (!amount || amount <= 0) {
        Swal.fire('Error', 'Ingrese una cantidad válida', 'error');
        return;
    }

    loader.classList.remove('hidden');
    result.textContent = '';

    setTimeout(() => {
        const converted = (amount / rates[from]) * rates[to];
        loader.classList.add('hidden');
        result.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
        addToHistory(amount, from, converted.toFixed(2), to);
        updateConversionCount();
    }, 1000);
}

// Historial de conversiones
function addToHistory(amount, from, converted, to) {
    const historyTableBody = document.querySelector('#history tbody');
    const timestamp = new Date().toLocaleString();

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${from}</td>
        <td>${to}</td>
        <td>${amount}</td>
        <td>${converted}</td>
        <td>${timestamp}</td>
    `;

    historyTableBody.prepend(row);

    // Mantener solo las últimas 5 conversiones
    while (historyTableBody.children.length > 5) {
        historyTableBody.removeChild(historyTableBody.lastChild);
    }
}

// Invertir monedas
function invertCurrencies() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');

    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    $('#fromCurrency').trigger('change');
    $('#toCurrency').trigger('change');
}

// Mostrar fecha de última actualización
function showLastUpdate(timestamp) {
    const lastUpdate = document.getElementById('lastUpdate');
    const updateDate = new Date(timestamp * 1000);
    lastUpdate.textContent = `Última actualización: ${updateDate.toLocaleString()}`;
}

// Actualizar contador de conversiones
function updateConversionCount() {
    conversionCount++;
    const counterElement = document.getElementById('conversionCount');
    counterElement.textContent = `🔢 Total de conversiones: ${conversionCount}`;
}

// Modo Oscuro/Claro
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
});

// Pantalla de Bienvenida
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splashScreen').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    }, 2000);
});

// Botón Ir Arriba
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 300);
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Eventos Principales
document.getElementById('convertBtn').addEventListener('click', convertCurrency);
document.getElementById('invertBtn').addEventListener('click', invertCurrencies);

// Inicializar Select2
function initializeSelect2() {
    $('#fromCurrency').select2({ placeholder: 'Selecciona la divisa de origen', width: 'resolve' });
    $('#toCurrency').select2({ placeholder: 'Selecciona la divisa de destino', width: 'resolve' });
}

// Iniciar App
fetchRates();

// EmailJS - Envío de Formulario
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message) {
        Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
        return;
    }

    emailjs.send("service_z4i60ad", "template_wchvxk9", {
        from_name: name,
        from_email: email,
        message: message
    })
    .then(() => {
        Swal.fire('¡Enviado!', 'Tu mensaje fue enviado correctamente.', 'success');
        contactForm.reset();
    }, (error) => {
        Swal.fire('Error', 'Hubo un problema al enviar el mensaje.', 'error');
        console.error('EmailJS Error:', error);
    });
});




