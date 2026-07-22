import React from 'react';
import { Card } from '../components/ui/core';
import { useAppStore } from '../hooks/useAppStore';
import { calcNetWorth, calcMonthlySurplus, getAssetLevel } from '../utils/calculate';
import { formatCurrency } from '../utils/format';
import { Wallet, TrendingUp, ShieldCheck } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { data } = useAppStore();
  const netWorth = calcNetWorth(data);
  const surplus = calcMonthlySurplus(data);
  const level = getAssetLevel(netWorth);

  return (
    <div className="p-5 space-y-6">
      <section className="text-center space-y-2 mt-4">
        <p className="text-sm font-medium text-slate-500">純資産総額</p>
        <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {formatCurrency(netWorth)}
        </h2>
      </section>

      <Card>
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-xs text-slate-500 mb-1">Asset Level</p>
            <p className={`font-bold text-lg ${level.color}`}>{level.label}</p>
          </div>
          <p className="text-sm font-medium text-slate-400">{level.progress}%</p>
        </div>
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-1000 ease-out"
            style={{ width: `${level.progress}%` }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col items-center justify-center py-6">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <TrendingUp size={20} />
          </div>
          <p className="text-xs text-slate-500 mb-1">毎月余剰額</p>
          <p className="font-bold text-slate-800 dark:text-slate-100">{formatCurrency(surplus)}</p>
        </Card>
        
        <Card className="flex flex-col items-center justify-center py-6">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
            <Wallet size={20} />
          </div>
          <p className="text-xs text-slate-500 mb-1">総資産</p>
          <p className="font-bold text-slate-800 dark:text-slate-100">
            {formatCurrency(Object.values(data.assets).reduce((a,b)=>a+b,0))}
          </p>
        </Card>
      </div>

      <Card>
        <div className="flex items-start gap-4">
          <ShieldCheck className="text-indigo-500 shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">AI 診断サマリー</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {surplus > 0 
                ? `毎月${formatCurrency(surplus)}の余剰資金があります。これを投資（NISA等）に回すことで、将来の資産形成が大きく加速します。シミュレーションタブで確認しましょう。`
                : '支出が収入を上回っています。まずは毎月の収支バランスを見直し、固定費の削減を検討しましょう。'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
