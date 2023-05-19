import Script from 'next/script'

const Analytics = () => {
  return (
    <Script
      strategy="afterInteractive"
      data-domain="crystallize.eu.org"
      src="https://sight.aozaki.cc/app-event.js"
    />
  )
}

export default Analytics
