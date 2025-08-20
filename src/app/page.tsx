export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="font-recoleta text-6xl md:text-8xl font-black tracking-tighter">
          Your new obsession
        </h1>
        <h1 className="font-recoleta text-6xl md:text-8xl font-black tracking-tighter text-electric-violet">
          has arrived.
        </h1>
        <p className="mt-6 max-w-xl text-lg md:text-xl text-deep-space/80">
          Stop guessing. Start growing. Humanly Social is the ridiculously smart way to manage your brand&apos;s UGC, from creator discovery to content that converts.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#"
            className="rounded-full bg-juicy-orange px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-juicy-orange"
          >
            You in?
          </a>
          <a href="#" className="text-lg font-semibold leading-6 text-deep-space">
            Book a demo <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </main>
  );
}
