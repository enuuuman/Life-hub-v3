import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Card, NumberInput, Button } from '../components/ui/core';
import { useAppStore } from '../hooks/useAppStore';
import { generateSimulationData } from '../utils/calculate';
import { formatCurrency } from '../utils/format';
import { Trash2, PlusCircle, AlertCircle } from 'lucide-react';

export const SimulationView: React.FC = () => {
  const { data, updateData } = useAppStore();
  
  const simData = useMemo(() => generateSimulationData(data, 40), [data]);
  
  const totalRatio = data.portfolio.reduce((sum, item) => sum + item.ratio, 0);
  const weightedReturn = totalRatio === 100 
    ? data.portfolio.reduce((sum, item) => sum + (item.ratio / 100) * item.returnRate, 0)
    : 0;

  const updatePortfolioItem = (id: string, key: string, value: any) => {
    updateData({
      portfolio: data.portfolio.map(p => p.id === id ? { ...p, [key]: value } : p)
    });
  };

  const removePortfolioItem = (id: string) => {
    updateData({ portfolio: data.portfolio.filter(p => p.id !== id) });
  };

  const addPortfolioItem = () => {
    updateData({
      portfolio: [...data.portfolio, { id: Date.now().toString(), name: '新規商品', ratio: 0, returnRate: 3.0 }]
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      return (
        <div className="bg-slate-800 text-white p-3 rounded-lg shadow-xl text-sm">
          <p className="font-bold mb-1">{label}歳</p>
          <p className="text-emerald-400 font-bold">{formatCurrency(pData.amount)}</p>
          {pData.event && <p className="text-yellow-300 mt-1 text-xs">★ {pData.event}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">40年シミュレーション</h2>
      
      <Card className="p-2 sm:p-5 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={simData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="age" tickFormatter={(v) => `${v}歳`} tick={{fontSize: 10, fill: '#64748b'}} />
            <YAxis tickFormatter={(v) => `${v/10000}万`} width={45} tick={{fontSize: 10, fill: '#64748b'}} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
            {simData.map((d, i) => d.event ? (
              <ReferenceDot key={i} x={d.age} y={d.amount} r={4} fill="#F59E0B" stroke="white" strokeWidth={2} />
            ) : null)}
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">ポートフォリオ管理</h3>
          <div className="text-right">
            <p className="text-xs text-slate-500">期待リターン</p>
            <p className="font-bold text-emerald-600">{weightedReturn.toFixed(2)}%</p>
          </div>
        </div>

        {totalRatio !== 100 && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4 font-medium">
            <AlertCircle size={16} /> 合計比率を100%にしてください（現在: {totalRatio}%）
          </div>
        )}

        <div className="space-y-3">
          {data.portfolio.map((item) => (
            <div key={item.id} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <input 
                  value={item.name}
                  onChange={(e) => updatePortfolioItem(item.id, 'name', e.target.value)}
                  className="bg-transparent font-bold text-slate-800 dark:text-slate-100 outline-none w-2/3"
                />
                <button onClick={() => removePortfolioItem(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] text-slate-500">比率 (%)</label>
                  <input 
                    type="number" 
                    value={item.ratio}
                    onChange={(e) => updatePortfolioItem(item.id, 'ratio', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-2 text-sm outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-slate-500">利回り (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={item.returnRate}
                    onChange={(e) => updatePortfolioItem(item.id, 'returnRate', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-2 text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button onClick={addPortfolioItem} variant="outline" className="mt-4 border-dashed text-sm py-2">
          <PlusCircle size={16} /> 商品を追加
        </Button>
      </Card>
    </div>
  );
};
