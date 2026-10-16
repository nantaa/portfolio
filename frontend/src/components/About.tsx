"use client";

export default function About() {
  return (
    <>
      <div className="sec-hd" id="about">
        <span className="sec-lbl">About</span>
        <span className="sec-ct">The person behind the work</span>
      </div>

      <section className="about">
        <div className="about-left">
          <div className="about-ph">

            <img src="images/aryo.png" alt="" />
          </div>
          <div className="about-left-tag">Bekasi, Indonesia — 2025</div>
        </div>
        <div className="about-right">
          <div className="a-label">Who I am</div>
          <h2 className="a-heading">
            I build systems that are as<br />
            considered in their <em>architecture</em><br />
            as in their surface.
          </h2>
          <p className="a-body">
            I operate at the intersection of software, design, and infrastructure —
            building products and systems that solve real problems with precision.
            Every project follows a structure: understand the problem deeply,
            think through constraints, execute with intention, measure the result.<br /><br />
            The depth isn&apos;t always visible. But it&apos;s always there.
          </p>
          <div className="a-stats">
            <div className="a-stat">
              <span className="a-stat-num">08</span>
              <span className="a-stat-lbl">Disciplines</span>
            </div>
            <div className="a-stat">
              <span className="a-stat-num">2+</span>
              <span className="a-stat-lbl">Years active</span>
            </div>
            <div className="a-stat">
              <span className="a-stat-num">∞</span>
              <span className="a-stat-lbl">Systems built</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
