"use client";

export default function Nav() {
  return (
    <nav>
      <div className="nav-logo">
        Aryo<em>.</em>
      </div>
      <div className="nav-right">
        <ul className="nav-links">
          <li><a href="#work">Work</a></li>
          <li><a href="#disciplines">Skills</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-cta">Available for work

        </div>
      </div>
    </nav>
  );
}
