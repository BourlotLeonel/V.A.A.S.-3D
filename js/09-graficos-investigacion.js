/**
 * 09-graficos-investigacion.js
 * Sincronización en tiempo real con el motor V.A.A.S. 3D,
 * previsualización 3D en vivo y generación de gráficos de investigación.
 */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);

  // Factores EPA (kg CO2 por litro de combustible: Nafta = 2.348, Diésel = 2.689)
  const EPA_FACTORS = {
    auto: 8.887 / 3.785411784,
    moto: 8.887 / 3.785411784,
    bus: 10.180 / 3.785411784,
    truck: 10.180 / 3.785411784
  };

  // Distribución modal urbana de referencia para desglose ambiental
  const FLEET_SHARES = {
    auto: 0.68,
    moto: 0.20,
    bus: 0.06,
    truck: 0.06
  };

  // Historial temporal de la sesión
  let history = [];
  let cumulativeStopVaas = 0;   // segundos-vehículo detenidos acumulados (Con V.A.A.S.)
  let cumulativeStopFixed = 0;  // segundos-vehículo detenidos acumulados (Sin V.A.A.S.)
  let lastSampleTimestamp = performance.now();
  let elapsedSimSeconds = 0;

  // ==================== 1. CAMBIO DE PESTAÑAS (HEADER) ====================
  const tab3d = $('tab-3d');
  const tab2d = $('tab-2d');
  const view2d = $('view-2d');
  const btnGo3d = $('btn-go-3d');

  function setView(mode) {
    const is2D = mode === '2d';
    view2d.classList.toggle('active', is2D);
    tab2d.classList.toggle('active', is2D);
    tab3d.classList.toggle('active', !is2D);
    window.dispatchEvent(new Event('resize'));
  }

  tab3d.addEventListener('click', () => setView('3d'));
  tab2d.addEventListener('click', () => setView('2d'));
  if (btnGo3d) btnGo3d.addEventListener('click', () => setView('3d'));

  // Atajo de teclado: Tecla 'Tab' o 'G' para alternar rápido durante la exposición
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.key === 'g' || e.key === 'G') {
      setView(view2d.classList.contains('active') ? '3d' : '2d');
    }
  });

  // ==================== 2. ESPEJO EN VIVO DEL CANVAS 3D ====================
  const canvas3d = $('c');
  const previewCanvas = $('preview-3d');
  const previewCtx = previewCanvas ? previewCanvas.getContext('2d') : null;

  function renderMiniPreview() {
    if (!previewCtx || !canvas3d || !view2d.classList.contains('active')) return;
    try {
      previewCtx.drawImage(canvas3d, 0, 0, previewCanvas.width, previewCanvas.height);
    } catch (_) {
      // Ignorar si el contexto WebGL aún no inicializó
    }
  }

  // ==================== 3. LECTURA DE TELEMETRÍA DEL MOTOR 3D ====================
  function parseNum(str) {
    if (!str) return 0;
    const clean = String(str).replace(/\./g, '').replace(',', '.').match(/-?\d+(\.\d+)?/);
    return clean ? parseFloat(clean[0]) : 0;
  }

  function extractTelemetryFromDOM() {
    const tb = $('tb');
    const cardsContainer = $('cards');
    const clockEl = $('clock');
    const m1El = $('m1');
    const rngEl = $('rng');

    // Sincronizar badges del Header
    if (clockEl && $('header-clock')) {
      $('header-clock').textContent = clockEl.textContent.trim();
    }
    if (m1El && $('header-mode-badge')) {
      const isVaasOn = m1El.classList.contains('on');
      $('header-mode-badge').textContent = isVaasOn ? '3D: Con V.A.A.S.' : '3D: Fijo 30 s';
    }
    if (rngEl && $('chart-range-badge')) {
      $('chart-range-badge').textContent = 'Alcance: ' + rngEl.value + ' m';
    }

    // Valores por defecto
    let waitVaas = 0, waitFixed = 0;
    let queueVaas = 0, queueFixed = 0;
    let servedVaas = 0, servedFixed = 0;
    let rawRows = [];

    if (tb) {
      const trs = Array.from(tb.querySelectorAll('tr'));
      let vaasCol = 1;
      let fixedCol = 2;

      // Detectar orden de columnas en el encabezado de #tb
      const ths = tb.querySelectorAll('th');
      if (ths.length >= 3) {
        const h1 = ths[1].textContent.toLowerCase();
        const h2 = ths[2].textContent.toLowerCase();
        if ((h1.includes('sin') || h1.includes('fijo')) && !h2.includes('sin')) {
          vaasCol = 2;
          fixedCol = 1;
        }
      }

      trs.forEach((tr) => {
        const tds = tr.querySelectorAll('td');
        if (tds.length >= 3) {
          const label = tds[0].textContent.trim();
          const lLow = label.toLowerCase();
          const vVaas = parseNum(tds[vaasCol].textContent);
          const vFixed = parseNum(tds[fixedCol].textContent);
          rawRows.push({ label, vVaas, vFixed });

          if (/espera|detenci|demora|tiempo|delay/.test(lLow) && !/total|acum/.test(lLow)) {
            waitVaas = vVaas;
            waitFixed = vFixed;
          } else if (/cola|fila|detenid|esperando/.test(lLow) && !/máx|max/.test(lLow)) {
            queueVaas = vVaas;
            queueFixed = vFixed;
          } else if (/cruzaron|salieron|atendidos|completaron|vehículos|vehiculos|pasaron/.test(lLow)) {
            servedVaas = vVaas;
            servedFixed = vFixed;
          }
        }
      });

      // Fallback posicional si las etiquetas tienen otros nombres
      if (waitVaas === 0 && waitFixed === 0 && rawRows.length >= 2) {
        waitVaas = rawRows[1].vVaas;
        waitFixed = rawRows[1].vFixed;
      }
      if (queueVaas === 0 && queueFixed === 0 && rawRows.length >= 3) {
        queueVaas = rawRows[2].vVaas;
        queueFixed = rawRows[2].vFixed;
      }
    }

    // Extraer datos por acceso desde #cards
    const approaches = [];
    if (cardsContainer) {
      const cardEls = cardsContainer.querySelectorAll('.card');
      cardEls.forEach((c, idx) => {
        const name = c.querySelector('b') ? c.querySelector('b').textContent.trim() : `Acceso ${idx + 1}`;
        const smallText = c.querySelector('small') ? c.querySelector('small').textContent.trim() : '';
        const dotEl = c.querySelector('.dot');
        const color = dotEl ? (dotEl.style.backgroundColor || dotEl.style.background || '#555') : '#555';
        const nums = smallText.match(/\d+(\.\d+)?/g) || [];
        const count = nums.length > 0 ? parseFloat(nums[0]) : 0;
        approaches.push({ name, smallText, color, count });
      });
    }

    // Si la cola en #tb no está explícita, sumar la detección actual de los accesos
    if (queueVaas === 0 && approaches.length > 0) {
      queueVaas = approaches.reduce((acc, a) => acc + a.count, 0);
    }

    return {
      clock: clockEl ? clockEl.textContent.trim() : '00:00',
      waitVaas,
      waitFixed,
      queueVaas,
      queueFixed,
      servedVaas,
      servedFixed,
      approaches,
      rawRows
    };
  }

  // ==================== 4. CÁLCULO AMBIENTAL (EPA CO2 Y COMBUSTIBLE) ====================
  function getEmissionsParams() {
    return {
      auto: Math.max(0, parseFloat($('em-auto')?.value) || 0.8),
      moto: Math.max(0, parseFloat($('em-moto')?.value) || 0.25),
      bus: Math.max(0, parseFloat($('em-bus')?.value) || 2.5),
      truck: Math.max(0, parseFloat($('em-truck')?.value) || 3.0),
      engineOn: Math.min(100, Math.max(0, parseFloat($('em-engine-on')?.value) || 100)) / 100
    };
  }

  function computeEnvironmentalImpact(totalStoppedSecondsVaas, totalStoppedSecondsFixed) {
    const p = getEmissionsParams();
    const classes = ['auto', 'moto', 'bus', 'truck'];
    const labels = { auto: 'Autos', moto: 'Motos', bus: 'Colectivos', truck: 'Camiones' };

    let litresVaas = 0, kgVaas = 0;
    let litresFixed = 0, kgFixed = 0;
    const byClass = [];

    classes.forEach((cls) => {
      const share = FLEET_SHARES[cls];
      const hoursVaas = (totalStoppedSecondsVaas * share) / 3600;
      const hoursFixed = (totalStoppedSecondsFixed * share) / 3600;

      const lV = hoursVaas * p.auto * (cls === 'auto' ? 1 : 0)
               + hoursVaas * p.moto * (cls === 'moto' ? 1 : 0)
               + hoursVaas * p.bus * (cls === 'bus' ? 1 : 0)
               + hoursVaas * p.truck * (cls === 'truck' ? 1 : 0);
      const lF = hoursFixed * p.auto * (cls === 'auto' ? 1 : 0)
               + hoursFixed * p.moto * (cls === 'moto' ? 1 : 0)
               + hoursFixed * p.bus * (cls === 'bus' ? 1 : 0)
               + hoursFixed * p.truck * (cls === 'truck' ? 1 : 0);

      const adjLV = lV * p.engineOn;
      const adjLF = lF * p.engineOn;
      const kV = adjLV * EPA_FACTORS[cls];
      const kF = adjLF * EPA_FACTORS[cls];

      litresVaas += adjLV;
      litresFixed += adjLF;
      kgVaas += kV;
      kgFixed += kF;

      byClass.push({
        key: cls,
        name: labels[cls],
        kgVaas: kV,
        kgFixed: kF
      });
    });

    return { litresVaas, kgVaas, litresFixed, kgFixed, byClass };
  }

  // ==================== 5. GENERADORES SVG DE GRÁFICOS ====================
  function fmt(num, dec = 1) {
    return Number(num || 0).toLocaleString('es-AR', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec
    });
  }

  function buildLineChartSVG(data, keyVaas, keyFixed, unitLabel) {
    const w = 540, h = 190, padL = 44, padR = 16, padT = 18, padB = 28;
    const pw = w - padL - padR;
    const ph = h - padT - padB;

    const pts = data.length > 1 ? data : [
      { t: 0, [keyVaas]: 0, [keyFixed]: 0 },
      { t: 1, [keyVaas]: 0, [keyFixed]: 0 }
    ];

    const maxVal = Math.max(5, ...pts.flatMap((d) => [d[keyVaas] || 0, d[keyFixed] || 0])) * 1.12;
    const xCoord = (i) => (padL + (i / (pts.length - 1)) * pw).toFixed(1);
    const yCoord = (v) => (padT + ph - (Math.min(v, maxVal) / maxVal) * ph).toFixed(1);

    const pathVaas = pts.map((d, i) => `${i ? 'L' : 'M'}${xCoord(i)},${yCoord(d[keyVaas] || 0)}`).join(' ');
    const pathFixed = pts.map((d, i) => `${i ? 'L' : 'M'}${xCoord(i)},${yCoord(d[keyFixed] || 0)}`).join(' ');
    const areaVaas = `${pathVaas} L${xCoord(pts.length - 1)},${padT + ph} L${padL},${padT + ph} Z`;

    const grids = [0, 0.5, 1].map((f) => {
      const y = (padT + ph - f * ph).toFixed(1);
      const val = fmt(maxVal * f, maxVal < 10 ? 1 : 0);
      return `<line x1="${padL}" x2="${w - padR}" y1="${y}" y2="${y}" stroke="#1e293b" stroke-dasharray="3 3"/>
              <text x="${padL - 6}" y="${Number(y) + 4}" text-anchor="end" fill="#7c8b9e" font-size="10">${val}</text>`;
    }).join('');

    const firstClock = pts[0].clock || 'Inicio';
    const midClock = pts[Math.floor(pts.length / 2)].clock || '';
    const lastClock = pts[pts.length - 1].clock || 'Ahora';

    return `
      <svg viewBox="0 0 ${w} ${h}" role="img">
        <defs>
          <linearGradient id="grad-${keyVaas}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#4cc9f0" stop-opacity="0.28"/>
            <stop offset="100%" stop-color="#4cc9f0" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        ${grids}
        <text x="${padL}" y="12" fill="#93a0b2" font-size="10">${unitLabel}</text>
        <path d="${areaVaas}" fill="url(#grad-${keyVaas})"/>
        <path d="${pathFixed}" fill="none" stroke="#ff6b81" stroke-width="2.2" stroke-dasharray="5 3"/>
        <path d="${pathVaas}" fill="none" stroke="#4cc9f0" stroke-width="2.5"/>
        <text x="${padL}" y="${h - 6}" fill="#7c8b9e" font-size="10">${firstClock}</text>
        <text x="${padL + pw / 2}" y="${h - 6}" text-anchor="middle" fill="#7c8b9e" font-size="10">${midClock}</text>
        <text x="${w - padR}" y="${h - 6}" text-anchor="end" fill="#7c8b9e" font-size="10">${lastClock}</text>
      </svg>`;
  }

  function buildCO2ChartSVG(env) {
    const w = 540, h = 190;
    const maxTotal = Math.max(0.01, env.kgVaas, env.kgFixed) * 1.15;
    const barMaxW = 290;

    const wVaas = ((env.kgVaas / maxTotal) * barMaxW).toFixed(1);
    const wFixed = ((env.kgFixed / maxTotal) * barMaxW).toFixed(1);

    // Mini barras por clase vehicular
    const maxClass = Math.max(0.005, ...env.byClass.flatMap((c) => [c.kgVaas, c.kgFixed]));
    const classBars = env.byClass.map((c, idx) => {
      const yBase = 112 + idx * 18;
      const cwV = ((c.kgVaas / maxClass) * 160).toFixed(1);
      const cwF = ((c.kgFixed / maxClass) * 160).toFixed(1);
      return `
        <text x="16" y="${yBase + 9}" fill="#93a0b2" font-size="10.5">${c.name}</text>
        <rect x="95" y="${yBase}" width="${cwV}" height="5" rx="2" fill="#4cc9f0"/>
        <rect x="95" y="${yBase + 6}" width="${cwF}" height="5" rx="2" fill="#ff6b81"/>
        <text x="265" y="${yBase + 9}" fill="#cbd5e1" font-size="10">${fmt(c.kgVaas, 3)} vs ${fmt(c.kgFixed, 3)} kg</text>
      `;
    }).join('');

    return `
      <svg viewBox="0 0 ${w} ${h}" role="img">
        <text x="16" y="22" fill="#93a0b2" font-size="11" font-weight="600">CO₂ Total Acumulado (Muestra Simultánea)</text>

        <text x="16" y="48" fill="#e8edf3" font-size="11.5">Con V.A.A.S.</text>
        <rect x="110" y="35" width="${barMaxW}" height="18" rx="4" fill="#162030"/>
        <rect x="110" y="35" width="${wVaas}" height="18" rx="4" fill="#4cc9f0"/>
        <text x="410" y="48" fill="#4cc9f0" font-weight="700" font-size="11.5">${fmt(env.kgVaas, 3)} kg (${fmt(env.litresVaas, 2)} L)</text>

        <text x="16" y="74" fill="#e8edf3" font-size="11.5">Sin V.A.A.S.</text>
        <rect x="110" y="61" width="${barMaxW}" height="18" rx="4" fill="#162030"/>
        <rect x="110" y="61" width="${wFixed}" height="18" rx="4" fill="#ff6b81"/>
        <text x="410" y="74" fill="#ff6b81" font-weight="700" font-size="11.5">${fmt(env.kgFixed, 3)} kg (${fmt(env.litresFixed, 2)} L)</text>

        <line x1="16" x2="524" y1="94" y2="94" stroke="#1e293b"/>
        <text x="16" y="106" fill="#7c8b9e" font-size="10">Desglose por clase vehicular (Azul: Con V.A.A.S. · Rojo: Fijo 30 s)</text>
        ${classBars}
      </svg>`;
  }

  function buildApproachesChartSVG(approaches) {
    const w = 540, h = 190;
    const list = approaches.length ? approaches : [
      { name: 'San Lorenzo Oeste', count: 0, color: '#2ed573', smallText: '0 veh' },
      { name: 'San Lorenzo Este', count: 0, color: '#ff4757', smallText: '0 veh' },
      { name: 'Próspero Bovino', count: 0, color: '#ff4757', smallText: '0 veh' },
      { name: '25 de Mayo', count: 0, color: '#ff4757', smallText: '0 veh' }
    ];

    const maxCount = Math.max(8, ...list.map((a) => a.count));
    const barW = 240;

    const rows = list.slice(0, 4).map((a, i) => {
      const y = 26 + i * 38;
      const bw = ((a.count / maxCount) * barW).toFixed(1);
      return `
        <circle cx="22" cy="${y + 9}" r="6" fill="${a.color}"/>
        <text x="36" y="${y + 13}" fill="#e8edf3" font-size="11.5" font-weight="600">${a.name.slice(0, 22)}</text>
        <rect x="185" y="${y}" width="${barW}" height="18" rx="4" fill="#162030"/>
        <rect x="185" y="${y}" width="${bw}" height="18" rx="4" fill="#4cc9f0"/>
        <text x="435" y="${y + 13}" fill="#93a0b2" font-size="10.5">${a.smallText || (a.count + ' veh')}</text>
      `;
    }).join('');

    return `
      <svg viewBox="0 0 ${w} ${h}" role="img">
        <text x="16" y="15" fill="#7c8b9e" font-size="10">Estado de semáforo (LED) y carga vehicular detectada por cámara</text>
        ${rows}
      </svg>`;
  }

  // ==================== 6. BUCLE DE ACTUALIZACIÓN Y EXPORTACIÓN CSV ====================
  function updateResearchDashboard() {
    const now = performance.now();
    const dtReal = Math.min(1, (now - lastSampleTimestamp) / 1000);
    lastSampleTimestamp = now;

    const spdSelect = $('spd');
    const simSpeed = spdSelect ? parseFloat(spdSelect.value) || 0 : 1;
    const dtSim = dtReal * simSpeed;
    elapsedSimSeconds += dtSim;

    const telemetry = extractTelemetryFromDOM();

    // Integrar segundos-vehículo detenidos (si la simulación no está en pausa)
    if (simSpeed > 0) {
      const baseServed = Math.max(1, telemetry.servedVaas, telemetry.servedFixed);
      const estStopVaas = telemetry.waitVaas > 0
        ? Math.max(cumulativeStopVaas, telemetry.waitVaas * baseServed)
        : cumulativeStopVaas + telemetry.queueVaas * dtSim;

      const estStopFixed = telemetry.waitFixed > 0
        ? Math.max(cumulativeStopFixed, telemetry.waitFixed * baseServed)
        : cumulativeStopFixed + Math.max(telemetry.queueFixed, telemetry.queueVaas * 1.35) * dtSim;

      cumulativeStopVaas = estStopVaas;
      cumulativeStopFixed = estStopFixed;

      history.push({
        t: Math.round(elapsedSimSeconds),
        clock: telemetry.clock,
        waitVaas: telemetry.waitVaas,
        waitFixed: telemetry.waitFixed,
        queueVaas: telemetry.queueVaas,
        queueFixed: telemetry.queueFixed
      });

      if (history.length > 160) history.shift();
    }

    const env = computeEnvironmentalImpact(cumulativeStopVaas, cumulativeStopFixed);

    // Actualizar KPIs superiores
    const waitSaved = telemetry.waitFixed - telemetry.waitVaas;
    const waitPct = telemetry.waitFixed > 0 ? (waitSaved / telemetry.waitFixed) * 100 : 0;
    const co2Saved = env.kgFixed - env.kgVaas;
    const co2Pct = env.kgFixed > 0 ? (co2Saved / env.kgFixed) * 100 : 0;
    const fuelSaved = env.litresFixed - env.litresVaas;
    const queueDiff = telemetry.queueFixed - telemetry.queueVaas;

    if ($('kpi-wait-saved')) {
      $('kpi-wait-saved').textContent = (waitSaved >= 0 ? '-' : '+') + fmt(Math.abs(waitSaved), 1) + ' s';
      $('kpi-wait-saved').className = 'kpi-value ' + (waitSaved >= 0 ? 'positive' : 'negative');
      $('kpi-wait-pct').textContent = fmt(Math.abs(waitPct), 1) + '% ' + (waitSaved >= 0 ? 'menos' : 'más') + ' detención media';
    }
    if ($('kpi-co2-saved')) {
      $('kpi-co2-saved').textContent = fmt(Math.max(0, co2Saved), 3) + ' kg';
      $('kpi-co2-pct').textContent = fmt(Math.max(0, co2Pct), 1) + '% de reducción de CO₂ en ralentí';
    }
    if ($('kpi-fuel-saved')) {
      $('kpi-fuel-saved').textContent = fmt(Math.max(0, fuelSaved), 3) + ' L';
    }
    if ($('kpi-queue-diff')) {
      $('kpi-queue-diff').textContent = (queueDiff >= 0 ? '-' : '+') + fmt(Math.abs(queueDiff), 0) + ' veh en cola';
      const dbReduction = Math.min(6.5, Math.max(0, queueDiff * 0.45));
      $('kpi-noise-est').textContent = 'Mitigación acústica est.: -' + fmt(dbReduction, 1) + ' dB';
    }

    // Renderizar los 4 gráficos si la pestaña 2D está activa (o inicializarlos)
    if ($('chart-wait-time')) {
      $('chart-wait-time').innerHTML = buildLineChartSVG(history, 'waitVaas', 'waitFixed', 's / vehículo');
    }
    if ($('chart-queue-time')) {
      $('chart-queue-time').innerHTML = buildLineChartSVG(history, 'queueVaas', 'queueFixed', 'vehículos en cola');
    }
    if ($('chart-co2-bars')) {
      $('chart-co2-bars').innerHTML = buildCO2ChartSVG(env);
    }
    if ($('chart-approaches')) {
      $('chart-approaches').innerHTML = buildApproachesChartSVG(telemetry.approaches);
    }
  }

  // Botón Reiniciar historial gráfico
  if ($('btn-reset-charts')) {
    $('btn-reset-charts').addEventListener('click', () => {
      history = [];
      cumulativeStopVaas = 0;
      cumulativeStopFixed = 0;
      elapsedSimSeconds = 0;
      updateResearchDashboard();
    });
  }

  // Botón Exportar CSV
  if ($('btn-export-csv')) {
    $('btn-export-csv').addEventListener('click', () => {
      const env = computeEnvironmentalImpact(cumulativeStopVaas, cumulativeStopFixed);
      const rows = [
        ['Proyecto', 'V.A.A.S. - Vision Artificial Aplicada a Semaforos (UNER FCAL)'],
        ['Cruce Piloto', 'Av. San Lorenzo / Prospero Bovino / 25 de Mayo'],
        [],
        ['Indicador Ambiental Acumulado', 'Con V.A.A.S. (Adaptativo)', 'Sin V.A.A.S. (30 s fijo)', 'Ahorro / Diferencia'],
        ['CO2 estimado en espera (kg)', env.kgVaas.toFixed(4), env.kgFixed.toFixed(4), (env.kgFixed - env.kgVaas).toFixed(4)],
        ['Combustible en ralenti (Litros)', env.litresVaas.toFixed(4), env.litresFixed.toFixed(4), (env.litresFixed - env.litresVaas).toFixed(4)],
        [],
        ['Tiempo Simulado (s)', 'Hora Reloj', 'Espera Media V.A.A.S. (s)', 'Espera Media Fijo (s)', 'Cola V.A.A.S. (veh)', 'Cola Fijo (veh)'],
        ...history.map((h) => [h.t, h.clock, h.waitVaas, h.waitFixed, h.queueVaas, h.queueFixed])
      ];

      const csvContent = '\ufeff' + rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';')).join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'VAAS-3D-informe-investigacion.csv';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  // Escuchar cambios en los inputs de supuestos ambientales
  ['em-auto', 'em-moto', 'em-bus', 'em-truck', 'em-engine-on'].forEach((id) => {
    const el = $(id);
    if (el) el.addEventListener('input', updateResearchDashboard);
  });

  // Bucle de sincronización continua
  function syncLoop() {
    renderMiniPreview();
    requestAnimationFrame(syncLoop);
  }

  window.iniciarPanelVAAS=()=>{setInterval(updateResearchDashboard,600);requestAnimationFrame(syncLoop)};
  if(!window.vaasInicio)window.iniciarPanelVAAS();
})();