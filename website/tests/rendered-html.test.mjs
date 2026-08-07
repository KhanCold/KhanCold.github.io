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
  assert.ok(html.indexOf(">project</a>") < html.indexOf(">abstract</button>"));
  assert.match(html, /class="hf-news-highlight">🏆 #1 Paper of the Day<\/strong>/);
  assert.match(html, /class="hf-daily-link"/);
  assert.doesNotMatch(html, /Released <a [^>]*><strong>MerchantBench<\/strong><\/a>/);
  assert.doesNotMatch(html, /Released <strong>SPADER<\/strong> with code and model weights/);
  assert.match(html, /Long-Horizon/);
  assert.match(html, />Topics<\/span>/);
  assert.match(html, />Benchmark<\/span>/);
  assert.match(html, />Self-Improving<\/span>/);
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
});

test("includes service entries below awards", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");
  const awardsIndex = page.indexOf('"Awards"');
  const serviceIndex = page.indexOf('"Service"', awardsIndex);

  assert.ok(awardsIndex >= 0);
  assert.ok(serviceIndex > awardsIndex);
  assert.match(page.slice(serviceIndex), /OpenClaw Contributor/);
  assert.match(page.slice(serviceIndex), /2,000\+ Followers · 1M\+ Views/);
  assert.match(page, /社区服务/);
  assert.match(page, /粉丝数 2,000\+ · 浏览量 100 万\+/);
});

test("includes assets required by GitHub Pages", async () => {
  await Promise.all([
    access(new URL("_next/", outputRoot)),
    access(new URL("assets/profile-full.jpg", outputRoot)),
    access(new URL("assets/papers/merchantbench.jpg", outputRoot)),
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
