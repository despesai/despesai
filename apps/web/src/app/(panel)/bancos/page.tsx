'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { bankApi, Bank } from '@/lib/bank-api'
import {
  Plus,
  Landmark,
  MoreVertical,
  Building2,
  Loader2,
  CreditCard,
} from 'lucide-react'
import { BankModal } from '@/components/bank-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Trash2, Edit2 } from 'lucide-react'

export default function BancosPage() {
  const { user, isReady } = useAuth()
  const router = useRouter()
  const [banks, setBanks] = useState<Bank[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bankToEdit, setBankToEdit] = useState<Bank | null>(null)

  // Função para carregar os bancos do backend
  const loadBanks = useCallback(async () => {
    try {
      const data = await bankApi.list()
      setBanks(data)
    } catch (error) {
      console.error('Erro ao carregar bancos:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Proteção de rota: redireciona se não houver usuário logado
  useEffect(() => {
    if (isReady && !user) {
      router.replace('/login')
    }
  }, [isReady, user, router])

  // Carrega os dados assim que o usuário estiver pronto
  useEffect(() => {
    if (isReady && user) {
      loadBanks()
    }
  }, [isReady, user, loadBanks])

  const handleDelete = async (id: string, name: string) => {
    // Usando confirm nativo para simplicidade.
    // Pode ser trocado por um AlertDialog do Shadcn no futuro.
    if (
      window.confirm(
        `Tem certeza que deseja excluir a conta ${name}? Esta ação não pode ser desfeita.`
      )
    ) {
      try {
        await bankApi.delete(id)
        loadBanks() // Atualiza a lista após deletar
      } catch (error) {
        console.error('Erro ao excluir banco:', error)
        alert('Não foi possível excluir a conta.')
      }
    }
  }

  const handleCreateNew = () => {
    setBankToEdit(null)
    setIsModalOpen(true)
  }

  // Função para abrir modal de Edição
  const handleEdit = (bank: Bank) => {
    setBankToEdit(bank)
    setIsModalOpen(true)
  }

  // Estado de carregamento ou redirecionamento
  if (!isReady || (isReady && !user) || isLoading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">
          Sincronizando contas...
        </p>
      </div>
    )
  }

  // Cálculo do saldo total garantindo que o valor decimal seja tratado como número
  const totalBalance = banks.reduce(
    (acc, bank) => acc + (Number(bank.balance) || 0),
    0
  )

  return (
    <div className="text-foreground mx-auto max-w-6xl space-y-8 pb-12">
      {/* Header simplificado conforme solicitado */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Minhas Contas</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gestão de instituições financeiras e saldos consolidados.
          </p>
        </div>
      </div>

      {/* Resumo de Saldo Total */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card text-card-foreground shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Saldo Total Disponível
            </CardTitle>
            <Landmark className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(totalBalance)}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              {banks.length}{' '}
              {banks.length === 1 ? 'conta ativa' : 'contas ativas'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid de Bancos extraídos do Prisma */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {banks.map((bank) => (
          <Card
            key={bank.id}
            className="border-border bg-card text-card-foreground group relative overflow-hidden shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Tarja lateral discreta (já que não há campo 'color' no schema) */}
            <div className="bg-primary/20 absolute top-0 bottom-0 left-0 w-1" />

            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary border-primary/20 flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm">
                  <Building2 size={20} />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">
                    {bank.name}
                  </CardTitle>
                  <p className="text-muted-foreground mt-0.5 text-xs font-medium">
                    Cod: {bank.bankCode}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground -mr-2 h-8 w-8"
                  >
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => handleEdit(bank)}
                    className="cursor-pointer"
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(bank.id, bank.name)}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                    Agência
                  </p>
                  <p className="text-sm font-medium">{bank.agency}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                    Conta
                  </p>
                  <p className="text-sm font-medium">{bank.accountNumber}</p>
                </div>
              </div>

              <div className="border-border/50 border-t pt-2">
                <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                  Saldo em Conta
                </p>
                <p className="text-xl font-bold tracking-tight">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(Number(bank.balance) || 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Botão de Criação de Banco (Gatilho do Modal) */}
        <button
          onClick={handleCreateNew}
          className="border-border bg-background/50 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 transition-all"
        >
          <div className="bg-card border-border rounded-full border p-3 shadow-sm transition-transform group-hover:scale-110">
            <Plus size={24} />
          </div>
          <div className="text-center">
            <span className="block text-sm font-bold">Nova Instituição</span>
            <span className="text-muted-foreground text-xs">
              Adicionar dados bancários
            </span>
          </div>
        </button>
      </div>

      {/* Componente Modal de Criação (Alinhado ao schema.prisma) */}
      <BankModal
        open={isModalOpen}
        onOpenChange={(isOpen) => {
          setIsModalOpen(isOpen)
          if (!isOpen) setBankToEdit(null) // Limpa o estado ao fechar
        }}
        onSuccess={loadBanks}
        bankToEdit={bankToEdit} // Passa o banco selecionado
      />
    </div>
  )
}
