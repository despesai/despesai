'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { bankApi, Bank } from "@/lib/bank-api"
import { Loader2 } from "lucide-react"

// 1. Adicionamos o bankToEdit na Interface
interface BankModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  bankToEdit?: Bank | null 
}

const formSchema = z.object({
  bankCode: z.string()
    .length(3, 'O código deve ter exatamente 3 dígitos')
    .regex(/^\d{3}$/, 'O código deve conter apenas números'),
  name: z.string()
    .min(2, 'O nome da instituição deve ter pelo menos 2 caracteres')
    .max(100, 'O nome da instituição é muito longo'),
  agency: z.string()
    .min(1, 'A agência é obrigatória')
    .max(10, 'O número da agência excede o tamanho máximo'),
  accountNumber: z.string()
    .min(1, 'O número da conta é obrigatório')
    .max(20, 'O número da conta excede o tamanho máximo'),
  balance: z.string()
    .min(1, 'O saldo é obrigatório')
    .refine((val) => !isNaN(Number(val.replace(',', '.'))), {
      message: "Digite um valor numérico válido",
    }),
})

// 2. Extraímos o bankToEdit aqui nas propriedades da função
export function BankModal({ open, onOpenChange, onSuccess, bankToEdit }: BankModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankCode: "",
      name: "",
      agency: "",
      accountNumber: "",
      balance: "",
    },
  })

  // 3. Efeito que preenche os dados se for uma Edição
  useEffect(() => {
    if (open && bankToEdit) {
      form.reset({
        bankCode: bankToEdit.bankCode,
        name: bankToEdit.name,
        agency: bankToEdit.agency,
        accountNumber: bankToEdit.accountNumber,
        balance: String(bankToEdit.balance).replace('.', ','),
      })
    } else if (!open) {
      form.reset({ bankCode: "", name: "", agency: "", accountNumber: "", balance: "" })
    }
  }, [open, bankToEdit, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setApiError(null)

    try {
      const numericBalance = Number(values.balance.replace(',', '.'))
      
      const payload = {
        bankCode: values.bankCode,
        name: values.name,
        agency: values.agency,
        accountNumber: values.accountNumber,
        balance: numericBalance,
      }

      // 4. Decide se Atualiza ou Cria
      if (bankToEdit) {
        await bankApi.update(bankToEdit.id, payload)
      } else {
        await bankApi.create(payload)
      }

      form.reset()
      onSuccess()
      onOpenChange(false)
      router.refresh()
    } catch (err: any) {
      console.error("Erro ao salvar banco:", err)
      setApiError(err.message || 'Erro ao comunicar com a API. Verifique o console.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset()
      setApiError(null)
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]"> 
        <DialogHeader>
          <DialogTitle>{bankToEdit ? 'Editar Conta' : 'Adicionar Nova Conta'}</DialogTitle>
          <DialogDescription>
            {bankToEdit 
              ? 'Atualize os dados da sua instituição financeira.' 
              : 'Insira os dados bancários da sua instituição.'}
          </DialogDescription>
        </DialogHeader>

        {apiError && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
            {apiError}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="bankCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input placeholder="260" maxLength={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Instituição</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Nubank, Itaú" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="agency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agência</FormLabel>
                    <FormControl>
                      <Input placeholder="0001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conta e Dígito</FormLabel>
                    <FormControl>
                      <Input placeholder="12345-6" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saldo Atual (R$)</FormLabel>
                  <FormControl>
                    <Input placeholder="0,00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {bankToEdit ? 'Salvar Alterações' : 'Salvar Conta'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}