// Live Shipment Tracking Database
const parcelDatabase = {
  "IBX12345678": {
    status: "En Tránsito",
    statusCode: "transit",
    stepProgress: 2,
    origin: "Madrid, España",
    destination: "Barcelona, España",
    currentLocation: "Hub Central - Barajas, Madrid",
    estimatedDelivery: "11 de Agosto, 2026",
    history: [
      { time: "09 Ago - 04:00 PM", detail: "En tránsito en carretera A-2 dirección Barcelona" },
      { time: "09 Ago - 02:30 PM", detail: "Procesado y clasificado en Hub Barajas" },
      { time: "09 Ago - 10:00 AM", detail: "Paquete recibido en almacén central" }
    ]
  },
  "IBX87654321": {
    status: "Entregado",
    statusCode: "delivered",
    stepProgress: 3,
    origin: "Valencia, España",
    destination: "Sevilla, España",
    currentLocation: "Entregado al destinatario",
    estimatedDelivery: "08 de Agosto, 2026",
    history: [
      { time: "08 Ago - 01:15 PM", detail: "Entregado y firmado por el destinatario" },
      { time: "08 Ago - 09:00 AM", detail: "En reparto con mensajero local" }
    ]
  }
};

function trackParcel() {
  const input = document.getElementById("trackingInput").value.trim().toUpperCase();
  const resultDiv = document.getElementById("trackingResult");
  const detailsDiv = document.getElementById("trackingDetails");

  if (input === "") {
    resultDiv.innerHTML = "<p style='color: #ffdd57; margin-top: 10px;'>Por favor, introduzca un número de seguimiento.</p>";
    detailsDiv.innerHTML = "";
    return;
  }

  const parcel = parcelDatabase[input];

  if (parcel) {
    resultDiv.innerHTML = "";

    const isStep1 = parcel.stepProgress >= 1 ? "completed" : "";
    const isStep2 = parcel.stepProgress === 2 ? "active" : parcel.stepProgress > 2 ? "completed" : "";
    const isStep3 = parcel.stepProgress === 3 ? "completed active" : "";

    let historyHTML = "";
    parcel.history.forEach(item => {
      historyHTML += `
        <li class="timeline-item">
          <strong>${item.time}</strong><br>
          ${item.detail}
        </li>`;
    });

    detailsDiv.innerHTML = `
      <div class="tracking-card">
        <div class="route-header">
          <span>📍 ${parcel.origin} ➔ 🏁 ${parcel.destination}</span>
          <span class="status-badge status-${parcel.statusCode}">${parcel.status}</span>
        </div>

        <div class="tracking-progress">
          <div class="progress-step ${isStep1}">
            <div class="step-icon">✓</div>
            <small>Recibido</small>
          </div>
          <div class="progress-step ${isStep2}">
            <div class="step-icon">🚚</div>
            <small>En Camino</small>
          </div>
          <div class="progress-step ${isStep3}">
            <div class="step-icon">📦</div>
            <small>Entregado</small>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 4px 0;"><strong>Ubicación Actual:</strong> ${parcel.currentLocation}</p>
          <p style="margin: 4px 0;"><strong>Entrega Estimada:</strong> ${parcel.estimatedDelivery}</p>
        </div>

        <h4 style="margin-top: 15px; margin-bottom: 10px; color: #0d3b66;">Historial en Vivo:</h4>
        <ul class="timeline-list">
          ${historyHTML}
        </ul>
      </div>
    `;
  } else {
    resultDiv.innerHTML = "<p style='color: #ffadad; margin-top: 10px;'>Número de seguimiento no encontrado.</p>";
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

  emailjs.send("service_nz2yql6", "YOUR_TEMPLATE_ID", templateParams)
    .then(function(response) {
       statusDiv.textContent = "¡Registro completado! Se ha enviado un recibo a su correo.";
       statusDiv.style.color = "green";
       document.getElementById("registerForm").reset();
    }, function(error) {
       statusDiv.textContent = "Error al enviar el registro. Intente nuevamente.";
       statusDiv.style.color = "red";
    });
}
