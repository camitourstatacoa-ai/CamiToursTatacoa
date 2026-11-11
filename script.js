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

/* ===== Más planes y servicios =====
   Cada plan es una fila de datos. Para cambiar un precio o un horario,
   edita solo este arreglo: las tarjetas y el mensaje de WhatsApp se arman solos.
   sitio = lo que se paga en el sitio, por persona (nunca se suma a la reserva).
   Un tercer valor "true" marca algo opcional. */
const PLANES = [
  {
    id: "xilopalos", grupo: "recorridos",
    titulo: "Sendero Valle de los Xilópalos",
    resumen: "4,9 km a pie, de 2 a 3 horas en el sendero. Duración total: 4 horas (ida y vuelta desde Villavieja).",
    detalle: "Caminata para ver mochuelos, madera fosilizada y 3 paleocanales de arena compacta. El punto fuerte es el “Estrecho de la Señorita”, un cañón de 600 metros de largo y 7 metros de altura.",
    opciones: [
      { nombre: "Solo acompañamiento (guianza)", nota: "Grupo de 1 a 5 personas, tarifa plana", precio: 120000 },
      { nombre: "Transporte + acompañamiento", nota: "1 persona", precio: 150000 },
      { nombre: "Transporte + acompañamiento", nota: "2 personas", precio: 180000 }
    ],
    sitio: [["Ingreso al sendero (propiedad privada)", 3000]]
  },
  {
    id: "museo", grupo: "recorridos",
    titulo: "Excursión: transporte al Museo Paleontológico",
    resumen: "A 18 km de Villavieja, unos 50 minutos de viaje.",
    detalle: "Traslado al museo, reconocido como el n.º 1 de Latinoamérica en su categoría. Incluye transporte de ida, tiempo de espera durante el recorrido (1 hora y 20 minutos) y retorno a Villavieja.",
    opciones: [{ nombre: "Transporte de ida, espera y retorno", nota: "1 o 2 personas", precio: 150000 }],
    sitio: [["Entrada al museo", 20000]]
  },
  {
    id: "express", grupo: "transporte",
    titulo: "Opción 1: Tour Clásico Express",
    resumen: "Recorrido continuo de 4 horas, sin guía.",
    opciones: [{ nombre: "Solo transporte", nota: "1 o 2 personas", precio: 120000 }],
    notaSitio: "Las entradas no están incluidas y se pagan en cada sitio que visites."
  },
  {
    id: "pasadia", grupo: "transporte",
    titulo: "Opción 2: Pasadía completo (doble jornada)",
    resumen: "Dos salidas el mismo día, sin guía.",
    horario: [
      { titulo: "Mañana", pasos: [
        ["8:00 AM", "Salida y caminata en el Valle de los Xilópalos"],
        ["11:00 AM", "Desierto Gris"],
        ["", "30 minutos opcionales de piscina"],
        ["12:10 PM", "Retorno a Villavieja"] ] },
      { titulo: "Tarde y noche", pasos: [
        ["4:00 PM", "Salida al Desierto Rojo (caminata de 1 h 30 min)"],
        ["5:40 PM", "Atardecer"],
        ["7:00 PM", "Observatorio"],
        ["8:20 PM", "Retorno a Villavieja"] ] }
    ],
    opciones: [
      { nombre: "Solo transporte", nota: "1 persona", precio: 170000 },
      { nombre: "Solo transporte", nota: "2 personas", precio: 190000 }
    ],
    sitio: [
      ["Ingreso al sendero Xilópalos", 3000],
      ["Ingreso al Desierto Gris", 3000],
      ["Piscina", 10000, true],
      ["Desierto Rojo (espacio estatal)", 0],
      ["Entrada al observatorio", 10000]
    ]
  },
  {
    id: "tarde", grupo: "transporte",
    titulo: "Opción 3: Tarde y estrellas",
    resumen: "Desiertos, atardecer y observatorio, sin guía.",
    horario: [
      { titulo: "Tarde y noche", pasos: [
        ["2:00 PM", "Salida al Desierto Gris"],
        ["3:45 PM", "Traslado al Desierto Rojo"],
        ["5:40 PM", "Atardecer"],
        ["7:00 PM", "Observatorio"],
        ["8:20 PM", "Retorno a Villavieja"] ] }
    ],
    opciones: [
      { nombre: "Solo transporte", nota: "1 persona", precio: 140000 },
      { nombre: "Solo transporte", nota: "2 personas", precio: 160000 }
    ],
    sitio: [
      ["Ingreso al Desierto Gris", 3000],
      ["Desierto Rojo (espacio estatal)", 0],
      ["Entrada al observatorio", 10000]
    ]
  }
];

