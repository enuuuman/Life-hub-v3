export type AccountMode = 'personal' | 'partner' | 'joint';
export type TabType = 'home' | 'input' | 'plan' | 'simulation';

export interface Assets {
  cash: number;
  stocks: number;
  nisa: number;
  other: number;
}

export interface Liabilities {
  mortgage: number;
  other: number;
}

export interface Cashflow {
  monthlyIncome: number;
  monthlyExpense: number;
}

export interface LifeEvent {
  id: string;
  name: string;
  age: number;
  cost: number;
  category: 'education' | 'housing' | 'marriage' | 'travel' | 'other';
}

export interface PortfolioItem {
  id: string;
  name: string;
  ratio: number;
  returnRate: number;
}

export interface UserData {
  age: number;
  assets: Assets;
  liabilities: Liabilities;
  cashflow: Cashflow;
  events: LifeEvent[];
  portfolio: PortfolioItem[];
}

export const INITIAL_USER_DATA: UserData = {
  age: 30,
  assets: { cash: 0, stocks: 0, nisa: 0, other: 0 },
  liabilities: { mortgage: 0, other: 0 },
  cashflow: { monthlyIncome: 0, monthlyExpense: 0 },
  events: [],
  portfolio: [
    { id: '1', name: '全世界株式', ratio: 70, returnRate: 5.0 },
    { id: '2', name: '現金・債券', ratio: 30, returnRate: 0.1 }
  ]
};
