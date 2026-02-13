"use client";

interface AccessState {
  free: boolean;
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
  return (
    <>
      <style>{styles}</style>
      <div className="page-wrap">
        <div className="card">
          <div className="header">
            <div className="title">WELCOME TO<br />RUN WITH THE WINNERS</div>
            <div className="subtitle">You just made the best decision of your betting career.<br />Here&apos;s our packages:</div>
          </div>
          <div className="divider" />
          <div className="tiers">
            <TierCard icon="🆓" label="FREE" tierClass="tier-free" description={<>You&apos;re here. You&apos;re in the building. Every week you&apos;ll get <strong>1–2 free plays</strong> on us.</>} subscribed={access.free} authenticated={authenticated} />
            <TierCard icon="🔥" label="MAX BET PLAY OF THE DAY" tierClass="tier-maxbet" priceTag="$49.99 One-Time" description={<>Our highest-conviction, most researched pick of the day. One play. Max confidence.</>} subscribed={access.maxbet} authenticated={authenticated} checkoutUrl={CHECKOUT_URLS.maxbet} btnClass="btn-maxbet" btnText="GET MAX BET — $49.99" />
            <TierCard icon="💎" label="PREMIUM" tierClass="tier-premium" priceTag="Starting at $29.99" description={<>This is where the real action is. You get <strong>ALL daily plays</strong> PLUS the <strong>Max Bet Play Of The Day included every single day</strong> — that&apos;s a $49.99/day pick built into your sub.</>} prices={["$29.99 / 2 Days","$59.99 / Week","$119.99 / Month","$279.99 / 3 Months","$1,999.99 / Lifetime"]} subscribed={access.premium} authenticated={authenticated} checkoutUrl={CHECKOUT_URLS.premium} btnClass="btn-premium" btnText="JOIN PREMIUM" />
            <TierCard icon="🎯" label="PLAYER PROPS" tierClass="tier-props" priceTag="Starting at $9.99" description={<>Brand new. <strong>Daily player prop picks</strong> with full analysis. If you&apos;re a props bettor, this is your lane.</>} prices={["$9.99 / Day","$29.99 / Week","$59.99 / Month"]} subscribed={access.props} authenticated={authenticated} checkoutUrl={CHECKOUT_URLS.props} btnClass="btn-props" btnText="JOIN PLAYER PROPS" />
            <TierCard icon="👑" label="HIGH ROLLERS" tierClass="tier-highrollers" priceTag="Starting at $149.99" description={<>The top tier. <strong>EVERYTHING</strong> included — all plays, Max Bet POTD, AND Player Props. If you&apos;re serious about this, this is where you belong.</>} prices={["$149.99 / Week","$399.99 / Month"]} subscribed={access.highrollers} authenticated={authenticated} checkoutUrl={CHECKOUT_URLS.highrollers} btnClass="btn-highrollers" btnText="JOIN HIGH ROLLERS" />
          </div>
          <div className="divider" />
          <div className="footer">
            <div className="footer-tagline">WE DON&apos;T HOPE. WE DON&apos;T GUESS.</div>
            <div style={{ height: 4 }} />
            <div className="footer-tagline">WE RUN WITH THE WINNERS. 🏆</div>
          </div>
        </div>
      </div>
    </>
  );
}

interface TierCardProps {
  icon: string; label: string; tierClass: string; priceTag?: string;
  description: React.ReactNode; prices?: string[]; subscribed: boolean;
  authenticated: boolean; checkoutUrl?: string; btnClass?: string; btnText?: string;
}

function TierCard({ icon, label, tierClass, priceTag, description, prices, subscribed, authenticated, checkoutUrl, btnClass, btnText }: TierCardProps) {
  return (
    <div className={`tier ${tierClass} ${subscribed ? "tier-subscribed" : ""}`}>
      <div className="tier-top">
        <div className="tier-icon">{icon}</div>
        <div className="tier-label">{label}</div>
        {priceTag && <div className="tier-price-tag">{priceTag}</div>}
      </div>
      <div className="tier-desc">{description}</div>
      {prices && (
        <div className="prices">
          {prices.map((p, i) => {
            const parts = p.split(" / ");
            return (<div className="price-pill" key={i}><span className="amt">{parts[0]}</span> / {parts[1]}</div>);
          })}
        </div>
      )}
      {checkoutUrl && (
        <div className="btn-wrap">
          {subscribed ? (
            <div className="subscribed-badge"><span className="check-icon">✓</span> SUBSCRIBED</div>
          ) : (
            <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className={`tier-btn ${btnClass}`}>{btnText}</a>
          )}
        </div>
      )}
    </div>
  );
}

