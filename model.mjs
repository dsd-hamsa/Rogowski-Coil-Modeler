const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const defaultState = {
  global: {
    trueCurrent: 500,
    loopRadiusMm: 60,
    conductorOdMm: 11.684,
    sampleCount: 10000,
    randomSeed: 20260407,
    offsetCoefficient: 0.03,
    shapeCoefficient: 0.08,
    tiltExponent: 0.4,
    skewCoefficient: 0.02,
    neighborCoefficient: 0.05,
    targetThresholdPct: 0.5,
  },
  geometry: {
    offsetXNorm: 0.0,
    offsetYNorm: 0.0,
    tiltDeg: 0,
    axisRatio: 1.0,
    axialSkewNorm: 0.0,
    leftNeighborCurrentA: 0,
    rightNeighborCurrentA: 0,
    leftNeighborSpacingNorm: 4.0,
    rightNeighborSpacingNorm: 4.0,
  },
  methods: {
    a: {
      name: "Zip tie and hang",
      offsetXMean: 0.22,
      offsetXStd: 0.12,
      offsetYMean: 0.18,
      offsetYStd: 0.12,
      tiltMeanDeg: 18,
      tiltStdDeg: 10,
      axisRatioMean: 0.82,
      axisRatioStd: 0.08,
      axialSkewMean: 0.12,
      axialSkewStd: 0.08,
      closureBiasMean: 0.08,
      closureBiasStd: 0.05,
      motionOffsetStd: 0.05,
      motionTiltStdDeg: 2.5,
      leftNeighborCurrentA: 0,
      rightNeighborCurrentA: 0,
      leftNeighborSpacingNorm: 4.0,
      rightNeighborSpacingNorm: 4.0,
    },
    b: {
      name: "Printed clip holder",
      offsetXMean: 0.04,
      offsetXStd: 0.04,
      offsetYMean: 0.06,
      offsetYStd: 0.04,
      tiltMeanDeg: 3,
      tiltStdDeg: 2,
      axisRatioMean: 0.97,
      axisRatioStd: 0.02,
      axialSkewMean: 0.02,
      axialSkewStd: 0.02,
      closureBiasMean: 0.01,
      closureBiasStd: 0.01,
      motionOffsetStd: 0.01,
      motionTiltStdDeg: 0.5,
      leftNeighborCurrentA: 0,
      rightNeighborCurrentA: 0,
      leftNeighborSpacingNorm: 4.0,
      rightNeighborSpacingNorm: 4.0,
    },
  },
};

