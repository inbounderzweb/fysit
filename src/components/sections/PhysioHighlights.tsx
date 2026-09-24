"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

import styles from "./PhysioHighlights.module.css";

const highlights = [
  {
    title: "Pain Relief Therapy",
    description:
      "Pain Relief Therapy is a targeted treatment designed to alleviate discomfort.",
    icon: "pain-relief",
    tone: "light",
  },
  {
    title: "Orthopedic Analysis",
    description:
      "This analysis helps diagnose conditions such as arthritis, sports injuries, deformities.",
    icon: "orthopedic",
    tone: "dark",
  },
  {
    title: "Injury Recovery",
    description:
      "Chiropractic care helps reduce pain, stiffness, and inflammation after car-related injuries.",
    icon: "injury-recovery",
    tone: "light",
  },
  {
    title: "Chronic Pain",
    description:
      "We address long-term pain conditions with gentle for sustainable relief.",
    icon: "chronic-pain",
    tone: "blue",
  },
] as const;

/** The reference's four introductory cards, immediately after the hero. */
export function PhysioHighlights() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="physio-highlights"
      aria-label="Physiotherapy treatment highlights"
      className={styles.section}
    >
      <ol className={styles.grid}>
        {highlights.map((highlight, index) => (
          <motion.li
            key={highlight.icon}
            className={styles.card}
            data-tone={highlight.tone}
            data-reveal
            // Keep server/client markup identical; CSS handles reduced motion
            // before hydration, and the transition below skips the animation.
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              // GSAP's power2.out is a cubic ease-out in the reference.
              ease: [1 / 3, 1, 2 / 3, 1],
            }}
          >
            <h2 className={styles.title}>{highlight.title}</h2>
            <p className={styles.description}>{highlight.description}</p>
            <span
              aria-hidden="true"
              className={styles.icon}
              style={
                {
                  "--highlight-icon": `url("/icons/physio-highlights/${highlight.icon}.svg")`,
                } as CSSProperties
              }
            />
            <div className={styles.numberWrap} aria-hidden="true">
              <div className={styles.numberPocket}>
                <span className={styles.number}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
