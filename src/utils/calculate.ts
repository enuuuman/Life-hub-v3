import { UserData } from '../types';

export const calcNetWorth = (data: UserData): number => {
  const totalAssets = Object.values(data.assets).reduce((a, b) => a + b, 0);
  const totalLiabilities = Object.values(data.liabilities).reduce((a, b) => a + b, 0);
  return totalAssets - totalLiabilities;
};

export const calcMonthlySurplus = (data: UserData): number => {
  return data.cashflow.monthlyIncome - data.cashflow.monthlyExpense;
};

export const getAssetLevel = (netWorth: number) => {
  if (netWorth < 0) return { label: 'Debt', color: 'text-red-500', progress: 0 };
  if (netWorth < 5000000) return { label: 'Seed', color: 'text-slate-500', progress: 20 };
  if (netWorth < 30000000) return { label: 'Build', color: 'text-indigo-500', progress: 50 };
  if (netWorth < 50000000) return { label: 'Grow', color: 'text-emerald-500', progress: 80 };
  return { label: 'Independence', color: 'text-yellow-500', progress: 100 };
};

export const generateSimulationData = (data: UserData, years: number = 40) => {
  const result = [];
  let currentAssets = calcNetWorth(data);
  const yearlySurplus = calcMonthlySurplus(data) * 12;
  const inflationRate = 1.02; // 2% inflation

  // 加重平均利回り計算
  const totalRatio = data.portfolio.reduce((sum, item) => sum + item.ratio, 0);
  const weightedReturn = totalRatio === 100 
    ? data.portfolio.reduce((sum, item) => sum + (item.ratio / 100) * (item.returnRate / 100), 0)
    : 0;

  let currentYearExpense = data.cashflow.monthlyExpense * 12;

  for (let i = 0; i <= years; i++) {
    const age = data.age + i;
    
    // ライフイベントの反映
    const yearEvents = data.events.filter(e => e.age === age);
    const eventCosts = yearEvents.reduce((sum, e) => sum + e.cost, 0);
    
    currentAssets -= eventCosts;
    currentAssets += (data.cashflow.monthlyIncome * 12) - currentYearExpense;
    currentAssets *= (1 + weightedReturn);

    result.push({
      age,
      amount: Math.round(currentAssets),
      event: yearEvents.length > 0 ? yearEvents[0].name : undefined
    });

    currentYearExpense *= inflationRate; // インフレ適用
  }
  return result;
};
