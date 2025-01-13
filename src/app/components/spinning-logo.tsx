import Image from 'next/image'

export default function SpinningLogo() {
  return (
    <div className="flex justify-center mb-8">
      <div className="animate-spin-slow">
        <Image
          src="/logo.png"
          alt="FiveM Server Logo"
          width={100}
          height={100}
        />
      </div>
    </div>
  )
}