"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Tab = "about" | "vita" | "publications" | "achievements";
type Language = "en" | "zh";

const siteBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicAsset = (path: string) => `${siteBasePath}${path}`;
const profileClickWindow = 1200;
const merchantBenchProjectUrl =
  "https://air.1688.com/kapp/next1688/merchantbench/?spm=defwork.home.0.0.7f8c530dSdRT9v";

type Publication = {
  year: string;
  title: string;
  authors: string[];
  abstract: string;
  abstractZh: string;
  venue: string;
  rating?: string;
  tag: string;
  tagZh: string;
  topics: string[];
  image?: string;
  monogram?: string;
  project?: string;
  pdf?: string;
  paper?: string;
  code?: string;
  hfPaper?: string;
};

const tabs: { id: Tab; label: Record<Language, string> }[] = [
  { id: "about", label: { en: "about", zh: "关于" } },
  { id: "vita", label: { en: "vita", zh: "履历" } },
  { id: "publications", label: { en: "publications", zh: "论文" } },
  { id: "achievements", label: { en: "achievements", zh: "成就" } },
];

type AchievementIconName = "birth" | "followers" | "views" | "merge" | "rank" | "silver";

type Achievement = {
  id: string;
  icon: AchievementIconName;
  title: Record<Language, string>;
  detail: Record<Language, string>;
  quote: Record<Language, string>;
  date: string;
  dateTime: string;
  rare?: boolean;
};

const achievements: Achievement[] = [
  {
    id: "birth",
    icon: "birth",
    title: { en: "The Beginning", zh: "人生起点" },
    detail: {
      en: "Started the long game called life on September 27, 2001.",
      zh: "于 2001 年 9 月 27 日开始人生这场长期游戏。",
    },
    quote: {
      en: "“A journey of a thousand miles begins beneath one’s feet.” — Tao Te Ching",
      zh: "“千里之行，始于足下。”——《道德经》",
    },
    date: "2001.09",
    dateTime: "2001-09-27",
  },
  {
    id: "first-silver",
    icon: "silver",
    title: { en: "First Silver", zh: "第一枚银牌" },
    detail: {
      en: "Won an ACM/CCPC programming contest silver medal for the first time.",
      zh: "首次获得 ACM/CCPC 程序设计竞赛银牌。",
    },
    quote: {
      en: "“After countless blows, it still stands firm against every wind.” — Zheng Xie",
      zh: "“千磨万击还坚劲，任尔东西南北风。”——郑燮",
    },
    date: "2021.11",
    dateTime: "2021-11",
  },
  {
    id: "third-seat",
    icon: "rank",
    title: { en: "Top Three", zh: "位列前三" },
    detail: {
      en: "Ranked 3rd among 608 undergraduates, approximately top 0.5%.",
      zh: "本科成绩排名 3 / 608，约前 0.5%。",
    },
    quote: {
      en: "“I shall ascend the summit and see all mountains beneath me.” — Du Fu",
      zh: "“会当凌绝顶，一览众山小。”——杜甫",
    },
    date: "2024.06",
    dateTime: "2024-06",
    rare: true,
  },
  {
    id: "followers-2000",
    icon: "followers",
    title: { en: "2,000 Followers", zh: "两千关注" },
    detail: {
      en: "Reached 2,000 followers on CSDN.",
      zh: "CSDN 博客粉丝数突破 2,000。",
    },
    quote: {
      en: "“Is it not a joy to have friends come from afar?” — The Analects",
      zh: "“有朋自远方来，不亦乐乎。”——《论语》",
    },
    date: "2025.06",
    dateTime: "2025-06",
  },
  {
    id: "openclaw-merge",
    icon: "merge",
    title: { en: "Merged Upstream", zh: "合入上游" },
    detail: {
      en: "An OpenClaw pull request was merged into the project.",
      zh: "提交的 OpenClaw Pull Request 被项目正式合并。",
    },
    quote: {
      en: "“When two people are of one mind, their strength can cut through metal.” — I Ching",
      zh: "“二人同心，其利断金。”——《周易》",
    },
    date: "2026.06",
    dateTime: "2026-06",
    rare: true,
  },
  {
    id: "views-million",
    icon: "views",
    title: { en: "One Million Views", zh: "百万浏览" },
    detail: {
      en: "Surpassed one million total views on CSDN.",
      zh: "CSDN 博客累计浏览量突破 100 万。",
    },
    quote: {
      en: "“Writing is an affair of eternity; its gains and losses are known in the heart.” — Du Fu",
      zh: "“文章千古事，得失寸心知。”——杜甫",
    },
    date: "2025.08",
    dateTime: "2025-08",
    rare: true,
  },
];

const pixelArt: Record<AchievementIconName, { pixels: string[]; palette: Record<string, string> }> = {
  birth: {
    pixels: [
      "....YY....",
      "....YY....",
      "...PPPP...",
      "..WWWWWW..",
      "..WPPPPW..",
      "..WWWWWW..",
      ".BBBBBBBB.",
      ".BWWWWWWB.",
      ".BBBBBBBB.",
      "..........",
    ],
    palette: { Y: "#f6c453", P: "#e788a9", W: "#fff1d1", B: "#8f5f42" },
  },
  followers: {
    pixels: [
      "..SS..SS..",
      ".SFFS.SFFS",
      ".SFFS.SFFS",
      "..SS..SS..",
      ".BBBBBBBB.",
      "BBB.BB.BBB",
      "BB..BB..BB",
      "BB..BB..BB",
      "..........",
      "..........",
    ],
    palette: { S: "#5b5b71", F: "#f2c7a0", B: "#5b86c5" },
  },
  views: {
    pixels: [
      "..........",
      "...KKKK...",
      ".KKWWWWKK.",
      "KKWCCCCWKK",
      "KWCCDDCCWK",
      "KWCDDDDCWK",
      "KWCCDDCCWK",
      "KKWCCCCWKK",
      ".KKWWWWKK.",
      "...KKKK...",
    ],
    palette: { K: "#445063", W: "#eef2f4", C: "#58a8c4", D: "#26384c" },
  },
  merge: {
    pixels: [
      "..GG......",
      ".GWWG.....",
      ".GWWG..GG.",
      "..GG..GWWG",
      "..G...GWWG",
      "..G....GG.",
      "..G...GG..",
      "..G..GG...",
      "..GGGG....",
      "...GG.....",
    ],
    palette: { G: "#4fa66a", W: "#dff5e5" },
  },
  rank: {
    pixels: [
      "....GG....",
      "..GGGGGG..",
      ".G..GG..G.",
      ".G..GG..G.",
      "..GGGGGG..",
      "...GGGG...",
      "....GG....",
      "...BBBB...",
      "..BBBBBB..",
      ".BBBBBBBB.",
    ],
    palette: { G: "#d5ad4f", B: "#65769a" },
  },
  silver: {
    pixels: [
      "..BB..BB..",
      "..BBBBBB..",
      "...BBBB...",
      "...BBBB...",
      "..SSSSSS..",
      ".SWWWWWS..",
      ".SWWKKWS..",
      ".SWWWWWS..",
      "..SSSSSS..",
      "...SSSS...",
    ],
    palette: { B: "#5f7199", S: "#8c969f", W: "#e9ecee", K: "#bac1c5" },
  },
};

const languageChangeEvent = "site-language-change";

function subscribeToLanguage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(languageChangeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(languageChangeEvent, callback);
  };
}

function getLanguageSnapshot(): Language {
  const savedLanguage = window.localStorage.getItem("site-language");
  return savedLanguage === "zh" ? "zh" : "en";
}

type IconName = "mail" | "phone" | "github" | "scholar" | "blog";

