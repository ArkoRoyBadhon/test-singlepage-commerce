import Link from 'next/link'

const NotFound = () => {
  return (
    <>
      <main className="flex min-h-[calc(100vh-180px)] w-full flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="font-libre text-[120px] leading-none font-bold">404</h1>
        <h2 className="font-manrope text-primary-text mb-4 text-2xl font-bold md:text-4xl">Oops! Page Not Found</h2>
        <p className="font-manrope text-secondary-text mx-auto mb-4 max-w-lg text-base md:text-lg">
          Sorry, this page doesn’t exist. Check the URL or return to the homepage.
        </p>
        <Link
          href="/"
          className="font-mont bg-primary-text hover:bg-opacity-90 hover:bg-primary-text/80 inline-flex h-12 items-center justify-center rounded-sm px-8 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 md:text-lg"
        >
          Back to Homepage
        </Link>
      </main>
    </>
  )
}

export default NotFound
