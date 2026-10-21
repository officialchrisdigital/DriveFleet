---
name: DriveFleet Operational Engine
colors:
  surface: '#FFFFFF'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#434655'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#005e6e'
  on-tertiary: '#ffffff'
  tertiary-container: '#00788c'
  on-tertiary-container: '#d7f6ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
  page-bg: '#F8FAFC'
  border-subtle: '#E2E8F0'
  status-success: '#16A34A'
  status-warning: '#D97706'
  status-error: '#DC2626'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.025em
  display-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-kpi:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-medium:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.025em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a high-performance visual language engineered at the intersection of enterprise fleet logistics and frictionless consumer vehicle reservation. It projects precision, structural authority, and rapid operational clarity. The interface balances high-density administrative workflows with polished, conversion-oriented booking paths.

### Personality & Emotional Tenor
- **Operational Precision:** Utilitarian, reliable, and razor-sharp. Content-first layouts prioritize immediate scannability over decorative distraction.
- **Architectural Authority:** Anchored by deep slate navy surfaces and structured vertical hierarchies that communicate data integrity and enterprise reliability.
- **Frictionless Velocity:** High-contrast interactive focal points and deterministic feedback loops ensure high-speed decision making for fleet dispatchers and end users alike.

### Design Movement
The visual system employs **Corporate Modern with High-Density Utilitarianism**. It relies on crisp 1px borders, subtle ambient elevation, disciplined 8px spatial intervals, and high-readability typography to deliver clean structural delineation without excessive skeuomorphic noise or distracting decorative blurs.

## Colors

The color architecture is built around functional intent and contrast-driven legibility.

### Core Roles
- **Primary Interactive (`#2563EB`):** Applied exclusively to actionable touchpoints: primary trigger buttons, active page markers, form focus halos, and mission-critical booking CTAs.
- **Structural Primary / Navy (`#0F172A`):** Anchors administrative sidebar navigation, high-contrast modal backdrops, and core heading typography.
- **Accent / Highlight (`#06B6D4`):** Used selectively for telemetry indicators, timeline data flags, and specific analytical callouts.
- **Neutral Stack:** `#475569` serves as the benchmark secondary text tone, paired with `#E2E8F0` for hairline dividers and `#F8FAFC` as the default canvas background. Pure `#FFFFFF` remains reserved for interactive surfaces, cards, and modal sheets.

### Status Communication
Status tokens enforce dual visual-semantic cues. Background fills for badges and alert ribbons must be rendered as low-saturation tints (10–15% opacity) of the base status color, paired with the full-strength solid token for foreground text and icon graphics:
- **Success (`#16A34A`):** Vehicle "Ready", booking "Confirmed", telemetry "Optimal".
- **Warning (`#D97706`):** Approaching service thresholds, review required, pending approval.
- **Error (`#DC2626`):** Vehicle "Out of Service", overdue checkout, destructive triggers, inline validation failure.

## Typography

The typography scale utilizes **Inter** across all interface layers to ensure high tabular and reading performance. Numbers in data grids, KPI tiles, and pricing calculations must leverage tabular figures (`font-variant-numeric: tabular-nums`) to prevent horizontal jitter during live data updates.

### Hierarchy & Application
- **Display & Large Headlines:** Reserved for marketing landing surfaces and major section titles. Tight negative letter-spacing ensures a solid visual presence without sprawling.
- **Title KPI:** Tailored specifically for dashboard operational metric cards, displaying high-weight numeric data with clear vertical balance.
- **Body Text:** Standard body text is strictly locked to a 16px minimum (`body-base`) for consumer documentation, policies, and vehicle descriptions to maintain accessible scanning.
- **Labels & Microcopy:** `label-sm` utilizes an uppercase transformation paired with positive letter spacing (`0.025em`) for table headers, status badges, and technical vehicle spec tokens.

## Layout & Spacing

The layout is structured around an uncompromising **8px spatial grid**. Every layout dimension, gutter, margin, and component padding increment resolves to a standard multiple of 8px (with 4px `space-xs` reserved for internal badge and micro-button padding).

### Layout Paradigms
- **Administrative Console:** A persistent 260px fixed-width navigation rail (`#0F172A`) paired with a fluid, multi-column work canvas. Dense operational registries, fleet grids, and metrics panels occupy up to 100% of the remaining viewport, with a maximum boundary of 1440px on extra-wide monitors.
- **Consumer Booking Flow:** A centered, constrained container with a maximum width of 1280px, maintaining balanced gutters to guide the user through inventory selection and checkout.
- **Data Densities:** Tables within administrative screens conform to a strict compact vertical rhythm (8px top/bottom cell padding), whereas public vehicle detail cards use generous vertical spacing (`space-lg` and `space-xl`).