function mensajePlan(p, o) {
  const l = ["Hola Cami Tours Tatacoa, quiero reservar:", "", `*${p.titulo}*`, `${o.nombre} (${o.nota})`, `Valor: ${pesos(o.precio)}`];
  if (p.sitio) {
    l.push("", "Se pagan en el sitio (no incluido en la reserva), por persona:");
    p.sitio.forEach(([t, v, opc]) => l.push(`- ${t}${opc ? " (opcional)" : ""}: ${pesos(v)}`));
  } else if (p.notaSitio) {
    l.push("", p.notaSitio);
  }
  l.push("", "¿Tienen disponibilidad? Me gustaría ir el día: ");
  return l.join("\n");
}

function cajaSitio(p) {
  if (!p.sitio) return p.notaSitio ? `<div class="sitio"><p>Se pagan en el sitio</p>${p.notaSitio}</div>` : "";
  const total = p.sitio.filter(x => !x[2]).reduce((s, x) => s + x[1], 0);
  const hayOpcional = p.sitio.some(x => x[2]);
  const filas = p.sitio.map(([t, v, opc]) => `<div class="l"><span>${t}${opc ? " (opcional)" : ""}</span><b>${pesos(v)}</b></div>`).join("");
  const suma = p.sitio.length > 1 ? `<div class="l tot"><span>Total en el sitio${hayOpcional ? " (sin opcionales)" : ""}</span><b>${pesos(total)}</b></div>` : "";
  return `<div class="sitio"><p>Se pagan en el sitio, por persona (no incluido en la reserva)</p>${filas}${suma}</div>`;
}

function filaOpcion(p, o) {
  return `<div class="opcion"><div class="t"><b>${o.nombre}</b><span>${o.nota}</span></div>` +
    `<div class="der"><span class="precio">${pesos(o.precio)}</span>` +
    `<a class="btn chico" href="${enlace(mensajePlan(p, o))}" target="_blank" rel="noopener">Reservar por WhatsApp</a></div></div>`;
}

function tarjetaPlan(p) {
  const horario = p.horario
    ? `<ol class="horario">${p.horario.map(b => `<li class="bloque">${b.titulo}</li>` + b.pasos.map(([h, t]) => `<li><b>${h}</b><span>${t}</span></li>`).join("")).join("")}</ol>`
    : "";
  return `<article class="plan plan-${p.id}"><h4>${p.titulo}</h4><div class="meta">${p.resumen}</div>` +
    (p.detalle ? `<p>${p.detalle}</p>` : "") + horario + cajaSitio(p) +
    `<div class="opciones">${p.opciones.map(o => filaOpcion(p, o)).join("")}</div></article>`;
}

$("listaRecorridos").innerHTML = PLANES.filter(p => p.grupo === "recorridos").map(tarjetaPlan).join("");
$("listaTransporte").innerHTML = PLANES.filter(p => p.grupo === "transporte").map(tarjetaPlan).join("");
$("amanecerBtn").href = enlace("Hola Cami Tours Tatacoa, quiero agregar la experiencia del amanecer a mi plan. ¿Qué opciones tienen?");