function Icon({ name }: { name: IconName }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  } as const;

  if (name === "github") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49v-1.91c-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.94a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.89v2.8c0 .27.18.59.69.49A10.25 10.25 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
      </svg>
    );
  }

  const paths: Record<Exclude<IconName, "github">, React.ReactNode> = {
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    phone: <path d="M6.6 3h3l1.5 4-2 1.6a16 16 0 0 0 6.3 6.3l1.6-2 4 1.5v3A3.6 3.6 0 0 1 17.4 21 14.4 14.4 0 0 1 3 6.6 3.6 3.6 0 0 1 6.6 3Z" />,
    scholar: <><path d="m3 9 9-5 9 5-9 5-9-5Z" /><path d="M7 12v4c2.5 2 7.5 2 10 0v-4M21 9v6" /></>,
    blog: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a3 3 0 0 1 3 3v15a3 3 0 0 0-3-3H4Z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H14v18a3 3 0 0 1 3-3h3Z" /></>,
  };

  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

const publications: Publication[] = [
  {
    year: "2026",
    title:
      "Bidirectional Context Self-Distillation for Reinforcement Learning of Skill-Based LLM Agents",
    authors: [
      "Tianjun Pan",
      "Yuan Li",
      "Hongda Wang",
      "Linbo Jin†",
      "Mengfei Song",
      "Lei Gao",
      "Qiming Shi",
      "Shaokang Fu",
      "Jiarong Zhao",
      "Chengyu Wang",
      "Chengfu Huo",
    ],
    abstract:
      "External natural-language skills can guide LLM agents through complex tasks, but agents still need to learn how to turn that guidance into effective actions. We introduce BCSD, a bidirectional context self-distillation framework that augments reinforcement learning with token-level supervision from two complementary views of each trajectory. One view adds higher-level Meta-Skill guidance, while the other removes general guidance to emphasize task-specific skills; BCSD combines their signals to rescale the reinforcement learning advantage. Experiments on ALFWorld and WebShop show consistent improvements across model scales, and ablations confirm that the two context views make complementary contributions.",
    abstractZh:
      "外部自然语言技能可以为大语言模型智能体解决复杂任务提供可复用、可编辑的指导，但智能体仍需学会将这些指导转化为有效行动。我们提出 BCSD，一种双向上下文自蒸馏框架，通过同一轨迹的两种互补上下文视角，为强化学习引入词元级监督：增强视角加入更高层的元技能指导，精简视角则移除通用指导以突出任务特定技能；二者的信号被联合用于重缩放强化学习优势。在 ALFWorld 和 WebShop 上的实验表明，BCSD 在不同模型规模下均能稳定提升表现，消融实验也验证了两种上下文视角的互补作用。",
    venue: "arXiv 2026",
    tag: "OPD",
    tagZh: "自蒸馏",
    topics: ["OPD", "Self-Evolving"],
    image: publicAsset("/assets/papers/bcsd-card.jpg?v=260809555"),
    pdf: "https://arxiv.org/pdf/2608.09555",
    paper: "https://arxiv.org/abs/2608.09555",
  },
  {
    year: "2026",
    title:
      "POEM: Phase-Aware SO(2) Feature Rotation for Time Series Forecasting Under Periodicity Drift",
    authors: [
      "Jiawen Zhu",
      "Shuhan Liu",
      "Shengxuan Li",
      "Qiming Shi",
      "Di Weng†",
    ],
    abstract:
      "Deep learning has advanced time series forecasting, but periodicity drift, in which cycle timing and phase vary over time, remains a challenging problem. Existing methods predominantly model these sequences on fixed time grids, suffering from a limited ability to accommodate phase-related variation. To address this limitation, we propose POEM, a phase-aware forecasting framework based on latent feature rotation using the special orthogonal group in two dimensions, denoted by SO(2). POEM aims to reduce the phase-related variability by learning a phase-correction coordinate and applying an invertible SO(2)-based rotation to paired latent features. To extrapolate this correction coordinate, Directional Phase Increment Attention (DPIA) retrieves historical phase increments from similar temporal contexts and integrates them into future phase corrections. Experiments demonstrate that POEM achieves competitive performance, while qualitative visualizations suggest that the learned phase-aware transformation makes latent trajectories more regular.",
    abstractZh:
      "深度学习推动了时间序列预测的发展，但周期漂移仍是一个具有挑战性的问题，其中周期的时间位置和相位会随时间变化。现有方法主要在固定时间网格上建模这类序列，适应相位变化的能力有限。为此，我们提出 POEM：一个基于二维特殊正交群 SO(2) 潜在特征旋转的相位感知预测框架。POEM 学习相位校正坐标，并对成对的潜在特征施加可逆的 SO(2) 旋转，以减少相位相关的变化。为外推该校正坐标，方向性相位增量注意力（DPIA）从相似时间上下文中检索历史相位增量，并将其整合到未来的相位校正中。实验表明，POEM 取得了有竞争力的性能；定性可视化进一步显示，所学习的相位感知变换能使潜在轨迹更加规整。",
    venue: "arXiv 2026",
    tag: "Time Series",
    tagZh: "时间序列",
    topics: ["Time Series", "Forecasting"],
    image: publicAsset("/assets/papers/poem-card.jpg?v=8c07137a"),
    pdf: "https://arxiv.org/pdf/2608.03630",
    paper: "https://arxiv.org/abs/2608.03630",
  },
  {
    year: "2026",
    title:
      "Beyond Solution-Centric Search: Adaptive Inquiry and Knowledge Revision for Autonomous ML Engineering",
    authors: [
      "Shaokang Fu",
      "Yulong Tao",
      "Linbo Jin†",
      "Jiarong Zhao",
      "Qiming Shi",
      "Tianjun Pan",
      "Haonan Li",
      "Chengyu Wang",
      "Jia Wu",
      "Chengfu Huo",
    ],
    abstract:
      "Long-horizon autonomous research tasks such as machine learning engineering require systems to make interdependent decisions under a limited budget. Existing LLM-based agents typically organize candidate-solution improvement through tree, graph, or chain structures, meaning that the search process determines how information is acquired and managed. We call this design solution-centric search and propose instead the information paradigm, in which an evolving information state represents the system's understanding of the task and guides solution improvement. We instantiate this paradigm in Iris, an inquiry-revision loop. For information acquisition, Iris generates local action plans from the current information state and uses epistemic actions to probe decision-critical unknowns without modifying the retained solution. For information management, Iris synthesizes observations across experiments into task knowledge composed of revisable claims with explicit scope and status. It updates this knowledge as new evidence arrives and constructs each decision context from raw evidence, structured summaries, or task knowledge at the required level of detail. On MLE-Bench, Iris attains a 64.9% any-medal rate under a 12-hour budget, the highest among compared systems. Across four tasks spanning harness engineering and model post-training, Iris also demonstrates cross-domain generalization.",
    abstractZh:
      "机器学习工程等长程自主研究任务要求系统在有限预算下做出相互依赖的决策。现有基于大语言模型的智能体通常通过树、图或链式结构组织候选方案改进，使搜索过程同时决定信息如何获取和管理。我们将这种设计称为以方案为中心的搜索，并提出信息范式：用持续演化的信息状态表示系统对任务的理解，并以此指导方案改进。我们将这一范式实例化为 Iris，一个由探询与修订组成的循环。Iris 从当前信息状态生成局部行动计划，利用认知型行动探查影响决策的未知因素；同时将跨实验观察综合为由可修订论断组成的任务知识，并随新证据到来持续更新。在 MLE-Bench 上，Iris 在 12 小时预算下取得 64.9% 的任意奖牌率，为对比系统中的最高成绩；在涵盖评测框架工程和模型后训练的四项任务上，也展现了跨领域泛化能力。",
    venue: "arXiv 2026",
    tag: "Autoresearch",
    tagZh: "自主科研",
    topics: ["Autoresearch", "Self-Evolving"],
    image: publicAsset("/assets/papers/beyond-solution-centric-search-card.jpg?v=fd3e972c"),
    pdf: "https://arxiv.org/pdf/2608.02143",
    paper: "https://arxiv.org/abs/2608.02143",
  },
  {
    year: "2026",
    title:
      "MerchantBench: Benchmarking LLM Agents for Long-Term Coherence in E-Commerce Operations",
    authors: [
      "Qiming Shi",
      "Yulong Tao",
      "Linbo Jin†",
      "Zhaolu Kang",
      "Yibo Dou",
      "Jiawen Zhu",
      "Tianjun Pan",
      "Shaokang Fu",
      "Chengyu Wang",
      "Siyue Li",
      "Yaping Cheng",
      "Di Weng†",
      "Chengfu Huo",
    ],
    abstract:
      "Large language model agents are increasingly evaluated as autonomous tool users, yet most benchmarks focus on bounded tasks with immediate success criteria. Real-world deployments often require Long-Term Coherence, the capacity to preserve purposeful behavior across extended horizons while adapting decisions to accumulated evidence. We introduce MerchantBench, a 365-day order-level simulation grounded in 98,843 real e-commerce product records and equipped with 26 tools for agent interaction. MerchantBench couples promptly observable Upstream Supplier Events with delayed Downstream Order Outcomes, requiring agents to follow individual order lifecycles and revisit earlier decisions. We evaluate eight LLMs under two agent frameworks in 48 runs, each spanning 365 simulated days. Our results reveal a substantial gap between even the latest LLMs and human participants, with the best LLM configuration attaining only 27.3% of the mean final net assets achieved by human participants.",
    abstractZh:
      "大语言模型智能体正日益被当作自主工具使用者进行评测，但多数基准只关注成功标准可即时判断的有限任务。真实部署往往要求智能体具备长程连贯性，即在较长时间跨度内保持目标导向行为，并依据持续积累的证据调整决策。我们提出 MerchantBench：一个基于 98,843 条真实电商商品记录、配备 26 种交互工具的 365 天订单级模拟环境。该环境将可即时观察的上游供应商事件与延迟出现的下游订单结果相连接，要求智能体跟踪每个订单的完整生命周期，并回访先前决策。我们在两种智能体框架下评测了八个大语言模型，共完成 48 次、每次覆盖 365 个模拟日的运行。结果显示，即使是最新模型，与人类参与者之间仍存在显著差距；表现最好的模型配置最终净资产仅为人类平均水平的 27.3%。",
    venue: "arXiv 2026",
    tag: "Long-Horizon",
    tagZh: "长程智能体",
    topics: ["Long-Horizon", "Benchmark"],
    image: publicAsset("/assets/papers/merchantbench-card.jpg?v=c49cd1c5"),
    project: merchantBenchProjectUrl,
    pdf: "https://arxiv.org/pdf/2607.28956",
    paper: "https://arxiv.org/abs/2607.28956",
    code: "https://github.com/KhanCold/merchantbench",
    hfPaper: "https://huggingface.co/papers/2607.28956",
  },
  {
    year: "2026",
    title: "SKILL-KD: Contrastive Skill Distillation for LLM Agents",
    authors: [
      "Qiming Shi",
      "Yibo Dou",
      "Jiawen Zhu",
      "Yulong Tao",
      "Linbo Jin",
      "Zhaolu Kang",
      "Yunfan Zhou",
      "Di Weng†",
    ],
    abstract:
      "Skill-based prompting has become a practical mechanism for improving large language model agents, yet existing skill acquisition methods often treat skills as experience summaries, memory entries, or direct summaries of successful demonstrations. We propose SKILL-KD, a contrastive skill distillation framework that treats skills as an explicit distillation medium between agents of different capabilities. Given a student failure and the teacher trajectory on the same task, SKILL-KD distills their actionable discrepancy into a textual skill patch, evaluates the patch by re-running the student, and iteratively refines the patch when the student still fails. Drift-Aware Skill Consolidation maintains trace-linked edit histories and controls how new patches update the skill library. Across five agent benchmarks and two student settings, SKILL-KD consistently improves frozen student agents over fixed-model adaptation baselines.",
    abstractZh:
      "基于技能的提示已成为提升大语言模型智能体能力的实用机制，但现有技能获取方法往往将技能视为经验总结、记忆条目，或对成功示范的直接概括。我们提出 SKILL-KD，一种对比式技能蒸馏框架，将技能作为不同能力智能体之间显式的蒸馏媒介。给定学生智能体的一次失败及教师智能体在同一任务上的轨迹，SKILL-KD 将二者之间可执行的差异蒸馏为文本技能补丁，通过重新运行学生智能体评估补丁，并在学生仍然失败时迭代优化。漂移感知技能整合机制维护与轨迹关联的编辑历史，并控制新补丁如何更新技能库。在五个智能体基准和两种学生模型设置上，SKILL-KD 均能稳定提升冻结学生智能体，优于固定模型适配基线。",
    venue: "arXiv 2026",
    tag: "Self-Evolving",
    tagZh: "自进化",
    topics: ["Self-Evolving", "Skills"],
    image: publicAsset("/assets/papers/skill-kd-card.jpg?v=2be0f667"),
    pdf: "https://arxiv.org/pdf/2607.28048",
    paper: "https://arxiv.org/abs/2607.28048",
  },
  {
    year: "2026",
    title:
      "SPADER: Step-wise Peer Advantage with Diversity-Aware Exploration Rewards for Multi-Answer Question Answering",
    authors: [
      "Qiming Shi*",
      "Zhaolu Kang*",
      "Yunfan Zhou",
      "Di Weng†",
      "Yingcai Wu",
    ],
    abstract:
      "Large language models are increasingly deployed as tool-augmented agents to acquire information beyond parametric knowledge. While recent work has improved long-horizon tool-use reasoning, most approaches focus on tasks with a single correct answer. We propose SPADER, a reinforcement learning framework for long-horizon tool use in Multi-Answer QA. SPADER includes Step-wise Peer Advantage, a critic-free step-level credit assignment mechanism that aligns parallel trajectories by decision step and estimates advantages from peer returns. It also includes a diversity-aware exploration reward that promotes long-tail entity discovery by upweighting rare findings and downweighting redundant ones. Experiments on QAMPARI, Mintaka, WebQSP, and QUEST show that SPADER generally improves recall and overall F1 over prompting-based agents, outcome-supervised RL methods, and recent step-level supervision approaches.",
    abstractZh:
      "大语言模型正越来越多地作为工具增强型智能体，用于获取参数化知识之外的信息。尽管近期研究提升了长程工具使用推理能力，多数方法仍聚焦于仅有单一正确答案的任务。我们提出 SPADER，一个面向多答案问答中长程工具使用的强化学习框架。SPADER 包含逐步同伴优势机制：一种无需评论器的步骤级信用分配方法，它按决策步骤对齐并行轨迹，并利用同伴回报估计优势；同时引入多样性感知探索奖励，通过提高稀有发现的权重、降低重复结果的权重来促进长尾实体发现。在 QAMPARI、Mintaka、WebQSP 和 QUEST 上的实验表明，相比基于提示的智能体、结果监督强化学习方法以及近期的步骤级监督方法，SPADER 总体上提升了召回率和综合 F1。",
    venue: "EMNLP 2026",
    rating: "CORE A*",
    tag: "Agentic RL",
    tagZh: "智能体强化学习",
    topics: ["Agentic RL", "Search Agent"],
    image: publicAsset("/assets/papers/spader-card.jpg?v=50eafc60"),
    pdf: publicAsset("/papers/spader.pdf"),
    paper: "https://arxiv.org/abs/2606.00593",
    code: "https://github.com/KhanCold/spader",
  },
  {
    year: "2026",
    title:
      "BIRD-History: A Benchmark for History-Driven Text-to-SQL with Fine-Grained Knowledge Annotations",
    authors: ["Yunfan Zhou", "Qiming Shi", "Yizhou Yang", "Di Weng", "Yingcai Wu"],
    abstract:
      "While recent Large Language Model (LLM)-based text-to-SQL systems achieve impressive performance on standard benchmarks, they struggle when user queries implicitly rely on domain-specific knowledge, such as business logic, data conventions, and analytical practices, that is neither captured by the schema nor explicitly stated in the natural language question. Historical SQL query logs offer a valuable source of such knowledge, yet existing benchmarks do not adequately support evaluation of history-driven approaches. To address this gap, we introduce BIRD-History, a benchmark consisting of 1,393 tasks across 11 databases, designed to evaluate text-to-SQL systems’ ability to ground underspecified natural language questions using historical SQL scripts. Each task is annotated with ground-truth labels specifying which historical queries contain relevant knowledge and which SQL clauses encode it, enabling systematic evaluation of both retrieval effectiveness and knowledge utilization. We further introduce a plug-in retriever that extracts relevant knowledge from historical logs, seamlessly enhancing existing few-shot text-to-SQL pipelines without architectural modifications. Experiments demonstrate consistent improvements across four text-to-SQL systems, highlighting the value of leveraging historical query logs for handling underspecified queries.",
    abstractZh:
      "尽管近期基于大语言模型的 Text-to-SQL 系统在标准基准上表现出色，但当用户问题隐式依赖 schema 未涵盖且自然语言问题未明确说明的领域知识（如业务逻辑、数据约定和分析惯例）时，系统仍面临困难。我们提出 BIRD-History：一个覆盖 11 个数据库、包含 1,393 个任务的基准，用于评估 Text-to-SQL 系统利用历史 SQL 脚本为欠指明自然语言问题提供知识依据的能力。每个任务都标注了包含相关知识的历史查询及编码该知识的具体 SQL 子句，从而可系统评估检索效果与知识利用。我们还提出一个插件式检索器，从历史日志中抽取相关知识，无需修改架构即可增强现有少样本 Text-to-SQL 流水线；实验在四个 Text-to-SQL 系统上均取得一致提升。",
    venue: "EMNLP 2026 Findings",
    rating: "CORE A*",
    tag: "Coding Agent",
    tagZh: "代码大模型",
    topics: ["Coding Agent", "Benchmark"],
    image: publicAsset("/assets/papers/bird-history-card.jpg"),
  },
  {
    year: "2026",
    title: "Modality Fault Lines: Structural Corruptions Reveal Fragile Omni-Modal Reasoning",
    authors: [
      "Zhaolu Kang",
      "Meixin Wu",
      "Qiming Shi",
      "Yu Xue",
      "Yingjie He",
      "Lei Wei",
      "Yidi Wang",
      "Richeng Xuan",
      "Zhichao Hu",
    ],
    abstract:
      "Omni-modal large language models are increasingly evaluated on clean text–vision–audio inputs, where every channel is present, synchronized, and easy to read. These scores are often taken as evidence of robust cross-modal fusion, but clean evaluation alone cannot tell whether success depends on stable cross-modal structure or on cues that happen to be sufficient in the intact input. We study this uncertainty as a diagnostic problem and define a modality fault line: a boundary at which model behavior becomes unstable when a modality remains present and human-interpretable, yet the internal evidence structure of text, vision, or audio is perturbed. To probe these fault lines, we introduce SCEVAL (Structure-Corruption Evaluation), a diagnostic evaluation protocol that keeps the question, answer space, and modality channels fixed while applying controlled structural corruptions to text, vision, and audio individually and jointly. Built from 273 human-verified tri-modal examples from Social-IQ, OmniBench, and VALOR, SCEVAL evaluates proprietary and open-source omni-modal systems by reporting the mean accuracy over up to three random variants per stochastic condition, with the worst-variant gap logged as a diagnostic of seed-level variance. The results reveal a consistent pattern: structural corruption lowers clean accuracy, text–vision damage forms the most stable shared fault line, and multimodal degradation is non-additive rather than a simple function of how many channels are corrupted.",
    abstractZh:
      "全模态大语言模型通常在文本、视觉、音频通道均完整同步的干净输入上评测，但干净准确率无法判断成功源于稳定的跨模态结构，还是完整输入中恰好足够的局部线索。我们将这一不确定性视为诊断问题，并定义 modality fault line：当某个模态仍然存在且对人类可解释、但其内部证据结构受到扰动时，模型行为开始不稳定的边界。为探测这些断层，我们提出 SCEVAL（Structure-Corruption Evaluation），在保持问题、答案空间和模态通道不变的前提下，分别及联合地对文本、视觉和音频施加受控结构腐蚀。SCEVAL 基于来自 Social-IQ、OmniBench 和 VALOR 的 273 个经人工验证的三模态样本，按每个随机条件最多三个变体的平均准确率评估闭源与开源全模态系统，并记录最差变体差距以诊断随机种子脆弱性。结果表明：结构腐蚀会降低干净准确率，文本-视觉损伤形成最稳定的共享断层，多模态退化呈非加性且依赖模型。",
    venue: "EMNLP 2026 Findings",
    rating: "CORE A*",
    tag: "Multimodal",
    tagZh: "多模态",
    topics: ["Multimodal", "Benchmark"],
    image: publicAsset("/assets/papers/modality-fault-lines-card.jpg"),
  },
  {
    year: "2026",
    title: "Cerebra: Aligning Implicit Knowledge in Interactive SQL Authoring",
    authors: [
      "Yunfan Zhou",
      "Qiming Shi",
      "Zhongsu Luo",
      "Xiwen Cai",
      "Yanwei Huang",
      "Dae Hyun Kim",
      "Di Weng†",
      "Yingcai Wu",
    ],
    abstract:
      "LLM-driven tools have significantly lowered barriers to writing SQL queries. However, user instructions are often underspecified, assuming the model understands implicit knowledge such as dataset schemas, domain conventions, and task-specific requirements. We present Cerebra, an interactive NL-to-SQL tool that aligns implicit knowledge between users and LLMs during SQL authoring. Cerebra automatically retrieves implicit knowledge from historical SQL scripts based on user instructions, presents this knowledge in an interactive tree view for code review, and supports iterative refinement to improve generated scripts. A user study with 16 participants demonstrates improved support for customized SQL authoring.",
    abstractZh:
      "大语言模型驱动的工具显著降低了编写 SQL 查询的门槛。然而，用户指令常常并不完整，并默认模型已经理解数据集结构、领域惯例和任务特定要求等隐性知识。我们提出 Cerebra，一个在 SQL 编写过程中对齐用户与大语言模型隐性知识的交互式自然语言转 SQL 工具。Cerebra 根据用户指令从历史 SQL 脚本中自动检索隐性知识，以交互式树状视图呈现这些知识供用户审查，并支持迭代优化以改进生成脚本。一项包含 16 名参与者的用户研究表明，Cerebra 能更好地支持定制化 SQL 编写。",
    venue: "CHI 2026",
    rating: "CCF-A",
    tag: "Coding Agent",
    tagZh: "代码大模型",
    topics: ["Coding Agent", "HCI"],
    image: publicAsset("/assets/papers/cerebra-card.jpg?v=6e34d5c2"),
    pdf: publicAsset("/papers/cerebra.pdf"),
    paper: "https://doi.org/10.1145/3772318.3790974",
    code: "https://github.com/zjuidg/CHI26-Cerebra",
  },
  {
    year: "2025",
    title:
      "Xavier: Toward Better Coding Assistance in Authoring Tabular Data Wrangling Scripts",
    authors: [
      "Yunfan Zhou",
      "Xiwen Cai",
      "Qiming Shi",
      "Yanwei Huang",
      "Haotian Li",
      "Huamin Qu",
      "Di Weng†",
      "Yingcai Wu",
    ],
    abstract:
      "Data analysts frequently employ code completion tools in writing custom scripts to tackle complex tabular data wrangling tasks. However, existing tools do not sufficiently link data contexts such as schemas and values with the code being edited. We introduce Xavier, a tool designed to enhance data wrangling script authoring in computational notebooks. Xavier maintains users' awareness of data contexts while providing data-aware code suggestions, automatically highlights relevant data, integrates code and data contexts for more accurate suggestions, and instantly previews transformation results for verification. A user study with 16 data analysts shows its potential to streamline data wrangling script authoring.",
    abstractZh:
      "数据分析师经常借助代码补全工具编写自定义脚本，以处理复杂的表格数据整理任务。然而，现有工具未能充分关联数据结构、数据值等上下文与正在编辑的代码。我们提出 Xavier，一个用于增强计算笔记本中数据整理脚本编写体验的工具。Xavier 在提供数据感知代码建议的同时，帮助用户保持对数据上下文的认知；它能够自动高亮相关数据，融合代码与数据上下文以给出更准确的建议，并即时预览转换结果以供验证。一项包含 16 名数据分析师的用户研究展示了 Xavier 简化数据整理脚本编写流程的潜力。",
    venue: "CHI 2025",
    rating: "CCF-A",
    tag: "Coding Agent",
    tagZh: "代码大模型",
    topics: ["Coding Agent", "HCI"],
    image: publicAsset("/assets/papers/xavier-card.jpg?v=9f43a5b1"),
    pdf: publicAsset("/papers/xavier.pdf"),
    paper: "https://doi.org/10.1145/3706598.3714239",
    code: "https://github.com/CHI25-Xavier/Xavier",
  },
];

