import WhitelistForm from './components/whitelist-form'
import SpinningLogo from './components/spinning-logo'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <SpinningLogo />
      <h1 className="text-4xl font-bold text-center mb-8">FiveM Server Whitelist Application</h1>
      <WhitelistForm />
    </main>
  )
}

