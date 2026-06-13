import { Helmet } from 'react-helmet-async';

export default function AdSenseScript() {
  const client = import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-4198491089532618';
  if (!client) return null;
  return (
    <Helmet>
      <meta name="google-adsense-account" content={client} />
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
      />
    </Helmet>
  );
}
