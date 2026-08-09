const parcelDatabase = {
  "IBX12345678": "Estado: En Tránsito — Salida del hub de Madrid (Barajas)",
  "IBX87654321": "Estado: Entregado — Firmado en destino",
  "IBX99999999": "Estado: En Preparación — Oficinas de IberExpress Logistics"
};

function trackParcel() {
  const input = document.getElementById("trackingInput").value.trim().toUpperCase();
  const resultDiv = document.getElementById("trackingResult");

  if (input === "") {
    resultDiv.textContent = "Por favor, introduzca un número de seguimiento válido.";
    resultDiv.style.color = "#ffdd57";
    return;
  }

  if (parcelDatabase[input]) {
    resultDiv.textContent = parcelDatabase[input];
    resultDiv.style.color = "#a8ffb2";
  } else {
    resultDiv.textContent = "Número de seguimiento no encontrado. Verifique e intente de nuevo.";
    resultDiv.style.color = "#ffadad";
  }
}
