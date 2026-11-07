// Cambia este número por el del guía (código de país + número, sin + ni espacios)
const WHATSAPP = "573102782734";
const PRECIOS = {
  tuk: { 1: 160000, 2: 180000, 3: 220000 },
  guia: 120000,
  entradaObs: 10000,
  transObs: { 1: 60000, 2: 60000, 3: 70000 },
  gris: 3000,
  piscina: 10000
};
const $ = id => document.getElementById(id);
const pesos = n => "$" + n.toLocaleString("es-CO");
const enlace = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

function calcular() {
  const modo = $("modo").value, n = Number($("pers").value);
  const conObs = $("obs").checked;
  $("trans").disabled = !conObs;
  if (!conObs) $("trans").checked = false;
  const conTrans = $("trans").checked;
  const grande = n > 5, tukGrande = modo === "tuk" && n > 3;

  const reserva = [], sitio = [];
  let consulta = false, total = 0;
  const etiqueta = n > 5 ? "más de 5 personas" : `${n} ${n === 1 ? "persona" : "personas"}`;

  if (grande || tukGrande) consulta = true;
  else {
    const base = modo === "tuk" ? PRECIOS.tuk[n] : PRECIOS.guia;
    reserva.push([`Tour clásico (${modo === "tuk" ? "Tuk-Tuk" : "solo guianza"}, ${etiqueta})`, base]); total += base;
  }
  if (conObs) {
    const ent = PRECIOS.entradaObs * n;
    sitio.push([`Entrada al observatorio (${n} × ${pesos(PRECIOS.entradaObs)})`, ent]); total += ent;
    if (conTrans) {
      if (n > 3) consulta = true;
      else { reserva.push(["Transporte al observatorio", PRECIOS.transObs[n]]); total += PRECIOS.transObs[n]; }
    }
  }
  const gris = PRECIOS.gris * n, pis = PRECIOS.piscina * n;
  sitio.push([`Desierto Gris (${n} × ${pesos(PRECIOS.gris)})`, gris], [`Piscina (${n} × ${pesos(PRECIOS.piscina)})`, pis]);
  total += gris + pis;

  const fila = ([t, v]) => `<div class="l"><span>${t}</span><b>${pesos(v)}</b></div>`;
  let html = "";
  if (consulta) html += `<p class="aviso">Escríbenos y te cotizamos. Para este tamaño de grupo o servicio no hay tarifa fija; abajo ves lo que sí podemos calcular.</p>`;
  html += `<div class="g"><p>Reserva con el guía</p>${reserva.map(fila).join("") || "<div class=\"l\"><span>Por cotizar</span></div>"}</div>`;
  html += `<div class="g"><p>Se pagan en el sitio</p>${sitio.map(fila).join("")}</div>`;
  const suma = a => a.reduce((s, x) => s + x[1], 0);
  html += `<div class="l"><span>Pagas al guía (reserva)</span><b>${pesos(suma(reserva))}</b></div>`;
  html += `<div class="l"><span>Pagas en el sitio</span><b>${pesos(suma(sitio))}</b></div>`;
  html += `<div class="tot"><span>Total estimado</span><span>${pesos(total)}</span></div>`;
  $("detalle").innerHTML = html;

  const lineas = [consulta ? "Hola Cami Tours Tatacoa, quiero cotizar el tour clásico." : "Hola Cami Tours Tatacoa, quiero reservar el tour clásico.", "",
    `Modalidad: ${modo === "tuk" ? "con transporte en Tuk-Tuk" : "solo guianza (voy en mi vehículo)"}`,
    `Personas: ${etiqueta}`, `Horario: ${$("hora").value}`];
  if ($("fecha").value) lineas.push("Fecha: " + new Date($("fecha").value + "T12:00:00").toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" }));
  if (conObs) lineas.push("Observatorio: sí" + (conTrans ? ", con transporte" : ""));
  lineas.push(`Reserva con el guía: ${pesos(suma(reserva))}`, `Se paga en el sitio: ${pesos(suma(sitio))}`, `Total estimado: ${pesos(total)}${consulta ? " (parcial, falta cotizar)" : ""}`, "", consulta ? "¿Me pueden cotizar?" : "¿Tienen disponibilidad?");
  $("reservarBtn").textContent = consulta ? "Escríbenos y te cotizamos" : "Reservar por WhatsApp";
  $("reservarBtn").href = enlace(lineas.join("\n"));
}

["modo", "pers", "hora", "fecha", "obs", "trans"].forEach(id => $(id).addEventListener("input", calcular));
$("flotante").href = enlace("Hola Cami Tours Tatacoa, quiero información sobre los recorridos.");
calcular();
