import {
  defaultState,
  evaluatePlacement,
  fieldDefinitions,
  formatCurrent,
  formatFactor,
  formatPercent,
  loadZipTieVsClipPresets,
  runMonteCarlo,
} from "./model.mjs";

const state = structuredClone(defaultState);

const elements = {
  globalControls: document.querySelector("#globalControls"),
  geometryControls: document.querySelector("#geometryControls"),
  methodAControls: document.querySelector("#methodAControls"),
  methodBControls: document.querySelector("#methodBControls"),
  geometrySummary: document.querySelector("#geometrySummary"),
  geometryFactorBody: document.querySelector("#geometryFactorBody"),
  geometrySvg: document.querySelector("#geometrySvg"),
  comparisonBody: document.querySelector("#comparisonBody"),
  histogramCanvas: document.querySelector("#histogramCanvas"),
  cdfCanvas: document.querySelector("#cdfCanvas"),
  iqiValue: document.querySelector("#iqiValue"),
  iqiCaption: document.querySelector("#iqiCaption"),
  methodAName: document.querySelector("#methodAName"),
  methodBName: document.querySelector("#methodBName"),
  methodAHeader: document.querySelector("#methodAHeader"),
  methodBHeader: document.querySelector("#methodBHeader"),
  idealizeCase: document.querySelector("#idealizeCase"),
  presetZipTie: document.querySelector("#presetZipTie"),
  runSimulation: document.querySelector("#runSimulation"),
};

const metricRows = [
  { label: "Mean signed error", key: "meanError", formatter: (value) => formatPercent(value) },
  { label: "Mean absolute error", key: "meanAbsError", formatter: (value) => formatPercent(value) },
  { label: "Median absolute error", key: "medianAbsError", formatter: (value) => formatPercent(value) },
  { label: "P95 absolute error", key: "p95AbsError", formatter: (value) => formatPercent(value) },
  { label: "P99 absolute error", key: "p99AbsError", formatter: (value) => formatPercent(value) },
  { label: "Worst absolute error", key: "worstAbsError", formatter: (value) => formatPercent(value) },
  { label: "P(|error| < target)", key: "fractionUnderTarget", formatter: (value) => formatPercent(value * 100, 1) },
  { label: "Fraction above 0.5%", key: "fractionAboveHalfPct", formatter: (value) => formatPercent(value * 100, 1) },
  { label: "Fraction above 1.0%", key: "fractionAboveOnePct", formatter: (value) => formatPercent(value * 100, 1) },
  { label: "Fraction above 2.0%", key: "fractionAboveTwoPct", formatter: (value) => formatPercent(value * 100, 1) },
  { label: "Signed P05", key: "signedP05", formatter: (value) => formatPercent(value) },
  { label: "Signed P95", key: "signedP95", formatter: (value) => formatPercent(value) },
];

let latestSimulation = null;

function makeNumberControl({ key, label, step, min, max, hint }, value, onChange) {
  const wrapper = document.createElement("div");
  wrapper.className = "control";

  const title = document.createElement("label");
  title.textContent = label;

  const input = document.createElement("input");
  input.type = "number";
  input.step = `${step}`;
  input.min = `${min}`;
  input.max = `${max}`;
  input.value = `${value}`;
  input.addEventListener("input", () => {
    onChange(key, Number(input.value));
  });

  wrapper.append(title, input);
  if (hint) {
    const help = document.createElement("div");
    help.className = "hint";
    help.textContent = hint;
    wrapper.append(help);
  }
  return wrapper;
}

function makeSelectControl({ key, label, options, hint }, value, onChange) {
  const wrapper = document.createElement("div");
  wrapper.className = "control";

  const title = document.createElement("label");
  title.textContent = label;

  const select = document.createElement("select");
  options.forEach((option) => {
    const element = document.createElement("option");
    element.value = `${option.value}`;
    element.textContent = `${option.label} (${option.note})`;
    select.append(element);
  });
  select.value = `${value}`;
  select.addEventListener("change", () => {
    onChange(key, Number(select.value));
  });

  wrapper.append(title, select);
  if (hint) {
    const help = document.createElement("div");
    help.className = "hint";
    help.textContent = hint;
    wrapper.append(help);
  }
  return wrapper;
}