const awgOptions = [
  { value: 11.684, label: "0000 (4/0)", note: "11.6840 mm" },
  { value: 10.4049, label: "000 (3/0)", note: "10.4049 mm" },
  { value: 9.2658, label: "00 (2/0)", note: "9.2658 mm" },
  { value: 8.2515, label: "0 (1/0)", note: "8.2515 mm" },
  { value: 7.3481, label: "1 AWG", note: "7.3481 mm" },
  { value: 6.5437, label: "2 AWG", note: "6.5437 mm" },
  { value: 5.8273, label: "3 AWG", note: "5.8273 mm" },
  { value: 5.1894, label: "4 AWG", note: "5.1894 mm" },
  { value: 4.6213, label: "5 AWG", note: "4.6213 mm" },
  { value: 4.1154, label: "6 AWG", note: "4.1154 mm" },
  { value: 3.6649, label: "7 AWG", note: "3.6649 mm" },
  { value: 3.2636, label: "8 AWG", note: "3.2636 mm" },
  { value: 2.9064, label: "9 AWG", note: "2.9064 mm" },
  { value: 2.5882, label: "10 AWG", note: "2.5882 mm" },
  { value: 2.3048, label: "11 AWG", note: "2.3048 mm" },
  { value: 2.0525, label: "12 AWG", note: "2.0525 mm" },
  { value: 1.8278, label: "13 AWG", note: "1.8278 mm" },
  { value: 1.6277, label: "14 AWG", note: "1.6277 mm" },
  { value: 1.4495, label: "15 AWG", note: "1.4495 mm" },
  { value: 1.2908, label: "16 AWG", note: "1.2908 mm" },
  { value: 1.1495, label: "17 AWG", note: "1.1495 mm" },
  { value: 1.0237, label: "18 AWG", note: "1.0237 mm" },
  { value: 0.9116, label: "19 AWG", note: "0.9116 mm" },
  { value: 0.8118, label: "20 AWG", note: "0.8118 mm" },
  { value: 0.7229, label: "21 AWG", note: "0.7229 mm" },
  { value: 0.6438, label: "22 AWG", note: "0.6438 mm" },
  { value: 0.5733, label: "23 AWG", note: "0.5733 mm" },
  { value: 0.5106, label: "24 AWG", note: "0.5106 mm" },
  { value: 0.4547, label: "25 AWG", note: "0.4547 mm" },
  { value: 0.4049, label: "26 AWG", note: "0.4049 mm" },
  { value: 0.3606, label: "27 AWG", note: "0.3606 mm" },
  { value: 0.3211, label: "28 AWG", note: "0.3211 mm" },
  { value: 0.2859, label: "29 AWG", note: "0.2859 mm" },
  { value: 0.2546, label: "30 AWG", note: "0.2546 mm" },
  { value: 0.2268, label: "31 AWG", note: "0.2268 mm" },
  { value: 0.2019, label: "32 AWG", note: "0.2019 mm" },
  { value: 0.1798, label: "33 AWG", note: "0.1798 mm" },
  { value: 0.1601, label: "34 AWG", note: "0.1601 mm" },
  { value: 0.1426, label: "35 AWG", note: "0.1426 mm" },
  { value: 0.127, label: "36 AWG", note: "0.1270 mm" },
  { value: 0.1131, label: "37 AWG", note: "0.1131 mm" },
  { value: 0.1007, label: "38 AWG", note: "0.1007 mm" },
  { value: 0.0897, label: "39 AWG", note: "0.0897 mm" },
  { value: 0.0799, label: "40 AWG", note: "0.0799 mm" },
];

