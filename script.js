// Live Shipment Tracking Database
const parcelDatabase = {
  "IBX12345678": {
    status: "En Tránsito",
    location: "Hub Central - Madrid (Barajas)",
    origin: "Madrid, España",
    destination: "Barcelona, España",
    estimatedDelivery: "11 de Agosto, 2026",
    history: [
      "09 de Agosto - 10:00 AM: Paquete recibido en almacén (Avenida Central 13, Madrid)",
      "09 de Agosto - 02:30 PM: Clasificado en Hub Central Barajas",
      "09 de Agosto - 04:00 PM: En tránsito hacia destino final"
    ]
  },
  "IBX87654321": {
    status: "Entregado",
    location: "Dirección de Destino",
    origin: "Valencia, España",
    destination: "Sevilla, España",
    estimatedDelivery: "Entregado",
    history: [
      "08 de Agosto - 09:00 AM: En reparto",
      "08 de Agosto - 01:15 PM: Entregado y firmado"
    ]
  }
};

function trackParcel() {
  const input = document.getElementById("trackingInput").value.trim().toUpperCase();
  const resultDiv = document.getElementById("trackingResult");
  const detailsDiv = document.getElementById("trackingDetails");

  if (input === "") {
    resultDiv.innerHTML = "<p style='color: #ffdd57;'>Por favor, introduzca un número de seguimiento válido.</p>";
    detailsDiv.innerHTML = "";
    return;
  }

  const parcel = parcelDatabase[input];

  if (parcel) {
    resultDiv.innerHTML = `<p style='color: #a8ffb2; font-size: 20px;'>Estado: ${parcel.status}</p>`;
    
    let historyHTML = "<ul>";
    parcel.history.forEach(step => {
      historyHTML += `<li>${step}</li>`;
    });
    historyHTML += "</ul>";

    detailsDiv.innerHTML = `
      <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-top: 15px; text-align: left;">
        <p><strong>Origen:</strong> ${parcel.origin}</p>
        <p><strong>Destino:</strong> ${parcel.destination}</p>
        <p><strong>Ubicación Actual:</strong> ${parcel.location}</p>
        <p><strong>Entrega Estimada:</strong> ${parcel.estimatedDelivery}</p>
        <hr style="border-color: rgba(255,255,255,0.2);">
        <h4>Historial del Envío:</h4>
        ${historyHTML}
      </div>
    `;
  } else {
    resultDiv.innerHTML = "<p style='color: #ffadad;'>Número de seguimiento no encontrado. Verifique e intente de nuevo.</p>";
    detailsDiv.innerHTML = "";
  }
}

// Free Auto-Reply via EmailJS
emailjs.init("AMHxWY_omFP7i1RE3");

function sendRegistrationEmail(event) {
  event.preventDefault();

  const statusDiv = document.getElementById("registerStatus");
  statusDiv.textContent = "Procesando registro...";
  statusDiv.style.color = "#0d3b66";

  const templateParams = {
    fullname: document.getElementById("fullname").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    city: document.getElementById("city").value,
    country: document.getElementById("country").value
  };

  // Replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID with your actual EmailJS IDs
  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
    .then(function(response) {
       statusDiv.textContent = "¡Registro completado! Se ha enviado un recibo a su correo.";
       statusDiv.style.color = "green";
       document.getElementById("registerForm").reset();
    }, function(error) {
       statusDiv.textContent = "Error al enviar el registro. Intente nuevamente.";
       statusDiv.style.color = "red";
    });
}
