/**
 * Suitability Scoring Algorithm for Plant Recommendation
 * 
 * Research Formula:
 * Suitability Score = 40% Light Match + 25% Maintenance Match + 20% Pet Safety Match + 15% User Preference Match
 * 
 * Rating Levels:
 * - 90-100 = Excellent Match
 * - 75-89 = Good Match
 * - 60-74 = Fair Match
 * - Below 60 = Poor Match
 */

/**
 * Calculates the suitability score and breakdown for a given plant against user parameters.
 * 
 * @param {Object} plant - The plant object from database/catalog
 * @param {Object} criteria - User finder questionnaire answers
 * @param {string} criteria.environment - 'Indoor' | 'Outdoor'
 * @param {string} criteria.sunlight - 'Low' | 'Medium' | 'High'
 * @param {string} criteria.maintenance - 'Low' | 'Medium' | 'High'
 * @param {boolean} criteria.petSafeRequired - true | false
 * @param {boolean} criteria.airPurifyingPreferred - true | false
 * @param {string} criteria.experience - 'Beginner' | 'Intermediate' | 'Expert'
 * 
 * @returns {Object} { score, label, breakdown, explanation }
 */
export function calculateSuitabilityScore(plant, criteria) {
  if (!plant || !criteria) {
    return { score: 0, label: 'Poor Match', breakdown: {}, explanation: [] };
  }

  // 1. LIGHT MATCH (40%)
  let lightMatch = 0;
  const userLight = criteria.sunlight; // Low, Medium, High
  const plantLight = (plant.sunlight || 'Medium').toLowerCase();

  if (userLight === 'Low') {
    if (plantLight.includes('low') || plantLight.includes('indirect')) {
      lightMatch = 100;
    } else if (plantLight.includes('medium') || plantLight.includes('partial')) {
      lightMatch = 60;
    } else {
      lightMatch = 20; // Full sun/high light in low light environment
    }
  } else if (userLight === 'Medium') {
    if (plantLight.includes('medium') || plantLight.includes('indirect') || plantLight.includes('partial') || plantLight.includes('low to medium')) {
      lightMatch = 100;
    } else if (plantLight.includes('low')) {
      lightMatch = 80;
    } else if (plantLight.includes('full') || plantLight.includes('high')) {
      lightMatch = 60;
    }
  } else if (userLight === 'High') {
    if (plantLight.includes('full') || plantLight.includes('high') || plantLight.includes('bright') || plantLight.includes('sun')) {
      lightMatch = 100;
    } else if (plantLight.includes('medium') || plantLight.includes('partial') || plantLight.includes('indirect')) {
      lightMatch = 70;
    } else {
      lightMatch = 30; // Shade-loving plant in full sun
    }
  }

  // 2. MAINTENANCE MATCH (25%)
  let maintMatch = 0;
  const userMaint = criteria.maintenance; // Low, Medium, High
  const plantDiff = plant.difficulty || 'Easy'; // Easy, Medium, Hard

  if (userMaint === 'Low') {
    if (plantDiff === 'Easy') maintMatch = 100;
    else if (plantDiff === 'Medium') maintMatch = 50;
    else maintMatch = 10;
  } else if (userMaint === 'Medium') {
    if (plantDiff === 'Medium') maintMatch = 100;
    else if (plantDiff === 'Easy') maintMatch = 80; // Easy is acceptable for medium pref
    else maintMatch = 40;
  } else if (userMaint === 'High') {
    // High maintenance preference means they can manage any plant
    if (plantDiff === 'Hard') maintMatch = 100;
    else if (plantDiff === 'Medium') maintMatch = 90;
    else maintMatch = 70;
  }

  // 3. PET SAFETY MATCH (20%)
  let petMatch = 0;
  const petSafeRequired = criteria.petSafeRequired;
  const isPetFriendly = plant.petFriendly; // boolean

  if (petSafeRequired) {
    petMatch = isPetFriendly ? 100 : 0;
  } else {
    // If not required, any plant is a 100% match for this criteria
    petMatch = 100;
  }

  // 4. USER PREFERENCE MATCH (15%)
  // Combined score of Environment (Indoor/Outdoor) + Air Purifying preference + Experience Match
  let envMatch = 0;
  const userEnv = criteria.environment; // Indoor, Outdoor
  const category = (plant.category || '').toLowerCase();

  if (userEnv === 'Indoor') {
    if (category.includes('indoor') || category.includes('purifying') || category.includes('succulent') || category.includes('medicinal')) {
      envMatch = 100;
    } else {
      envMatch = 20; // Outdoor plant indoors
    }
  } else { // Outdoor
    if (category.includes('outdoor') || category.includes('flowering') || category.includes('medicinal')) {
      envMatch = 100;
    } else {
      envMatch = 30; // Indoor plant outdoors
    }
  }

  let airMatch = 0;
  const airPurifyPreferred = criteria.airPurifyingPreferred;
  const isAirPurifying = category.includes('purifying') || (plant.description || '').toLowerCase().includes('purif');

  if (airPurifyPreferred) {
    airMatch = isAirPurifying ? 100 : 40;
  } else {
    airMatch = 100;
  }

  let expMatch = 0;
  const experience = criteria.experience; // Beginner, Intermediate, Expert

  if (experience === 'Beginner') {
    if (plantDiff === 'Easy') expMatch = 100;
    else if (plantDiff === 'Medium') expMatch = 50;
    else expMatch = 10;
  } else if (experience === 'Intermediate') {
    if (plantDiff === 'Medium') expMatch = 100;
    else if (plantDiff === 'Easy') expMatch = 90;
    else expMatch = 60;
  } else { // Expert
    expMatch = 100; // Expert is prepared for any difficulty
  }

  const preferenceMatch = (envMatch + airMatch + expMatch) / 3;

  // 5. OVERALL WEIGHTED SCORE CALCULATION
  const weightedLight = lightMatch * 0.40;
  const weightedMaint = maintMatch * 0.25;
  const weightedPet = petMatch * 0.20;
  const weightedPref = preferenceMatch * 0.15;

  const totalScore = Math.round(weightedLight + weightedMaint + weightedPet + weightedPref);

  // 6. RATING LABELS
  let label = 'Poor Match';
  if (totalScore >= 90) label = 'Excellent Match';
  else if (totalScore >= 75) label = 'Good Match';
  else if (totalScore >= 60) label = 'Fair Match';

  // 7. EXPLANATORY REASONS (For IEEE Explainable AI component)
  const explanation = [];
  if (lightMatch >= 80) {
    explanation.push(`Perfect match for your ${userLight.toLowerCase()}-light environment (${plant.sunlight} sunlight requirements).`);
  } else {
    explanation.push(`Sub-optimal lighting match; plant prefers ${plant.sunlight} light.`);
  }

  if (plantDiff === 'Easy') {
    explanation.push(`Highly beginner-friendly and very low-maintenance.`);
  } else if (plantDiff === 'Medium') {
    explanation.push(`Requires moderate attention, perfect for developing gardening skills.`);
  } else {
    explanation.push(`Requires specialized care and an experienced hand.`);
  }

  if (isPetFriendly) {
    explanation.push(`Non-toxic and 100% pet-safe for cats and dogs.`);
  } else {
    explanation.push(`⚠️ Toxic to pets. Keep out of reach of domestic animals.`);
  }

  if (isAirPurifying) {
    explanation.push(`Highly rated air-purifying plant, filtering VOCs and releasing fresh oxygen.`);
  }

  return {
    score: totalScore,
    label,
    breakdown: {
      light: { raw: lightMatch, weighted: parseFloat(weightedLight.toFixed(1)) },
      maintenance: { raw: maintMatch, weighted: parseFloat(weightedMaint.toFixed(1)) },
      petSafety: { raw: petMatch, weighted: parseFloat(weightedPet.toFixed(1)) },
      preferences: { raw: Math.round(preferenceMatch), weighted: parseFloat(weightedPref.toFixed(1)) }
    },
    explanation
  };
}
