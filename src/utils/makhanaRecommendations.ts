import { SensorReading } from '../types';

export interface RecommendationItem {
  title: string;
  status: 'good' | 'watch' | 'action';
  detail: string;
}

export type PondType = 'natural' | 'managed';
export type AreaUnit = 'ha' | 'acre';

export interface NutrientPlan {
  nutrient: 'N' | 'P2O5' | 'K2O';
  status: 'low' | 'medium' | 'high' | 'unknown';
  perHectareKg: number;
}

export interface ReferenceLink {
  title: string;
  url: string;
  note: string;
}

export interface AssessmentReportData {
  overallStatus: 'good' | 'watch' | 'action';
  headline: string;
  summary: string;
  nutrientLines: string[];
  recommendationLines: string[];
}

export const MAKHANA_REFERENCE_LINKS: ReferenceLink[] = [
  {
    title: 'Climate crisis a major threat for makhana farmers: Report',
    url: 'https://timesofindia.indiatimes.com/city/patna/climate-crisis-a-major-threat-for-makhana-farmers-report/articleshow/122052414.cms',
    note: 'Quoted KVK guidance in a 2024 report: makhana does best around 20-35 C and depends on healthy pond ecosystems.',
  },
  {
    title: 'BAU launches organic makhana drive in Purnia',
    url: 'https://timesofindia.indiatimes.com/city/patna/bau-launches-organic-makhana-drive-in-purnia/articleshow/120998015.cms',
    note: 'Confirms both pond and field systems are used and that Bihar agri institutions are pushing scientific, organic, input-efficient management.',
  },
  {
    title: 'Euryale ferox',
    url: 'https://en.wikipedia.org/wiki/Euryale_ferox',
    note: 'Used only for contextual background that makhana is a freshwater pond crop and that field-based flooded cultivation is now practiced.',
  },
];

export function convertToHectares(value: number, unit: AreaUnit) {
  return unit === 'ha' ? value : value * 0.404686;
}

const NATURAL_WATER_PH = { min: 6.5, max: 8.5 };
const NATURAL_WATER_TEMP_C = { min: 20, max: 35 };

// These are conservative operational heuristics layered on top of sourced context.
const SOIL_PH_TARGET = { min: 6.0, max: 7.5 };
const TDS_TARGET = { min: 100, max: 500 };
const TURB_TARGET = { min: 10, max: 60 };

function classifyNutrient(value: number | null, type: 'N' | 'P' | 'K'): NutrientPlan['status'] {
  if (value === null) return 'unknown';

  if (type === 'N') {
    if (value < 280) return 'low';
    if (value <= 560) return 'medium';
    return 'high';
  }

  if (type === 'P') {
    if (value < 10) return 'low';
    if (value <= 25) return 'medium';
    return 'high';
  }

  if (value < 110) return 'low';
  if (value <= 280) return 'medium';
  return 'high';
}

function perHectareDose(status: NutrientPlan['status'], nutrient: NutrientPlan['nutrient']) {
  if (status === 'high' || status === 'unknown') return 0;

  if (nutrient === 'N') return status === 'low' ? 40 : 20;
  if (nutrient === 'P2O5') return status === 'low' ? 20 : 10;
  return status === 'low' ? 20 : 10;
}

export function getNutrientPlan(reading: SensorReading | null): NutrientPlan[] {
  if (!reading) {
    return [
      { nutrient: 'N', status: 'unknown', perHectareKg: 0 },
      { nutrient: 'P2O5', status: 'unknown', perHectareKg: 0 },
      { nutrient: 'K2O', status: 'unknown', perHectareKg: 0 },
    ];
  }

  const nStatus = classifyNutrient(reading.nitrogen, 'N');
  const pStatus = classifyNutrient(reading.phosphorus, 'P');
  const kStatus = classifyNutrient(reading.potassium, 'K');

  return [
    { nutrient: 'N', status: nStatus, perHectareKg: perHectareDose(nStatus, 'N') },
    { nutrient: 'P2O5', status: pStatus, perHectareKg: perHectareDose(pStatus, 'P2O5') },
    { nutrient: 'K2O', status: kStatus, perHectareKg: perHectareDose(kStatus, 'K2O') },
  ];
}