export const fieldDefinitions = {
  global: [
    { key: "trueCurrent", label: "True current (A)", step: 10, min: 1, max: 20000, hint: "Reference current for all calculations." },
    { key: "loopRadiusMm", label: "Loop radius (mm)", step: 1, min: 5, max: 500, hint: "Effective coil radius." },
    {
      key: "conductorOdMm",
      label: "Conductor size (AWG)",
      type: "select",
      options: awgOptions,
      hint: "Bare conductor diameter from the AWG chart. Used in the placement sketch only.",
    },
    { key: "sampleCount", label: "Monte Carlo samples", step: 1000, min: 1000, max: 1000000, hint: "10,000 is a good default." },
    { key: "randomSeed", label: "Random seed", step: 1, min: 1, max: 999999999, hint: "Keeps method comparisons repeatable." },
    { key: "offsetCoefficient", label: "Offset coefficient k_o", step: 0.01, min: 0, max: 3, hint: "Quadratic sensitivity to normalized offset." },
    { key: "shapeCoefficient", label: "Shape coefficient k_s", step: 0.01, min: 0, max: 3, hint: "Sensitivity to loop ovality." },
    { key: "tiltExponent", label: "Tilt exponent", step: 0.1, min: 0.1, max: 5, hint: "Response uses cos(theta)^n." },
    { key: "skewCoefficient", label: "Skew coefficient k_a", step: 0.01, min: 0, max: 3, hint: "Penalty for axial skew." },
    { key: "neighborCoefficient", label: "Neighbor coefficient k_n", step: 0.01, min: 0, max: 2, hint: "Scales adjacent phase coupling." },
    { key: "targetThresholdPct", label: "IQI target (% abs error)", step: 0.1, min: 0.1, max: 10, hint: "Threshold for the Installation Quality Index." },
  ],
  geometry: [
    { key: "offsetXNorm", label: "Offset X / R", step: 0.01, min: -1.2, max: 1.2, hint: "Horizontal offset normalized by loop radius." },
    { key: "offsetYNorm", label: "Offset Y / R", step: 0.01, min: -1.2, max: 1.2, hint: "Vertical offset normalized by loop radius." },
    { key: "tiltDeg", label: "Tilt (deg)", step: 0.5, min: 0, max: 89, hint: "Deviation from ideal perpendicular crossing." },
    { key: "axisRatio", label: "Axis ratio b/a", step: 0.01, min: 0.2, max: 1.2, hint: "1.0 is circular; lower values are more oval." },
    { key: "axialSkewNorm", label: "Axial skew / R", step: 0.01, min: -1.5, max: 1.5, hint: "Normalized shift along the intended crossing axis." },
    { key: "leftNeighborCurrentA", label: "Left neighbor current (A)", step: 10, min: -5000, max: 5000, hint: "Set to 0 to ignore adjacent phase current." },
    { key: "rightNeighborCurrentA", label: "Right neighbor current (A)", step: 10, min: -5000, max: 5000, hint: "Use sign if phase direction matters." },
    { key: "leftNeighborSpacingNorm", label: "Left neighbor spacing / R", step: 0.1, min: 0.5, max: 12, hint: "Center-to-center spacing normalized by loop radius." },
    { key: "rightNeighborSpacingNorm", label: "Right neighbor spacing / R", step: 0.1, min: 0.5, max: 12, hint: "Larger spacing reduces coupling." },
  ],
  method: [
    { key: "offsetXMean", label: "Offset X mean / R", step: 0.01, min: -1, max: 1 },
    { key: "offsetXStd", label: "Offset X std / R", step: 0.01, min: 0, max: 0.8 },
    { key: "offsetYMean", label: "Offset Y mean / R", step: 0.01, min: -1, max: 1 },
    { key: "offsetYStd", label: "Offset Y std / R", step: 0.01, min: 0, max: 0.8 },
    { key: "tiltMeanDeg", label: "Tilt mean (deg)", step: 0.5, min: 0, max: 89 },
    { key: "tiltStdDeg", label: "Tilt std (deg)", step: 0.5, min: 0, max: 30 },
    { key: "axisRatioMean", label: "Axis ratio mean b/a", step: 0.01, min: 0.2, max: 1.1 },
    { key: "axisRatioStd", label: "Axis ratio std", step: 0.01, min: 0, max: 0.3 },
    { key: "axialSkewMean", label: "Skew mean / R", step: 0.01, min: -1, max: 1 },
    { key: "axialSkewStd", label: "Skew std / R", step: 0.01, min: 0, max: 0.5 },
    { key: "closureBiasMean", label: "Closure bias mean / R", step: 0.01, min: -1, max: 1 },
    { key: "closureBiasStd", label: "Closure bias std / R", step: 0.01, min: 0, max: 0.4 },
    { key: "motionOffsetStd", label: "Motion offset std / R", step: 0.01, min: 0, max: 0.5 },
    { key: "motionTiltStdDeg", label: "Motion tilt std (deg)", step: 0.1, min: 0, max: 15 },
    { key: "leftNeighborCurrentA", label: "Left neighbor current (A)", step: 10, min: -5000, max: 5000 },
    { key: "rightNeighborCurrentA", label: "Right neighbor current (A)", step: 10, min: -5000, max: 5000 },
    { key: "leftNeighborSpacingNorm", label: "Left spacing / R", step: 0.1, min: 0.5, max: 12 },
    { key: "rightNeighborSpacingNorm", label: "Right spacing / R", step: 0.1, min: 0.5, max: 12 },
  ],
};

