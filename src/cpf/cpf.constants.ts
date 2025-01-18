export const CPF_LIMITS = {
  ORDINARY_WAGE_CEILING: 6000, // Monthly ceiling
  ADDITIONAL_WAGE_CEILING: 102000, // Yearly ceiling
  MINIMUM_WAGE_THRESHOLD: 50, // Minimum amount for CPF contribution
  // Add more limits as per CPF guidelines
};

// src/cpf/constants/contribution-allocation.constants.ts
export const CONTRIBUTION_ALLOCATION = {
  LESS_THAN_55: {
    // ORDINARY: 0.2,
    SPECIAL: 0.1621,
    MEDISAVE: 0.2162,
  },
  FROM_55_TO_60: {
    // ORDINARY: 0.21,
    SPECIAL: 0.3076,
    MEDISAVE: 0.323,
  },
  FROM_60_TO_65: {
    // ORDINARY: 0.145,
    SPECIAL: 0.4042,
    MEDISAVE: 0.4468,
  },
  ABOVE_65: {
    // ORDINARY: 0.7,
    SPECIAL: 0.303,
    MEDISAVE: 0.6363,
  },
};
