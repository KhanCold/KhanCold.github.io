import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const outputRoot = new URL("../out/", import.meta.url);

test("exports the homepage as static HTML", async () => {
  const html = await readFile(new URL("index.html", outputRoot), "utf8");

  assert.match(html, /<title>Qiming Shi · 史启明<\/title>/);
  assert.match(html, /Agentic RL/);
  assert.match(html, /Wide Search Agent/);
  assert.match(html, /MerchantBench: Benchmarking LLM Agents/);
  assert.match(html, /arxiv\.org\/abs\/2607\.28956/);
  assert.match(html, /github\.com\/KhanCold\/merchantbench/);
  assert.match(html, /air\.1688\.com\/kapp\/next1688\/merchantbench/);
  assert.match(html, /class="project-icon"/);
  assert.match(html, />project<\/a>/);
  const merchantBenchStart = html.indexOf("MerchantBench: Benchmarking LLM Agents");
  const skillKdStart = html.indexOf("SKILL-KD", merchantBenchStart);
  const spaderStart = html.indexOf("SPADER: Step-wise Peer Advantage", skillKdStart);
  const merchantBenchHtml = html.slice(merchantBenchStart, skillKdStart);
  assert.ok(merchantBenchStart < skillKdStart);
  assert.ok(skillKdStart < spaderStart);
  assert.ok(merchantBenchHtml.indexOf(">project</a>") < merchantBenchHtml.indexOf(">abstract</button>"));
  assert.match(html, /class="hf-news-highlight">🏆 #1 Paper of the Day<\/strong>/);
  assert.match(html, /class="hf-daily-link"/);
  assert.doesNotMatch(html, /Released <a [^>]*><strong>MerchantBench<\/strong><\/a>/);
  assert.doesNotMatch(html, /Released <strong>SPADER<\/strong> with code and model weights/);
  assert.match(html, /Long-Horizon/);
  assert.match(html, />Topics<\/span>/);
  assert.match(html, />Benchmark<\/span>/);
  assert.match(html, />Self-Evolving<\/span>/);
  assert.match(html, />Search Agent<\/span>/);
  assert.match(html, />Code LLM<\/span>/);
  assert.match(html, />HCI<\/span>/);
  assert.match(html, />see all<\/button>/);
  assert.doesNotMatch(html, />achievements<\/button>/);
  assert.match(html, /aria-label="Language selector"/);
  assert.match(html, />中文<\/button>/);
  assert.match(html, /class="abstract-icon"/);
  assert.match(html, /class="paper-icon"/);
  assert.doesNotMatch(html, />pdf<\/a>/);
  assert.doesNotMatch(html, /Excel Copilot|Data Intelligence/);
  assert.match(html, /favicon-32\.png/);
  assert.match(html, /profile-optimized\.jpg/);
  assert.match(html, /merchantbench-card\.jpg[^>]*loading="lazy"[^>]*decoding="async"/);
  assert.doesNotMatch(
    html,
    /<link rel="preload" as="image" href="\/assets\/papers\/[^"?]+-card\.jpg/,
  );
});

test("includes service entries below awards", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");
  const awardsIndex = page.indexOf('"Awards"');
  const serviceIndex = page.indexOf('"Service"', awardsIndex);

  assert.ok(awardsIndex >= 0);
  assert.ok(serviceIndex > awardsIndex);
  assert.match(page.slice(serviceIndex), /OpenClaw&Hermes Contributor/);
  assert.match(page.slice(serviceIndex), /2,000\+ Followers · 1M\+ Views/);
  assert.match(page, /社区服务/);
  assert.match(page, /粉丝数 2,000\+ · 浏览量 100 万\+/);
});

test("shows four news entries by default and can reveal the rest", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");

  assert.match(
    page,
    /Three papers: <strong>SPADER<\/strong>, <strong>BIRD-History<\/strong>, and\{" "\}/,
  );
  assert.match(
    page,
    /<strong>Modality Fault Lines<\/strong> were accepted to <strong>EMNLP 2026<\/strong>\.\s*<br \/>/,
  );
  assert.match(page, /<br \/>\s*Papers coming soon for BIRD-History and Modality Fault Lines\./);
  assert.match(
    page,
    /我们的三篇论文：<strong>SPADER<\/strong>、<strong>BIRD-History<\/strong> 和\{" "\}/,
  );
  assert.match(
    page,
    /<strong>Modality Fault Lines<\/strong> 被 <strong>EMNLP 2026<\/strong> 接收。\s*<br \/>/,
  );
  assert.match(page, /<br \/>\s*BIRD-History 与 Modality Fault Lines 的论文即将上线。/);
  assert.match(page, /One of our pull requests was merged into <strong>Hermes<\/strong>/);
  assert.match(page, /我们提交的一个 Pull Request 已被 <strong>Hermes<\/strong> 合并/);
  assert.match(page, /const \[showAllNews, setShowAllNews\] = useState\(false\)/);
  assert.match(
    page,
    /className="dated-row" hidden=\{!showAllNews\}>\s*<time>2026\.04<\/time>/,
  );
  assert.match(page, /className="dated-row" hidden=\{!showAllNews\}/);
  assert.match(page, /aria-expanded=\{showAllNews\}/);
  assert.match(page, /"Show more"/);
  assert.match(page, /"Show less"/);
});

