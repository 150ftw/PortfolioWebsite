"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { blogPosts } from "@/lib/data";

/**
 * Blog — editorial magazine layout, asymmetric newspaper grid.
 *  - Post 01 spans left 60% — large lede piece.
 *  - Posts 02 & 03 stack on the right 40%.
 *  - A thin vertical rule divides left and right columns.
 */
export default function Blog() {
  const [lede, ...rest] = blogPosts;

  return (
    <section
      id="blog"
      className="relative w-full bg-ink px-6 py-32 text-paper md:px-[6vw]"
    >
      {/* Top label */}
      <div className="mb-14 flex items-baseline justify-between">
        <div className="ui-label tracking-[0.3em] text-paper/60">
          THOUGHT_STREAM
        </div>
        <div className="ui-label text-paper/40">/ 04 · JOURNAL</div>
      </div>

      <div className="relative grid grid-cols-1 gap-12 md:grid-cols-12">
        {/* Thin vertical divider — desktop only */}
        <div
          className="pointer-events-none absolute inset-y-0 left-[60%] hidden w-px bg-paper/15 md:block"
          aria-hidden
        />

        {/* LEDE POST — left 7 columns */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="md:col-span-7 md:pr-10"
        >
          <a
            href="#"
            data-cursor
            data-cursor-label="READ"
            className="group block"
          >
            <div
              className="brutal-heading text-acid"
              style={{ fontSize: "clamp(3rem, 8vw, 10rem)", lineHeight: 0.9 }}
            >
              {lede.number}
            </div>
            <h3
              className="editorial mt-4 italic leading-tight text-paper transition-transform duration-300 group-hover:translate-x-2"
              style={{ fontSize: "clamp(1.5rem, 2.4rem, 3rem)" }}
            >
              {lede.title}
            </h3>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-paper/70">
              {lede.excerpt}
            </p>
            <div className="mt-8 h-px w-full bg-paper/20" />
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <span className="ui-label text-acid">{lede.category}</span>
                <span className="ui-label text-paper/40">{lede.readTime}</span>
              </div>
              <ArrowUpRight
                size={20}
                className="text-paper/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-acid"
              />
            </div>
          </a>
        </motion.article>

        {/* RIGHT 5 columns — posts 02 & 03 stacked */}
        <div className="flex flex-col gap-10 md:col-span-5 md:pl-10">
          {rest.map((post, i) => (
            <motion.article
              key={post.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              className={i === 0 ? "" : "border-t border-paper/20 pt-10"}
            >
              <a
                href="#"
                data-cursor
                data-cursor-label="READ"
                className="group block"
              >
                <div
                  className={`brutal-heading ${
                    post.accent === "acid" ? "text-acid" : "text-danger"
                  }`}
                  style={{ fontSize: "clamp(2rem, 5vw, 6rem)", lineHeight: 0.9 }}
                >
                  {post.number}
                </div>
                <h4
                  className="editorial mt-3 italic leading-tight text-paper transition-transform duration-300 group-hover:translate-x-2"
                  style={{ fontSize: "clamp(1.2rem, 1.6rem, 2rem)" }}
                >
                  {post.title}
                </h4>
                <p className="mt-3 text-xs leading-relaxed text-paper/60">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <span
                    className={`ui-label ${
                      post.accent === "acid" ? "text-acid" : "text-danger"
                    }`}
                  >
                    {post.category}
                  </span>
                  <span className="ui-label text-paper/40">
                    {post.readTime}
                  </span>
                </div>
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
