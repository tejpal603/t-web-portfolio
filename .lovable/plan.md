# TWeb premium agency portfolio

## Goal
Build a complete, high-end TWeb website with separate agency pages, a portfolio-first experience, six distinct working demo websites, and a validated inquiry form that securely saves submissions in TWeb.

## Brand and visual direction
- Establish a deep navy, soft cream, white, and restrained blue token system with Manrope headings and Inter body copy.
- Use generous spacing, precise borders, soft shadows, strong editorial typography, and lightweight motion without generic gradients or decorative clutter.
- Create a cinematic homepage opening with the supplied headline, two clear actions, and an animated composition of real demo previews.
- Generate a cohesive set of high-quality, business-specific imagery for the six fictional brands; optimize and load it responsively.
- Respect reduced-motion preferences, keyboard navigation, contrast, and mobile readability.

## Main TWeb website
- Add shared premium navigation and footer across distinct routes: Home, Our Work, Services, About, and Contact.
- **Home:** full-screen opening, selected work, services overview, reasons to choose TWeb, four-step process, and inquiry prompt.
- **Our Work:** large filterable gallery for all six demos, explicit “concept demo” labeling, desktop/mobile preview switching, project descriptions, working live-demo links, and “Discuss a Similar Website” links into the contact flow.
- **Services:** benefit-led presentation of all six requested services with clear icons and a project inquiry action.
- **About:** concise positioning, design principles, and the requested business-focused reasons to choose TWeb without unsupported claims.
- **Contact:** the supplied lead-generation copy, complete inquiry form, and clear submission status.
- Omit public email, WhatsApp, and social links for now because no real contact details were supplied; no invented or dead links will appear.

## Six working demo websites
Create a separate, responsive route and distinctive fictional identity for each concept:

1. **Restaurant** — refined dining, food-led opening, menu highlights, reservations, location, and illustrative guest notes.
2. **Cafe** — warm editorial styling, featured drinks, story, opening hours, location, and illustrative reviews.
3. **Gym** — bold fitness direction, memberships, trainers, schedule, and a strong join action.
4. **Salon** — elegant treatments, transparent demo pricing, stylists, illustrative testimonials, and booking flow.
5. **Construction** — credible industrial styling, services, completed-project gallery, process, and quote request.
6. **Creative agency** — art-directed typography, interactive work previews, capabilities, and sophisticated but efficient motion.

Each demo will include its own responsive navigation, realistic business-specific sections, clearly labeled demo contact information and illustrative testimonials, functional in-page navigation/actions, and an unobtrusive way back to TWeb. No concept will be represented as paid client work.

## Inquiry storage and validation
- Enable Lovable Cloud and add a private inquiries collection for name, business name, email, category, requirements, budget range, source/demo context, and submission time.
- Validate all fields in the browser and again before saving, with useful inline errors, length limits, and no false success state.
- Keep public submission permission narrowly limited to creating an inquiry; visitors will not be able to read saved inquiries.
- “Discuss a Similar Website” will preselect the relevant demo category on the contact page.

## Content, discovery, and quality
- Add unique page titles, descriptions, Open Graph text, Twitter card metadata, and appropriate indexing signals to every main and demo route.
- Build reusable navigation, section, gallery, preview-switcher, form, and demo primitives while allowing each demo its own visual language.
- Add meaningful loading behavior, image alt text, focus states, mobile menus, form status states, and no dead controls.
- Verify the main routes, all six demos, category filtering, preview switching, navigation, and successful/failed form submission behavior.
- Check desktop and mobile layouts for clipping, overlaps, readable text, and properly framed imagery; finish only after the preview builds cleanly.

## Technical notes
- Keep TanStack Start’s file-based routing and create dedicated routes for `/work`, `/services`, `/about`, `/contact`, plus all six `/demos/...` paths.
- Use semantic Tailwind v4 design tokens in the global stylesheet and shared React components for repeated structure.
- Use generated local assets rather than externally hotlinked imagery.
- Use Lovable Cloud for persistent lead storage; no login is required for public visitors.