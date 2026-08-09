emailjs.init("AMHxWY_omFP7i1RE3");

// Default pre-existing database
const defaultParcels = {
  "IBX12345678": {
    status: "En Tránsito",
    statusCode: "transit",
    stepProgress: 2,
    origin: "Madrid, España",
    destination: "Barcelona, España",
    currentLocation: "Hub Central - Barajas, Madrid",
    estimatedDelivery: "11 de Agosto, 2026",
    desc: "Documentos de Empresa",
    history: [
      { time: "09 Ago - 04:00 PM", detail: "En tránsito en carretera A-2 dirección Barcelona" },
      { time: "09 Ago - 02:30 PM", detail: "Procesado y clasificado en Hub Barajas" }
    ]
  }
};

// Retrieve packages from browser storage
function getParcelDatabase() {
  const stored = localStorage.getItem("customParcels");
  if (stored) {
    return { ...defaultParcels, ...JSON.parse(stored) };
  }
  return defaultParcels;
}

// Generate unique tracking code (IBX + 8 Random Numbers)
function generateTrackingCode() {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return "IBX" + randomNum;
}

function trackParcel() {
  const input = document.getElementById("trackingInput").value.trim().toUpperCase();
  const resultDiv = document.getElementById("trackingResult");
  const detailsDiv = document.getElementById("trackingDetails");
  const db = getParcelDatabase();

  if (input === "") {
    resultDiv.innerHTML = "<p style='color: #ffdd57; margin-top: 10px;'>Por favor, introduzca un número de seguimiento.</p>";
    detailsDiv.innerHTML = "";
    return;
  }

  const parcel = db[input];

  if (parcel) {
    resultDiv.innerHTML = "";

    const isStep1 = parcel.stepProgress >= 1 ? "completed active" : "";
    const isStep2 = parcel.stepProgress === 2 ? "active" : parcel.stepProgress > 2 ? "completed" : "";
    const isStep3 = parcel.stepProgress === 3 ? "completed active" : "";

    let historyHTML = "";
    if (parcel.history && parcel.history.length > 0) {
      parcel.history.forEach(item => {
        historyHTML += `<li class="timeline-item"><strong>${item.time}</strong><br>${item.detail}</li>`;
      });
    } else {
      historyHTML = `<li class="timeline-item"><strong>Envío Registrado</strong><br>Paquete procesado e ingresado al sistema.</li>`;
    }

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
          <p style="margin: 4px 0;"><strong>Contenido:</strong> ${parcel.desc || 'Paquete General'}</p>
          <p style="margin: 4px 0;"><strong>Ubicación Actual:</strong> ${parcel.currentLocation}</p>
          <p style="margin: 4px 0;"><strong>Entrega Estimada:</strong> ${parcel.estimatedDelivery}</p>
        </div>

        <h4 style="margin-top: 15px; margin-bottom: 10px; color: #0d3b66;">Historial en Vivo:</h4>
        <ul class="timeline-list">${historyHTML}</ul>
      </div>
    `;
  } else {
    resultDiv.innerHTML = "<p style='color: #ffadad; margin-top: 10px;'>Número de seguimiento no encontrado en el sistema.</p>";
    detailsDiv.innerHTML = "";
  }
}

function sendRegistrationEmail(event) {
  event.preventDefault();

  const statusDiv = document.getElementById("registerStatus");
  statusDiv.textContent = "Generando código de envío y recibo...";
  statusDiv.style.color = "#0d3b66";

  const trackingCode = generateTrackingCode();
  const fullname = document.getElementById("fullname").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const origin = document.getElementById("origin").value;
  const destination = document.getElementById("destination").value;
  const packageDesc = document.getElementById("packageDesc").value;

  // Save dynamically generated tracking code into database
  const newParcel = {
    status: "Procesando en Almacén",
    statusCode: "transit",
    stepProgress: 1,
    origin: origin,
    destination: destination,
    currentLocation: "Almacén Central de Origen - " + origin,
    estimatedDelivery: "En 2 a 3 días hábiles",
    desc: packageDesc,
    history: [
      { time: "Hoy", detail: "Envío registrado y etiqueta generada." }
    ]
  };

  const currentStored = JSON.parse(localStorage.getItem("customParcels") || "{}");
  currentStored[trackingCode] = newParcel;
  localStorage.setItem("customParcels", JSON.stringify(currentStored));

  // EmailJS parameters
  const templateParams = {
    fullname: fullname,
    phone: phone,
    email: email,
    origin: origin,
    destination: destination,
    tracking_code: trackingCode,
    package_desc: packageDesc
  };

  emailjs.send("service_nz2yql6", "template_jrghilr", templateParams)
    .then(function() {
      statusDiv.textContent = "¡Registro Exitoso! Guarde su recibo a continuación.";
      statusDiv.style.color = "green";

      // Populate & Show Receipt Modal
      document.getElementById("rTrackingCode").textContent = trackingCode;
      document.getElementById("rName").textContent = fullname;
      document.getElementById("rEmail").textContent = email;
      document.getElementById("rPhone").textContent = phone;
      document.getElementById("rOrigin").textContent = origin;
      document.getElementById("rDestination").textContent = destination;
      document.getElementById("rDesc").textContent = packageDesc;

      document.getElementById("receiptModal").style.display = "block";
      document.getElementById("registerForm").reset();
    }, function(error) {
      statusDiv.textContent = "Error al enviar el recibo por correo. Mostrando recibo en pantalla...";
      statusDiv.style.color = "orange";
      
      // Still show receipt modal even if email delivery encounters an issue
      document.getElementById("rTrackingCode").textContent = trackingCode;
      document.getElementById("rName").textContent = fullname;
      document.getElementById("rEmail").textContent = email;
      document.getElementById("rPhone").textContent = phone;
      document.getElementById("rOrigin").textContent = origin;
      document.getElementById("rDestination").textContent = destination;
      document.getElementById("rDesc").textContent = packageDesc;

      document.getElementById("receiptModal").style.display = "block";
    });
}

function closeReceipt() {
  document.getElementById("receiptModal").style.display = "none";
}
