'use client'
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Lightbulb,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Wallet,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { OverviewChart } from '@/components/overview-chart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'

export default function DashboardPage() {
  const { user, isReady } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isReady && !user) {
      router.replace('/login')
    }
  }, [isReady, user, router])

  if (!isReady || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">
            Carregando despesas…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Bem-vindo de volta ao seu controle financeiro.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 border-slate-200 font-medium text-slate-600"
          >
            <Upload size={16} />
            <span>Upload de Extrato</span>
          </Button>
          <Button className="gap-2 bg-indigo-600 font-medium text-white hover:bg-indigo-700">
            <Plus size={16} />
            <span>Nova Transação</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Kpi cards */}
        <KpiCard
          title="Saldo Total"
          value="R$ 12.450,00"
          description="Soma de todas as suas contas"
          icon={Wallet}
        />
        <KpiCard
          title="Receitas (Mês)"
          value="R$ 5.200,00"
          description="+12% em relação ao mês anterior"
          icon={ArrowUpCircle}
        />
        <KpiCard
          title="Despesas (Mês)"
          value="R$ 3.840,00"
          description="-5% em relação ao mês anterior"
          icon={ArrowDownCircle}
        />
      </div>

      {/* Grid Principal */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Coluna da esquerda */}
        <div className="space-y-6 md:col-span-12 lg:col-span-8">
          <OverviewChart />

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-800">
                Histórico Recente
              </CardTitle>
              <Button
                variant="ghost"
                className="text-xs font-bold text-indigo-600 hover:bg-indigo-50"
              >
                Ver tudo
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400">
                        ❖
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Transação Exemplo {item}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          27 de Abril, 2026
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-600">
                        - R$ 150,00
                      </p>
                      <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Nubank
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna da Direita*/}
        <div className="space-y-6 md:col-span-12 lg:col-span-4">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-slate-400" />
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Orçamentos do Mês
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <BudgetProgress
                category="Alimentação"
                spent={800}
                total={1000}
                colorClass="bg-orange-500"
              />
              <BudgetProgress
                category="Assinaturas"
                spent={120}
                total={150}
                colorClass="bg-blue-500"
              />
              <BudgetProgress
                category="Transporte"
                spent={250}
                total={200}
                colorClass="bg-indigo-600"
              />

              <Button
                variant="outline"
                className="w-full border-dashed border-slate-300 text-xs font-bold text-slate-500 hover:bg-slate-50"
              >
                + Ajustar Metas
              </Button>
            </CardContent>
          </Card>

          <Card className="border-indigo-200 bg-indigo-50/50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-600" />
                <CardTitle className="text-lg font-semibold text-indigo-900">
                  Insights da IA
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-950">
                    Limite de Alimentação
                  </p>
                  <p className="mt-0.5 text-xs text-indigo-800/80">
                    Você atingiu 80% do seu orçamento para refeições. Restam
                    apenas R$ 200.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-950">
                    Economia em Lazer
                  </p>
                  <p className="mt-0.5 text-xs text-indigo-800/80">
                    Este mês você gastou 15% menos em lazer. Que tal investir
                    esses R$ 150?
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Lightbulb size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-950">
                    Assinatura Detectada
                  </p>
                  <p className="mt-0.5 text-xs text-indigo-800/80">
                    Identificamos um novo débito de "Streaming XYZ". Deseja
                    categorizar?
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full text-xs font-bold text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700"
              >
                Ver todos os insights
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-slate-400" />
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Agenda de Contas
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <UpcomingBillItem
                title="Aluguel"
                value="R$ 2.400,00"
                dueDate="05/05"
                status="today"
              />
              <UpcomingBillItem
                title="Internet Fibra"
                value="R$ 120,00"
                dueDate="10/05"
                status="pending"
              />
              <UpcomingBillItem
                title="Netflix"
                value="R$ 55,90"
                dueDate="12/05"
                status="pending"
              />
              <UpcomingBillItem
                title="Energia (Cemig)"
                value="R$ 180,00"
                dueDate="25/04"
                status="paid"
              />

              <Button
                variant="ghost"
                className="w-full text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              >
                Ver calendário completo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function KpiCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string
  value: string
  description: string
  icon: any
}) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </CardContent>
    </Card>
  )
}

function BudgetProgress({
  category,
  spent,
  total,
  colorClass = 'bg-indigo-600',
}: {
  category: string
  spent: number
  total: number
  colorClass?: string
}) {
  const percentage = Math.min((spent / total) * 100, 100)
  const isOverBudget = spent > total

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-slate-700">{category}</p>
          <p className="text-[10px] text-slate-500">Limite: R$ {total}</p>
        </div>
        <div className="text-right">
          <p
            className={`text-sm font-bold ${isOverBudget ? 'text-red-600' : 'text-slate-900'}`}
          >
            R$ {spent}
          </p>
          <p className="text-[10px] text-slate-400">
            {Math.round(percentage)}%
          </p>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function UpcomingBillItem({
  title,
  value,
  dueDate,
  status = 'pending',
}: {
  title: string
  value: string
  dueDate: string
  status?: 'today' | 'pending' | 'paid'
}) {
  const statusStyles = {
    today: 'bg-red-50 text-red-600 border-red-100',
    pending: 'bg-slate-50 text-slate-600 border-slate-100',
    paid: 'bg-green-50 text-green-600 border-green-100',
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-md border ${statusStyles[status]}`}
        >
          {status === 'paid' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="text-[10px] font-medium text-slate-500">
            Vence em: {dueDate}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-900">{value}</p>
        <span
          className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase ${statusStyles[status]}`}
        >
          {status === 'today'
            ? 'Hoje'
            : status === 'paid'
              ? 'Pago'
              : 'Pendente'}
        </span>
      </div>
    </div>
  )
}
