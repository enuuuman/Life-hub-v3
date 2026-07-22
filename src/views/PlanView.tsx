import React, { useState } from 'react';
import { Card, Button, NumberInput } from '../components/ui/core';
import { useAppStore } from '../hooks/useAppStore';
import { formatCurrency } from '../utils/format';
import { Trash2, Plus, Sparkles } from 'lucide-react';

export const PlanView: React.FC = () => {
  const { data, updateData } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', age: data.age + 1, cost: 1000000 });

  const addEvent = () => {
    if (!newEvent.name) return;
    const event = { ...newEvent, id: Date.now().toString(), category: 'other' as const };
    updateData({ events: [...data.events, event].sort((a, b) => a.age - b.age) });
    setIsAdding(false);
    setNewEvent({ name: '', age: data.age + 1, cost: 1000000 });
  };

  const removeEvent = (id: string) => {
    updateData({ events: data.events.filter(e => e.id !== id) });
  };

  const autoGenerate = () => {
    const templates = [
      { id: Date.now() + '1', name: '車の買い替え', age: data.age + 5, cost: 3000000, category: 'other' as const },
      { id: Date.now() + '2', name: '住宅修繕', age: data.age + 15, cost: 5000000, category: 'housing' as const },
      { id: Date.now() + '3', name: '老後資金確保', age: 65, cost: 0, category: 'other' as const }
    ];
    updateData({ events: [...data.events, ...templates].sort((a, b) => a.age - b.age) });
  };

  return (
    <div className="p-5 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">ライフイベント</h2>
        <button onClick={autoGenerate} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full flex items-center gap-1 font-medium">
          <Sparkles size={14} /> 自動生成
        </button>
      </div>

      <div className="space-y-4">
        {data.events.length === 0 ? (
          <div className="text-center py-10 text-slate-400">イベントがありません</div>
        ) : (
          data.events.map(event => (
            <Card key={event.id} className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <div className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-bold w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  {event.age}歳
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{event.name}</p>
                  <p className="text-sm text-red-500 font-medium">-{formatCurrency(event.cost)}</p>
                </div>
              </div>
              <button onClick={() => removeEvent(event.id)} className="text-slate-300 hover:text-red-500 p-2 transition-colors">
                <Trash2 size={20} />
              </button>
            </Card>
          ))
        )}
      </div>

      {isAdding ? (
        <Card className="border-2 border-indigo-100 dark:border-slate-700">
          <h3 className="font-bold mb-4">新規イベント追加</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">イベント名</label>
              <input 
                value={newEvent.name} 
                onChange={e => setNewEvent({...newEvent, name: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-3 px-4 outline-none text-slate-800 dark:text-white"
                placeholder="例: 車の購入"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">発生年齢</label>
              <input 
                type="number" 
                value={newEvent.age} 
                onChange={e => setNewEvent({...newEvent, age: parseInt(e.target.value) || data.age})}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-3 px-4 outline-none text-slate-800 dark:text-white"
              />
            </div>
            <NumberInput label="予想費用" value={newEvent.cost} onChange={v => setNewEvent({...newEvent, cost: v})} />
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>キャンセル</Button>
              <Button onClick={addEvent}>追加する</Button>
            </div>
          </div>
        </Card>
      ) : (
        <Button onClick={() => setIsAdding(true)} variant="outline" className="border-dashed">
          <Plus size={20} /> イベントを追加
        </Button>
      )}

      {data.events.length > 0 && (
        <button onClick={() => updateData({ events: [] })} className="text-red-500 text-sm font-medium w-full text-center mt-8 p-4">
          すべてのイベントを削除
        </button>
      )}
    </div>
  );
};
