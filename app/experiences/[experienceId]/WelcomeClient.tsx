"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface AccessState {
  maxbet: boolean;
  premium: boolean;
  props: boolean;
  highrollers: boolean;
}

const CHECKOUT_URLS = {
  maxbet: "https://whop.com/rwtw/max-bet-play-of-the-day/",
  premium: "https://whop.com/rwtw/rwtw/",
  props: "https://whop.com/rwtw/rwtw-propboard/",
  highrollers: "https://whop.com/rwtw/rwtw-premium-copy/",
};

export default function WelcomeClient({
  access,
  authenticated,
}: {
  access: AccessState;
  authenticated: boolean;
}) {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll<HTMLElement>(".tier");
    if (!cards) return;

    const handleMouseMove = (card: HTMLElement) => (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    };

    const handlers = Array.from(cards).map((card) => {
      const handler = handleMouseMove(card);
      card.addEventListener("mousemove", handler);
      return { card, handler };
    });

    return () => {
      handlers.forEach(({ card, handler }) =>
        card.removeEventListener("mousemove", handler)
      );
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="page-wrap">
        {/* Ambient bg effects */}
        <div className="ambient" aria-hidden="true" />
        <div className="noise" aria-hidden="true" />

        <div className="content">
          {/* Hero */}
          <header className="hero">
            <div className="badge">
              <span className="badge-dot" />
              Live Picks Daily
            </div>
            <Image
              src="/logo.png"
              alt=""
              width={220}
              height={220}
              className="hero-logo"
              priority
              unoptimized
            />
            <p className="hero-sub">
              You just made the best decision of your betting career.
            </p>
            <div className="scroll-cue" aria-hidden="true">
              <div className="scroll-line" />
            </div>
          </header>

          {/* Section label */}
          <div className="section-label">
            <span className="label-accent">Choose Your Lane</span>
          </div>

          {/* Tier cards */}
          <div className="tiers" ref={cardsRef}>
            <TierCard
              icon="💎"
              label="Premium"
              tierClass="tier-premium"
              priceTag="Starting at $29.99"
              description={
                <>
                  All daily plays plus the{" "}
                  <strong>Max Bet Play Of The Day</strong> included every single
                  day — that&apos;s a $49.99/day pick built into your sub.
                </>
              }
              prices={[
                "$29.99 / 2 Days",
                "$59.99 / Week",
                "$119.99 / Month",
                "$279.99 / 3 Months",
                "$1,999.99 / Lifetime",
              ]}
              subscribed={access.premium}
              authenticated={authenticated}
              checkoutUrl={CHECKOUT_URLS.premium}
              btnText="Join Premium"
              delay={0}
            />
            <TierCard
              icon="👑"
              label="High Rollers"
              tierClass="tier-highrollers"
              featured
              priceTag="Starting at $149.99"
              description={
                <>
                  The top tier. <strong>EVERYTHING</strong> included — all plays,
                  Max Bet POTD, AND Player Props. If you&apos;re serious about
                  this, this is where you belong.
                </>
              }
              prices={["$149.99 / Week", "$399.99 / Month"]}
              subscribed={access.highrollers}
              authenticated={authenticated}
              checkoutUrl={CHECKOUT_URLS.highrollers}
              btnText="Join High Rollers"
              delay={1}
            />
            <TierCard
              icon="🔥"
              label="Max Bet Play of the Day"
              tierClass="tier-maxbet"
              priceTag="$49.99 One-Time"
              description={
                <>
                  Our highest-conviction, most researched pick of the day. One
                  play. Max confidence.
                </>
              }
              subscribed={access.maxbet}
              authenticated={authenticated}
              checkoutUrl={CHECKOUT_URLS.maxbet}
              btnText="Get Max Bet Play of the Day — $49.99"
              delay={2}
            />
            <TierCard
              icon="🎯"
              label="Player Props"
              tierClass="tier-props"
              priceTag="Starting at $9.99"
              description={
                <>
                  Brand new. <strong>Daily player prop picks</strong> with full
                  analysis. If you&apos;re a props bettor, this is your lane.
                </>
              }
              prices={[
                "$9.99 / Day",
                "$29.99 / Week",
                "$59.99 / Month",
              ]}
              subscribed={access.props}
              authenticated={authenticated}
              checkoutUrl={CHECKOUT_URLS.props}
              btnText="Join Player Props"
              delay={3}
            />
          </div>

          {/* Footer */}
          <footer className="closer">
            <div className="closer-rule" />
            <p className="closer-line">
              We Don&apos;t Hope. We Don&apos;t Guess.
            </p>
            <p className="closer-main">We Run With The Winners. 🏆</p>
            <div className="closer-rule" />
          </footer>
        </div>
      </div>
    </>
  );
}

