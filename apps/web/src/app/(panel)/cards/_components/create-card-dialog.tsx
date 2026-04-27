'use client'
import { useEffect,useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Bank,creditCardsApi } from '@/lib/credit-cards-api'

interface CreateCardDialogProps {
  onSuccess: () => void
  onClose: () => void
}

export function CreateCardDialog({
  onSuccess,
  onClose,
}: CreateCardDialogProps) {
  const [loading, setLoading] = useState(false)
  const [banks, setBanks] = useState<Bank[]>([])

  useEffect(() => {
    creditCardsApi.listBanks().then(setBanks).catch(console.error)
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)

    try {
      await creditCardsApi.create({
        name: formData.get('name') as string,
        limit: Number(formData.get('limit')),
        closingDay: Number(formData.get('closingDay')),
        dueDay: Number(formData.get('dueDay')),
        bankId: formData.get('bankId') as string,
      })
      onSuccess()
    } catch (error) {
      console.error('Erro ao criar cartão:', error)
      alert('Não foi possível criar o cartão. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background w-full max-w-md rounded-lg border p-6 shadow-lg">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Adicionar Cartão de Crédito</h2>
          <p className="text-muted-foreground text-sm">
            Preencha os dados do seu novo cartão.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Cartão</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Nubank Principal"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">Limite Total (R$)</Label>
            <Input
              id="limit"
              name="limit"
              type="number"
              step="0.01"
              placeholder="5000.00"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="closingDay">Dia de Fechamento</Label>
              <Input
                id="closingDay"
                name="closingDay"
                type="number"
                min="1"
                max="31"
                placeholder="5"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDay">Dia de Vencimento</Label>
              <Input
                id="dueDay"
                name="dueDay"
                type="number"
                min="1"
                max="31"
                placeholder="12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankId">Banco Emissor</Label>
            {}
            <select
              id="bankId"
              name="bankId"
              required
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecione um banco...</option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Cartão'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