test("lists SPADER as an EMNLP 2026 paper", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");
  const spaderStart = page.indexOf(
    "SPADER: Step-wise Peer Advantage with Diversity-Aware Exploration Rewards",
  );
  const spaderEnd = page.indexOf("BIRD-History:", spaderStart);
  const spaderSource = page.slice(spaderStart, spaderEnd);

  assert.ok(spaderStart >= 0);
  assert.ok(spaderEnd > spaderStart);
  assert.match(spaderSource, /venue: "EMNLP 2026"/);
  assert.match(spaderSource, /rating: "CORE A\*"/);
});

test("adds the two EMNLP Findings papers only to full publications in the requested order", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");
  const spaderStart = page.indexOf(
    "SPADER: Step-wise Peer Advantage with Diversity-Aware Exploration Rewards",
  );
  const birdStart = page.indexOf(
    "BIRD-History: A Benchmark for History-Driven Text-to-SQL with Fine-Grained Knowledge Annotations",
  );
  const modalityStart = page.indexOf(
    "Modality Fault Lines: Structural Corruptions Reveal Fragile Omni-Modal Reasoning",
  );
  const birdSource = page.slice(birdStart, modalityStart);
  const modalityEnd = page.indexOf('title: "Cerebra:', modalityStart);
  const modalitySource = page.slice(modalityStart, modalityEnd);
  const aboutStart = page.indexOf("function About");
  const aboutReturn = page.indexOf("return (", aboutStart);
  const featuredSource = page.slice(aboutStart, aboutReturn);

  assert.ok(spaderStart >= 0);
  assert.ok(spaderStart < birdStart);
  assert.ok(birdStart < modalityStart);
  assert.doesNotMatch(featuredSource, /BIRD-History|Modality Fault Lines/);

  assert.match(birdSource, /authors: \["Yunfan Zhou", "Qiming Shi", "Yizhou Yang", "Di Weng", "Yingcai Wu"\]/);
  assert.match(birdSource, /venue: "EMNLP 2026 Findings"/);
  assert.match(birdSource, /rating: "CORE A\*"/);
  assert.match(birdSource, /topics: \["Code LLM", "Benchmark"\]/);
  assert.match(birdSource, /assets\/papers\/bird-history-card\.jpg/);
  assert.doesNotMatch(birdSource, /\n\s+paper:/);

  assert.match(modalitySource, /"Zhaolu Kang"[\s\S]*?"Meixin Wu"[\s\S]*?"Qiming Shi"/);
  assert.match(modalitySource, /"Richeng Xuan"[\s\S]*?"Zhichao Hu"/);
  assert.match(modalitySource, /venue: "EMNLP 2026 Findings"/);
  assert.match(modalitySource, /rating: "CORE A\*"/);
  assert.match(modalitySource, /topics: \["Multimodal", "Benchmark"\]/);
  assert.match(modalitySource, /assets\/papers\/modality-fault-lines-card\.jpg/);
  assert.doesNotMatch(modalitySource, /\n\s+paper:/);
});

test("includes the August papers only in the full publication data", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");
  const newsStart = page.indexOf('language === "zh" ? "动态" : "News"');
  const publicationsStart = page.indexOf(
    'language === "zh" ? "精选论文" : "Selected Publications"',
    newsStart,
  );
  const newsSource = page.slice(newsStart, publicationsStart);
  const bcsdStart = page.indexOf("Bidirectional Context Self-Distillation for Reinforcement Learning");
  const bcsdEnd = page.indexOf("POEM: Phase-Aware", bcsdStart);
  const bcsdSource = page.slice(bcsdStart, bcsdEnd);

  assert.ok(newsStart >= 0);
  assert.ok(publicationsStart > newsStart);
  assert.doesNotMatch(newsSource, /Bidirectional Context Self-Distillation|POEM|Beyond Solution-Centric Search/);
  assert.match(page, /Bidirectional Context Self-Distillation for Reinforcement Learning/);
  assert.match(page, /POEM: Phase-Aware SO\(2\) Feature Rotation/);
  assert.match(page, /Beyond Solution-Centric Search: Adaptive Inquiry/);
  assert.match(page, /arxiv\.org\/abs\/2608\.09555/);
  assert.match(page, /arxiv\.org\/abs\/2608\.03630/);
  assert.match(page, /arxiv\.org\/abs\/2608\.02143/);
  assert.match(page, /tag: "OPD"/);
  assert.match(page, /tagZh: "自蒸馏"/);
  assert.match(page, /topics: \["OPD", "Self-Evolving"\]/);
  assert.match(bcsdSource, /"Linbo Jin†"/);
  assert.match(bcsdSource, /assets\/papers\/bcsd-card\.jpg/);
  assert.match(page, /"Di Weng†"/);
  assert.match(page, /"Linbo Jin†"/);
  assert.match(page, /topics: \["Autoresearch", "Self-Evolving"\]/);
  assert.doesNotMatch(
    page.slice(page.indexOf("function About"), page.indexOf("return (", page.indexOf("function About"))),
    /Bidirectional Context Self-Distillation|POEM|Beyond Solution-Centric Search/,
  );
});