function AuthorList({ authors }: { authors: string[] }) {
  return (
    <span className="authors">
      {authors.map((author, index) => {
        const marks = author.match(/[*†]+$/)?.[0] ?? "";
        const name = marks ? author.slice(0, -marks.length) : author;

        return (
          <span key={`${author}-${index}`}>
            {name === "Qiming Shi" ? <strong>{name}</strong> : name}
            {marks ? <sup className="author-mark">{marks}</sup> : null}
            {index < authors.length - 1 ? ", " : ""}
          </span>
        );
      })}
    </span>
  );
}

function PublicationLegend({ language }: { language: Language }) {
  return (
    <p className="publication-legend">
      {language === "zh" ? "* 共同一作；† 通讯作者" : "* Equal contribution; † Corresponding author"}
    </p>
  );
}

function PaperVisual({ publication, language }: { publication: Publication; language: Language }) {
  return (
    <div className="paper-visual" aria-hidden="true">
      {publication.image ? (
        <img
          src={publication.image}
          alt=""
          width={160}
          height={112}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="paper-placeholder">{publication.monogram}</div>
      )}
      <span>{language === "zh" ? publication.tagZh : publication.tag}</span>
    </div>
  );
}

function PaperLinks({
  publication,
  abstractId,
  abstractOpen,
  onToggleAbstract,
  language,
}: {
  publication: Publication;
  abstractId: string;
  abstractOpen: boolean;
  onToggleAbstract: () => void;
  language: Language;
}) {
  return (
    <div className="paper-links">
      {publication.hfPaper ? (
        <a className="hf-daily-link" href={publication.hfPaper} target="_blank" rel="noreferrer">
          <span aria-hidden="true">🤗</span>
          {language === "zh" ? "HF 日榜 #1" : "HF Daily #1"}
        </a>
      ) : null}
      {publication.project ? (
        <a href={publication.project} target="_blank" rel="noreferrer">
          <span className="project-icon" aria-hidden="true" />
          {language === "zh" ? "项目" : "project"}
        </a>
      ) : null}
      <button
        type="button"
        className={abstractOpen ? "active" : ""}
        aria-controls={abstractId}
        aria-expanded={abstractOpen}
        onClick={onToggleAbstract}
      >
        <span className="abstract-icon" aria-hidden="true" />
        {language === "zh" ? "摘要" : "abstract"}
      </button>
      {publication.paper ? (
        <a href={publication.paper} target="_blank" rel="noreferrer">
          <span className="paper-icon" aria-hidden="true" />
          {language === "zh" ? "论文" : "paper"}
        </a>
      ) : null}
      {publication.code ? (
        <a href={publication.code} target="_blank" rel="noreferrer">
          <span className="code-icon" aria-hidden="true">&lt;/&gt;</span>
          {language === "zh" ? "代码" : "code"}
        </a>
      ) : null}
    </div>
  );
}

