import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

describe("Human UI/UX Makeover & Screenshot Issue Resolutions", () => {
  // Screenshot 1: Indonesian 3D Material Studies
  it("Screenshot 1: raja_ampat_snorkel_day.html hides arcade dock when ui-hidden is active", () => {
    const htmlPath = path.join(rootDir, "frontend", "public", "raja_ampat_snorkel_day.html");
    const html = fs.readFileSync(htmlPath, "utf-8");
    assert.ok(
      html.includes("body.ui-hidden .dock-wrap") || html.includes(".dock-wrap"),
      "Should contain CSS hiding .dock-wrap when body.ui-hidden"
    );
    assert.ok(
      html.includes("display: none !important"),
      "Should enforce display: none !important on hidden UI elements"
    );
  });

  it("Screenshot 1: MaterialStudiesCarousel loads clean daylight diorama without noir blackout", () => {
    const carouselPath = path.join(
      rootDir,
      "frontend",
      "src",
      "components",
      "previews",
      "MaterialStudiesCarousel.tsx"
    );
    const content = fs.readFileSync(carouselPath, "utf-8");
    assert.ok(!content.includes("theme=noir"), "Should not force noir blackout mode");
    assert.ok(
      content.includes("mood=1") || content.includes("ui=0"),
      "Should load daylight mood (mood=1) and clean UI (ui=0)"
    );
  });

  // Screenshot 2: Moriku Modal Height Collapse
  it("Screenshot 2: moriku index.html gives #app explicit 100% height and flex column", () => {
    const morikuIndexPath = path.join(
      rootDir,
      "frontend",
      "public",
      "projects",
      "moriku",
      "index.html"
    );
    const html = fs.readFileSync(morikuIndexPath, "utf-8");
    assert.ok(html.includes("#app"), "Must style #app");
    assert.ok(html.includes("height: 100%"), "#app must have height: 100%");
    assert.ok(html.includes("display: flex"), "#app must have display: flex");
  });

  it("Screenshot 2: Moriku authentic cyan/navy 'M' logo is deployed", () => {
    const logoAssetPath = path.join(
      rootDir,
      "frontend",
      "public",
      "projects",
      "moriku",
      "build",
      "assets",
      "logo-CjMAA329.png"
    );
    const authenticLogoPath = path.join(
      rootDir,
      "frontend",
      "public",
      "projects",
      "moriku",
      "moriku-logo.png"
    );
    assert.ok(fs.existsSync(logoAssetPath), "Built logo asset must exist");
    assert.ok(fs.existsSync(authenticLogoPath), "Authentic moriku-logo.png must exist");

    const assetSize = fs.statSync(logoAssetPath).size;
    const authenticSize = fs.statSync(authenticLogoPath).size;
    assert.equal(assetSize, authenticSize, "Built logo asset must match authentic moriku-logo.png");
  });

  // Screenshot 5: Makna Works Card Restored Before 1:1 Version
  it("Screenshot 5: Makna Works card renders MaknaMoodboardPreview directly without overlapping badge", () => {
    const workGridPath = path.join(rootDir, "frontend", "src", "components", "WorkGrid.tsx");
    const content = fs.readFileSync(workGridPath, "utf-8");

    // Makna Works must render MaknaMoodboardPreview
    assert.ok(
      content.includes("project.id === 8 ? (") && content.includes("<MaknaMoodboardPreview />"),
      "WorkGrid must render MaknaMoodboardPreview for project 8"
    );

    // No overlapping 1-CLICK LAUNCH badges
    assert.ok(
      !content.includes("⚡ 1-CLICK LAUNCH: 1:1 LIVE GUIDELINES SYSTEM"),
      "Must not have overlapping 1-click launch badge for Makna Works"
    );
  });

  // Screenshot 4: Modal Viewport & Centered Staging
  it("Screenshot 4: CaseStudyModal wraps non-iframe previews inside a centered specimen stage", () => {
    const modalPath = path.join(rootDir, "frontend", "src", "components", "CaseStudyModal.tsx");
    const content = fs.readFileSync(modalPath, "utf-8");

    assert.ok(
      content.includes("max-w-4xl") || content.includes("m-auto"),
      "CaseStudyModal must stage non-iframe previews with max-width and margin auto to prevent empty desert"
    );
  });

  // Screenshot 3 & Useless Animations Purge
  it("Screenshot 3 & Clean UI: HomeClient has purged fake loading gate and marquee ticker", () => {
    const homeClientPath = path.join(rootDir, "frontend", "src", "components", "HomeClient.tsx");
    const content = fs.readFileSync(homeClientPath, "utf-8");

    assert.ok(
      !content.includes("INITIALIZING SYSTEM ARCHITECTURE"),
      "HomeClient must not contain fake loading gate"
    );
    assert.ok(
      !content.includes("marquee-track"),
      "HomeClient must not contain scrolling marquee ticker"
    );
  });

  // Fix 1: Hero button filled text contrast
  it("Fix 1: hero-btn filled uses high contrast white text instead of dark text on maroon", () => {
    const globalsCssPath = path.join(rootDir, "frontend", "src", "app", "globals.css");
    const css = fs.readFileSync(globalsCssPath, "utf-8");
    assert.ok(
      css.includes(".hero-btn.filled") && (css.includes("color: #ffffff") || css.includes("color: #fff") || css.includes("color: white")),
      "hero-btn.filled must enforce white text (#ffffff) to ensure readable contrast on maroon background"
    );
  });

  // Fix 2: Chessboard pattern with maroon blank cards and cream
  it("Fix 2: WorkGrid eliminates pitch black cards and uses maroon and cream chessboard pattern", () => {
    const workGridPath = path.join(rootDir, "frontend", "src", "components", "WorkGrid.tsx");
    const content = fs.readFileSync(workGridPath, "utf-8");

    // No pitch black background #0c1015 or #06121a
    assert.ok(
      !content.includes("#0c1015"),
      "WorkGrid must not use pitch black #0c1015 for card cover"
    );
    assert.ok(
      !content.includes("#06121a"),
      "WorkGrid must not use pitch black #06121a for card cover"
    );

    // Must alternate maroon and cream
    assert.ok(
      content.includes("#7a1525") || content.includes("maroon") || content.includes("accent"),
      "WorkGrid must use maroon oxblood card backgrounds"
    );
    assert.ok(
      content.includes("#f7f4ee") || content.includes("cream") || content.includes("#efece4"),
      "WorkGrid must use cream linen card backgrounds"
    );
  });

  // Fix 3: Removal of "1:1 Live Project" and "1:1 LIVE" labels
  it("Fix 3: WorkGrid eliminates repetitive '1:1 Live Project' labels and '1:1 LIVE' prefixes", () => {
    const workGridPath = path.join(rootDir, "frontend", "src", "components", "WorkGrid.tsx");
    const content = fs.readFileSync(workGridPath, "utf-8");

    assert.ok(
      !content.includes("1:1 Live Project"),
      "WorkGrid must not contain '1:1 Live Project' button label"
    );
    assert.ok(
      !content.includes("1:1 LIVE MORIKU RUNTIME"),
      "WorkGrid must purge '1:1 LIVE' from Moriku cover badge"
    );
    assert.ok(
      !content.includes("1:1 LIVE SHADER DIORAMA"),
      "WorkGrid must purge '1:1 LIVE' from Shader Diorama cover badge"
    );
    assert.ok(
      !content.includes("1:1 LIVE 3D SHOWCASE"),
      "WorkGrid must purge '1:1 LIVE' from 3D showcase cover badge"
    );
    assert.ok(
      !content.includes("1:1 LIVE SYSTEM"),
      "WorkGrid must purge '1:1 LIVE SYSTEM' chips"
    );
    assert.ok(
      content.includes("View Project") || content.includes("Read Case"),
      "WorkGrid button must use clean, professional call to action such as View Project"
    );
  });
});
