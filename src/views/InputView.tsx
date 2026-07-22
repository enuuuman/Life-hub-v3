import React from 'react';
import { Card, NumberInput } from '../components/ui/core';
import { useAppStore } from '../hooks/useAppStore';

export const InputView: React.FC = () => {
  const { data, updateData } = useAppStore();

  const updateAsset = (key: keyof typeof data.assets, val: number) => {
    updateData({ assets: { ...data.assets, [key]: val } });
  };
  const updateLiability = (key: keyof typeof data.liabilities, val: number) => {
    updateData({ liabilities: { ...data.liabilities, [key]: val } });
  };
  const updateCashflow = (key: keyof typeof data.cashflow, val: number) => {
    updateData({ cashflow: { ...data.cashflow, [key]: val } });
  };

  return (
    <div className="p-5 space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">基本情報入力</h2>
        <div className="w-20">
          <label className="text-xs text-slate-500 block mb-1">現在の年齢</label>
          <input 
            type="number" 
            value={data.age || ''}
            onChange={(e) => updateData({ age: parseInt(e.target.value) || 0 })}
            className="w-full bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-center font-bold text-slate-800 dark:text-white"
          />
        </div>
      </div>

      <Card>
        <h3 className="font-bold text-indigo-600 mb-4 border-b border-slate-100 pb-2">毎月の収支</h3>
        <NumberInput label="手取り月収" value={data.cashflow.monthlyIncome} onChange={(v) => updateCashflow('monthlyIncome', v)} />
        <NumberInput label="毎月の支出" value={data.cashflow.monthlyExpense} onChange={(v) => updateCashflow('monthlyExpense', v)} />
      </Card>

      <Card>
        <h3 className="font-bold text-emerald-600 mb-4 border-b border-slate-100 pb-2">プラスの資産</h3>
        <NumberInput label="預貯金 (現金)" value={data.assets.cash} onChange={(v) => updateAsset('cash', v)} />
        <NumberInput label="株式・投資信託 (特定口座等)" value={data.assets.stocks} onChange={(v) => updateAsset('stocks', v)} />
        <NumberInput label="NISA・iDeCo" value={data.assets.nisa} onChange={(v) => updateAsset('nisa', v)} />
        <NumberInput label="その他の資産" value={data.assets.other} onChange={(v) => updateAsset('other', v)} />
      </Card>

      <Card>
        <h3 className="font-bold text-red-500 mb-4 border-b border-slate-100 pb-2">マイナスの資産 (負債)</h3>
        <NumberInput label="住宅ローン残高" value={data.liabilities.mortgage} onChange={(v) => updateLiability('mortgage', v)} />
        <NumberInput label="その他の借入" value={data.liabilities.other} onChange={(v) => updateLiability('other', v)} />
      </Card>
      
      <p className="text-xs text-center text-slate-400 mt-4">※ 入力内容は自動的に保存されます</p>
    </div>
  );
};