### Responsive Adaptation
- **Desktop (1440px+):** Full multi-column view; admin sidebar expanded; filter sidebars visible alongside 3-column vehicle listings.
- **Tablet (768px - 1023px):** Admin navigation collapses into an icon rail or slide-out drawer; grids collapse to 2 columns; data tables gain horizontal touch scrolling with frozen identifier columns.
- **Mobile (375px - 767px):** Full-bleed single-column layouts with 16px canvas padding. Action buttons stretch to full container width (`w-full`), and filters shift into floating slide-over sheets.

## Elevation & Depth

Depth in this system is functional, crisp, and deliberately restrained. Visual separation relies primarily on sharp `#E2E8F0` structural outlines paired with subtle ambient diffusion. Glassmorphic blurs and heavy drop shadows are prohibited to maintain data clarity.

### Depth Hierarchy
1. **Level 0 (Canvas):** `#F8FAFC` page background.
2. **Level 1 (Card & Row Surfaces):** Pure `#FFFFFF` containers bounded by a continuous 1px solid `#E2E8F0` border. Shadow: none or `0 1px 2px 0 rgba(15, 23, 42, 0.04)`.
3. **Level 2 (Interactive Cards & Popovers):** Elevated vehicle cards on hover, popovers, and segmented action trays. Shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`, bounded by `#E2E8F0`.
4. **Level 3 (Overlays, Modals, & Drawers):** Floating confirmation modals, mobile filter sheets, and sticky reservation summary bars. Shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`, framed against a 50% opacity backdrop overlay (`#0F172A80`).

## Shapes

The geometric personality balances industrial structure with contemporary accessibility. Surfaces feature precise rounding to soften high-density enterprise layouts while preserving functional UI boundaries.

### Geometric Rules
- **Containers & Major Panels (`rounded-xl` / 12px–16px):** Primary vehicle cards, dashboard overview tiles, floating reservation sidebars, and dialog modals utilize 12px or 16px radii.
- **Interactive Controls (`rounded-lg` / 8px):** Form inputs, dropdown selectors, standard buttons, and tab controls are standard 8px rounded corners to maintain alignment with the spatial grid.
- **Pill Badges (`rounded-full` / 9999px):** Status badges (e.g., "Active", "In Maintenance"), telemetry pills, and avatar containers use a fully rounded border-radius.

## Components

### Buttons
- **Primary:** Solid `#2563EB` fill, `#FFFFFF` text, 8px radius, height 40px (desktop) / 48px (mobile). Hover state: `#1D4ED8`. Active state: `#1E40AF`. Focus ring: 2px solid `#06B6D4` with a 2px offset.
- **Secondary / Outline:** `#FFFFFF` fill, 1px solid `#E2E8F0`, `#0F172A` text. Hover state: `#F8FAFC` background with `#CBD5E1` border.
- **Destructive:** Solid `#DC2626` fill, `#FFFFFF` text. Used exclusively for cancellation and irreversible vehicle deactivation workflows.

### Form Inputs & Selectors
- **Text Inputs:** Height 40px, `#FFFFFF` surface, 1px solid `#E2E8F0`, 8px radius, text color `#0F172A`, placeholder `#475569`.
- **Focus State:** 1px border transition to `#2563EB` paired with an ambient 3px box-shadow glow at 15% opacity (`rgba(37, 99, 235, 0.15)`).
- **Error State:** 1px border `#DC2626`, paired with helper text rendered in `caption` size using `#DC2626`.

### Badges & Status Chips
- Rendered in `label-sm` font size with full roundedness (`rounded-full`), 4px vertical padding, and 10px horizontal padding.
- Text must be paired with an icon or dot indicator to prevent color-only status encoding:
  - *Ready / Active:* `#16A34A` text on `rgba(22, 163, 74, 0.1)` background.
  - *Maintenance / Pending:* `#D97706` text on `rgba(217, 119, 6, 0.1)` background.
  - *Out of Service / Overdue:* `#DC2626` text on `rgba(220, 38, 38, 0.1)` background.

### Cards & Container Panels
- Baseline: `#FFFFFF` fill, 12px or 16px radius, 1px solid `#E2E8F0`.
- **Vehicle Inventory Card:** Top section features a 16:9 media frame with fallback placeholder graphics; lower section contains vehicle classification, pricing anchor (tabular text), feature chips, and an interactive CTA button.

### Data Tables (Fleet & Booking Registry)
- Surface: `#FFFFFF` contained inside a 1px `#E2E8F0` border wrapper.
- **Header:** Height 44px, background `#F8FAFC`, text `#475569` styled in `label-sm` uppercase, with subtle column dividers.
- **Row:** Height 52px, text `#0F172A` in `label-md`, hairline bottom border `#E2E8F0`. Row hover: `#F8FAFC` background. Tabular data columns (mileage, rates, vin) must be right-aligned or left-aligned with monospaced numerical behavior.