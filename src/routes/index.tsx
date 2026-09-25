import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  FileBadge2,
  Globe2,
  Menu,
  Network,
  Route as RouteIcon,
  UsersRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NeuralField } from "@/components/NeuralField";
import { supabase } from "@/integrations/supabase/client";
import logoBlack from "@/assets/aimlab-scholars-logo-black.png";
import logoWhite from "@/assets/aimlab-scholars-logo-white.png";
import crossDotsMint from "@/assets/cross-dots-mint.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AiMLab Scholars | Phát triển tài năng Toán & AI" },
      {
        name: "description",
        content:
          "Chương trình phát triển tài năng Toán và AI với mentor đồng hành, lộ trình theo năng lực và mục tiêu học thuật dài hạn.",
      },
      { property: "og:title", content: "AiMLab Scholars | Phát triển tài năng Toán & AI" },
      {
        property: "og:description",
        content:
          "Lộ trình Toán và AI chuyên sâu, mentor đồng hành và định hướng từ nền tảng đến dự án, cuộc thi và nghiên cứu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type TrackKey = "standard" | "independent";

type StorySignal = {
  title: string;
  href: string;
  description: string;
  accent: "mint" | "indigo";
};

const storySignals: StorySignal[] = [
  {
    title: "#1 ĐIỂM CHUẨN",
    href: "https://vietnamnet.vn/cac-nganh-co-diem-chuan-cao-nhat-2026-ai-len-ngoi-su-pham-va-quan-doi-van-hot-2544805.html",
    description: "AI nằm trong nhóm ngành có điểm chuẩn cao tại nhiều trường công nghệ ở Việt Nam.",
    accent: "mint",
  },
  {
    title: "#ĐÀO TẠO CHÍNH QUY",
    href: "https://xaydungchinhsach.chinhphu.vn/quyet-dinh-so-2422-qd-bgddt-ve-khung-noi-dung-giao-duc-tri-tue-nhan-tao-ai-cho-hoc-sinh-pho-thong-119260820163256297.htm",
    description:
      "Từ năm học 2026–2027, AI chính thức trở thành một phần của giáo dục phổ thông.",
    accent: "indigo",
  },
  {
    title: "#ĐẤU TRƯỜNG HỌC THUẬT",
    href: "https://thanhnien.vn/bo-gd-dt-thuc-day-dua-tri-tue-nhan-tao-thanh-mon-thi-hoc-sinh-gioi-quoc-gia-185260811091345847.htm",
    description:
      "VOAI, IOAI và các kỳ thi AI đang mở rộng cơ hội phát triển học thuật cho học sinh.",
    accent: "mint",
  },
];

type PillarPreview = {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  accent: "mint" | "indigo";
};

const aimlabModelPillars: PillarPreview[] = [
  {
    title: "Mentor dẫn dắt",
    description: "Mentor chuyên môn cao trực tiếp hướng dẫn và theo sát quá trình học.",
    imageUrl: "/source-img/mentor.jpg",
    imageAlt: "Ảnh minh hoạ Mentor dẫn dắt.",
    accent: "mint",
  },
  {
    title: "Cá nhân hoá",
    description: "Lộ trình điều chỉnh theo năng lực, mục tiêu và tiến độ thực tế.",
    imageUrl: "/source-img/personalized.jpg",
    imageAlt: "Ảnh minh hoạ lộ trình cá nhân hoá.",
    accent: "indigo",
  },
  {
    title: "Cộng đồng",
    description: "Môi trường học thuật để tiếp tục chia sẻ tri thức, kết nối và cơ hội.",
    imageUrl: "/source-img/community.jpg",
    imageAlt: "Ảnh minh hoạ cộng đồng học thuật.",
    accent: "mint",
  },
];

type TrackConfig = {
  key: TrackKey;
  label: string;
  vietnameseName: string;
  englishName: string;
  format?: string;
  goal: string;
  description: string;
  outcomes: string[];
  benefits: string[];
  accent: "mint" | "indigo";
};

const trainingTracks: TrackConfig[] = [
  {
    key: "standard",
    label: "Standard Track",
    vietnameseName: "Lộ trình tiêu chuẩn",
    englishName: "Standard Track",
    goal: "Mục tiêu hướng tới các kỳ thi học thuật",
    description:
      "Dành cho học sinh, sinh viên có nền tảng Toán phổ thông tốt và muốn hướng tới các sân chơi học thuật về Toán, Toán ứng dụng, AI và Khoa học dữ liệu.",
    outcomes: [
      "Nền tảng Toán thiết yếu cho AI",
      "Xây dựng mô hình và triển khai dự án thực tiễn",
      "Sẵn sàng cho các cuộc thi, nghiên cứu phù hợp",
    ],
    benefits: [
      "Lộ trình thiết kế theo năng lực, mục tiêu của từng nhóm học viên",
      "Head Mentor giảng dạy chính, Mentor giải đáp và theo sát tiến độ học tập",
      "Theo dõi, báo cáo và đánh giá định kỳ",
    ],
    accent: "mint",
  },
  {
    key: "independent",
    label: "Independent Track",
    vietnameseName: "Lộ trình chuyên biệt",
    englishName: "Independent Track",
    goal: "Mục tiêu chuyên biệt theo nhu cầu",
    description:
      "Dành cho học viên đã có mục tiêu cụ thể về nghiên cứu, cuộc thi và muốn phát triển chuyên sâu, tối ưu hoá nhất theo nhịp độ cá nhân hoặc nhóm nhỏ.",
    outcomes: [
      "Dự án hoặc sản phẩm học thuật cụ thể",
      "Hồ sơ thể hiện rõ năng lực học thuật cá nhân",
      "Chiến lược phát triển theo từng giai đoạn và dài hạn",
    ],
    benefits: [
      "Lộ trình thiết kế theo năng lực và mục tiêu của học viên",
      "Head Mentor hướng dẫn và giải đáp trực tiếp",
      "Theo dõi, báo cáo và đánh giá định kỳ",
      "Tham dự buổi định hướng cá nhân hằng tháng",
    ],
    accent: "indigo",
  },
];

type JourneyStep = {
  number: string;
  title: string;
  text: string;
};

const journeySteps: JourneyStep[] = [
  {
    number: "01",
    title: "Tư vấn định hướng",
    text: "Học viên trao đổi với AiMLab về mục tiêu, nền tảng và nhu cầu để xác định phạm vi học phù hợp.",
  },
  {
    number: "02",
    title: "Thiết kế phương án",
    text: "Head Mentor xây dựng phương án riêng theo năng lực, mục tiêu và nhịp độ thực tế của học viên.",
  },
  {
    number: "03",
    title: "Triển khai và đồng hành",
    text: "Head Mentor trực tiếp hướng dẫn, giải đáp và theo dõi tiến độ, kèm phản hồi hằng tuần.",
  },
  {
    number: "04",
    title: "Đánh giá và điều chỉnh",
    text: "Kết quả được định kỳ rà soát và lộ trình học tập linh hoạt điều chỉnh theo tiến bộ thực tế.",
  },
];

type OpportunityItem = {
  name: string;
  description: string;
};

const opportunityItems: OpportunityItem[] = [
  { name: "VOAI", description: "Olympic Trí tuệ nhân tạo Việt Nam" },
  { name: "IOAI", description: "Olympic Trí tuệ nhân tạo Quốc tế" },
  {
    name: "Kaggle",
    description: "Getting Started, Machine Learning và Khoa học dữ liệu cấp trường, cấp quốc gia",
  },
  {
    name: "Nghiên cứu",
    description: "Phát triển đề tài, báo cáo hoặc bài nghiên cứu khoa học theo định hướng",
  },
];

type AcademicNode = {
  name: string;
  logoUrl: string;
};

const academicInstitutions: AcademicNode[] = [
  {
    name: "California Institute of Technology",
    logoUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Caltech_Logo.svg",
  },
  {
    name: "Duke University",
    logoUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4vrMCO6xaYYps2AEDY6vpH2j2J_7sKXS32UOOKL5BuA&s=10",
  },
  {
    name: "Dublin City University",
    logoUrl:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Dublin_City_University_Logo.svg/1280px-Dublin_City_University_Logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail",
  },
  {
    name: "Nanyang Technological University",
    logoUrl:
      "https://en.wikipedia.org/wiki/Special:Redirect/file/Nanyang_Technological_University.svg",
  },
  {
    name: "Đại học Quốc gia Thành phố Hồ Chí Minh",
    logoUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/VNU-HCM_logo.svg",
  },
];

type AchievementItem = {
  logo: string;
  event: string;
  highlight: string;
  detail: string;
  results: string[];
};

const alumniAchievements: AchievementItem[] = [
  {
    logo: "SCUDEM",
    event: "STUDENT CHALLENGE USING DIFFERENTIAL EQUATIONS MODELING 2025",
    highlight: "05",
    detail: "GIẢI TOÀN ĐOÀN",
    results: ["02 Giải Nhất (Outstanding)", "03 Giải Nhì (Meritorious)"],
  },
  {
    logo: "SMPF",
    event: "SINGAPORE MATHEMATICS PROJECT FESTIVAL 2026",
    highlight: "01",
    detail: "GIẢI QUỐC TẾ",
    results: ["Giải Bạc (Bảng Senior)"],
  },
  {
    logo: "VAIC",
    event: "VIETNAM AI CHAMPIONSHIP 2025",
    highlight: "01",
    detail: "HUY CHƯƠNG",
    results: ["Huy chương Bạc"],
  },
];

const scrollToForm = (track?: TrackKey | "undecided") => {
  if (track) window.dispatchEvent(new CustomEvent("select-track", { detail: track }));
  document.querySelector("#dang-ky")?.scrollIntoView({ behavior: "smooth" });
};

function Index() {
  const [activeTrack, setActiveTrack] = useState<TrackKey>("standard");
  const [activePillarIndex, setActivePillarIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;

    const blocks = document.querySelectorAll<HTMLElement>(
      [
        "main > section:not(#top) > .content-shell > *",
        ".about-narrative-bridge",
        ".about-story-intro",
        ".about-signals-row > *",
        ".why-math-band",
        ".about-aimlab-head",
        ".about-aimlab-list > *",
        ".about-aimlab-visual",
        ".program-intro",
        ".track-card",
        ".journey-steps .journey-step",
        ".opportunity-options .opportunity-option",
        ".logo-wall .institution-logo",
        ".achievement-grid .achievement-card",
        ".consultation-section .content-shell > *",
      ].join(","),
    );
    let lastScrollY = window.scrollY;
    let scrollDirection: "up" | "down" = "down";

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) > 3) {
        scrollDirection = currentScrollY > lastScrollY ? "down" : "up";
        lastScrollY = currentScrollY;
      }
    };

    blocks.forEach((block, index) => {
      block.classList.add("scroll-reveal");
      const delay = block.classList.contains("why-math-band")
        ? 220
        : Math.min(index % 4, 3) * 55;
      block.style.setProperty("--reveal-delay", `${delay}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const block = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            block.dataset["revealDirection"] = scrollDirection === "down" ? "up" : "down";
            requestAnimationFrame(() =>
              requestAnimationFrame(() => block.classList.add("is-visible")),
            );
          } else {
            block.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "-3% 0px -8% 0px" },
    );

    window.addEventListener("scroll", updateScrollDirection, { passive: true });
    blocks.forEach((block) => observer.observe(block));

    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
      observer.disconnect();
      blocks.forEach((block) => {
        block.classList.remove("scroll-reveal", "is-visible");
        block.style.removeProperty("--reveal-delay");
        delete block.dataset["revealDirection"];
      });
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="page-shell flex h-20 items-center justify-between">
          <a href="#top" aria-label="AiMLab Scholars - Trang đầu">
            <img src={logoBlack} alt="AiMLab Scholars" className="h-9 w-auto" />
          </a>
          <nav className="hidden items-center gap-8 text-sm md:flex" aria-label="Điều hướng chính">
            <a href="#tong-quan" className="transition-colors hover:text-primary">
              Tổng quan
            </a>
            <a href="#chuong-trinh" className="transition-colors hover:text-primary">
              Chương trình
            </a>
            <a href="#co-hoi" className="transition-colors hover:text-primary">
              Cơ hội
            </a>
          </nav>
          <Button
            variant="hero"
            size="lg"
            className="hidden md:inline-flex"
            onClick={() => scrollToForm("undecided")}
          >
            Đăng ký tư vấn <ArrowRight />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen && (
          <nav
            className="border-t border-border bg-background px-4 py-5 md:hidden"
            aria-label="Điều hướng di động"
          >
            <div className="flex flex-col gap-4 text-sm">
              {[
                ["Tổng quan", "#tong-quan"],
                ["Chương trình", "#chuong-trinh"],
                ["Cơ hội", "#co-hoi"],
                ["Đăng ký tư vấn", "#dang-ky"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={(event) => {
                    setMenuOpen(false);
                    if (href === "#dang-ky") {
                      event.preventDefault();
                      scrollToForm("undecided");
                    }
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <section
        id="top"
        className="grid min-h-[94vh] scroll-mt-20 border-b border-border pt-20 md:grid-cols-[1.08fr_.92fr]"
      >
        <NeuralField />
        <div className="hero-copy-panel flex flex-col justify-between px-6 py-10 md:px-12 md:py-14 lg:px-16">
          <div className="relative z-10 flex items-start justify-between">
            <span className="section-label text-brand-deep">Toán học × Trí tuệ nhân tạo</span>
            <span className="font-mono text-xs text-muted-foreground">EST. 2026</span>
          </div>
          <div className="relative z-10 my-16 md:my-10">
            <h1 className="display-title max-w-3xl">
              <span style={{ color: "#00a26b" }}>AiMLab</span>
              <br />
              <span style={{ color: "#657dff" }}>Scholars</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-foreground/72 md:text-xl">
              Chương trình phát triển tài năng Toán và AI, nơi ươm dưỡng tài năng trẻ hướng đến
              những thành tựu học thuật.
            </p>
            <div className="hero-cta-group mt-8 flex flex-wrap gap-3">
              <Button
                variant="hero"
                size="lg"
                className="hero-primary-button"
                onClick={() => scrollToForm()}
              >
                Nhận lộ trình tư vấn <ArrowRight />
              </Button>
              <Button variant="outline" size="lg" className="hero-outline-button" asChild>
                <a href="#chuong-trinh">
                  Khám phá chương trình <ArrowDown />
                </a>
              </Button>
            </div>
          </div>
          <div className="hero-highlights relative z-10 border-t border-border pt-5">
            <div>
              <strong className="block text-2xl text-foreground">02</strong>
              <span className="text-xs text-muted-foreground">Hướng đào tạo</span>
            </div>
            <div>
              <strong className="block text-2xl text-foreground">Mentor</strong>
              <span className="text-xs text-muted-foreground">Đồng hành và dẫn dắt</span>
            </div>
            <div>
              <strong className="block text-2xl text-foreground">Cá nhân hoá</strong>
              <span className="text-xs text-muted-foreground">Theo năng lực và mục tiêu</span>
            </div>
          </div>
        </div>
      </section>

      <section id="vi-sao" className="about-section why-section scroll-mt-20 py-20 md:py-24">
        <div className="content-shell">
          <div className="about-context-block">
            <span className="section-label">00 // VÌ SAO TOÁN &amp; AI?</span>

            <div className="about-story-intro">
              <h2 className="about-context-title section-main-title">
                AI đang trở thành một <span className="about-story-highlight">năng lực học thuật</span>{" "}
                ngày càng quan trọng.
              </h2>
            </div>

            <div className="about-signals-row mt-10 grid gap-8 md:grid-cols-3">
              {storySignals.map((signal, index) => (
                <article
                  key={signal.title}
                  className={`about-signal-inline about-signal-inline-${signal.accent}`}
                >
                  <div className="about-signal-icon" aria-hidden="true">
                    {index === 0 ? (
                      <BarChart3 size={24} strokeWidth={2} />
                    ) : index === 1 ? (
                      <FileBadge2 size={24} strokeWidth={2} />
                    ) : (
                      <Globe2 size={24} strokeWidth={2} />
                    )}
                  </div>
                  <div className="about-signal-copy">
                    <h3>
                      <a href={signal.href} target="_blank" rel="noreferrer">
                        <span>{signal.title}</span>
                        <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
                      </a>
                    </h3>
                    <p>{signal.description}</p>
                  </div>
                </article>
              ))}
            </div>

          </div>
        </div>

        <div className="why-math-band" aria-label="Vai trò của nền tảng Toán với AI">
          <div className="content-shell why-math-band-inner">
            <span className="why-math-band-node" aria-hidden="true" />
            <p>
              Để đi xa với <span className="why-math-band-ai">AI</span>, nền tảng Toán là điều cốt lõi.
            </p>
          </div>
        </div>
      </section>

      <section
        id="tong-quan"
        className="about-section about-program-section scroll-mt-20 py-20 md:py-24"
      >
        <div className="content-shell">
          <div className="about-aimlab-model">
            <div className="about-aimlab-head">
              <span className="section-label">01 // VỀ CHƯƠNG TRÌNH</span>
              <h2 className="about-aimlab-display section-main-title">
                <span>AiMLab Scholars</span> ra đời...
              </h2>
              <p>
                để biến đam mê Toán và AI thành một hành trình học thuật có định hướng, được Mentor
                dẫn dắt và theo sát.
              </p>
            </div>

            <div
              className="about-aimlab-layout mt-8"
              onMouseLeave={() => setActivePillarIndex(null)}
            >
              <div
                className="about-aimlab-list"
                role="list"
                aria-label="Mô hình phát triển của AiMLab Scholars"
              >
                {aimlabModelPillars.map((pillar, index) => (
                  <article
                    key={pillar.title}
                    role="listitem"
                    tabIndex={0}
                    className={`about-aimlab-row about-aimlab-row-${pillar.accent} ${
                      activePillarIndex === index ? "is-active" : ""
                    }`}
                    onMouseEnter={() => setActivePillarIndex(index)}
                    onFocus={() => setActivePillarIndex(index)}
                    onClick={() => setActivePillarIndex(index)}
                  >
                    <div className="about-aimlab-row-icon" aria-hidden="true">
                      {index === 0 ? (
                        <UsersRound size={24} strokeWidth={2} />
                      ) : index === 1 ? (
                        <RouteIcon size={24} strokeWidth={2} />
                      ) : (
                        <Network size={24} strokeWidth={2} />
                      )}
                    </div>
                    <div className="about-aimlab-row-copy">
                      <h3>{pillar.title}</h3>
                      <p>{pillar.description}</p>
                    </div>
                    <span className="about-aimlab-row-arrow" aria-hidden="true">
                      <ArrowUpRight size={18} strokeWidth={2.1} />
                    </span>
                  </article>
                ))}
              </div>

              <aside
                className="about-aimlab-visual has-local-photo"
                aria-label="Ảnh minh hoạ mô hình AiMLab Scholars"
              >
                <div className="about-aimlab-photo-stack" aria-live="polite">
                  {aimlabModelPillars.map((pillar, index) => {
                    const isVisible =
                      activePillarIndex === null ? index === 0 : activePillarIndex === index;
                    return (
                      <div
                        key={pillar.title}
                        className={`about-aimlab-photo-link ${isVisible ? "is-visible" : ""}`}
                      >
                        <img
                          src={pillar.imageUrl}
                          alt={pillar.imageAlt}
                          loading="eager"
                          decoding="async"
                        />
                      </div>
                    );
                  })}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section
        id="chuong-trinh"
        className="program-section scroll-mt-20 border-y border-border bg-surface-soft py-24 md:py-28"
      >
        <div className="content-shell">
          <div className="program-intro">
            <span className="section-label">02 // HƯỚNG ĐÀO TẠO</span>
            <h2 className="program-title section-main-title">
              02 hướng đào tạo theo mục tiêu người học.
            </h2>
          </div>

          <div className="track-layout-v2 mt-14 grid md:grid-cols-[.34fr_1.66fr]">
            <div className="track-tabs-v2" role="tablist" aria-label="Hướng đào tạo">
              {trainingTracks.map((track) => (
                <button
                  key={track.key}
                  type="button"
                  role="tab"
                  aria-selected={activeTrack === track.key}
                  className={`track-tab-v2 track-tab-v2-${track.accent} ${activeTrack === track.key ? "is-active" : ""}`}
                  onClick={() => setActiveTrack(track.key)}
                >
                  <span
                    className={`track-tab-node track-tab-node-${track.accent}`}
                    aria-hidden="true"
                  />
                  <span>
                    <small>{track.englishName}</small>
                    <strong>{track.vietnameseName}</strong>
                  </span>
                  <ArrowRight size={18} />
                </button>
              ))}
            </div>

            {trainingTracks.map((track) => (
              <article
                key={track.key}
                role="tabpanel"
                hidden={activeTrack !== track.key}
                className={`track-detail-v2 track-detail-v2-${track.accent}`}
              >
                <div className="track-detail-heading">
                  <span className={`track-chip track-chip-${track.accent}`}>
                    {track.englishName}
                  </span>
                  <h3>{track.goal}</h3>
                  {track.format ? <p className="track-meta">{track.format}</p> : null}
                  <p className="track-description">{track.description}</p>
                </div>

                <div className="track-detail-grid">
                  <TrackList
                    title="Kết quả hướng tới"
                    items={track.outcomes}
                    accent={track.accent}
                  />
                  <TrackList
                    title="Quyền lợi đồng hành"
                    items={track.benefits}
                    accent={track.accent}
                  />
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="track-cta"
                  onClick={() => scrollToForm(track.key)}
                >
                  Nhận tư vấn {track.vietnameseName} <ArrowRight />
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Journey activeTrack={activeTrack} />
      <Opportunities />
      <AcademicNetwork />
      <AlumniAchievements />
      <ConsultationForm />
      <Footer />
    </main>
  );
}

function TrackList({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: "mint" | "indigo";
}) {
  return (
    <div className="track-list-block">
      <h4 className="track-list-title">{title}</h4>
      <ul className="track-list-items">
        {items.map((item) => (
          <li key={item}>
            <span className={`track-list-icon track-list-icon-${accent}`} aria-hidden="true">
              <Check className="size-4" />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Journey({ activeTrack }: { activeTrack: TrackKey }) {
  return (
    <section className="journey-section py-24 md:py-28">
      <div className="content-shell">
        <div className="content-heading-grid grid gap-10 md:grid-cols-[.9fr_1.1fr]">
          <div>
            <span className="section-label">03 // QUY TRÌNH THAM GIA</span>
          </div>
          <div>
            <h2 className="section-main-title">Mục tiêu rõ ràng ở từng giai đoạn.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Quy trình được thiết kế giúp phụ huynh và học viên dễ dàng đồng hành, theo dõi suốt lộ
              trình; đảm bảo mục tiêu đầu ra rõ ràng theo từng giai đoạn và định hướng cá nhân hóa
              theo năng lực, nhu cầu.
            </p>
          </div>
        </div>
        <div className="journey-steps mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {journeySteps.map((step, index) => (
            <article
              key={step.number}
              tabIndex={0}
              className={`journey-step journey-step-${index + 1} relative`}
            >
              <div className="journey-step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <div className="journey-cta-row mt-12 flex justify-end">
          <Button variant="hero" size="lg" onClick={() => scrollToForm(activeTrack)}>
            Nhận tư vấn lộ trình <ArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
}

function Opportunities() {
  return (
    <section
      id="co-hoi"
      className="opportunities-section relative scroll-mt-20 overflow-hidden bg-brand-ink py-24 text-background md:py-28"
    >
      <div className="content-shell relative">
        <span className="section-label text-brand-mint">
          04 // CƠ HỘI PHÁT TRIỂN SAU CHƯƠNG TRÌNH
        </span>
        <div className="opportunity-heading mt-8 grid gap-12">
          <h2 className="opportunity-title section-main-title">
            Nền tảng vững
            <br />
            <span>mở ra nhiều hướng đi.</span>
          </h2>
          <p className="max-w-xl self-end text-lg leading-relaxed text-background/65">
            Nền tảng thu được sau lộ trình là bước đệm để học viên hướng tới các sân chơi học thuật
            phù hợp với năng lực và nguyện vọng của mình, dưới sự tư vấn của các Mentor.
          </p>
        </div>
        <div className="opportunity-options mt-20 grid border-t border-background/20 md:grid-cols-4">
          {opportunityItems.map((item) => (
            <article
              key={item.name}
              tabIndex={0}
              className="opportunity-option text-left border-r border-background/20 p-6 md:p-8 md:first:pl-0 md:last:border-r-0"
            >
              <span aria-hidden="true" className="opportunity-node" />
              <strong className="block font-mono text-2xl text-brand-indigo md:text-3xl">
                {item.name}
              </strong>
              <span className="opportunity-description mt-3 block text-xs leading-relaxed text-background/65">
                {item.description}
              </span>
            </article>
          ))}
        </div>
        <div className="opportunity-cta-row mt-12">
          <Button variant="inverse" size="lg" onClick={() => scrollToForm()}>
            Trao đổi về mục tiêu của học viên <ArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
}

function AcademicNetwork() {
  return (
    <section className="academic-network-section py-24 md:py-28">
      <div className="content-shell">
        <div className="academic-light-shell">
          <div className="academic-shell-head">
            <span className="section-label text-brand-mint">05 // ĐỘI NGŨ HỌC THUẬT</span>
            <h2 className="academic-title section-main-title">
              Chất lượng đội ngũ
              <br />
              tạo nên sự khác biệt.
            </h2>
          </div>

          <div
            className="logo-wall academic-logo-wall"
            aria-label="Một số môi trường học tập và làm việc trong mạng lưới học thuật AiMLab"
          >
            {academicInstitutions.map((institution, index) => (
              <div
                className={`institution-logo academic-logo-card academic-logo-card-${index + 1}`}
                key={institution.name}
                tabIndex={0}
                aria-label={institution.name}
              >
                <img
                  className="institution-image"
                  src={institution.logoUrl}
                  alt={`${institution.name} logo`}
                  loading="lazy"
                />
                <span className="institution-tooltip">{institution.name}</span>
              </div>
            ))}
            <div
              className="academic-network-stat"
              aria-label="Hơn 10 nhân tài trong mạng lưới học thuật chuyên môn của AiMLab"
              tabIndex={0}
            >
              <div className="academic-network-stat-main">
                <strong>10+</strong>
                <span>Nhân tài</span>
              </div>
              <p>trong mạng lưới học thuật chuyên môn của AiMLab</p>
            </div>
          </div>

          <p className="academic-note">
            Danh sách thể hiện các môi trường học tập và làm việc có sự hiện diện của thành viên
            trong mạng lưới học thuật của AiMLab, không phải quan hệ đối tác hay bảo trợ của các tổ
            chức nêu trên.
          </p>
        </div>
      </div>
    </section>
  );
}

function AlumniAchievements() {
  return (
    <section className="achievements-section relative overflow-hidden py-24 text-background md:py-28">
      <div className="content-shell relative">
        <span className="section-label text-background/80">06 // THÀNH TÍCH CỰU HỌC VIÊN</span>
        <h2 className="section-main-title achievement-section-title">
          Khẳng định vị thế tại các đấu trường
          <br className="hidden md:block" /> Toán học &amp; AI.
        </h2>
        <div className="achievement-grid mt-14 grid gap-5 lg:grid-cols-3">
          {alumniAchievements.map((item, index) => (
            <article className="achievement-card" key={item.event} tabIndex={0}>
              <div className="achievement-topline">
                <div className="achievement-logo" title={item.event}>
                  {item.logo}
                </div>
                <span className="achievement-index">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{item.event}</h3>
              <div className="achievement-highlight-row">
                <strong>{item.highlight}</strong>
                <span>{item.detail}</span>
              </div>
              <div className="achievement-results">
                {item.results.map((result) => (
                  <p key={result}>{result}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConsultationForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [track, setTrack] = useState("undecided");

  useEffect(() => {
    const handler = (event: Event) =>
      setTrack((event as CustomEvent<TrackKey | "undecided">).detail);
    window.addEventListener("select-track", handler);
    return () => window.removeEventListener("select-track", handler);
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("loading");
    const form = new FormData(formElement);
    const { error } = await supabase.from("consultation_requests").insert({
      full_name: String(form.get("full_name") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      role: String(form.get("role") ?? "student"),
      track,
      needs: String(form.get("needs") ?? "").trim() || null,
    });
    if (error) {
      setStatus("error");
      return;
    }
    formElement.reset();
    setTrack("undecided");
    setStatus("success");
  };

  return (
    <section
      id="dang-ky"
      className="consultation-section scroll-mt-20 border-t border-brand-ink/15 bg-brand-mint py-24 md:py-28"
    >
      <div className="content-shell grid gap-12 md:grid-cols-[.8fr_1.2fr]">
        <div>
          <span className="section-label text-brand-ink">07 // ĐĂNG KÝ TƯ VẤN</span>
          <h2 className="section-main-title consultation-title">
            Nhận lộ trình và
            <br /> tư vấn miễn phí.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink/70">
            Chia sẻ mục tiêu, độ tuổi và nền tảng hiện tại của học viên để AiMLab cùng trao đổi,
            định hướng phương pháp học và xây dựng lộ trình phù hợp.
          </p>
          <p className="mt-12 font-mono text-xs">Chăm sóc khách hàng: 0949.321.023 (Nguyệt Quế)</p>
        </div>
        <form
          onSubmit={submit}
          className="consultation-form grid gap-5 bg-background p-6 md:grid-cols-2 md:p-10"
        >
          <FormField label="Họ và tên" name="full_name" placeholder="Nguyễn Văn A" required />
          <FormField
            label="Điện thoại / Zalo"
            name="phone"
            placeholder="09xx xxx xxx"
            required
            inputMode="tel"
          />
          <label className="grid gap-2 text-sm">
            <span>Vai trò</span>
            <select
              name="role"
              required
              className="h-12 rounded-md border border-input bg-background px-3 outline-none focus:border-primary"
            >
              <option value="parent">Phụ huynh</option>
              <option value="student">Học viên đăng ký</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            <span>Hướng quan tâm</span>
            <select
              name="track"
              value={track}
              onChange={(event) => setTrack(event.target.value)}
              required
              className="h-12 rounded-md border border-input bg-background px-3 outline-none focus:border-primary"
            >
              <option value="undecided">Cần được tư vấn</option>
              <option value="standard">Lộ trình tiêu chuẩn</option>
              <option value="independent">Lộ trình chuyên biệt</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm md:col-span-2">
            <span>Nhu cầu sơ bộ</span>
            <textarea
              name="needs"
              maxLength={1200}
              rows={4}
              placeholder="Mục tiêu, độ tuổi, nền tảng hiện tại hoặc điều gia đình đang quan tâm..."
              className="resize-none rounded-md border border-input bg-background p-3 outline-none focus:border-primary"
            />
          </label>
          <div className="consultation-submit-row flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center">
            <Button variant="hero" size="lg" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Đang gửi..." : "Gửi đăng ký"}
              <ArrowRight />
            </Button>
            <p
              aria-live="polite"
              className={`text-sm ${status === "error" ? "text-destructive" : "text-brand-deep"}`}
            >
              {status === "success" && "AiMLab đã nhận thông tin và sẽ sớm liên hệ với bạn."}
              {status === "error" &&
                "Chưa thể gửi lúc này. Vui lòng thử lại hoặc gọi 0949 321 023."}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

function FormField({
  label,
  name,
  placeholder,
  required,
  inputMode,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  inputMode?: "tel";
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span>{label}</span>
      <input
        name={name}
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        minLength={required ? 2 : undefined}
        className="h-12 rounded-md border border-input bg-background px-3 outline-none focus:border-primary"
      />
    </label>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-ink py-14 text-background">
      <img
        src={crossDotsMint.url}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[.06]"
      />
      <div className="page-shell relative">
        <div className="flex flex-col justify-between gap-10 border-b border-background/20 pb-10 md:flex-row md:items-start">
          <img
            src={logoWhite}
            alt="AiMLab Scholars"
            className="h-10 w-auto object-contain object-left"
          />
          <div className="grid gap-3 text-sm text-background/65 md:text-right">
            <a href="#tong-quan">Tổng quan</a>
            <a href="#chuong-trinh">Hướng đào tạo</a>
            <a href="#dang-ky">Đăng ký tư vấn</a>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 pt-6 font-mono text-xs text-background/45 md:flex-row">
          <span>© 2026 AiMLab. AI & Math Lab.</span>
          <span>Từ đam mê đến thành tựu học thuật.</span>
        </div>
      </div>
    </footer>
  );
}