export function getSensorRecommendations(reading: SensorReading | null): RecommendationItem[] {
  if (!reading) {
    return [
      {
        title: 'No live reading',
        status: 'watch',
        detail: 'Recommendation logic starts when the device pushes a fresh water and soil packet.',
      },
    ];
  }

  const items: RecommendationItem[] = [];

  if (reading.water_ph !== null) {
    if (reading.water_ph < NATURAL_WATER_PH.min) {
      items.push({
        title: 'Water pH is below the reference band',
        status: 'action',
        detail: `Target for makhana pond water is approximately ${NATURAL_WATER_PH.min}-${NATURAL_WATER_PH.max}. Check for acidic inflow and review liming or buffer management with a local agronomist.`,
      });
    } else if (reading.water_ph > NATURAL_WATER_PH.max) {
      items.push({
        title: 'Water pH is above the reference band',
        status: 'action',
        detail: `A reading above ${NATURAL_WATER_PH.max} can reduce nutrient balance. Recheck the sensor, review source water, and avoid adding alkaline inputs blindly.`,
      });
    } else {
      items.push({
        title: 'Water pH is within the reference band',
        status: 'good',
        detail: `Current water pH aligns with the ${NATURAL_WATER_PH.min}-${NATURAL_WATER_PH.max} band used here as the natural-pond reference.`,
      });
    }
  }

  if (reading.water_temp_c !== null) {
    if (reading.water_temp_c < NATURAL_WATER_TEMP_C.min || reading.water_temp_c > NATURAL_WATER_TEMP_C.max) {
      items.push({
        title: 'Water temperature is outside the cited makhana climate band',
        status: 'watch',
        detail: `The field reference used here is ${NATURAL_WATER_TEMP_C.min}-${NATURAL_WATER_TEMP_C.max} C. Persistent deviation can stress the crop and the pond ecosystem.`,
      });
    } else {
      items.push({
        title: 'Water temperature is in the climate comfort band',
        status: 'good',
        detail: `The current water temperature sits inside the ${NATURAL_WATER_TEMP_C.min}-${NATURAL_WATER_TEMP_C.max} C range cited for makhana-growing conditions.`,
      });
    }
  }

  if (reading.soil_ph !== null) {
    if (reading.soil_ph < SOIL_PH_TARGET.min || reading.soil_ph > SOIL_PH_TARGET.max) {
      items.push({
        title: 'Soil pH needs attention',
        status: 'watch',
        detail: `This dashboard uses ${SOIL_PH_TARGET.min}-${SOIL_PH_TARGET.max} as a working soil pH band for balanced nutrient availability in managed makhana plots.`,
      });
    } else {
      items.push({
        title: 'Soil pH is workable',
        status: 'good',
        detail: 'The soil reading is in the working band used for nutrient-availability decisions in the recommendation engine.',
      });
    }
  }

  if (reading.tds !== null && (reading.tds < TDS_TARGET.min || reading.tds > TDS_TARGET.max)) {
    items.push({
      title: 'Dissolved solids are outside the operational band',
      status: 'watch',
      detail: `The app uses ${TDS_TARGET.min}-${TDS_TARGET.max} ppm as a conservative water-management band. Treat this as an operational signal, not a makhana-specific legal threshold.`,
    });
  }

  if (reading.turb !== null && (reading.turb < TURB_TARGET.min || reading.turb > TURB_TARGET.max)) {
    items.push({
      title: 'Turbidity suggests a pond-management check',
      status: 'watch',
      detail: `The current turbidity is outside the working band of ${TURB_TARGET.min}-${TURB_TARGET.max} NTU used by the device UI. Inspect runoff, sediment disturbance, and water exchange conditions.`,
    });
  }

  if (reading.npk_valid === false) {
    items.push({
      title: 'NPK packet is not validated',
      status: 'watch',
      detail: 'Show the nutrient values carefully in the field and avoid over-claiming fertilizer precision until calibration is complete.',
    });
  }

  return items;
}

export function getPondTypeAdvice(pondType: PondType): RecommendationItem[] {
  if (pondType === 'natural') {
    return [
      {
        title: 'Protect the natural pond character',
        status: 'good',
        detail: 'Focus on maintaining water retention, avoiding polluted inflow, and protecting the organic sediment layer instead of forcing heavy correction inputs.',
      },
      {
        title: 'Use nutrient additions conservatively',
        status: 'watch',
        detail: 'When the pond already behaves like a natural wetland, small corrections are usually safer than aggressive dosing.',
      },
    ];
  }

  return [
    {
      title: 'Human-made pond should be pushed toward natural behavior',
      status: 'action',
      detail: 'Prioritize water retention, organic matter build-up, low-pollution inflow, and stable pond ecology so the system behaves more like a natural makhana pond.',
    },
    {
      title: 'Build pond resilience, not only NPK',
      status: 'action',
      detail: 'Along with nutrient correction, review bund stability, water source quality, sediment condition, and organic biomass inputs.',
    },
  ];
}

export function buildAssessmentReport(
  reading: SensorReading | null,
  pondType: PondType,
  areaValue: number,
  areaUnit: AreaUnit
): AssessmentReportData {
  const sensorRecommendations = getSensorRecommendations(reading);
  const pondRecommendations = getPondTypeAdvice(pondType);
  const nutrientPlan = getNutrientPlan(reading);
  const areaHa = areaValue > 0 ? convertToHectares(areaValue, areaUnit) : 0;
  const allRecommendations = [...sensorRecommendations, ...pondRecommendations];

  const overallStatus = allRecommendations.some((item) => item.status === 'action')
    ? 'action'
    : allRecommendations.some((item) => item.status === 'watch')
      ? 'watch'
      : 'good';

  const headline =
    overallStatus === 'good'
      ? 'Condition looks stable for the measured makhana field.'
      : overallStatus === 'watch'
        ? 'Condition is workable but needs monitoring and selective correction.'
        : 'Condition needs corrective action before relying on the pond setup.';

  const summary = reading
    ? `Measured water pH ${reading.water_ph?.toFixed(2) ?? 'N/A'}, soil pH ${reading.soil_ph?.toFixed(2) ?? 'N/A'}, TDS ${reading.tds?.toFixed(2) ?? 'N/A'}, turbidity ${reading.turb?.toFixed(2) ?? 'N/A'}, nitrogen ${reading.nitrogen?.toFixed(2) ?? 'N/A'}, phosphorus ${reading.phosphorus?.toFixed(2) ?? 'N/A'}, potassium ${reading.potassium?.toFixed(2) ?? 'N/A'}.`
    : 'No reading is available for report generation.';

  const nutrientLines = nutrientPlan.map((item) => {
    const totalKg = item.perHectareKg * areaHa;
    return `${item.nutrient}: ${item.status.toUpperCase()} category, ${item.perHectareKg} kg/ha basis, ${totalKg.toFixed(1)} kg for ${areaHa.toFixed(2)} ha`;
  });

  const recommendationLines = allRecommendations.slice(0, 6).map(
    (item) => `${item.title}: ${item.detail}`
  );

  return {
    overallStatus,
    headline,
    summary,
    nutrientLines,
    recommendationLines,
  };
}
