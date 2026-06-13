import { Helmet } from 'react-helmet-async';

const pages = {
  about: {
    title: 'About Us',
    description: 'Speed News 24 is a digital news portal delivering fast updates, AI-assisted summaries, and Hindi-English coverage for readers in India and around the world.',
    sections: [
      ['Who We Are', 'Speed News 24 is built to help readers follow important stories quickly and clearly. We cover breaking news, India, world, politics, technology, sports, entertainment, education, and business.'],
      ['Our Editorial Approach', 'We combine automated news aggregation with editorial review tools. AI features help summarize, tag, and optimize news metadata, while editors can publish and manage articles from the admin panel.'],
      ['Languages', 'The platform supports Hindi and English so readers can follow stories in the language they prefer.']
    ]
  },
  contact: {
    title: 'Contact Us',
    description: 'Contact Speed News 24 for editorial queries, corrections, advertisements, sponsorships, and general support.',
    sections: [
      ['Editorial Contact', 'For news corrections, story suggestions, or content-related queries, email us at jobwitharun050201@gmail.com.'],
      ['Advertising', 'For sponsorships, display ads, and brand partnerships, email jobwitharun050201@gmail.com.'],
      ['General Support', 'For technical or account-related support, email jobwitharun050201@gmail.com.']
    ]
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    description: 'Speed News 24 privacy policy explains how we collect, use, and protect reader information.',
    sections: [
      ['Information We Collect', 'We may collect account details, newsletter email addresses, comments, device information, cookies, analytics data, and advertising identifiers.'],
      ['How We Use Information', 'We use information to operate the site, personalize content, send newsletters, prevent abuse, improve performance, and support advertising.'],
      ['Cookies And Ads', 'Third-party services such as analytics providers and advertising partners may use cookies to measure traffic and show relevant ads.'],
      ['Your Choices', 'You can unsubscribe from newsletters, disable cookies in your browser, and contact us for data-related requests.']
    ]
  },
  terms: {
    title: 'Terms And Conditions',
    description: 'Terms and conditions for using Speed News 24.',
    sections: [
      ['Use Of Website', 'By using Speed News 24, you agree to use the website lawfully and not misuse comments, accounts, or automated systems.'],
      ['Content', 'News content is provided for information. We work to keep information accurate, but developing news may change.'],
      ['User Comments', 'Users are responsible for their comments. We may moderate, remove, or block content that is abusive, illegal, spam, or misleading.'],
      ['Changes', 'We may update these terms from time to time as the service evolves.']
    ]
  },
  disclaimer: {
    title: 'Disclaimer',
    description: 'Speed News 24 disclaimer for news, external links, AI summaries, and advertising.',
    sections: [
      ['News Disclaimer', 'Speed News 24 publishes aggregated and editorial news content for informational purposes. Readers should verify important information from official sources when needed.'],
      ['AI Assistance', 'AI tools may help create summaries, headlines, tags, and SEO metadata. Editorial review is recommended before relying on sensitive information.'],
      ['External Links', 'Articles may link to third-party websites. We are not responsible for their content, policies, or availability.'],
      ['Advertising', 'Advertisements and sponsored links are managed separately from editorial coverage.']
    ]
  }
};

export default function StaticPage({ type }) {
  const page = pages[type] || pages.about;
  return (
    <main className="container-page py-10">
      <Helmet>
        <title>{page.title} | Speed News 24</title>
        <meta name="description" content={page.description} />
      </Helmet>
      <article className="news-card p-6 md:p-10">
        <h1 className="text-3xl font-black md:text-4xl">{page.title}</h1>
        <p className="mt-3 max-w-3xl text-zinc-600 dark:text-zinc-300">{page.description}</p>
        <div className="mt-8 grid gap-6">
          {page.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2 className="text-xl font-black">{heading}</h2>
              <p className="mt-2 leading-7 text-zinc-700 dark:text-zinc-300">{body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
