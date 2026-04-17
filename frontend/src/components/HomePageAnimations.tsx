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
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      const heroLines = gsap.utils.toArray<HTMLElement>("[data-hero-line]");
      const heroImage = document.querySelector<HTMLElement>("[data-hero-image]");

      if (isMobile) {
        if (heroLines.length) {
          gsap.from(heroLines, {
            autoAlpha: 0,
            y: 16,
            duration: 0.55,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.08,
          });
        }

        gsap.from("[data-hero-kicker]", {
          autoAlpha: 0,
          y: 12,
          duration: 0.45,
          ease: "power2.out",
        });

        gsap.from("[data-hero-description]", {
          autoAlpha: 0,
          y: 12,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.22,
        });

        gsap.from("[data-hero-actions]", {
          autoAlpha: 0,
          y: 14,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.3,
        });

        if (heroImage) {
          gsap.fromTo(
            heroImage,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.65, ease: "power2.out" },
          );
        }
        return;
      }

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

      if (heroImage) {
        gsap.fromTo(
          heroImage,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 1.05, ease: "power3.out", delay: 0.16 },
        );
      }

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
