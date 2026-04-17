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

    const isTouchDevice = ScrollTrigger.isTouch > 0;
    const cleanupTasks: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("[data-reveal='section']");

      const animateOnEnter = (
        targets: gsap.TweenTarget,
        fromVars: gsap.TweenVars,
        toVars: gsap.TweenVars,
        trigger: gsap.DOMTarget,
        start: string,
      ) => {
        ScrollTrigger.create({
          trigger,
          start,
          once: true,
          onEnter: () => {
            gsap.fromTo(targets, fromVars, toVars);
          },
        });
      };

      sections.forEach((section) => {
        animateOnEnter(
          section,
          { autoAlpha: 0, y: 42 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
          },
          section,
          "top 84%",
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

        animateOnEnter(
          items,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: amount,
          },
          triggerSelector,
          "top 82%",
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

      if (isTouchDevice) {
        const fallbackSelector = "[data-reveal='section'], .js-catalog-card, .js-client-card, .js-benefit-card, .js-step-card";
        let rafId = 0;

        const revealStuckVisibleElements = () => {
          const viewportHeight = window.innerHeight;
          const elements = document.querySelectorAll<HTMLElement>(fallbackSelector);

          elements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const inViewport = rect.top < viewportHeight * 1.08 && rect.bottom > -40;
            if (!inViewport) {
              return;
            }

            const computed = window.getComputedStyle(element);
            const hiddenByAnimation = computed.visibility === "hidden" || Number(computed.opacity) < 0.08;
            if (hiddenByAnimation) {
              gsap.to(element, {
                autoAlpha: 1,
                y: 0,
                duration: 0.45,
                ease: "power2.out",
                overwrite: "auto",
              });
            }
          });
        };

        const scheduleFallbackReveal = () => {
          if (rafId) {
            return;
          }

          rafId = window.requestAnimationFrame(() => {
            rafId = 0;
            revealStuckVisibleElements();
          });
        };

        const firstPass = window.setTimeout(scheduleFallbackReveal, 220);
        const secondPass = window.setTimeout(scheduleFallbackReveal, 900);
        window.addEventListener("scroll", scheduleFallbackReveal, { passive: true });
        window.addEventListener("resize", scheduleFallbackReveal);

        cleanupTasks.push(() => {
          window.clearTimeout(firstPass);
          window.clearTimeout(secondPass);
          window.removeEventListener("scroll", scheduleFallbackReveal);
          window.removeEventListener("resize", scheduleFallbackReveal);
          if (rafId) {
            window.cancelAnimationFrame(rafId);
          }
        });
      }

      const refreshOnLoad = () => ScrollTrigger.refresh();
      const delayedRefresh = window.setTimeout(refreshOnLoad, 300);
      window.addEventListener("load", refreshOnLoad);
      cleanupTasks.push(() => {
        window.clearTimeout(delayedRefresh);
        window.removeEventListener("load", refreshOnLoad);
      });
    });

    return () => {
      cleanupTasks.forEach((task) => task());
      ctx.revert();
    };
  }, []);

  return null;
}