export function createRng(seed) {
  let state = Math.trunc(seed) % 2147483647;
  if (state <= 0) {
    state += 2147483646;
  }
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function sampleStandardNormal(rng) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function sampleNormal(rng, mean, std) {
  if (std === 0) {
    return mean;
  }
  return mean + sampleStandardNormal(rng) * std;
}

function sampleTruncatedNormal(rng, mean, std, min, max) {
  if (std === 0) {
    return clamp(mean, min, max);
  }
  for (let index = 0; index < 12; index += 1) {
    const sample = sampleNormal(rng, mean, std);
    if (sample >= min && sample <= max) {
      return sample;
    }
  }
  return clamp(sampleNormal(rng, mean, std), min, max);
}

function percentile(sortedValues, fraction) {
  if (sortedValues.length === 0) {
    return 0;
  }
  const index = clamp((sortedValues.length - 1) * fraction, 0, sortedValues.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) {
    return sortedValues[lower];
  }
  const weight = index - lower;
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

function computeNeighborFactor(globalConfig, placement) {
  const base = globalConfig.neighborCoefficient;
  const tiltPenalty = Math.sin((placement.tiltDeg * Math.PI) / 180);
  const offsetPenalty = placement.offsetNorm;
  const leftSpacing = Math.max(placement.leftNeighborSpacingNorm, 0.2);
  const rightSpacing = Math.max(placement.rightNeighborSpacingNorm, 0.2);
  const leftContribution =
    base *
    ((1 + 0.5 * tiltPenalty + 0.35 * offsetPenalty) / (leftSpacing * leftSpacing)) *
    (placement.leftNeighborCurrentA / globalConfig.trueCurrent);
  const rightContribution =
    base *
    ((1 + 0.5 * tiltPenalty + 0.35 * offsetPenalty) / (rightSpacing * rightSpacing)) *
    (placement.rightNeighborCurrentA / globalConfig.trueCurrent);
  return Math.max(0, 1 + leftContribution + rightContribution);
}

export function evaluatePlacement(globalConfig, placement) {
  const offsetNorm = Math.sqrt(
    placement.offsetXNorm * placement.offsetXNorm + placement.offsetYNorm * placement.offsetYNorm,
  );
  const safeOffset = clamp(offsetNorm, 0, 1.4);
  const safeAxisRatio = clamp(placement.axisRatio, 0.05, 1.2);
  const safeTilt = clamp(placement.tiltDeg, 0, 89.9);
  const safeSkew = Math.abs(placement.axialSkewNorm);

  const tiltRadians = (safeTilt * Math.PI) / 180;
  const offsetFactor = Math.max(0, 1 - globalConfig.offsetCoefficient * safeOffset * safeOffset);
  const tiltFactor = Math.max(0, Math.pow(Math.cos(tiltRadians), globalConfig.tiltExponent));
  const shapeFactor = Math.max(0, 1 - globalConfig.shapeCoefficient * (1 - safeAxisRatio));
  const skewFactor = Math.max(0, 1 - globalConfig.skewCoefficient * safeSkew);
  const neighborFactor = computeNeighborFactor(globalConfig, {
    ...placement,
    offsetNorm: safeOffset,
  });

  const responseFactor = offsetFactor * tiltFactor * shapeFactor * skewFactor * neighborFactor;
  const measuredCurrent = globalConfig.trueCurrent * responseFactor;
  const percentError = ((measuredCurrent - globalConfig.trueCurrent) / globalConfig.trueCurrent) * 100;

  return {
    offsetNorm: safeOffset,
    measuredCurrent,
    percentError,
    responseFactor,
    factors: {
      offset: offsetFactor,
      tilt: tiltFactor,
      shape: shapeFactor,
      skew: skewFactor,
      neighbors: neighborFactor,
    },
  };
}

function sampleMethodPlacement(globalConfig, methodConfig, rng) {
  const offsetX =
    sampleNormal(rng, methodConfig.offsetXMean, methodConfig.offsetXStd) +
    sampleNormal(rng, methodConfig.closureBiasMean, methodConfig.closureBiasStd) +
    sampleNormal(rng, 0, methodConfig.motionOffsetStd);
  const offsetY =
    sampleNormal(rng, methodConfig.offsetYMean, methodConfig.offsetYStd) +
    sampleNormal(rng, 0, methodConfig.motionOffsetStd);

  return {
    offsetXNorm: clamp(offsetX, -1.5, 1.5),
    offsetYNorm: clamp(offsetY, -1.5, 1.5),
    tiltDeg: sampleTruncatedNormal(
      rng,
      methodConfig.tiltMeanDeg,
      Math.sqrt(methodConfig.tiltStdDeg ** 2 + methodConfig.motionTiltStdDeg ** 2),
      0,
      89,
    ),
    axisRatio: sampleTruncatedNormal(rng, methodConfig.axisRatioMean, methodConfig.axisRatioStd, 0.2, 1.1),
    axialSkewNorm: sampleNormal(rng, methodConfig.axialSkewMean, methodConfig.axialSkewStd),
    leftNeighborCurrentA: methodConfig.leftNeighborCurrentA,
    rightNeighborCurrentA: methodConfig.rightNeighborCurrentA,
    leftNeighborSpacingNorm: methodConfig.leftNeighborSpacingNorm,
    rightNeighborSpacingNorm: methodConfig.rightNeighborSpacingNorm,
  };
}

function summarizeErrors(errorSamples, thresholdPct) {
  const signedSorted = [...errorSamples].sort((left, right) => left - right);
  const absSorted = errorSamples.map((value) => Math.abs(value)).sort((left, right) => left - right);
  const meanError = errorSamples.reduce((sum, value) => sum + value, 0) / errorSamples.length;
  const meanAbsError = absSorted.reduce((sum, value) => sum + value, 0) / absSorted.length;
  const thresholdFraction =
    absSorted.filter((value) => value <= thresholdPct).length / absSorted.length;

  return {
    meanError,
    meanAbsError,
    medianAbsError: percentile(absSorted, 0.5),
    p95AbsError: percentile(absSorted, 0.95),
    p99AbsError: percentile(absSorted, 0.99),
    worstAbsError: absSorted[absSorted.length - 1],
    signedP05: percentile(signedSorted, 0.05),
    signedP95: percentile(signedSorted, 0.95),
    fractionUnderTarget: thresholdFraction,
    fractionAboveHalfPct: absSorted.filter((value) => value > 0.5).length / absSorted.length,
    fractionAboveOnePct: absSorted.filter((value) => value > 1.0).length / absSorted.length,
    fractionAboveTwoPct: absSorted.filter((value) => value > 2.0).length / absSorted.length,
    signedSamples: signedSorted,
    absSamples: absSorted,
  };
}

export function runMonteCarlo(globalConfig, methodConfig, seedOffset = 0) {
  const rng = createRng(globalConfig.randomSeed + seedOffset);
  const errorSamples = [];
  const measuredCurrents = [];

  for (let sampleIndex = 0; sampleIndex < globalConfig.sampleCount; sampleIndex += 1) {
    const placement = sampleMethodPlacement(globalConfig, methodConfig, rng);
    const result = evaluatePlacement(globalConfig, placement);
    errorSamples.push(result.percentError);
    measuredCurrents.push(result.measuredCurrent);
  }

  const summary = summarizeErrors(errorSamples, globalConfig.targetThresholdPct);
  return {
    samples: errorSamples,
    measuredCurrents,
    summary,
  };
}

export function loadZipTieVsClipPresets(state) {
  return {
    ...state,
    methods: {
      a: {
        ...state.methods.a,
        name: "Zip tie and hang",
        offsetXMean: 0.24,
        offsetXStd: 0.13,
        offsetYMean: 0.18,
        offsetYStd: 0.12,
        tiltMeanDeg: 18,
        tiltStdDeg: 10,
        axisRatioMean: 0.82,
        axisRatioStd: 0.08,
        axialSkewMean: 0.12,
        axialSkewStd: 0.08,
        closureBiasMean: 0.08,
        closureBiasStd: 0.05,
        motionOffsetStd: 0.05,
        motionTiltStdDeg: 2.5,
      },
      b: {
        ...state.methods.b,
        name: "Printed clip holder",
        offsetXMean: 0.04,
        offsetXStd: 0.04,
        offsetYMean: 0.06,
        offsetYStd: 0.04,
        tiltMeanDeg: 3,
        tiltStdDeg: 2,
        axisRatioMean: 0.97,
        axisRatioStd: 0.02,
        axialSkewMean: 0.02,
        axialSkewStd: 0.02,
        closureBiasMean: 0.01,
        closureBiasStd: 0.01,
        motionOffsetStd: 0.01,
        motionTiltStdDeg: 0.5,
      },
    },
  };
}

export function formatPercent(value, digits = 2) {
  return `${value.toFixed(digits)}%`;
}

export function formatFactor(value, digits = 4) {
  return value.toFixed(digits);
}

export function formatCurrent(value, digits = 1) {
  return `${value.toFixed(digits)} A`;
}