function populateControls(container, fields, source, onChange) {
  container.innerHTML = "";
  fields.forEach((field) => {
    if (field.type === "select") {
      container.append(makeSelectControl(field, source[field.key], onChange));
    } else {
      container.append(makeNumberControl(field, source[field.key], onChange));
    }
  });
}

function renderAllControls() {
  populateControls(elements.globalControls, fieldDefinitions.global, state.global, (key, value) => {
    state.global[key] = value;
    renderDeterministic();
  });
  populateControls(elements.geometryControls, fieldDefinitions.geometry, state.geometry, (key, value) => {
    state.geometry[key] = value;
    renderDeterministic();
  });
  populateControls(elements.methodAControls, fieldDefinitions.method, state.methods.a, (key, value) => {
    state.methods.a[key] = value;
  });
  populateControls(elements.methodBControls, fieldDefinitions.method, state.methods.b, (key, value) => {
    state.methods.b[key] = value;
  });
}

function renderDeterministic() {
  const result = evaluatePlacement(state.global, state.geometry);

  const statItems = [
    ["Measured current", formatCurrent(result.measuredCurrent)],
    ["Signed error", formatPercent(result.percentError)],
    ["Absolute error", formatPercent(Math.abs(result.percentError))],
    ["Normalized offset", formatFactor(result.offsetNorm, 3)],
  ];

  elements.geometrySummary.innerHTML = "";
  statItems.forEach(([label, value]) => {
    const card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML = `<div class="stat-label">${label}</div><div class="stat-value">${value}</div>`;
    elements.geometrySummary.append(card);
  });

  const factorRows = [
    ["F_offset", formatFactor(result.factors.offset), "Quadratic sensitivity to radial mis-centering."],
    ["F_tilt", formatFactor(result.factors.tilt), "Cosine-like response for non-perpendicular crossing."],
    ["F_shape", formatFactor(result.factors.shape), "Penalty from ovality using axis ratio b/a."],
    ["F_skew", formatFactor(result.factors.skew), "Penalty from axial skew away from the intended section."],
    ["F_neighbors", formatFactor(result.factors.neighbors), "Simple first-order coupling from adjacent phases."],
    ["Total response", formatFactor(result.responseFactor), "Product of the fitted geometry factors."],
  ];

  elements.geometryFactorBody.innerHTML = factorRows
    .map(
      ([name, value, notes]) =>
        `<tr><td><span class="pill">${name}</span></td><td>${value}</td><td>${notes}</td></tr>`,
    )
    .join("");

  renderGeometrySvg();

  if (latestSimulation) {
    updateIqi(latestSimulation);
  }
}

function renderGeometrySvg() {
  const svg = elements.geometrySvg;
  const width = 320;
  const height = 320;
  const centerX = width / 2;
  const centerY = height / 2;
  const loopRadius = 106;
  const rx = loopRadius;
  const ry = loopRadius * state.geometry.axisRatio;
  const conductorRadius = Math.max((state.global.conductorOdMm / (2 * state.global.loopRadiusMm)) * loopRadius, 8);
  const conductorX = centerX + state.geometry.offsetXNorm * loopRadius;
  const conductorY = centerY + state.geometry.offsetYNorm * loopRadius;

  svg.innerHTML = `
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(36,90,67,0.08)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect x="0" y="0" width="${width}" height="${height}" fill="url(#grid)"></rect>
    <line x1="${centerX}" y1="24" x2="${centerX}" y2="${height - 24}" stroke="rgba(31,42,33,0.15)" stroke-dasharray="5 6"/>
    <line x1="24" y1="${centerY}" x2="${width - 24}" y2="${centerY}" stroke="rgba(31,42,33,0.15)" stroke-dasharray="5 6"/>
    <ellipse cx="${centerX}" cy="${centerY}" rx="${rx}" ry="${ry}"
      fill="rgba(36,90,67,0.10)" stroke="#245a43" stroke-width="6"></ellipse>
    <circle cx="${centerX}" cy="${centerY}" r="5" fill="#245a43"></circle>
    <circle cx="${conductorX}" cy="${conductorY}" r="${conductorRadius}"
      fill="rgba(159,82,38,0.18)" stroke="#9f5226" stroke-width="4"></circle>
    <line x1="${centerX}" y1="${centerY}" x2="${conductorX}" y2="${conductorY}"
      stroke="#9f5226" stroke-width="3"></line>
    <text x="22" y="28" fill="#5d665d" font-size="12">ideal center</text>
    <text x="22" y="${height - 18}" fill="#5d665d" font-size="12">tilt = ${state.geometry.tiltDeg.toFixed(1)}°, b/a = ${state.geometry.axisRatio.toFixed(2)}</text>
  `;
}