/* ── Tier Card ── */

interface TierCardProps {
  icon: string;
  label: string;
  tierClass: string;
  priceTag?: string;
  description: React.ReactNode;
  prices?: string[];
  subscribed: boolean;
  authenticated: boolean;
  checkoutUrl?: string;
  btnText?: string;
  featured?: boolean;
  delay?: number;
}

function TierCard({
  icon,
  label,
  tierClass,
  priceTag,
  description,
  prices,
  subscribed,
  authenticated,
  checkoutUrl,
  btnText,
  featured,
  delay = 0,
}: TierCardProps) {
  return (
    <div
      className={`tier ${tierClass}${subscribed ? " tier-subscribed" : ""}${featured ? " tier-featured" : ""}`}
      style={{ animationDelay: `${0.15 + delay * 0.1}s` }}
    >
      {featured && <span className="featured-tag">Most Popular</span>}

      <div className="tier-head">
        <div className="tier-icon">{icon}</div>
        <div className="tier-meta">
          <div className="tier-label">{label}</div>
          {priceTag && <div className="tier-price-tag">{priceTag}</div>}
        </div>
      </div>

      <p className="tier-desc">{description}</p>

      {prices && (
        <div className="prices">
          {prices.map((p, i) => {
            const parts = p.split(" / ");
            return (
              <span className="price-pill" key={i}>
                <span className="amt">{parts[0]}</span> / {parts[1]}
              </span>
            );
          })}
        </div>
      )}

      {checkoutUrl && (
        <div className="btn-wrap">
          {subscribed ? (
            <div className="subscribed-badge">
              <span className="check-icon">✓</span> Subscribed
            </div>
          ) : (
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tier-btn"
            >
              {btnText}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Styles ── */

const styles = `
/* === Reset === */
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}

/* === Vars === */
:root{
  --bg:#07080c;
  --gold:#d4a843;--gold-hi:#f0c95c;--gold-lo:#a07c2e;
  --fire:#e8522a;--fire-hi:#ff7043;
  --blue:#4ea8f6;--blue-hi:#6dc0ff;
  --purple:#a855f7;--purple-hi:#c084fc;
  --txt:rgba(245,241,235,1);
  --txt2:rgba(245,241,235,.55);
  --txt3:rgba(245,241,235,.3);
  --border:rgba(255,255,255,.06);
  --glass:rgba(255,255,255,.025);
}

/* === Page === */
.page-wrap{
  position:relative;background:var(--bg);min-height:100vh;
  overflow-x:hidden;-webkit-font-smoothing:antialiased;
  font-family:'DM Sans','Barlow',system-ui,sans-serif;
  color:var(--txt);
}

/* === Ambient === */
.ambient{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.ambient::before{content:'';position:absolute;top:-35%;left:-15%;width:70vw;height:70vw;
  background:radial-gradient(circle,rgba(212,168,67,.06)0%,transparent 55%);
  animation:drift 22s ease-in-out infinite alternate}
.ambient::after{content:'';position:absolute;bottom:-25%;right:-10%;width:60vw;height:60vw;
  background:radial-gradient(circle,rgba(232,82,42,.035)0%,transparent 55%);
  animation:drift 28s ease-in-out infinite alternate-reverse}
@keyframes drift{from{transform:translate(0,0)scale(1)}to{transform:translate(4%,6%)scale(1.08)}}

/* === Noise === */
.noise{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.3;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  background-size:180px}

/* === Content === */
.content{position:relative;z-index:2;max-width:720px;margin:0 auto;padding:0 20px}

/* === Hero === */
.hero{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:80px 0 20px;min-height:auto;
}
.badge{
  display:inline-flex;align-items:center;gap:8px;
  padding:7px 18px;border-radius:100px;
  border:1px solid var(--border);background:var(--glass);backdrop-filter:blur(8px);
  font-size:10.5px;font-weight:600;letter-spacing:3px;text-transform:uppercase;
  color:var(--txt2);margin-bottom:36px;animation:fadeUp .7s ease both;
}
.badge-dot{
  width:6px;height:6px;border-radius:50%;background:var(--gold);
  box-shadow:0 0 10px var(--gold);animation:pulse 2s ease-in-out infinite;
}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.75)}}

.hero-logo{
  width:clamp(100px,22vw,160px)!important;height:auto!important;
  margin-bottom:24px;
  filter:drop-shadow(0 0 30px rgba(212,168,67,.2));
  animation:fadeUp .7s ease .05s both;
}

.hero-title{
  font-family:'Bebas Neue','Oswald',sans-serif;
  font-size:clamp(4.5rem,14vw,9rem);line-height:.88;letter-spacing:-1px;
  animation:fadeUp .7s ease .1s both;
}
.gold{
  background:linear-gradient(135deg,var(--gold-hi),var(--gold),var(--gold-lo));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
.hero-sub{
  font-size:16px;font-weight:300;color:var(--txt2);
  margin-top:22px;line-height:1.7;max-width:440px;
  animation:fadeUp .7s ease .2s both;
}
.scroll-cue{
  margin-top:28px;display:flex;flex-direction:column;align-items:center;gap:6px;
  animation:fadeUp .7s ease .35s both;
}
.scroll-cue span{font-size:9.5px;letter-spacing:3px;text-transform:uppercase;color:var(--txt3)}
.scroll-line{width:1px;height:36px;background:linear-gradient(to bottom,var(--gold),transparent);animation:scrollBob 2.2s ease-in-out infinite}
@keyframes scrollBob{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(8px);opacity:1}}

/* === Section label === */
.section-label{text-align:center;margin-bottom:24px}
.label-accent{
  font-size:10.5px;font-weight:600;letter-spacing:4px;text-transform:uppercase;
  color:var(--gold);
}

/* === Tier cards === */
.tiers{display:flex;flex-direction:column;gap:16px;padding-bottom:20px}

.tier{
  position:relative;border-radius:16px;padding:28px 28px 24px;
  background:var(--glass);border:1px solid var(--border);
  backdrop-filter:blur(16px);overflow:hidden;
  transition:border-color .35s ease,transform .35s cubic-bezier(.16,1,.3,1),background .35s ease;
  animation:fadeUp .6s ease both;
}
/* Spotlight glow on hover */
.tier::after{
  content:'';position:absolute;inset:-50%;
  background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.03)0%,transparent 45%);
  pointer-events:none;opacity:0;transition:opacity .4s ease;
}
.tier:hover::after{opacity:1}
.tier:hover{transform:translateY(-3px);border-color:rgba(255,255,255,.1)}

/* Top accent line */
.tier::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--accent,var(--gold)),transparent);
  opacity:0;transition:opacity .4s ease;
}
.tier:hover::before{opacity:1}

/* Tier accent colors */
.tier-maxbet{--accent:var(--fire)}
.tier-premium{--accent:var(--blue)}
.tier-props{--accent:var(--purple)}
.tier-highrollers{--accent:var(--gold-hi)}

/* Featured */
.tier-featured{border-color:rgba(212,168,67,.12);background:linear-gradient(165deg,rgba(212,168,67,.04),var(--glass))}
.featured-tag{
  position:absolute;top:14px;right:14px;
  font-size:8.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
  padding:4px 10px;border-radius:6px;
  background:linear-gradient(135deg,var(--gold),var(--gold-lo));color:var(--bg);
}

/* Subscribed ring */
.tier-subscribed{border-color:rgba(74,222,128,.2)!important}
.tier-subscribed::before{background:linear-gradient(90deg,transparent,#4ade80,transparent)!important;opacity:1!important}

/* Head */
.tier-head{display:flex;align-items:center;gap:14px;margin-bottom:14px}
.tier-icon{
  width:44px;height:44px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;font-size:20px;
  background:rgba(255,255,255,.03);border:1px solid var(--border);flex-shrink:0;
}
.tier-maxbet .tier-icon{background:rgba(232,82,42,.08);border-color:rgba(232,82,42,.15)}
.tier-premium .tier-icon{background:rgba(78,168,246,.08);border-color:rgba(78,168,246,.15)}
.tier-props .tier-icon{background:rgba(168,85,247,.08);border-color:rgba(168,85,247,.15)}
.tier-highrollers .tier-icon{background:rgba(212,168,67,.08);border-color:rgba(212,168,67,.15)}

.tier-meta{display:flex;flex-direction:column;gap:2px}
.tier-label{
  font-family:'Oswald',sans-serif;font-weight:600;font-size:16px;
  letter-spacing:2.5px;text-transform:uppercase;color:var(--accent,var(--txt));
}
.tier-price-tag{font-size:11.5px;font-weight:500;color:var(--txt3);letter-spacing:.3px}

/* Desc */
.tier-desc{font-size:13.5px;line-height:1.6;color:var(--txt2);margin-bottom:14px}
.tier-desc strong{color:rgba(255,255,255,.82);font-weight:600}

/* Prices */
.prices{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px}
.price-pill{
  font-size:11px;font-weight:600;letter-spacing:.4px;
  padding:5px 11px;border-radius:7px;
  background:rgba(255,255,255,.04);border:1px solid var(--border);
  color:var(--txt2);
}
.price-pill .amt{color:rgba(255,255,255,.85);font-weight:700}

/* CTA */
.btn-wrap{margin-top:2px}
.tier-btn{
  display:block;width:100%;padding:13px;border-radius:10px;
  border:1px solid var(--border);background:transparent;
  font-family:'Oswald',sans-serif;font-weight:600;font-size:13px;
  letter-spacing:2px;text-transform:uppercase;text-decoration:none;
  text-align:center;color:var(--txt);cursor:pointer;
  transition:all .3s ease;
}
.tier-btn:hover{
  background:var(--accent,var(--gold));border-color:var(--accent,var(--gold));
  color:var(--bg);transform:scale(1.015);
}
/* Featured CTA filled by default */
.tier-featured .tier-btn{
  background:linear-gradient(135deg,var(--gold),var(--gold-lo));
  border-color:var(--gold);color:var(--bg);
}
.tier-featured .tier-btn:hover{
  background:linear-gradient(135deg,var(--gold-hi),var(--gold));
  border-color:var(--gold-hi);
}
/* Premium CTA - blue */
.tier-premium .tier-btn{
  background:linear-gradient(135deg,var(--blue),#2b7de9);
  border-color:var(--blue);color:#fff;
}
.tier-premium .tier-btn:hover{
  background:linear-gradient(135deg,var(--blue-hi),var(--blue));
  border-color:var(--blue-hi);
}
/* Max Bet CTA - red */
.tier-maxbet .tier-btn{
  background:linear-gradient(135deg,var(--fire),#c23a1a);
  border-color:var(--fire);color:#fff;
}
.tier-maxbet .tier-btn:hover{
  background:linear-gradient(135deg,var(--fire-hi),var(--fire));
  border-color:var(--fire-hi);
}
/* Player Props CTA - purple */
.tier-props .tier-btn{
  background:linear-gradient(135deg,var(--purple),#7c3aed);
  border-color:var(--purple);color:#fff;
}
.tier-props .tier-btn:hover{
  background:linear-gradient(135deg,var(--purple-hi),var(--purple));
  border-color:var(--purple-hi);
}

/* Subscribed badge */
.subscribed-badge{
  display:inline-flex;align-items:center;gap:8px;
  padding:11px 24px;border-radius:10px;
  background:rgba(74,222,128,.06);border:1px solid rgba(74,222,128,.2);
  font-family:'Oswald',sans-serif;font-weight:600;font-size:13px;
  letter-spacing:2px;text-transform:uppercase;color:#4ade80;
}
.check-icon{
  display:inline-flex;align-items:center;justify-content:center;
  width:20px;height:20px;border-radius:50%;
  background:rgba(74,222,128,.15);font-size:12px;color:#4ade80;
}

/* === Footer / Closer === */
.closer{text-align:center;padding:60px 0 80px}
.closer-rule{width:50px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:0 auto 28px}
.closer-line{
  font-family:'Oswald',sans-serif;font-weight:500;font-size:clamp(1rem,2.5vw,1.4rem);
  text-transform:uppercase;letter-spacing:4px;color:var(--txt3);line-height:1.8;
}
.closer-main{
  font-family:'Bebas Neue','Oswald',sans-serif;
  font-size:clamp(2.2rem,6vw,3.8rem);line-height:1.1;margin-top:6px;
  background:linear-gradient(135deg,var(--gold-hi),var(--gold),var(--gold-lo));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}

/* === Animation === */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

/* === Responsive === */
@media(max-width:600px){
  .hero{padding:50px 0 16px;min-height:auto}
  .hero-title{font-size:clamp(3.5rem,16vw,5rem)}
  .hero-sub{font-size:14px}
  .tier{padding:22px 18px 20px}
  .tier-label{font-size:14px;letter-spacing:2px}
  .tier-desc{font-size:12.5px}
  .price-pill{font-size:10px;padding:4px 9px}
  .featured-tag{top:10px;right:10px;font-size:8px}
  .closer{padding:40px 0 60px}
}
`;