test("includes assets required by GitHub Pages", async () => {
  await Promise.all([
    access(new URL("_next/", outputRoot)),
    access(new URL("assets/profile-optimized.jpg", outputRoot)),
    access(new URL("assets/papers/merchantbench-card.jpg", outputRoot)),
    access(new URL("assets/papers/bcsd-card.jpg", outputRoot)),
    access(new URL("assets/papers/poem-card.jpg", outputRoot)),
    access(new URL("assets/papers/beyond-solution-centric-search-card.jpg", outputRoot)),
    access(new URL("assets/papers/bird-history-card.jpg", outputRoot)),
    access(new URL("assets/papers/modality-fault-lines-card.jpg", outputRoot)),
    access(new URL("assets/papers/spader-card.jpg", outputRoot)),
    access(new URL("assets/papers/skill-kd-card.jpg", outputRoot)),
    access(new URL("assets/papers/cerebra-card.jpg", outputRoot)),
    access(new URL("assets/papers/xavier-card.jpg", outputRoot)),
    access(new URL("papers/spader.pdf", outputRoot)),
    access(new URL("favicon-32.png", outputRoot)),
    access(new URL(".nojekyll", outputRoot)),
  ]);

  const config = await readFile(new URL("next.config.ts", projectRoot), "utf8");
  assert.match(config, /output:\s*["']export["']/);
});

test("keeps the Zhejiang University logo clear of mobile education dates", async () => {
  const css = await readFile(new URL("app/globals.css", projectRoot), "utf8");

  assert.match(
    css,
    /\.institution-logo img\[src\$="\/zju\.png"\][\s\S]*?clip-path:\s*inset\(7px 16px 8px\)/,
  );
});

test("uses compact, readable layouts on phone-sized screens", async () => {
  const css = await readFile(new URL("app/globals.css", projectRoot), "utf8");
  const tabletMediaStart = css.indexOf("@media (max-width: 780px)");
  const phoneMediaStart = css.indexOf("@media (max-width: 560px)");
  const reducedMotionStart = css.indexOf("@media (prefers-reduced-motion", phoneMediaStart);
  const tabletCss = css.slice(tabletMediaStart, phoneMediaStart);
  const phoneCss = css.slice(phoneMediaStart, reducedMotionStart);

  assert.match(
    tabletCss,
    /\.sidebar\s*\{[\s\S]*?display:\s*grid;[\s\S]*?grid-template-columns:\s*112px minmax\(0, 1fr\)/,
  );
  assert.match(
    phoneCss,
    /\.vita-row\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\);[\s\S]*?row-gap:\s*6px/,
  );
  assert.match(
    phoneCss,
    /\.vita-row > time\s*\{[\s\S]*?text-align:\s*left;[\s\S]*?white-space:\s*nowrap/,
  );
  assert.match(
    phoneCss,
    /\.vita-body\s*\{[\s\S]*?grid-template-columns:\s*52px minmax\(0, 1fr\)/,
  );
  assert.match(
    phoneCss,
    /\.paper-visual\s*\{[\s\S]*?width:\s*min\(280px, 100%\);[\s\S]*?aspect-ratio:\s*10 \/ 7/,
  );
});

test("balances Microsoft and AVIC logo sizes", async () => {
  const css = await readFile(new URL("app/globals.css", projectRoot), "utf8");

  assert.match(
    css,
    /img\[src\$="\/microsoft\.svg"\][\s\S]*?width:\s*34px;[\s\S]*?height:\s*34px;/,
  );
  assert.match(
    css,
    /img\[src\$="\/avic\.svg"\][\s\S]*?width:\s*38px;[\s\S]*?height:\s*38px;/,
  );
});

test("dates the OpenClaw merge achievement to June 2026", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");

  assert.match(
    page,
    /id: "openclaw-merge"[\s\S]*?date: "2026\.06"[\s\S]*?dateTime: "2026-06"/,
  );
});

test("keeps achievements behind the five-click profile-photo easter egg", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");

  assert.match(page, /const nextCount = withinClickWindow \?[^;]+;/);
  assert.match(page, /if \(nextCount < 5\) return;/);
  assert.match(page, /setAchievementsUnlocked\(true\)/);
  assert.doesNotMatch(page, /achievementsUnlockKey|achievements-unlocked/);
  assert.match(page, /tab\.id !== "achievements" \|\| achievementsUnlocked/);
});
