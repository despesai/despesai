'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// Dados simulados para o frontend
const data = [
  { name: 'Jan', receitas: 4000, gastos: 2400 },
  { name: 'Fev', receitas: 3000, gastos: 1398 },
  { name: 'Mar', receitas: 5000, gastos: 4800 },
  { name: 'Abr', receitas: 4780, gastos: 3908 },
  { name: 'Mai', receitas: 5890, gastos: 4800 },
  { name: 'Jun', receitas: 4390, gastos: 3800 },
  { name: 'Jul', receitas: 4490, gastos: 4300 },
]

export function OverviewChart() {
  const [activeTab, setActiveTab] = useState<'gastos' | 'receitas' | 'relacao'>(
    'relacao'
  )

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="flex flex-col justify-between gap-4 pb-6 md:flex-row md:items-center">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">
            Visão Geral Financeira
          </CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Acompanhe seu fluxo de caixa mensal.
          </p>
        </div>

        {/* Controles de Abas (Tabs customizadas simples) */}
        <div className="flex w-fit rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab('gastos')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
              activeTab === 'gastos'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Gastos
          </button>
          <button
            onClick={() => setActiveTab('receitas')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
              activeTab === 'receitas'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Receitas
          </button>
          <button
            onClick={() => setActiveTab('relacao')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
              activeTab === 'relacao'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Relação
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                }}
                formatter={(value: any) => [`R$ ${value}`, '']}
              />
              {activeTab === 'relacao' && (
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
              )}

              {/* Renderização Condicional das Barras baseada na aba ativa */}
              {(activeTab === 'gastos' || activeTab === 'relacao') && (
                <Bar
                  dataKey="gastos"
                  name="Gastos"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              )}
              {(activeTab === 'receitas' || activeTab === 'relacao') && (
                <Bar
                  dataKey="receitas"
                  name="Receitas"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
