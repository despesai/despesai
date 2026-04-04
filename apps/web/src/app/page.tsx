'use client'

import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { FeatureCard } from '@/components/feature-card'
import { useAuth } from '@/contexts/auth-context'

export default function Home() {
  const router = useRouter()
  const { user, isReady, logout } = useAuth()

  return (
    <div className="bg-background text-foreground relative min-h-screen w-full overflow-x-hidden font-sans">

      <div className="bg-brand-purple/20 pointer-events-none absolute -top-[10%] -right-[10%] h-[600px] w-[600px] rounded-full blur-[120px]" />
      <div className="bg-brand-cyan/10 pointer-events-none absolute top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full blur-[100px]" />

      <nav className="bg-background/80 fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/5 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="from-brand-purple to-brand-cyan flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br">
            <Icon icon="lucide:activity" className="text-xl text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">DespesAI</span>
        </div>
        <div className="text-muted-foreground hidden gap-8 text-sm font-medium md:flex">
          <Link
            href="#features"
            className="hover:text-foreground transition-colors"
          >
            Funcionalidades
          </Link>
        </div>
        {!isReady ? (
          <span
            className="bg-muted inline-block h-9 w-[7.5rem] animate-pulse rounded-full"
            aria-hidden
          />
        ) : user ? (
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground hidden text-sm font-medium sm:inline">
              Olá, {user.name}
            </span>
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground hidden text-sm font-semibold transition-colors sm:inline"
            >
              Painel
            </Link>
            <button
              type="button"
              onClick={async () => {
                await logout()
              }}
              className="text-muted-foreground cursor-pointer rounded-full border border-white/10 px-4 py-2 text-sm font-semibold transition-colors hover:text-foreground"
            >
              Sair
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="bg-foreground text-background cursor-pointer rounded-full px-5 py-2 text-sm font-bold transition-opacity hover:opacity-90"
          >
            Entrar no App
          </button>
        )}
      </nav>

      <section className="relative flex flex-col items-center px-6 pt-32 pb-20 text-center">
        <div className="bg-brand-purple/10 border-brand-purple/20 text-brand-purple mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold">
          <span className="relative flex h-2 w-2">
            <span className="bg-brand-purple absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
            <span className="bg-brand-purple relative inline-flex h-2 w-2 rounded-full"></span>
          </span>
          NOVA IA DE PROCESSAMENTO DISPONÍVEL
        </div>

        <h1 className="mb-8 max-w-4xl text-5xl leading-[1.1] font-extrabold tracking-tighter md:text-7xl">
          Sua gestão financeira no{' '}
          <span className="from-brand-purple to-brand-cyan bg-linear-to-r bg-clip-text text-transparent">
            piloto automático
          </span>
        </h1>

        <p className="text-muted-foreground mb-10 max-w-2xl text-lg leading-relaxed md:text-xl">
          O DespesAI usa inteligência artificial para ler seus extratos,
          classificar gastos e prever seu caixa sem que você precise digitar uma
          única linha.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => router.push('/register')}
            className="bg-brand-purple shadow-brand-purple/25 flex h-14 cursor-pointer items-center gap-2 rounded-xl px-8 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105"
          >
            Começar Grátis <Icon icon="lucide:arrow-right" />
          </button>
        </div>

        <div className="bg-card/50 relative mt-20 w-full max-w-5xl rounded-2xl border border-white/10 p-2 shadow-2xl transition-all hover:scale-[1.01]">
          <div className="from-brand-purple to-brand-cyan absolute -inset-1 -z-10 rounded-2xl bg-linear-to-r opacity-30 blur-2xl"></div>
          <div className="border-border bg-background relative aspect-video overflow-hidden rounded-xl border">
            <Image
              src="/dashboard-morckup.jpeg"
              alt="Preview do DespesAI Dashboard"
              fill
              className="object-cover object-top"
              priority
            />
            <div className="from-background/40 pointer-events-none absolute inset-0 bg-linear-to-t to-transparent"></div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <FeatureCard
            icon="lucide:scan-eye"
            title="Leitura de PDF e Imagem"
            desc="Arraste seu extrato bancário ou nota fiscal e deixe nossa IA extrair cada centavo automaticamente."
          />
          <FeatureCard
            icon="lucide:brain-circuit"
            title="Classificação Inteligente"
            desc="A IA aprende com seus hábitos e categoriza gastos como alimentação, lazer ou impostos."
          />
          <FeatureCard
            icon="lucide:trending-up"
            title="Previsão de Fluxo"
            desc="Saiba quanto você terá na conta no final do mês com base no seu histórico e assinaturas."
          />
        </div>
      </section>
    </div>
  )
}