const styles = `
* { margin: 0; padding: 0; box-sizing: border-box; }
.page-wrap { background: #0a0a0a; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; padding: 40px 20px; }
.card { width: 680px; max-width: 100%; background: linear-gradient(165deg, #0d0d0d 0%, #111111 40%, #0d0d0d 100%); border-radius: 20px; overflow: hidden; position: relative; border: 1px solid rgba(255,215,0,0.15); box-shadow: 0 0 80px rgba(255,215,0,0.06), 0 40px 80px rgba(0,0,0,0.6); }
.card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, transparent, #FFD700, #FFA500, #FFD700, transparent); }
.header { text-align: center; padding: 48px 40px 32px; background: radial-gradient(ellipse at center top, rgba(255,215,0,0.07) 0%, transparent 70%); }
.title { font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 38px; letter-spacing: 6px; text-transform: uppercase; background: linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #CC8400 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.1; }
.subtitle { font-family: 'Barlow', sans-serif; font-weight: 400; font-size: 15px; color: rgba(255,255,255,0.55); margin-top: 14px; letter-spacing: 0.5px; line-height: 1.5; }
.divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,215,0,0.25), transparent); margin: 0 40px; }
.tiers { padding: 28px 32px 20px; display: flex; flex-direction: column; gap: 16px; }
.tier { border-radius: 14px; padding: 22px 24px; position: relative; overflow: hidden; transition: all 0.3s ease; }
.tier::before { content: ''; position: absolute; inset: 0; border-radius: 14px; border: 1px solid transparent; pointer-events: none; }
.tier-subscribed::after { content: ''; position: absolute; inset: 0; border-radius: 14px; border: 2px solid rgba(45,125,70,0.5); pointer-events: none; z-index: 2; }
.tier-free { background: linear-gradient(135deg, rgba(100,100,100,0.1) 0%, rgba(60,60,60,0.08) 100%); }
.tier-free::before { border-color: rgba(180,180,180,0.12); }
.tier-free .tier-icon { background: rgba(180,180,180,0.12); color: #ccc; }
.tier-free .tier-label { color: #aaa; }
.tier-maxbet { background: linear-gradient(135deg, rgba(255,165,0,0.12) 0%, rgba(230,126,34,0.06) 100%); }
.tier-maxbet::before { border-color: rgba(255,165,0,0.2); }
.tier-maxbet .tier-icon { background: rgba(255,165,0,0.15); color: #FFA500; }
.tier-maxbet .tier-label { color: #FFA500; }
.tier-premium { background: linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(37,99,235,0.06) 100%); }
.tier-premium::before { border-color: rgba(59,130,246,0.2); }
.tier-premium .tier-icon { background: rgba(59,130,246,0.15); color: #60a5fa; }
.tier-premium .tier-label { color: #60a5fa; }
.tier-props { background: linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(139,92,246,0.06) 100%); }
.tier-props::before { border-color: rgba(168,85,247,0.2); }
.tier-props .tier-icon { background: rgba(168,85,247,0.15); color: #c084fc; }
.tier-props .tier-label { color: #c084fc; }
.tier-highrollers { background: linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.05) 100%); }
.tier-highrollers::before { border-color: rgba(255,215,0,0.2); }
.tier-highrollers .tier-icon { background: rgba(255,215,0,0.12); color: #FFD700; }
.tier-highrollers .tier-label { color: #FFD700; }
.tier-top { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 12px; }
.tier-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.tier-label { font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 18px; letter-spacing: 3px; text-transform: uppercase; text-align: center; }
.tier-price-tag { font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 12px; color: rgba(255,255,255,0.35); letter-spacing: 0.5px; text-align: center; }
.tier-desc { font-family: 'Barlow', sans-serif; font-weight: 400; font-size: 13.5px; color: rgba(255,255,255,0.5); line-height: 1.55; margin-bottom: 12px; text-align: center; }
.tier-desc strong { color: rgba(255,255,255,0.8); font-weight: 600; }
.prices { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.price-pill { font-family: 'Barlow Condensed', sans-serif; font-weight: 600; font-size: 12.5px; letter-spacing: 0.5px; padding: 5px 12px; border-radius: 6px; background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.06); }
.price-pill .amt { color: rgba(255,255,255,0.85); font-weight: 700; }
.btn-wrap { text-align: center; margin-top: 14px; }
.tier-btn { display: inline-block; padding: 10px 32px; border-radius: 8px; font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; text-align: center; transition: all 0.25s ease; cursor: pointer; }
.tier-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.4); }
.btn-maxbet { background: linear-gradient(135deg, #FFA500, #E67E22); color: #fff; }
.btn-maxbet:hover { box-shadow: 0 6px 20px rgba(255,165,0,0.3); }
.btn-premium { background: linear-gradient(135deg, #3B82F6, #2563EB); color: #fff; }
.btn-premium:hover { box-shadow: 0 6px 20px rgba(59,130,246,0.3); }
.btn-props { background: linear-gradient(135deg, #A855F7, #7C3AED); color: #fff; }
.btn-props:hover { box-shadow: 0 6px 20px rgba(168,85,247,0.3); }
.btn-highrollers { background: linear-gradient(135deg, #FFD700, #FFA500); color: #0a0a0a; }
.btn-highrollers:hover { box-shadow: 0 6px 20px rgba(255,215,0,0.3); }
.subscribed-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 28px; border-radius: 8px; background: rgba(45,125,70,0.15); border: 1px solid rgba(45,125,70,0.4); font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; color: #4ade80; }
.check-icon { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(45,125,70,0.3); font-size: 13px; color: #4ade80; }
.footer { text-align: center; padding: 24px 40px 40px; }
.footer-tagline { font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: 4px; text-transform: uppercase; background: linear-gradient(90deg, #FFD700, #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
@media (max-width: 720px) {
  .card { border-radius: 12px; }
  .header { padding: 32px 20px 24px; }
  .title { font-size: 28px; letter-spacing: 4px; }
  .subtitle { font-size: 13px; }
  .tiers { padding: 20px 16px 16px; }
  .tier { padding: 18px 16px; }
  .tier-label { font-size: 15px; letter-spacing: 2px; }
  .tier-desc { font-size: 12.5px; }
  .price-pill { font-size: 11px; padding: 4px 10px; }
  .footer { padding: 20px 20px 32px; }
  .footer-tagline { font-size: 16px; letter-spacing: 3px; }
  .divider { margin: 0 20px; }
}
`;
