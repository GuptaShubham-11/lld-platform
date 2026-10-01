'use client';

import { Container } from '@/components/core/container';
import { Footer } from '@/components/home/footer';
import { Hero } from '@/components/home/hero';
import { HowItWorks } from '@/components/home/how-works';
import { Navbar } from '@/components/home/navbar';
import { Pricing } from '@/components/home/pricing';

export default function Home() {
  return (
    <Container>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Pricing />
      <Footer />
    </Container>
  );
}
