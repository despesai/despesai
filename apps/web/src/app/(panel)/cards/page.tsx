'use client'

import { Calendar, CreditCard, DollarSign, Plus, Trash2 } from 'lucide-react' // Se não tiver lucide-react, instale: pnpm add lucide-react
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  CreditCard as CreditCardType,
  creditCardsApi,
} from '@/lib/credit-cards-api'

import { CreateCardDialog } from './_components/create-card-dialog'

export default function CartoesPage() {
  const [cards, setCards] = useState<CreditCardType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchCards = async () => {
    setIsLoading(true)
    try {
      const data = await creditCardsApi.list()
      setCards(data)
    } catch (error) {
      console.error('Erro ao buscar cartões:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este cartão?'
    )
    if (!confirmar) return

    try {
      await creditCardsApi.delete(id)
      fetchCards() // Recarrega a lista após excluir
    } catch (error) {
      console.error('Erro ao excluir cartão:', error)
      alert('Não foi possível excluir o cartão.')
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {}
      <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meus Cartões</h2>
          <p className="text-muted-foreground">
            Gerencie seus limites, datas de fechamento e faturas.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Cartão
        </Button>
      </div>

      <Separator />

      {}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-muted-foreground animate-pulse">
            Carregando cartões...
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card) => (
            <Card
              key={card.id}
              className="border-t-primary relative overflow-hidden border-t-4 transition-all hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex w-full flex-col space-y-1 overflow-hidden pr-2">
                  <CardTitle className="truncate text-sm font-medium">
                    {card.name}
                  </CardTitle>
                  <CreditCard className="text-muted-foreground h-4 w-4" />
                </div>

                {/* Botão de Excluir (Lixeira) */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 shrink-0"
                  onClick={() => handleDelete(card.id)}
                  title="Excluir cartão"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(card.limit)}
                </div>
                <p className="text-muted-foreground mb-4 text-xs">
                  Limite Total
                </p>

                <div className="bg-muted/50 mt-4 grid grid-cols-2 gap-2 rounded-md p-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground mb-1 flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" /> Fechamento
                    </span>
                    <span className="text-xs font-medium">
                      Dia {card.closingDay}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground mb-1 flex items-center gap-1 text-xs">
                      <DollarSign className="h-3 w-3" /> Vencimento
                    </span>
                    <span className="text-xs font-medium">
                      Dia {card.dueDay}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2 pb-4">
                <Button variant="secondary" className="h-8 w-full text-xs">
                  Ver Fatura
                </Button>
              </CardFooter>
            </Card>
          ))}

          {}
          <button
            onClick={() => setIsDialogOpen(true)}
            className="border-muted text-muted-foreground hover:border-primary hover:text-primary flex h-full min-h-[240px] flex-col items-center justify-center rounded-xl border-2 border-dashed bg-transparent p-6 transition-colors"
          >
            <Plus className="mb-2 h-8 w-8" />
            <span className="font-medium">Novo Cartão</span>
          </button>
        </div>
      )}

      {}
      {isDialogOpen && (
        <CreateCardDialog
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => {
            setIsDialogOpen(false)
            fetchCards()
          }}
        />
      )}
    </div>
  )
}