function drawAxes(ctx, width, height, margin, xLabel, yLabel) {
  ctx.strokeStyle = "rgba(31,42,33,0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin.left, height - margin.bottom);
  ctx.lineTo(width - margin.right, height - margin.bottom);
  ctx.lineTo(width - margin.right, margin.top);
  ctx.stroke();

  ctx.fillStyle = "#5d665d";
  ctx.font = "12px Segoe UI";
  ctx.fillText(xLabel, width / 2 - 42, height - 12);
  ctx.save();
  ctx.translate(16, height / 2 + 28);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();
}

function drawHistogram(canvas, samplesA, samplesB) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  const margin = { top: 18, right: 18, bottom: 40, left: 54 };
  drawAxes(ctx, width, height, margin, "signed error (%)", "count");

  const combined = [...samplesA, ...samplesB];
  const maxAbs = Math.max(2, ...combined.map((value) => Math.abs(value)));
  const minValue = -maxAbs;
  const maxValue = maxAbs;
  const bins = 32;
  const binWidth = (maxValue - minValue) / bins;

  const binCounts = (samples) => {
    const counts = Array.from({ length: bins }, () => 0);
    samples.forEach((value) => {
      const position = Math.max(
        0,
        Math.min(bins - 1, Math.floor((value - minValue) / binWidth)),
      );
      counts[position] += 1;
    });
    return counts;
  };

  const countsA = binCounts(samplesA);
  const countsB = binCounts(samplesB);
  const maxCount = Math.max(...countsA, ...countsB, 1);
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const barWidth = plotWidth / bins;

  const drawSeries = (counts, fillStyle, strokeStyle, offsetFraction) => {
    counts.forEach((count, index) => {
      const barHeight = (count / maxCount) * plotHeight;
      const x = margin.left + index * barWidth + barWidth * offsetFraction;
      const y = height - margin.bottom - barHeight;
      ctx.fillStyle = fillStyle;
      ctx.strokeStyle = strokeStyle;
      ctx.fillRect(x, y, barWidth * 0.42, barHeight);
      ctx.strokeRect(x, y, barWidth * 0.42, barHeight);
    });
  };

  drawSeries(countsA, "rgba(159,82,38,0.38)", "rgba(159,82,38,0.7)", 0.06);
  drawSeries(countsB, "rgba(36,90,67,0.38)", "rgba(36,90,67,0.7)", 0.52);

  ctx.fillStyle = "#5d665d";
  ctx.font = "12px Segoe UI";
  for (let tick = 0; tick <= 4; tick += 1) {
    const value = minValue + ((maxValue - minValue) * tick) / 4;
    const x = margin.left + (plotWidth * tick) / 4;
    ctx.fillText(value.toFixed(1), x - 10, height - margin.bottom + 18);
  }

  ctx.fillStyle = "rgba(159,82,38,0.9)";
  ctx.fillRect(width - 170, 16, 14, 14);
  ctx.fillStyle = "#1f2a21";
  ctx.fillText(state.methods.a.name, width - 150, 28);
  ctx.fillStyle = "rgba(36,90,67,0.9)";
  ctx.fillRect(width - 170, 38, 14, 14);
  ctx.fillStyle = "#1f2a21";
  ctx.fillText(state.methods.b.name, width - 150, 50);
}

