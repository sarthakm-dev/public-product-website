'use strict';

const SINGLE_TYPES = [
  {
    uid: 'api::landing-page.landing-page',
    data: {
      seoTitle: 'Accessibility Compliance Platform',
      seoDescription:
        'Monitor accessibility issues, review findings, and manage compliance workflows from one place.',
      hero: {
        eyebrow: 'Accessibility Intelligence',
        title: 'Ship accessible experiences with confidence',
        subtitle:
          'Track scans, review issues, and keep stakeholders aligned with a Strapi-powered content workflow.',
        primaryCtaLabel: 'Get started',
        primaryCtaHref: '/login',
        secondaryCtaLabel: 'Explore features',
        secondaryCtaHref: '/features',
      },
      testimonials: [],
      useCases: [],
      featurePageIntro: {
        title: 'Crawl, score, and export with confidence',
        description:
          'Feature content is sourced from Strapi and can be customized from the admin panel.',
      },
      pricingPageIntro: {
        title: 'Flexible plans for growing compliance programs',
        description:
          'Pricing content is managed in Strapi so the site can recover cleanly after a fresh database setup.',
      },
    },
  },
  {
    uid: 'api::stats-dashboard.stats-dashboard',
    data: {
      totalSitesCrawled: 0,
      accessibilityIssuesFound: 0,
      averageComplianceScore: 0,
      trend: [],
    },
  },
];

module.exports = {
  async bootstrap({ strapi }) {
    for (const entry of SINGLE_TYPES) {
      const existing = await strapi.db.query(entry.uid).findOne();

      if (existing) {
        continue;
      }

      await strapi.entityService.create(entry.uid, {
        data: entry.data,
      });
    }
  },
};
