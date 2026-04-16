"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HomePageAnimations() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("[data-reveal='section']");

      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 42 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 84%",
              once: true,
            },
          },
        );
      });

      const heroLines = gsap.utils.toArray<HTMLElement>("[data-hero-line]");
      if (heroLines.length) {
        gsap.fromTo(
          heroLines,
          { autoAlpha: 0, yPercent: 115 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.12,
          },
        );
      }

      gsap.from("[data-hero-kicker]", {
        autoAlpha: 0,
        y: 18,
        duration: 0.65,
        ease: "power2.out",
      });

      gsap.from("[data-hero-description]", {
        autoAlpha: 0,
        y: 16,
        duration: 0.75,
        ease: "power2.out",
        delay: 0.44,
      });

      gsap.from("[data-hero-actions]", {
        autoAlpha: 0,
        y: 20,
        duration: 0.75,
        ease: "power2.out",
        delay: 0.56,
      });

      const heroImage = document.querySelector<HTMLElement>("[data-hero-image]");
      if (heroImage) {
        gsap.fromTo(
          heroImage,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 1.05, ease: "power3.out", delay: 0.16 },
        );
      }

      const staggerIn = (selector: string, triggerSelector: string, amount: number) => {
        const items = gsap.utils.toArray<HTMLElement>(selector);
        if (!items.length) {
          return;
        }

        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: amount,
            scrollTrigger: {
              trigger: triggerSelector,
              start: "top 82%",
              once: true,
            },
          },
        );
      };

      staggerIn(".js-catalog-card", ".js-catalog-card", 0.05);
      staggerIn(".js-client-card", ".js-client-card", 0.06);
      staggerIn(".js-benefit-card", ".js-benefit-card", 0.09);
      staggerIn(".js-step-card", ".js-step-card", 0.09);

      const indicators = gsap.utils.toArray<HTMLElement>("[data-indicator-value]");
      indicators.forEach((indicator) => {
        const target = Number(indicator.dataset.indicatorValue || 0);
        const suffix = indicator.dataset.indicatorSuffix || "";
        const state = { value: 0 };

        gsap.set(indicator, { textContent: `0${suffix}` });

        gsap.to(state, {
          value: target,
          duration: 1.6,
          ease: "power3.out",
          onUpdate: () => {
            indicator.textContent = `${Math.round(state.value)}${suffix}`;
          },
          scrollTrigger: {
            trigger: indicator,
            start: "top 88%",
            once: true,
          },
        });
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
