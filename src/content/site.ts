/**
 * Everything the handoff README lists under "Content still to fill".
 * Change values here; no markup edits needed.
 */
export const site = {
  name: 'Alicia',
  title: 'Alicia · I start things.',
  description:
    'You posted an AI Web Design Marketer role. So I built you a website instead of sending a resume. Design. Build. Market.',

  /** Both CTAs and the dock use this. */
  email: 'aliciakaith19@gmail.com',

  /** Resume + LinkedIn, used in the dock and the close section. */
  resumeUrl: '/Alicia-Wibawa-Resume.pdf',
  linkedinUrl: 'https://www.linkedin.com/in/alicia-wibawa-297655241/',

  /**
   * The before-figure in "The AI question" (the migration baseline).
   * Renders at 45% opacity next to the pink arrow and "10 minutes".
   */
  migrationBaseline: 'weeks',

  /**
   * Force reduced motion regardless of the OS setting.
   * `prefers-reduced-motion: reduce` is always honoured on top of this.
   */
  reduceMotion: false,
};

/**
 * Work cards. `metric` is the mono qualifier in the hover pill.
 * Accent rotation is pink → lime → violet → orange, one per card.
 * Links marked '#' still need a URL. `position` is the object-position
 * for captures wider than the 16:11 card.
 */
export const work = {
  featured: {
    name: 'Study Vision',
    metric: 'in progress · 100 pages solo',
    href: '#',
    /** Slowly pan the full-page capture inside the frame. */
    pan: true,
  },
  grid: [
    { name: 'Glossy Boys', metric: 'shopify store', href: 'https://glossyboys.com.au', tone: 'lime', position: '50% 0%' },
    { name: 'Glue Club', metric: 'shopify theme', href: 'https://glueclub-theme.sekalastudio.com', tone: 'violet' },
    { name: 'Isola Health', metric: 'dietitian clinic', href: 'https://www.isola.health', tone: 'orange' },
    { name: 'Just Lights', metric: 'lighting e-commerce', href: 'https://justlights.com.au', tone: 'pink', position: '50% 0%' },
    { name: 'CPAP Sales', metric: 'health e-commerce', href: 'https://www.cpapsales.com.au', tone: 'lime' },
    { name: 'Komo', metric: 'in progress · student housing app', href: '#', tone: 'violet', position: '0% 0%' },
  ],
  seeMoreHref: 'https://sekalastudio.com',
  /** The "see more" wheel. Order matches images.arc0…arc5; href '' = not clickable. */
  more: [
    { name: 'Eden Flower Studio', href: 'https://edenflowerstudio.com.au', tone: 'lime' },
    { name: 'Lyrebird (prototype, in progress)', href: '', tone: 'orange' },
    { name: 'Nunani', href: 'https://nunani.com.au', tone: 'pink' },
    { name: 'Studio 9 Fitness', href: 'https://www.studio9fitness.com.au', tone: 'violet' },
    { name: 'Onemed', href: 'https://www.onemed.com.au', tone: 'paper-2' },
    { name: 'Hemel Bioproduct', href: 'https://hemelbioproduct.com.au', tone: 'lime' },
  ],
} as const;
