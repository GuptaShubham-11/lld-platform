import Link from 'next/link';
import { BrandName } from '@/components/core/brand-name';
import { HugeiconsIcon } from '@hugeicons/react';
import { GithubIcon, NewTwitterIcon, Linkedin02Icon } from '@hugeicons/core-free-icons';

const footerLinks = [
  {
    heading: 'Product',
    links: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Problems', href: '/problems' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      {
        label: 'Design patterns guide',
        href: 'https://medium.com/swlh/design-pattern-explained-in-five-minutes-4eae439005d6',
      },
      {
        label: 'SOLID principles',
        href: 'https://medium.com/backticks-tildes/the-s-o-l-i-d-principles-in-pictures-b34ce2f1e898',
      },
      { label: 'Blog', href: '/blog' },
      {
        label: 'Roadmap',
        href: 'https://medium.com/@sandeep.kumar.ece16/low-level-design-roadmap-7581688d96fa',
      },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Portfolio', href: 'https://gupta-shubham-11.vercel.app' },
      { label: 'Contact', href: 'https://www.linkedin.com/in/guptashubham11' },
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Terms of service', href: '/terms' },
    ],
  },
];

const socials = [
  { icon: GithubIcon, label: 'GitHub', href: 'https://github.com/GuptaShubham-11' },
  { icon: NewTwitterIcon, label: 'Twitter', href: 'https://x.com/GuptaShubham91' },
  { icon: Linkedin02Icon, label: 'LinkedIn', href: 'https://www.linkedin.com/in/guptashubham11' },
];

export function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="flex flex-col gap-4">
            <BrandName href="/" className="text-lg" />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Practice real-world low-level design problems and get instant AI feedback on every
              attempt.
            </p>
          </div>

          {/* link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerLinks.map((col) => (
              <div key={col.heading} className="flex flex-col gap-3.5">
                <span className="text-sm font-semibold tracking-wider text-foreground">
                  {col.heading}
                </span>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-foreground transition-colors duration-200 text-muted-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col-reverse items-center gap-4 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DesignLoop. All rights reserved.
          </p>

          <div className="flex items-center gap-1">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 hover:bg-card hover:text-primary"
              >
                <HugeiconsIcon icon={s.icon} size={16} strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