function PaperEntry({ publication, language }: { publication: Publication; language: Language }) {
  const [abstractOpen, setAbstractOpen] = useState(false);
  const abstractId = `abstract-${publication.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

  return (
    <article className="paper-entry">
      <PaperVisual publication={publication} language={language} />
      <div className="paper-copy">
        <h3>{publication.title}</h3>
        <p className="paper-authors"><AuthorList authors={publication.authors} /></p>
        <div className="paper-meta">
          <span className="paper-venue">{publication.venue}</span>
          {publication.rating ? <span className="ccf-tag">{publication.rating}</span> : null}
          <PaperLinks
            publication={publication}
            abstractId={abstractId}
            abstractOpen={abstractOpen}
            onToggleAbstract={() => setAbstractOpen((open) => !open)}
            language={language}
          />
        </div>
        <div className="paper-topics" aria-label={language === "zh" ? "论文主题" : "Paper topics"}>
          <span className="topics-label">{language === "zh" ? "主题" : "Topics"}</span>
          {publication.topics.map((topic) => (
            <span className="topic-tag" key={topic}>{topic}</span>
          ))}
        </div>
        {abstractOpen ? (
          <p className="paper-abstract" id={abstractId} lang={language === "zh" ? "zh-CN" : "en"}>
            {language === "zh" ? publication.abstractZh : publication.abstract}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function Sidebar({
  language,
  onCopy,
  onProfileClick,
}: {
  language: Language;
  onCopy: (value: string, label: string) => void;
  onProfileClick: () => void;
}) {
  return (
    <aside className="sidebar">
      <button
        className="profile-photo-trigger"
        type="button"
        aria-label={language === "zh" ? "个人照片" : "Profile photo"}
        onClick={onProfileClick}
      >
        <img
          className="profile-photo"
          src={publicAsset("/assets/profile-optimized.jpg")}
          alt="Qiming Shi in Shanghai"
          width={512}
          height={683}
          fetchPriority="high"
          decoding="async"
          draggable={false}
        />
      </button>
      <h1>Qiming Shi</h1>
      <p className="chinese-name">史启明</p>

      <div className="sidebar-block position-lines">
        <strong>{language === "zh" ? "人工智能硕士" : "M.S. in Artificial Intelligence"}</strong>
        <span>{language === "zh" ? "浙江大学 · 2024–2027" : "Zhejiang University · 2024–2027"}</span>
      </div>

      <div className="contact-row">
        <button
          type="button"
          onClick={() => onCopy("qimingshi@zju.edu.cn", language === "zh" ? "邮箱" : "Email")}
        >
          <Icon name="mail" />
          <span>qimingshi@zju.edu.cn</span>
        </button>
        <button
          type="button"
          onClick={() => onCopy("16605797704", language === "zh" ? "电话" : "Phone")}
        >
          <Icon name="phone" />
          <span>166-0579-7704</span>
        </button>
      </div>
      <div className="social-row">
        <a href="https://github.com/KhanCold" target="_blank" rel="noreferrer">
          <Icon name="github" /> GitHub
        </a>
        <a
          href="https://scholar.google.com/citations?user=6gONLJ4AAAAJ&hl=zh-CN"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="scholar" /> Scholar
        </a>
        <a href="https://blog.csdn.net/falldeep" target="_blank" rel="noreferrer">
          <Icon name="blog" /> CSDN
        </a>
      </div>

      <div className="sidebar-block interests">
        <strong>{language === "zh" ? "研究方向" : "Research Interests"}</strong>
        <span>{language === "zh" ? "自然语言处理" : "Natural Language Processing"}</span>
        <span>{language === "zh" ? "人机交互" : "Human-Computer Interaction"}</span>
        <span>{language === "zh" ? "智能体强化学习" : "Agentic RL"}</span>
      </div>

    </aside>
  );
}

function PageNav({
  activeTab,
  achievementsUnlocked,
  language,
  onSelect,
  onLanguageChange,
}: {
  activeTab: Tab;
  achievementsUnlocked: boolean;
  language: Language;
  onSelect: (tab: Tab) => void;
  onLanguageChange: (language: Language) => void;
}) {
  return (
    <nav className="page-nav" aria-label={language === "zh" ? "主要页面" : "Main sections"}>
      <div className="page-tabs">
        {tabs
          .filter((tab) => tab.id !== "achievements" || achievementsUnlocked)
          .map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => onSelect(tab.id)}
            >
              {tab.label[language]}
            </button>
          ))}
      </div>
      <div
        className="language-switch"
        role="group"
        aria-label={language === "zh" ? "语言选择" : "Language selector"}
      >
        <button
          type="button"
          className={language === "en" ? "active" : ""}
          aria-pressed={language === "en"}
          onClick={() => onLanguageChange("en")}
        >
          EN
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          className={language === "zh" ? "active" : ""}
          aria-pressed={language === "zh"}
          onClick={() => onLanguageChange("zh")}
        >
          中文
        </button>
      </div>
    </nav>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-heading">
      <h2>{children}</h2>
      <span />
    </div>
  );
}

function PixelIcon({
  name,
  label,
  compact = false,
  rare = false,
}: {
  name: AchievementIconName;
  label: string;
  compact?: boolean;
  rare?: boolean;
}) {
  const art = pixelArt[name];

  return (
    <span
      className={`pixel-icon ${compact ? "compact" : ""} ${rare ? "rare" : ""}`}
      role="img"
      aria-label={label}
    >
      <span className="pixel-icon-grid" aria-hidden="true">
        {art.pixels.flatMap((row, rowIndex) =>
          Array.from(row).map((pixel, columnIndex) => (
            <span
              className="pixel"
              key={`${rowIndex}-${columnIndex}`}
              style={pixel === "." ? undefined : { backgroundColor: art.palette[pixel] }}
            />
          )),
        )}
      </span>
    </span>
  );
}

function Achievements({ language }: { language: Language }) {
  const timelineAchievements = [...achievements].sort((a, b) =>
    b.dateTime.localeCompare(a.dateTime),
  );

  return (
    <div className="page achievements-page" lang={language === "zh" ? "zh-CN" : "en"}>
      <section className="content-section achievement-showcase">
        <SectionTitle>{language === "zh" ? "成就图鉴" : "Achievement Showcase"}</SectionTitle>
        <div className="achievement-shelf" role="list" aria-label={language === "zh" ? "全部已解锁成就" : "All unlocked achievements"}>
          {achievements.map((achievement) => (
            <div
              className="achievement-badge"
              role="listitem"
              tabIndex={0}
              aria-label={achievement.title[language]}
              key={achievement.id}
            >
              <PixelIcon
                name={achievement.icon}
                label={achievement.title[language]}
                rare={achievement.rare}
              />
              <span className="achievement-tooltip" role="tooltip">
                {achievement.title[language]}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section achievement-history">
        <SectionTitle>{language === "zh" ? "成就时间线" : "Achievement Timeline"}</SectionTitle>
        <div className="achievement-timeline">
          {timelineAchievements.map((achievement) => (
            <article className="achievement-row" key={achievement.id}>
              <time dateTime={achievement.dateTime}>{achievement.date}</time>
              <div className="achievement-event">
                <PixelIcon
                  name={achievement.icon}
                  label={achievement.title[language]}
                  compact
                  rare={achievement.rare}
                />
                <div className="achievement-copy">
                  <h3>{achievement.title[language]}</h3>
                  <p className="achievement-quote">{achievement.quote[language]}</p>
                  <p className="achievement-detail">{achievement.detail[language]}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function About({ language, onSeeAll }: { language: Language; onSeeAll: () => void }) {
  const [showAllNews, setShowAllNews] = useState(false);
  const featured = publications.filter((publication) =>
    [
      "MerchantBench",
      "SKILL-KD",
      "SPADER",
      "Cerebra",
      "Xavier",
    ].some((name) => publication.title.startsWith(name)),
  );

  return (
    <div className="page" lang={language === "zh" ? "zh-CN" : "en"}>
      <section className="intro-section">
        <h2>{language === "zh" ? "关于我" : "About Me"}</h2>
        {language === "zh" ? (
          <>
            <p>
              我是
              <a href="https://www.zju.edu.cn/english/" target="_blank" rel="noreferrer">
                <strong>浙江大学</strong>
              </a>
              <strong>人工智能专业硕士研究生</strong>，预计于 2027 年 6 月毕业。我是
              <a href="http://www.cad.zju.edu.cn/" target="_blank" rel="noreferrer">
                <strong>CAD&amp;CG 全国重点实验室</strong>
              </a>
              <a href="https://zjuidg.org/" target="_blank" rel="noreferrer">
                <strong>交互式数据研究组（IDG）</strong>
              </a>
              成员，由
              <a href="http://www.ycwu.org/" target="_blank" rel="noreferrer">
                <strong>巫英才教授</strong>
              </a>
              和
              <a href="https://dwe.ng/" target="_blank" rel="noreferrer">
                <strong>翁荻教授</strong>
              </a>
              共同指导。
            </p>
            <p>
              我的研究位于<strong>自然语言处理</strong>、<strong>人机交互</strong>和
              <strong>数据智能</strong>的交叉领域。我致力于构建能够在交互中持续学习、
              在长程任务中使用工具，并始终以决策相关数据和上下文为依据的智能体。
            </p>
            <p>
              近期，我主要关注<strong>智能体强化学习</strong>、<strong>自进化系统</strong>和
              <strong>人机协作</strong>，尤其对细粒度信用分配、长程连贯性，以及让模型行为更易于
              检查和优化的交互式系统感兴趣。
            </p>
          </>
        ) : (
          <>
            <p>
              I am a <strong>master&apos;s student in Artificial Intelligence</strong> at{" "}
              <a href="https://www.zju.edu.cn/english/" target="_blank" rel="noreferrer">
                <strong>Zhejiang University</strong>
              </a>
              , expected to graduate in June 2027. I am a member of the{" "}
              <a href="https://zjuidg.org/" target="_blank" rel="noreferrer">
                <strong>Interactive Data Group (IDG)</strong>
              </a>{" "}
              at the{" "}
              <a href="http://www.cad.zju.edu.cn/" target="_blank" rel="noreferrer">
                <strong>State Key Laboratory of CAD&amp;CG</strong>
              </a>
              , where I am jointly advised by{" "}
              <a href="http://www.ycwu.org/" target="_blank" rel="noreferrer">
                <strong>Prof. Yingcai Wu</strong>
              </a>{" "}
              and{" "}
              <a href="https://dwe.ng/" target="_blank" rel="noreferrer">
                <strong>Prof. Di Weng</strong>
              </a>
              .
            </p>
            <p>
              My research lies at the intersection of <strong>natural language processing</strong>,{" "}
              <strong>human-computer interaction</strong>, and <strong>data intelligence</strong>.
              I build learning agents that improve through interaction, use tools over long
              horizons, and remain grounded in the data and context surrounding their decisions.
            </p>
            <p>
              Recently, I have focused on <strong>agentic reinforcement learning</strong>,{" "}
              <strong>Self-Evolving systems</strong>, and <strong>human–AI collaboration</strong>,
              with particular interest in fine-grained credit assignment, long-term coherence,
              and interactive systems that make model behavior easier to inspect and refine.
            </p>
          </>
        )}
      </section>

      <section className="content-section">
        <SectionTitle>{language === "zh" ? "动态" : "News"}</SectionTitle>
        <div className="dated-list" id="news-list">
          <div className="dated-row">
            <time>2026.08</time>
            <p>
              {language === "zh" ? (
                <>
                  我们的三篇论文：<strong>SPADER</strong>、<strong>BIRD-History</strong> 和{" "}
                  <strong>Modality Fault Lines</strong> 被 <strong>EMNLP 2026</strong> 接收。
                  <br />
                  BIRD-History 与 Modality Fault Lines 的论文即将上线。
                </>
              ) : (
                <>
                  Three papers: <strong>SPADER</strong>, <strong>BIRD-History</strong>, and{" "}
                  <strong>Modality Fault Lines</strong> were accepted to <strong>EMNLP 2026</strong>.
                  <br />
                  Papers coming soon for BIRD-History and Modality Fault Lines.
                </>
              )}
            </p>
          </div>
          <div className="dated-row">
            <time>2026.08</time>
            <p>
              {language === "zh" ? (
                <>我们提交的一个 Pull Request 已被 <strong>Hermes</strong> 合并。</>
              ) : (
                <>One of our pull requests was merged into <strong>Hermes</strong>.</>
              )}
            </p>
          </div>
          <div className="dated-row">
            <time>2026.08</time>
            <p>
              {language === "zh" ? (
                <>
                  <a href="https://huggingface.co/papers/2607.28956" target="_blank" rel="noreferrer">
                    <strong>MerchantBench</strong>
                  </a>
                  入选 Hugging Face Daily Papers，并荣登{" "}
                  <strong className="hf-news-highlight">🏆 当日第 1</strong>。
                </>
              ) : (
                <>
                  <a href="https://huggingface.co/papers/2607.28956" target="_blank" rel="noreferrer">
                    <strong>MerchantBench</strong>
                  </a>{" "}
                  ranked <strong className="hf-news-highlight">🏆 #1 Paper of the Day</strong> on
                  Hugging Face Daily Papers.
                </>
              )}
            </p>
          </div>
          <div className="dated-row">
            <time>2026.05</time>
            <p>
              {language === "zh"
                ? "加入阿里巴巴 1688 团队，开展自进化智能体与长程强化学习研究。"
                : "Joined Alibaba's 1688 team to work on Self-Evolving agents and long-horizon RL."}
            </p>
          </div>
          <div className="dated-row" hidden={!showAllNews}>
            <time>2026.04</time>
            <p>
              {language === "zh" ? (
                <><strong>Cerebra</strong> 于巴塞罗那 CHI 2026 会议发表。</>
              ) : (
                <><strong>Cerebra</strong> appeared at CHI 2026 in Barcelona.</>
              )}
            </p>
          </div>
          <div className="dated-row" hidden={!showAllNews}>
            <time>2026.03</time>
            <p>
              {language === "zh"
                ? "完成微软亚洲研究院科研实习，研究广度搜索智能体。"
                : "Completed a research internship at MSRA on the Wide Search Agent."}
            </p>
          </div>
        </div>
        <button
          className="news-toggle"
          type="button"
          aria-controls="news-list"
          aria-expanded={showAllNews}
          onClick={() => setShowAllNews((current) => !current)}
        >
          {showAllNews
            ? language === "zh"
              ? "收起"
              : "Show less"
            : language === "zh"
              ? "显示更多"
              : "Show more"}
        </button>
      </section>

      <section className="content-section">
        <SectionTitle>{language === "zh" ? "精选论文" : "Selected Publications"}</SectionTitle>
        <PublicationLegend language={language} />
        <div className="paper-list">
          {featured.map((publication) => (
            <PaperEntry publication={publication} language={language} key={publication.title} />
          ))}
          <div className="paper-links">
            <button type="button" onClick={onSeeAll}>
              {language === "zh" ? "查看全部" : "see all"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function VitaRow({
  when,
  title,
  meta,
  logo,
  logoAlt,
  children,
}: {
  when: string;
  title: string;
  meta?: string;
  logo?: string;
  logoAlt?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="vita-row">
      <time>{when}</time>
      <div className={`vita-body ${logo ? "" : "no-logo"}`}>
        {logo ? (
          <div className="institution-logo">
            <img src={logo} alt={logoAlt ?? ""} />
          </div>
        ) : null}
        <div className="vita-copy">
          <p className="vita-heading">
            <strong>{title}</strong>
            {meta ? <span>{meta}</span> : null}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}

function Vita({ language }: { language: Language }) {
  return (
    <div className="page vita-page" lang={language === "zh" ? "zh-CN" : "en"}>
      <section className="content-section first-section vita-detail-section">
        <SectionTitle>{language === "zh" ? "教育经历" : "Education"}</SectionTitle>
        <VitaRow
          when="2024 — 2027"
          title={language === "zh" ? "人工智能硕士" : "M.S. Artificial Intelligence"}
          meta={language === "zh" ? "浙江大学，中国" : "Zhejiang University, China"}
          logo={publicAsset("/assets/logos/zju.png")}
          logoAlt={language === "zh" ? "浙江大学校徽" : "Zhejiang University logo"}
        >
          <p>
            {language === "zh" ? "CAD&CG 全国重点实验室 · " : "State Key Laboratory of CAD&CG · "}
            <a href="https://zjuidg.org/" target="_blank" rel="noreferrer">
              {language === "zh" ? "交互式数据研究组（IDG）" : "Interactive Data Group (IDG)"}
            </a>
          </p>
          <p>
            {language === "zh" ? "导师：" : "Advised by "}
            <a href="http://www.ycwu.org/" target="_blank" rel="noreferrer">
              {language === "zh" ? "巫英才教授" : "Prof. Yingcai Wu"}
            </a>
            {language === "zh" ? "、" : " and "}
            <a href="https://dwe.ng/" target="_blank" rel="noreferrer">
              {language === "zh" ? "翁荻教授" : "Prof. Di Weng"}
            </a>
            {language === "zh" ? "。" : "."}
          </p>
        </VitaRow>
        <VitaRow
          when="2020 — 2024"
          title={language === "zh" ? "软件工程学士" : "B.Eng. Software Engineering"}
          meta={language === "zh" ? "新疆大学，中国" : "Xinjiang University, China"}
          logo={publicAsset("/assets/logos/xju.jpg")}
          logoAlt={language === "zh" ? "新疆大学校徽" : "Xinjiang University logo"}
        >
          <p>
            <a href="https://ss.xju.edu.cn/" target="_blank" rel="noreferrer">
              {language === "zh" ? "软件学院" : "School of Software"}
            </a>
          </p>
          <p>{language === "zh" ? "绩点：91.41 / 100 · 排名：3 / 608" : "GPA: 91.41 / 100 · Rank: 3 / 608"}</p>
        </VitaRow>
      </section>

      <section className="content-section vita-detail-section">
        <SectionTitle>{language === "zh" ? "实习经历" : "Experience"}</SectionTitle>
        <VitaRow
          when={language === "zh" ? "2026.05 — 至今" : "2026.05 — Present"}
          title={language === "zh" ? "算法实习生" : "Algorithm Intern"}
          meta={language === "zh" ? "阿里巴巴集团 · 1688 · 杭州" : "Alibaba Group · 1688 · Hangzhou"}
          logo={publicAsset("/assets/logos/alibaba.png")}
          logoAlt={language === "zh" ? "阿里巴巴集团标志" : "Alibaba Group logo"}
        >
          <p>
            {language === "zh"
              ? "自进化智能体基础设施、长程电商环境，以及面向自主店铺运营的强化学习。"
              : "Self-Evolving agent infrastructure, long-horizon e-commerce environments, and reinforcement learning for autonomous store operations."}
          </p>
          <p className="keywords">
            {language === "zh" ? "自进化智能体 · 长程连贯性" : "Self-Evolving agents · Long Term Coherence"}
          </p>
        </VitaRow>
        <VitaRow
          when="2025.12 — 2026.03"
          title={language === "zh" ? "科研实习生" : "Research Intern"}
          meta={language === "zh" ? "微软亚洲研究院 · STCA · 北京" : "MSRA · STCA · Beijing"}
          logo={publicAsset("/assets/logos/microsoft.svg")}
          logoAlt={language === "zh" ? "微软亚洲研究院标志" : "MSRA logo"}
        >
          <p>
            {language === "zh"
              ? "广度搜索智能体，包括监督微调、奖励建模、强化学习，以及面向长程工具使用的逐步信用分配。"
              : "Wide Search Agent, including SFT, reward modeling, RL, and step-wise credit assignment for long-horizon tool use."}
          </p>
          <p className="keywords">{language === "zh" ? "智能体强化学习" : "Agentic RL"}</p>
        </VitaRow>
        <VitaRow
          when="2025.07 — 2025.12"
          title={language === "zh" ? "算法实习生" : "Algorithm Intern"}
          meta={language === "zh" ? "中航工业 · 西飞 · 西安" : "AVIC · Xifei · Xi'an"}
          logo={publicAsset("/assets/logos/avic.svg")}
          logoAlt={language === "zh" ? "中航工业西飞标志" : "AVIC Xifei logo"}
        >
          <p>
            {language === "zh"
              ? "面向代码大模型的运行时数据感知，以及自然语言转 SQL 系统中的隐性业务知识对齐。"
              : "Runtime data awareness for CodeLLMs and alignment of implicit business knowledge for text-to-SQL systems."}
          </p>
          <p className="keywords">
            {language === "zh" ? "代码大模型 · 自然语言转 SQL · 数据上下文" : "CodeLLM · Text-to-SQL · Data context"}
          </p>
        </VitaRow>
      </section>

      <section className="content-section">
        <SectionTitle>{language === "zh" ? "荣誉奖项" : "Awards"}</SectionTitle>
        <VitaRow
          when="2023"
          title={language === "zh" ? "小岛康誉奖学金" : "Kojima Yasuhiro Scholarship"}
          meta={language === "zh" ? "前 1%" : "Top 1%"}
        />
        <VitaRow
          when="2023"
          title={language === "zh" ? "ACM-ICPC 中国丝绸之路全国邀请赛 — 银牌" : "ACM-ICPC China Silk Road National Invitational — Silver Medal"}
        />
        <VitaRow
          when="2023"
          title={language === "zh" ? "ACM-ICPC 中国西北地区省赛 — 铜牌" : "ACM-ICPC China Northwest Provincial Contest — Bronze Medal"}
        />
        <VitaRow
          when="2023"
          title={language === "zh" ? "中国大学生计算机设计大赛 — 全国三等奖" : "China University Student Computer Design Competition — National Third Prize"}
        />
        <VitaRow
          when="2022"
          title={language === "zh" ? "ACM-ICPC 中国省赛 — 铜牌" : "ACM-ICPC China Provincial Contest — Bronze Medal"}
        />
        <VitaRow
          when="2021"
          title={language === "zh" ? "ACM-CCPC 大学生程序设计竞赛 — 银牌" : "ACM-CCPC Collegiate Programming Contest — Silver Medal"}
        />
      </section>

      <section className="content-section">
        <SectionTitle>{language === "zh" ? "社区服务" : "Service"}</SectionTitle>
        <VitaRow
          when="2026"
          title={
            language === "zh"
              ? "OpenClaw & Hermes 贡献者"
              : "OpenClaw&Hermes Contributor"
          }
        />
        <VitaRow
          when="2025"
          title={language === "zh" ? "CSDN 技术博主" : "CSDN Technical Blogger"}
          meta={language === "zh" ? "粉丝数 2,000+ · 浏览量 100 万+" : "2,000+ Followers · 1M+ Views"}
        />
      </section>
    </div>
  );
}

function Publications({ language }: { language: Language }) {
  const years = [...new Set(publications.map((publication) => publication.year))];

  return (
    <div className="page publications-page" lang={language === "zh" ? "zh-CN" : "en"}>
      <section className="intro-section">
        <h2>{language === "zh" ? "论文发表" : "Publications"}</h2>
        <PublicationLegend language={language} />
      </section>
      {years.map((year) => (
        <section className="content-section year-section" key={year}>
          <div className="year-heading"><h2>{year}</h2><span /></div>
          <div className="paper-list">
            {publications
              .filter((publication) => publication.year === year)
              .map((publication) => (
                <PaperEntry publication={publication} language={language} key={publication.title} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("about");
  const [achievementsUnlocked, setAchievementsUnlocked] = useState(false);
  const achievementsUnlockedRef = useRef(false);
  const profileClickSequence = useRef({ count: 0, lastClickAt: 0 });
  const language = useSyncExternalStore<Language>(
    subscribeToLanguage,
    getLanguageSnapshot,
    (): Language => "en",
  );
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    const updateFromHash = () => {
      const hash = window.location.hash.replace("#", "") as Tab;
      if (hash === "achievements" && !achievementsUnlockedRef.current) {
        setActiveTab("about");
        window.history.replaceState(null, "", "#about");
        return;
      }
      if (tabs.some((tab) => tab.id === hash)) setActiveTab(hash);
    };
    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);
    return () => window.removeEventListener("hashchange", updateFromHash);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  const selectTab = (tab: Tab, fromSeeAll = false) => {
    if (tab === "achievements" && !achievementsUnlockedRef.current) return;
    setActiveTab(tab);
    window.history.replaceState(null, "", `#${tab}`);
    if (window.matchMedia("(min-width: 781px)").matches) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (fromSeeAll) {
      window.requestAnimationFrame(() => {
        const contentColumn = document.querySelector<HTMLElement>(".content-column");
        window.scrollTo({ top: contentColumn?.offsetTop ?? 0, behavior: "smooth" });
      });
    }
  };

  const handleProfileClick = () => {
    if (achievementsUnlockedRef.current) return;

    const now = Date.now();
    const withinClickWindow = now - profileClickSequence.current.lastClickAt <= profileClickWindow;
    const nextCount = withinClickWindow ? profileClickSequence.current.count + 1 : 1;
    profileClickSequence.current = { count: nextCount, lastClickAt: now };

    if (nextCount < 5) return;

    achievementsUnlockedRef.current = true;
    profileClickSequence.current = { count: 0, lastClickAt: 0 };
    setAchievementsUnlocked(true);
  };

  const changeLanguage = (nextLanguage: Language) => {
    window.localStorage.setItem("site-language", nextLanguage);
    window.dispatchEvent(new Event(languageChangeEvent));
  };

  const copyContact = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const input = document.createElement("textarea");
      input.value = value;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopyMessage(language === "zh" ? `${label}已复制` : `${label} copied`);
    window.setTimeout(() => setCopyMessage(""), 1600);
  };

  return (
    <main className="site-shell">
      <Sidebar language={language} onCopy={copyContact} onProfileClick={handleProfileClick} />
      <div className="content-column">
        <PageNav
          activeTab={activeTab}
          achievementsUnlocked={achievementsUnlocked}
          language={language}
          onSelect={selectTab}
          onLanguageChange={changeLanguage}
        />
        <div className="page-content" role="tabpanel">
          {activeTab === "about" ? (
            <About language={language} onSeeAll={() => selectTab("publications", true)} />
          ) : null}
          {activeTab === "vita" ? <Vita language={language} /> : null}
          {activeTab === "publications" ? <Publications language={language} /> : null}
          {activeTab === "achievements" ? <Achievements language={language} /> : null}
        </div>
      </div>
      <div className={`copy-toast ${copyMessage ? "visible" : ""}`} role="status">
        {copyMessage}
      </div>
    </main>
  );
}
