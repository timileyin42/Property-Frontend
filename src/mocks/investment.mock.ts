import { InvestmentResponse } from "../types/investment";
export const mockInvestments: InvestmentResponse = {
  investments: Array.from({ length: 42 }).map((_, i) => ({
    id: i + 1,
    user_id: 1,
    property_id: i,
    fractions_owned: 5,
    ownership_percentage: 2.5,
    initial_value: 100000,
    current_value: 120000,
    growth_percentage: 20,
    growth_amount: 20000,
    image_url: "https://via.placeholder.com/300x200",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    property_title: `Property ${i + 1}`,
    property_location: "Lagos",
  })),
  total: 42,
  total_initial_value: 4200000,
  total_current_value: 5040000,
  total_growth_percentage: 20,
};