function drawCdf(canvas, absSamplesA, absSamplesB) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  const margin = { top: 18, right: 18, bottom: 40, left: 54 };
  drawAxes(ctx, width, height, margin, "absolute error threshold (%)", "P(|error| < x)");

  const thresholdMax = Math.max(
    2,
    absSamplesA[Math.floor(absSamplesA.length * 0.995)] || 2,
    absSamplesB[Math.floor(absSamplesB.length * 0.995)] || 2,
  );
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const drawSeries = (sortedAbsSamples, strokeStyle) => {
    ctx.beginPath();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 3;
    for (let step = 0; step <= 160; step += 1) {
      const threshold = (thresholdMax * step) / 160;
      let low = 0;
      let high = sortedAbsSamples.length;
      while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (sortedAbsSamples[mid] <= threshold) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      const fraction = low / sortedAbsSamples.length;
      const x = margin.left + (threshold / thresholdMax) * plotWidth;
      const y = height - margin.bottom - fraction * plotHeight;
      if (step === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  drawSeries(absSamplesA, "#9f5226");
  drawSeries(absSamplesB, "#245a43");

  ctx.fillStyle = "#5d665d";
  ctx.font = "12px Segoe UI";
  for (let tick = 0; tick <= 4; tick += 1) {
    const value = (thresholdMax * tick) / 4;
    const x = margin.left + (plotWidth * tick) / 4;
    ctx.fillText(value.toFixed(1), x - 10, height - margin.bottom + 18);
  }
  for (let tick = 0; tick <= 4; tick += 1) {
    const fraction = tick / 4;
    const y = height - margin.bottom - fraction * plotHeight;
    ctx.fillText(`${Math.round(fraction * 100)}%`, 14, y + 4);
  }
}

function updateIqi(simulation) {
  const target = state.global.targetThresholdPct;
  const best = simulation.b.summary.fractionUnderTarget;
  elements.iqiValue.textContent = `${(best * 100).toFixed(1)}%`;
  elements.iqiCaption.textContent = `Installation Quality Index for ${state.methods.b.name} at |error| < ${target.toFixed(1)}%.`;
  elements.iqiValue.title = `Fraction of ${state.methods.b.name} installs with absolute error below ${target.toFixed(1)}%.`;
}

function renderComparison(simulation) {
  elements.methodAHeader.textContent = state.methods.a.name;
  elements.methodBHeader.textContent = state.methods.b.name;
  elements.comparisonBody.innerHTML = metricRows
    .map((row) => {
      const aValue = row.formatter(simulation.a.summary[row.key]);
      const bValue = row.formatter(simulation.b.summary[row.key]);
      return `<tr><td>${row.label}</td><td>${aValue}</td><td>${bValue}</td></tr>`;
    })
    .join("");

  drawHistogram(elements.histogramCanvas, simulation.a.samples, simulation.b.samples);
  drawCdf(elements.cdfCanvas, simulation.a.summary.absSamples, simulation.b.summary.absSamples);
  updateIqi(simulation);
}

function runAndRenderSimulation() {
  latestSimulation = {
    a: runMonteCarlo(state.global, state.methods.a, 0),
    b: runMonteCarlo(state.global, state.methods.b, 1000),
  };
  renderComparison(latestSimulation);
}

elements.methodAName.addEventListener("input", () => {
  state.methods.a.name = elements.methodAName.value;
  if (latestSimulation) {
    renderComparison(latestSimulation);
  }
});

elements.methodBName.addEventListener("input", () => {
  state.methods.b.name = elements.methodBName.value;
  if (latestSimulation) {
    renderComparison(latestSimulation);
  }
});

elements.idealizeCase.addEventListener("click", () => {
  state.geometry = {
    ...defaultState.geometry,
  };
  renderAllControls();
  renderDeterministic();
});

elements.presetZipTie.addEventListener("click", () => {
  const next = loadZipTieVsClipPresets(state);
  state.methods.a = next.methods.a;
  state.methods.b = next.methods.b;
  elements.methodAName.value = state.methods.a.name;
  elements.methodBName.value = state.methods.b.name;
  renderAllControls();
  runAndRenderSimulation();
});

elements.runSimulation.addEventListener("click", () => {
  runAndRenderSimulation();
});

renderAllControls();
renderDeterministic();
runAndRenderSimulation();
