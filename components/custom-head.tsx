const CustomHead = ({ meta }: { meta: { title: string; description: string; image: string } }) => {
  // Fixed name and paths
  const Site = `NSFW Commissions`
  const twitterCard = `https://img.aozaki.cc/nsfw-cover.jpg`

  // Get Current Title
  const currentTitle = Site

  // Here goes the SEO part
  return (
    <>
      {/* SEO : Traditional */}
      <meta name="robots" content="noindex" />
      <title>{currentTitle}</title>
      <meta name="title" content={currentTitle} />
      <meta name="author" content="Crystallize" />
      <meta name="description" content={meta.description} />

      {/* SEO : Opengraph */}
      <meta property="og:title" content={currentTitle} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={twitterCard} />
      <meta name="og:site_name" content={Site} />

      {/* SEO : Twitter Card */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:image" content={twitterCard} />
      <meta property="twitter:title" content={currentTitle} />
      <meta property="twitter:description" content={meta.description} />
      <meta property="twitter:site" content="NSFW Commissions" />

      {/* SEO : PWA realted */}
      <meta name="application-name" content={Site} />
      <meta name="apple-mobile-web-app-title" content={Site} />
      <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#6fa8dc" />

      {/* SEO : RSS */}
      <link rel="feed" href="/index.xml" type="application/rss+xml" title={Site} className="" />
    </>
  )
}

export default CustomHead
