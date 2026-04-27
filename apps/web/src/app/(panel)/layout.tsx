'use client'

import {
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  Library,
  Receipt,
  Settings,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { ReactNode, useState } from 'react'

// ... (O componente SidebarItem continua exatamente igual)
interface SidebarItemProps {
  icon: any
  label: string
  isOpen?: boolean
  onClick?: () => void
  children?: ReactNode
}

function SidebarItem({
  icon: Icon,
  label,
  isOpen,
  onClick,
  children,
}: SidebarItemProps) {
  return (
    <div className="space-y-1">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
      >
        <div className="flex items-center gap-3">
          <Icon size={18} />
          {label}
        </div>
        {children && (
          <ChevronDown
            size={16}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>
      {isOpen && children && (
        <div className="ml-9 space-y-1 border-l border-slate-100 pl-2">
          {children}
        </div>
      )}
    </div>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }))
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
      {/* SIDEBAR ATUALIZADA AQUI */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col overflow-y-auto border-r border-slate-200 bg-white p-4 md:flex">
        <div className="mb-8 flex h-12 shrink-0 items-center px-2">
          <span className="text-xl font-bold tracking-tight text-indigo-600">
            Despesa.AI
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/dashboard">
            <SidebarItem icon={LayoutDashboard} label="Visão Geral" />
          </Link>

          <SidebarItem
            icon={Receipt}
            label="Transações"
            isOpen={openMenus['transacoes']}
            onClick={() => toggleMenu('transacoes')}
          >
            <div className="cursor-pointer py-1.5 text-xs text-slate-500 hover:text-slate-900">
              Ver Todas
            </div>
            <div className="cursor-pointer py-1.5 text-xs text-slate-500 hover:text-slate-900">
              Categorias
            </div>
          </SidebarItem>

          <SidebarItem
            icon={Library}
            label="Bancos"
            isOpen={openMenus['bancos']}
            onClick={() => toggleMenu('bancos')}
          >
            <Link
              href="/bancos"
              className="cursor-pointer py-1.5 text-xs text-slate-500 hover:text-slate-900"
            >
              Minhas Contas
            </Link>
            <div className="cursor-pointer py-1.5 text-xs text-slate-500 hover:text-slate-900">
              Conciliação
            </div>
          </SidebarItem>

          <SidebarItem
            icon={CreditCard}
            label="Cartões"
            isOpen={openMenus['cartoes']}
            onClick={() => toggleMenu('cartoes')}
          >
            <div className="cursor-pointer py-1.5 text-xs text-slate-500 hover:text-slate-900">
              Meus Cartões
            </div>
            <div className="cursor-pointer py-1.5 text-xs text-slate-500 hover:text-slate-900">
              Faturas
            </div>
          </SidebarItem>

          <SidebarItem icon={Settings} label="Configurações" />
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-end border-b border-slate-200 bg-white px-6">
          <div className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">Usuário</p>
              <p className="text-xs text-slate-500">Plano Pro</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-200 bg-indigo-100 text-indigo-600">
              <User size={18} />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
