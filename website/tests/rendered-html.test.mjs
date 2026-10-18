import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const outputRoot = new URL("../out/", import.meta.url);

test("exports the homepage as static HTML", async () => {
  const html = await readFile(new URL("index.html", outputRoot), "utf8");

  assert.match(html, /<title>Qiming Shi · 史启明<\/title>/);
  assert.match(html, /Agentic RL/);
  assert.match(html, /Research Interests[\s\S]*?AI Business/);
  assert.match(html, /recursive self-improvement \(RSI\)/);
  assert.doesNotMatch(html, /data intelligence|Recently, I have focused on/i);
  assert.match(html, /Wide Search Agent/);
  assert.match(html, /MerchantBench: Benchmarking LLM Agents/);
  assert.match(html, /arxiv\.org\/abs\/2607\.28956/);
  assert.match(html, /github\.com\/KhanCold\/merchantbench/);
  assert.match(html, /air\.1688\.com\/kapp\/next1688\/merchantbench/);
  assert.match(html, /class="project-icon"/);
  assert.match(html, />project<\/a>/);
  const merchantBenchStart = html.indexOf("MerchantBench: Benchmarking LLM Agents");
  const spaderStart = html.indexOf("SPADER: Step-wise Peer Advantage", merchantBenchStart);
  const skillKdStart = html.indexOf("SKILL-KD", spaderStart);
  const merchantBenchHtml = html.slice(merchantBenchStart, spaderStart);
  assert.ok(merchantBenchStart < spaderStart);
  assert.ok(spaderStart < skillKdStart);
  assert.ok(merchantBenchHtml.indexOf(">project</a>") < merchantBenchHtml.indexOf(">abstract</button>"));
  assert.match(html, /class="hf-news-highlight">🏆 #1 Paper of the Day<\/strong>/);
  assert.match(html, /class="hf-daily-link"/);
  assert.match(html, /class="media-coverage-link"/);
  assert.match(html, /class="media-news-highlight"/);
  assert.match(html, /机器之心 · Synced/);
  assert.match(html, /mp\.weixin\.qq\.com\/s\/go7vvpRyYFSvUp7BffmNTA/);
  assert.doesNotMatch(html, /Released <a [^>]*><strong>MerchantBench<\/strong><\/a>/);
  assert.doesNotMatch(html, /Released <strong>SPADER<\/strong> with code and model weights/);
  assert.match(html, /Long-Horizon/);
  assert.match(html, />Topics<\/span>/);
  assert.match(html, />Benchmark<\/span>/);
  assert.match(html, />Self-Evolving<\/span>/);
  assert.match(html, />Search Agent<\/span>/);
  assert.match(html, />Coding Agent<\/span>/);
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

test("keeps the Chinese About copy aligned with the English research focus", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");
  const about = page.slice(page.indexOf("function About("), page.indexOf('language === "zh" ? "动态" : "News"'));

  assert.match(about, /长程语言智能体/);
  assert.match(about, /递归自我改进（RSI）/);
  assert.match(about, /重点关注 <strong>AI Business<\/strong>/);
  assert.doesNotMatch(about, /数据智能|近期，我主要关注/);
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

test("shows the current AI Business internship above the completed Alibaba internship", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");
  const vitaStart = page.indexOf("function Vita(");
  const experienceStart = page.indexOf('"Experience"', vitaStart);
  const awardsStart = page.indexOf('"Awards"', experienceStart);
  const experience = page.slice(experienceStart, awardsStart);

  assert.match(experience, /2026\.09 — 至今/);
  assert.match(experience, /StepFun · Foundation Model Post-Training · Shanghai/);
  assert.match(experience, /参与 AI Business 能力建设/);
  assert.match(experience, /autonomous vending and supermarket operations/);
  assert.match(experience, /Env Scaling · Benchmark · Agentic RL/);
  assert.match(experience, /when="2026\.05 — 2026\.09"/);
  assert.ok(experience.indexOf("阶跃星辰") < experience.indexOf("阿里巴巴集团"));
  assert.doesNotMatch(experience, /2026\.05 — Present|2026\.05 — 至今/);
});

test("uses Coding Agent consistently instead of Code LLM", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");

  assert.doesNotMatch(page, /Code\s*LLMs?|代码大模型/i);
});

test("shows recent news in order and can reveal older entries", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");
  const newsStart = page.indexOf('language === "zh" ? "动态" : "News"');
  const newsEnd = page.indexOf('language === "zh" ? "精选论文" : "Selected Publications"', newsStart);
  const news = page.slice(newsStart, newsEnd);

  assert.ok(newsStart >= 0 && newsEnd > newsStart);
  assert.ok(news.indexOf("2026.10") < news.indexOf("2026.09"));
  assert.ok(news.indexOf("2026.09") < news.indexOf("2026.08"));
  assert.match(news, /<strong>SPADER<\/strong> was featured by/);
  assert.match(news, /机器之心 \(Synced\)/);
  assert.match(news, /className="media-news-highlight" href=\{spaderCoverageUrl\}/);
  assert.match(news, /Joined StepFun to work on AI Business/);
  assert.match(news, /className="dated-row" hidden=\{!showAllNews\}>\s*<time>2026\.05<\/time>/);

  assert.match(
    page,
    /Three papers: <strong>SPADER<\/strong>, <strong>BIRD-History<\/strong>, and\{" "\}/,
  );
  assert.match(
    page,
    /<strong>Modality Fault Lines<\/strong> were accepted to <strong>EMNLP 2026<\/strong>\./,
  );
  assert.doesNotMatch(page, /Papers coming soon for BIRD-History and Modality Fault Lines/);
  assert.match(
    page,
    /我们的三篇论文：<strong>SPADER<\/strong>、<strong>BIRD-History<\/strong> 和\{" "\}/,
  );
  assert.match(
    page,
    /<strong>Modality Fault Lines<\/strong> 被 <strong>EMNLP 2026<\/strong> 接收。/,
  );
  assert.doesNotMatch(page, /BIRD-History 与 Modality Fault Lines 的论文即将上线/);
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
  assert.match(birdSource, /topics: \["Coding Agent", "Benchmark"\]/);
  assert.match(birdSource, /assets\/papers\/bird-history-card\.jpg/);
  assert.match(birdSource, /paper: "https:\/\/arxiv\.org\/abs\/2608\.29345"/);
  assert.match(birdSource, /code: "https:\/\/github\.com\/zjuidg\/BIRD-History"/);

  assert.match(modalitySource, /"Zhaolu Kang"[\s\S]*?"Meixin Wu"[\s\S]*?"Qiming Shi"/);
  assert.match(modalitySource, /"Richeng Xuan"[\s\S]*?"Zhichao Hu"/);
  assert.match(modalitySource, /venue: "EMNLP 2026 Findings"/);
  assert.match(modalitySource, /rating: "CORE A\*"/);
  assert.match(modalitySource, /topics: \["Multimodal", "Benchmark"\]/);
  assert.match(modalitySource, /assets\/papers\/modality-fault-lines-card\.jpg/);
  assert.match(modalitySource, /paper: "https:\/\/arxiv\.org\/abs\/2608\.29278"/);
  assert.match(modalitySource, /project: "https:\/\/github\.com\/Zhaolu-K\/ModalityFaultLines-SCEval"/);
  assert.doesNotMatch(modalitySource, /\n\s+code:/);
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
    access(new URL("assets/logos/alibaba-group-mark.png", outputRoot)),
    access(new URL("assets/logos/stepfun.svg", outputRoot)),
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

test("left-aligns Vita dates and balances the Alibaba logo with the other internship icons", async () => {
  const css = await readFile(new URL("app/globals.css", projectRoot), "utf8");

  assert.match(css, /\.vita-row > time\s*\{[^}]*text-align:\s*left;/);
  assert.match(css, /\.institution-logo img\[src\$="\/alibaba-group-mark\.png"\]\s*\{[^}]*width:\s*40px;[^}]*height:\s*40px;/);
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

test("keeps the Microsoft logo compact", async () => {
  const css = await readFile(new URL("app/globals.css", projectRoot), "utf8");

  assert.match(
    css,
    /img\[src\$="\/microsoft\.svg"\][\s\S]*?width:\s*34px;[\s\S]*?height:\s*34px;/,
  );

});

test("removes the Xifei internship and achievements easter egg", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");
  const css = await readFile(new URL("app/globals.css", projectRoot), "utf8");
  const html = await readFile(new URL("index.html", outputRoot), "utf8");

  assert.doesNotMatch(page, /Xifei|西飞|AVIC|avic\.svg/);
  assert.doesNotMatch(page, /achievement|PixelIcon|pixelArt|onProfileClick|profileClick/i);
  assert.doesNotMatch(css, /achievement|pixel-icon|profile-photo-trigger/i);
  assert.doesNotMatch(html, /profile-photo-trigger|Papers coming soon/);
  assert.match(html, /<div class="profile-photo-frame"><img/);
});
