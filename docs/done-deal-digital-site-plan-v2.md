# Done Deal Digital — Complete Site Build Plan

**Purpose of this document:** This is the single source of truth for building the Done Deal Digital website. It contains all strategic decisions, design philosophy, content direction, page specifications, and technical guidance needed by any agent or developer working on the site. When in doubt about a decision, reference the principles in this document.

---

## 1. Brand Identity & Positioning

### Who We Are
Done Deal Digital is a digital marketing and web design agency built specifically for blue-collar, service-oriented businesses — plumbers, HVAC techs, roofers, electricians, landscapers, and similar trades. We sell websites and digital marketing services at competitive price points with fast turnarounds.

### Who We're Talking To
Our prospect is a small business owner in the trades. He (usually he, though not always) is:
- Running a crew of 1-15 people
- Making decisions between jobs, often on his phone
- Skeptical of marketing — he's been burned by agencies that overpromise
- Not technically sophisticated but not stupid — don't talk down to him
- Values directness, reliability, and proof over polish and jargon
- Judges credibility by gut feel: "Do these people seem like they know what they're doing and will they waste my time?"

### Brand Voice
- **Direct.** Short sentences. No filler. Say what we mean.
- **Confident but not arrogant.** We know our stuff. We don't need to prove it with big words.
- **Trade-fluent.** We use metaphors and language from the trades world. "Built to code." "No change orders." "We show up on time." This signals we understand their world without pandering.
- **Results-first.** Every claim ties back to leads, calls, or revenue. We never talk about "brand awareness" or "engagement metrics" to these guys.

### Brand Voice — Don'ts
- Don't use startup/tech jargon: "synergy," "leverage," "ecosystem," "disrupt"
- Don't use agency-speak: "holistic strategy," "brand storytelling," "content journey"
- Don't be cute or clever at the expense of clarity
- Don't be self-deprecating or overly casual — we're professionals, not buddies
- Don't over-explain. Trust the reader to get it.

---

## 2. Design System

### Core Philosophy
The design should feel like **a sharp-looking truck wrap** — professional, bold, clearly means business, but not a gallery opening. We need to look competent enough that business owners trust we can build them something good, but grounded enough that a plumber or roofer doesn't feel like we're from a different planet.

### Layout Principles
- **Grid-based, clean sections.** No overlapping elements, no diagonal cuts, no parallax wizardry.
- **Generous sizing on CTAs.** Big buttons, obvious next steps.
- **Big text, clear hierarchy.** These owners are looking at the site on a phone between jobs.
- **The design should feel like a firm handshake** — direct, confident, no ambiguity.
- **Sharp 90-degree corners** on all elements. Defined borders. "Blueprint" / "industrial" structure.
- **Vertical line separators** in navigation to reinforce the organized, grid-based feel.

### Color Palette
- **Primary:** Navy (dark, authoritative)
- **Accent:** Construction orange (energy, urgency, trades association)
- **Backgrounds:** Dark-to-darker gradients. No rainbow gradients, nothing glossy.
- **Text:** High contrast. White on navy, navy on white. No light gray text on white backgrounds.

### Typography
- **Condensed typefaces** — feels professional and grounded, not airy
- **All caps for headers and CTAs** — bold, commanding
- **Body text stays readable** — don't sacrifice legibility for style

### Texture & Atmosphere
- Subtle concrete or asphalt-like textures where appropriate
- Faint diagonal stripe patterns (evokes caution tape, work zones, action)
- Subtle grid pattern in hero backgrounds
- Nothing glossy or glass-morphic. No gradients that look like iOS design.

### Imagery Direction
- Stock photography of real tradespeople at work — not posed studio shots
- Prefer images that show action (working on a job site, tools in hand) over portraits
- If using icons, keep them simple line-style or solid fill. No 3D icons, no emoji-style.
- No AI-generated imagery that looks uncanny or over-polished
- Consider using before/after screenshots of actual websites as social proof evolves

### Mobile-First Requirements
- **Sticky mobile CTA bar** at bottom of screen with tap-to-call and/or "Get a Quote" button
- **Tap-to-call phone number** everywhere the phone number appears
- **Hamburger nav** — don't try to cram the full nav into mobile
- **Thumb-friendly tap targets** — minimum 44px height on all interactive elements
- **No horizontal scrolling ever.** Test every section at 320px width minimum.
- Content should be scannable in 30-second bursts. Use bold lead-in sentences on paragraphs if needed, but don't over-format.

---

## 3. Sitemap & Page Specifications

### Page Structure Overview

```
/ (Homepage) — EXISTS, mostly complete
/web-design — Service page
/local-seo — Service page
/lead-generation — Service page
/about — About / Why Us
/contact — Contact form
/case-studies — Portfolio/proof (HIDDEN until content exists, build the template now)
/faq — Frequently Asked Questions
/privacy — Privacy Policy
/terms — Terms of Service
/cookie-policy — Cookie Policy
```

### Navigation Structure

**Primary Nav (header):**
Services (dropdown: Web Design, Local SEO, Lead Generation) | About | Case Studies (hidden until ready) | FAQ | Contact

**Footer Nav:**
- Services column: Web Design, Local SEO, Lead Generation
- Company column: About, FAQ, Contact
- Legal column: Privacy Policy, Terms of Service, Cookie Policy

---

### Page: Web Design (`/web-design`)

**Purpose:** Deep dive on our website offering. This is the link you send a prospect when they need a website. It needs to answer: what do I get, how fast, and why should I trust you?

**Sections:**

**1. Hero**
- Headline: "YOUR WEBSITE SHOULD WORK AS HARD AS YOU DO."
- Subhead: "Most contractor websites are costing their owners jobs every single day. We build sites that turn searches into phone calls — fast, mobile-ready, and built to convert."
- CTA: "GET A FREE QUOTE"

**2. The Problem**
Frame the cost of a bad website or no website in terms they feel. Draft direction:

"Right now, someone in your town is searching for the exact service you offer. If your website is slow, outdated, or doesn't exist — that call goes to a competitor. It's that simple. You don't need a website that wins design awards. You need one that rings your phone."

Second paragraph should address the DIY trap: "Maybe you set up a GoDaddy site a few years ago and it 'works fine.' But if it takes more than 3 seconds to load, doesn't look right on a phone, or doesn't have a clear way to contact you — it's quietly sending leads to someone else."

**3. What You Get**
This is the specific deliverables list. Frame as a checklist-style section. Every item should be concrete and understood by a non-technical person.

Deliverables included in every website build:
- **Custom-designed 5-page website** — Home, About, Services, Service Area, and Contact pages, designed around your brand and built to convert visitors into calls. (Additional pages available as an add-on.)
- **Mobile-first responsive design** — Your site will look and work perfectly on phones, tablets, and desktops. Over 70% of your visitors are on their phone — we build for that reality first.
- **Click-to-call phone number** — Your phone number displayed prominently on every page. One tap and they're calling you. No hunting, no digging.
- **Contact form with instant notifications** — A simple, fast contact form that emails you immediately when a lead comes in. Never miss an inquiry.
- **Google Maps integration** — Embedded map showing your service area or business location so customers know you work in their area.
- **Google Business Profile link** — Direct connection between your website and your Google listing, reinforcing your legitimacy in local search.
- **Basic on-page SEO setup** — Proper title tags, meta descriptions, heading structure, image alt text, and clean URL structure so Google can find and understand your site from day one.
- **Google Analytics 4 installation** — Tracking installed so you can see how many people visit your site, where they come from, and what they do. We'll walk you through the dashboard.
- **Speed optimization** — Compressed images, minimal code, fast hosting. Your site will load in under 2 seconds, not 8.
- **SSL security certificate** — The padlock icon in the browser bar. Comes with your hosting and tells visitors (and Google) that your site is secure.
- **Social media links** — Links to your Facebook, Instagram, Nextdoor, or wherever you're active, displayed in the header or footer.
- **Favicon and branding** — Your logo and brand colors applied consistently. If you have a logo, we use it. If you need one, that's available as an add-on.
- **1 round of revisions** — After we deliver the first draft, you get a full revision round to dial in the details. We want you to be proud of it.
- **Launch on your domain** — We handle the technical setup to get your site live on your domain (e.g., yourcompany.com). If you need a domain, we'll help you pick and register one.
- **Post-launch support (30 days)** — Bug fixes and minor adjustments for 30 days after launch, so you're not left hanging.

**4. Our Build Process**
- Step 1: **Kickoff call (30 min)** — We learn about your business, your customers, your service area, and what makes you different. You send us your logo, photos, and any content you want included.
- Step 2: **Design & build (7-10 business days)** — We design and develop your site. You'll get a preview link to review before anything goes live.
- Step 3: **Your review** — You look it over, tell us what to change. We make revisions.
- Step 4: **Launch** — We push it live, set up analytics, and make sure everything is working. You get a walkthrough of your new site and how to read your traffic data.

**5. Why Not DIY / Why Not Wix**
Don't trash Wix — be respectful but clear. Draft direction:

"Tools like Wix and Squarespace are fine for a food blog or a hobby site. But for a service business competing for local customers on Google, they come with real limitations: slower load times, weaker SEO foundations, generic templates that don't convert, and no one to call when something breaks. We build sites purpose-made for trades businesses — every design decision, every layout choice, every feature is there because it helps you get more calls. That's the difference between a website and a website that works."

**6. CTA Section**
- Headline: "READY TO STOP LOSING LEADS TO YOUR COMPETITOR'S WEBSITE?"
- CTA: "GET YOUR FREE QUOTE"

---

### Page: Local SEO (`/local-seo`)

**Purpose:** Explain what local SEO is in plain English and why it matters for their business. Many of these owners have heard "SEO" but think it's a scam or don't understand it.

**Sections:**

**1. Hero**
- Headline: "SHOW UP FIRST WHEN YOUR TOWN SEARCHES FOR WHAT YOU DO."
- Subhead: "When a homeowner's AC dies at midnight, they Google 'emergency HVAC near me.' If you're not in those top results, that call — and that $3,000 job — goes to someone else. We fix that."
- CTA: "GET A FREE QUOTE"

**2. What Local SEO Actually Is**
Draft direction:

"Local SEO is how Google decides who shows up when someone in your area searches for your service. It's not magic, and it's not a scam — it's a set of specific, measurable things we do to tell Google: this business is real, it's located here, it does this work, and customers trust it. When those signals are strong, you show up. When they're weak or missing, your competitor does."

**3. What's Included**
Break into three clear pillars, each with specific deliverables:

**Google Business Profile Optimization**
- Full GBP audit and cleanup — business name, categories, hours, service area, description, and attributes all verified and optimized
- Professional business description written with local keywords
- Service list and service area configuration
- Photo upload and optimization (you provide photos, we optimize and organize them)
- Q&A section seeded with common customer questions and answers
- Initial batch of 4 GBP posts to establish activity
- Review response templates — we write them, you copy-paste when reviews come in
- Monthly GBP posts (2-4/month) to maintain activity signals

**Local Keyword Targeting**
- Local keyword research — we identify the exact search terms people in your area use to find your services (e.g., "emergency plumber [city]," "roof repair near me")
- On-page optimization of your website for those keywords — title tags, meta descriptions, headers, body content, and image alt text
- Service area pages — if you serve multiple cities or neighborhoods, we create dedicated pages targeting each area (up to 5 included, additional available as add-on)
- Schema markup — structured data added to your site so Google understands your business type, location, and services at a technical level

**Citation Building & Cleanup**
- NAP audit — we check that your business Name, Address, and Phone number are consistent everywhere online (inconsistencies confuse Google and hurt rankings)
- Citation building on 30+ directories — Yelp, BBB, Angi, HomeAdvisor, Thumbtack, Yellow Pages, Nextdoor, and industry-specific directories relevant to your trade
- Duplicate listing cleanup — we find and remove or merge duplicate listings that dilute your search presence
- Ongoing citation monitoring — we check quarterly for new inconsistencies or lost listings

**4. What You Can Expect**
Draft direction:

"SEO is not a light switch — it doesn't turn on overnight. Most of our clients start seeing measurable improvement in their local search visibility within 60-90 days. That means more impressions on Google Maps, more clicks to your website, and more calls from people who found you in search. We provide monthly reports showing exactly where you rank, how many people found you, and what actions they took. No black box. You'll always know what your money is doing."

**5. CTA Section**
- Headline: "STOP BEING INVISIBLE TO THE CUSTOMERS SEARCHING FOR YOU."
- CTA: "GET YOUR FREE QUOTE"

---

### Page: Lead Generation (`/lead-generation`)

**Purpose:** Explain paid advertising and lead funnel management for guys who think "Facebook ads" means boosting a post.

**Sections:**

**1. Hero**
- Headline: "LEADS THAT ACTUALLY PICK UP THE PHONE."
- Subhead: "We don't do vanity metrics. We build and manage ad campaigns that put your business in front of homeowners actively looking for your service — and track every dollar back to real results."
- CTA: "GET A FREE QUOTE"

**2. The Problem with Most Advertising**
Draft direction:

"Most trades businesses that try online ads do it like this: boost a Facebook post for $50, get a bunch of likes from people who will never hire them, and conclude that 'ads don't work.' Or they hand $2,000/month to a Google Ads 'expert' who sends a PDF full of impressions and click-through rates but can't tell them how many actual jobs came from it. We do it differently. Every campaign we run is built around one question: how many real leads did this produce, and what did each one cost?"

**3. What We Manage**
Specific line items grouped by service:

**Google Ads Management**
- Campaign strategy and setup — keyword research, ad group structure, geographic targeting locked to your service area
- Ad copywriting — we write the ads, test variations, and optimize for the messages that get clicks from real prospects
- Landing page creation — every campaign gets a dedicated landing page built to convert (not just your homepage). Includes click-to-call, contact form, and trust signals.
- Negative keyword management — we actively block irrelevant searches so you're not paying for clicks from people looking for DIY tutorials or jobs in your field
- Bid management and budget optimization — we adjust bids daily to maximize leads within your budget
- Conversion tracking — every call, form submission, and text is tracked back to the ad that generated it

**Local Service Ads (LSA) Setup & Management**
- LSA profile setup and verification — including background check coordination, license verification, and insurance documentation
- Profile optimization — service categories, hours, service area, and budget configuration
- Review management guidance — LSA rankings are heavily influenced by review volume and rating, so we provide a system for generating more reviews
- Dispute management — when you get a junk lead through LSA, we help you dispute it for a credit
- Note: LSA availability varies by trade and location. We'll confirm eligibility during consultation.

**Reporting & Transparency**
- Bi-weekly check-in reports — short, plain-English updates: how many leads, what they cost, what's working, what we're changing
- Monthly performance report — full breakdown of spend, leads, cost-per-lead, and lead quality assessment
- Real-time dashboard access — you can log in anytime and see your campaign performance. No waiting for us to send you numbers.
- Call recording (with consent where required) — so you can hear the quality of the leads coming in and we can assess what's converting

**4. How We Think About ROI**
Draft direction:

"Here's the math that matters. Say your average job is worth $1,500 and you close 1 out of every 3 leads. If we're generating leads at $40 each, that's $120 in ad spend to land a $1,500 job. That's the kind of math we optimize for — not impressions, not clicks, not 'reach.' Real jobs, real revenue. We'll build a projection like this for your specific business during our consultation so you know what to expect before you spend a dollar."

**5. CTA Section**
- Headline: "LET'S BUILD A LEAD MACHINE THAT PAYS FOR ITSELF."
- CTA: "GET YOUR FREE QUOTE"

---

### Page: About (`/about`)

**Purpose:** Build trust and human connection. When a prospect is on the fence after cold outreach, this is often the page that tips them. They want to know: who are these people and do they actually understand my business?

**Sections:**

**1. Opening Statement**
Headline: "WE'VE BEEN WHERE YOU ARE."

Draft direction:

"Done Deal Digital exists because we've seen too many good business owners get burned by bad marketing. Overpriced agencies that don't return calls. Freelancers who disappear mid-project. Cookie-cutter websites that look like they were built in an afternoon — because they were. We started this agency to do the opposite: show up, deliver real work, and make sure every dollar you spend moves the needle."

**2. Our Story**
This is the human connection section. Draft direction:

"We're Travis and Jacob — childhood best friends who got their start in digital marketing together over a decade ago. After years of building websites and running campaigns, our careers took us in different directions. Travis co-founded and operated a healthcare business, where he got deep into SEO, lead generation, sales systems, and managing teams — not as a marketer selling services, but as a business owner whose livelihood depended on those systems actually working. That experience changed everything about how he thinks about marketing: when it's your own money and your own business on the line, you stop caring about vanity metrics real fast.

After stepping away from that venture, Travis came back to what he'd been doing for 10+ years — building websites and digital systems — but with a completely different perspective. The combination of a decade of technical web development experience and hard-won lessons from running a real business is the foundation Done Deal Digital is built on.

Now we've reunited to do what we do best, together. We bring 10+ years of web development and digital marketing experience to every project, and — more importantly — we bring the perspective of people who have been on your side of the table. We know what it feels like when your business means everything to you. When it's not just a 'company' — it's how you take care of your family, build something you're proud of, and create the life you want."

**3. Why Trades**
Draft direction:

"We work exclusively with service businesses in the trades because we've seen firsthand how underserved this market is. The big agencies want $5,000/month retainers and treat a plumbing company like an afterthought. The cheap freelancers slap up a template and vanish. And the 'marketing gurus' running Facebook ads are burning through your budget with nothing to show for it.

Tradespeople deserve better. You built your skills through years of hard work and apprenticeship. You show up on time, you do the job right, and you stand behind your work. We think your marketing partner should operate the same way. That's what we do."

**4. Our Principles**
Short, punchy list that doubles as a trust-building mechanism:

- **We show up.** You'll always know what we're working on and when it'll be done. No ghosting, no runaround.
- **We keep it simple.** No jargon, no 40-page proposals, no fluff. We tell you what we'll do, what it costs, and what to expect.
- **We're straight with you.** If something isn't working, we'll say so. If you don't need a service we offer, we'll tell you that too.
- **We build to last.** No shortcuts, no duct tape. Everything we build is done right so it keeps working for you long after we hand it over.
- **Your success is the whole point.** We don't measure our work in deliverables. We measure it in how much closer your business is to the life you're building.

**5. CTA Section**
- Headline: "READY TO WORK WITH PEOPLE WHO ACTUALLY GIVE A DAMN?"
- CTA: "LET'S TALK"

---

### Page: Contact (`/contact`)

**Purpose:** The conversion page. Make it dead simple to get in touch. Zero friction.

**Hero:**
- Headline: "LET'S GET TO WORK."
- Subhead: "Fill out the form and we'll get back to you within 1 business day. No pushy sales pitch — just a straight conversation about what your business needs."

**Layout:**
- **Form** (left/main column):
  - Name (required)
  - Business Name (required)
  - Phone (required)
  - Email (required)
  - What do you need? (dropdown: New Website, Local SEO, Lead Generation / Paid Ads, Multiple Services, Not Sure)
  - Anything else we should know? (optional textarea, short)
  - Submit button: "GET MY FREE CONSULTATION"
- **Contact info** (right column / sidebar):
  - Phone number (tap-to-call)
  - Email address
  - Brief reassurance text: "We typically respond within 1 business day. No pushy sales calls — just a straight conversation about what your business needs."

**Technical requirements:**
- Form submissions via Netlify Forms
- Submission triggers email notification to Done Deal Digital inbox
- Thank-you page/state after submission: confirms receipt, sets expectations for response time
- Consider an auto-reply email confirming submission (can be set up later via Netlify Functions or Zapier)

**Form UX notes:**
- No CAPTCHA unless spam becomes a problem (it adds friction for mobile users)
- Phone field should use `type="tel"` for mobile keyboard
- Email field should use `type="email"` for validation
- Dropdown should default to placeholder text, not a pre-selected option
- Submit button should be full-width on mobile, high-contrast (orange on navy or inverse)

**Thank-You State:**
After submission, replace the form with a confirmation message:
- Headline: "WE GOT IT. WE'LL BE IN TOUCH."
- Body: "Thanks for reaching out. We'll review your info and get back to you within 1 business day — usually sooner. If you need something urgent, give us a call at [phone number]."
- Display the phone number as tap-to-call here as well.

---

### Page: FAQ (`/faq`)

**Purpose:** Handle common objections and questions before they become reasons not to reach out. Also reduces repetitive conversations in the sales process.

**Hero:**
- Headline: "STRAIGHT ANSWERS. NO RUNAROUND."
- Subhead: "If you don't see your question here, reach out — we're happy to talk it through."

**Format:** Accordion-style Q&A. Clean, scannable, one question at a time.

**Questions and Answers:**

*Getting Started*

**Q: How does the process work?**
A: It starts with a short consultation — either a call or a form submission. We learn about your business, take a look at your current digital presence, and put together a recommendation. If we're a good fit, we send you a clear proposal with scope, timeline, and pricing. No pressure, no commitments until you're ready. Once you give the green light, we get to work.

**Q: How long does it take to build a website?**
A: Most websites are designed, built, and launched within 2-3 weeks from kickoff. That includes your review and revision round. Larger or more complex projects may take longer, but we'll give you a clear timeline before we start.

**Q: Do I need to provide content and photos for my website?**
A: It helps if you have photos of your team, your work, or your trucks — real photos build more trust than stock images. But if you don't, we'll source professional stock photography that fits your business. For written content, we handle the copywriting. We'll ask you some questions about your business during kickoff and write everything from there.

**Q: What if I already have a website — can you improve it?**
A: It depends on the situation. Sometimes an existing site just needs cleanup and optimization. Other times, it's more cost-effective to build fresh on a modern platform. We'll look at what you have and give you an honest recommendation — we won't sell you a rebuild if a tune-up will do the job.

*Pricing & Value*

**Q: How much does a website cost?**
A: Every business is different, so we customize our quotes after a short consultation. We'll give you a clear, upfront price with no hidden fees or surprise costs. We're not the cheapest option out there, but we're not the most expensive either — we hit the sweet spot where you get quality work at a price that makes sense for a small business.

**Q: Are there ongoing costs after the website is built?**
A: Your website will have hosting costs (typically modest — we'll give you exact numbers). Beyond that, ongoing services like SEO, lead generation, and site maintenance are optional and billed separately. We'll never lock you into something you don't need.

**Q: How is this different from just using Wix or GoDaddy?**
A: Those tools work fine for certain situations, but for a service business competing for local customers, they come with real limitations: slower load times, weaker SEO foundations, generic templates that aren't designed to convert, and no one to call when something goes wrong. We build sites specifically for trades businesses — every feature is chosen because it helps you get more calls, not because it looks nice in a template gallery.

**Q: What's included in your SEO and lead gen services?**
A: It depends on the package, and we'll scope it out during your consultation. For SEO, the core includes Google Business Profile optimization, local keyword targeting, citation building, and monthly reporting. For lead generation, it includes ad campaign setup and management, landing page creation, conversion tracking, and regular performance reports. We spell everything out in your proposal — no vague "we'll optimize your presence" promises.

*Working With Us*

**Q: Will I be able to make changes to my site myself?**
A: Yes. We build on a platform with a content management system that lets you make basic updates — text, photos, adding a new service — without touching code. We'll give you a quick walkthrough after launch so you're comfortable. And if you need bigger changes, we're always a call or email away.

**Q: What kind of reporting do I get?**
A: For SEO clients, you get a monthly report showing your search rankings, website traffic, and Google Business Profile performance — in plain English, not marketing jargon. For lead gen clients, you get bi-weekly check-ins and a monthly report with lead counts, cost-per-lead, and what we're doing to improve. You can also log into your dashboard anytime to see real-time numbers.

**Q: What if I'm not happy with the design?**
A: We include a revision round in every project so you can give us feedback and we'll adjust. We want you to be proud of your site. If we're way off base (which is rare because we collaborate with you throughout), we'll work with you until it's right.

**Q: Do you lock me into a contract?**
A: For one-time projects like website builds, there's no ongoing contract — you pay for the project, we deliver it, and it's yours. For ongoing services like SEO and lead gen, we typically work on a month-to-month basis after an initial commitment period. We'd rather keep you because we're delivering results than because you're stuck in a contract.

*Technical*

**Q: Do you handle hosting?**
A: Yes. We set up hosting on a fast, reliable, modern platform and manage it for you. Hosting costs are straightforward and we'll tell you exactly what they are upfront.

**Q: Will my site work on mobile?**
A: Absolutely — mobile is actually where we start. Over 70% of local searches happen on a phone, so we design for mobile first and then scale up for tablets and desktops. Your site will look great and work perfectly on every device.

**Q: Do you help with Google Business Profile?**
A: Yes. If you're a web design client, we'll make sure your site links properly to your Google Business Profile. If you're an SEO client, full GBP optimization is a core part of what we do — including your description, service categories, photos, posts, and review response strategy.

**Final CTA at bottom of FAQ page:**
- Headline: "STILL HAVE QUESTIONS? LET'S TALK."
- CTA: "CONTACT US"

---

### Page: Case Studies (`/case-studies`)

**Status: Build the template and page structure now. Content will be added as projects are completed. Page should be hidden from navigation until at least 2-3 case studies are published.**

**Index page hero:**
- Headline: "DON'T TAKE OUR WORD FOR IT."
- Subhead: "Here's what we've built and the results it's driven."

**Template structure per case study:**
1. **Header:** Business type (e.g., "HVAC Company"), location (city/state), and services we provided — displayed as tags/badges
2. **The Challenge:** 2-3 sentences on their situation before working with us. What was the problem? What were they missing out on?
3. **What We Did:** Bullet list of specific services delivered (e.g., "Built 5-page website with service area pages," "Launched Google Ads campaign targeting emergency AC repair," etc.)
4. **The Results:** Concrete metrics displayed as stat callouts — traffic increase, lead volume, ranking improvements, cost-per-lead, etc. At least 2-3 hard numbers per case study.
5. **Screenshot/visual:** Before-and-after of their website, or a key metric chart. Real screenshots, not mockups.
6. **Pull quote** (optional): One sentence from the client if we can get a testimonial.

**Index page layout:**
- Grid of case study cards, each showing: business type icon, trade category, headline result metric ("3x more monthly leads in 90 days"), and a "Read the Case Study" link
- Filter by service type (Web Design, SEO, Lead Gen) is a nice-to-have for v1 but not required — can be added when there are 6+ case studies

---

### Legal Pages

**Privacy Policy, Terms of Service, Cookie Policy** — these need to exist for legitimacy but don't need to be custom-written masterpieces. Use standard templates appropriate for a US-based digital marketing agency. Ensure they cover:
- Data collection via contact form (name, email, phone, business info)
- Use of analytics cookies (Google Analytics 4)
- No selling of personal data
- Contact information for data requests

**These can be styled more simply than the rest of the site** — plain text on the standard page template is fine. Don't waste design effort here, but do make sure the typography is readable.

---

## 4. Conversion Strategy

### Primary Action
Form submission on the Contact page. Every CTA on every page should funnel toward `/contact`.

### Secondary Action
Tap-to-call phone number. Available in the header, footer, mobile sticky bar, and on the Contact page.

### CTA Hierarchy
1. **Primary CTA button** (appears in hero sections and CTA sections): "GET A FREE QUOTE" or "GET YOUR FREE CONSULTATION" — links to `/contact`
2. **Secondary CTA** (in nav, footer, inline): Phone number with tap-to-call
3. **Tertiary CTAs** (within content): "Learn more about [service]" links to service pages

### Post-Submission Flow
1. User submits form → Netlify Forms captures submission → email notification to Done Deal Digital
2. User sees a thank-you message (inline replacement or redirect): "We got it. We'll be in touch within 1 business day — usually sooner. If you need something urgent, give us a call at [phone number]."
3. (Future enhancement) Automated email confirmation to prospect with next-steps info
4. (Future enhancement) Qualified leads receive a Calendly link for scheduling a call — this keeps the calendar protected while still offering scheduling convenience to real prospects

### CTA Copy Guidelines
- Always lead with what they get, not what they do: "Get a Free Quote" not "Submit Form"
- Use urgency without being slimy: "Let's get started" not "LIMITED TIME OFFER"
- Keep button text short: 3-5 words max
- On mobile, CTA buttons should be full-width within their container

### Page-Specific CTAs (Summary)
| Page | Hero CTA | Bottom CTA |
|------|----------|------------|
| Homepage | GET A FREE QUOTE | GET A FREE QUOTE |
| Web Design | GET A FREE QUOTE | GET YOUR FREE QUOTE |
| Local SEO | GET A FREE QUOTE | GET YOUR FREE QUOTE |
| Lead Generation | GET A FREE QUOTE | GET YOUR FREE QUOTE |
| About | LET'S TALK | LET'S TALK |
| FAQ | (none) | CONTACT US |
| Contact | (form is the CTA) | — |

---

## 5. Component Library (Bookshop)

The site uses Astro + Bookshop with either Sveltia CMS or CloudCannon for content management. These are the reusable section types needed across pages:

### Core Components

1. **Hero Section** — Full-width, navy background, large headline (condensed all-caps), subhead, primary CTA button. Supports optional background texture/pattern. Variant: with and without hero image. Bookshop fields: headline (text), subhead (text), cta_text (text), cta_link (url), background_image (image, optional), show_texture (boolean).

2. **Service Card Grid** — 2-3 column grid of cards. Each card: icon, title, short description, bullet list of features. Used on homepage (overview) and could be reused elsewhere. Bookshop fields per card: icon (select), title (text), description (textarea), features (array of text), link (url, optional).

3. **Process Steps** — Numbered steps (01, 02, 03...) with title and description. Horizontal on desktop, vertical stack on mobile. Already exists on homepage. Bookshop fields: steps (array of { number, title, description }).

4. **Content Section** — Flexible two-column or single-column section for body copy. Supports: heading, body text (rich text / markdown), optional image on left or right side. This is the workhorse for service page content blocks. Bookshop fields: heading (text), body (richtext), image (image, optional), image_position (select: left/right/none), background (select: light/dark).

5. **Deliverables List** — Styled checklist section for "What You Get" blocks on service pages. Each item has a bold title and description. Checkmark or icon prefix. Bookshop fields: heading (text), items (array of { title, description }).

6. **CTA Banner** — Full-width section with headline, optional subhead, and primary CTA button. Dark background (navy or dark gradient). Used at the bottom of every page as the final push. Bookshop fields: headline (text), subhead (text, optional), cta_text (text), cta_link (url).

7. **FAQ Accordion** — Expandable Q&A pairs. Clean open/close animation. Only one item open at a time to keep the page tidy. Used on the FAQ page and optionally embeddable on service pages (showing 3-4 relevant questions). Bookshop fields: heading (text, optional), items (array of { question, answer }).

8. **Case Study Card Grid** — Grid of cards for the case studies index. Each card: trade category badge, business type, key metric headline, "Read the Case Study" link. Bookshop fields per card: trade (text), metric_headline (text), slug (url).

9. **Case Study Detail Layout** — Template for individual case study pages. Sections: challenge (richtext), what_we_did (array of text), results (array of { number, label }), screenshot_before (image, optional), screenshot_after (image, optional), testimonial_quote (text, optional), testimonial_attribution (text, optional).

10. **Contact Form** — Styled form component with the fields specified in the Contact page section above. Integrated with Netlify Forms. Hidden `form-name` field for Netlify. Bookshop fields: heading (text), subhead (text), phone (text), email (text), reassurance_text (textarea).

11. **Testimonial Block** — Quote text, attribution (name, business, location). Can be a single featured testimonial or a row of 2-3. Build the component now, populate when testimonials are collected. Bookshop fields: testimonials (array of { quote, name, business, location }).

12. **Stat Callout Row** — 3-4 stat boxes in a row. Number + label format. Bookshop fields: stats (array of { number, label }). Initial stats to use: "10+" / "Years Building Websites" | "2-3 Weeks" / "Average Site Launch" | "100%" / "Transparency on Every Dollar"

### Persistent Components

13. **Header/Nav** — Logo left, nav links center/right with vertical line separators, primary CTA button far right ("Get a Quote"). Mobile: hamburger menu. Sticky on scroll. Phone number visible on desktop, tap-to-call on mobile.

14. **Footer** — Three-column layout (Services, Company, Legal) with logo and tagline. Phone number and email. Copyright line. Tagline: "Built for the bold."

15. **Mobile Sticky CTA Bar** — Fixed to bottom of screen on mobile only. Contains tap-to-call button and "Get a Quote" button side by side. Should not overlap with page content (add bottom padding to body). Disappears when the contact form is in viewport (to avoid redundancy on the contact page).

---

## 6. Technical Notes

### Stack
- **Framework:** Astro
- **Component System:** Bookshop (for component-driven development and CMS visual editing)
- **CMS:** Sveltia CMS or CloudCannon (to be finalized — both integrate with Bookshop; CloudCannon offers native Bookshop support with visual editing, Sveltia is a free open-source Git-based CMS). The CMS enables content updates (text, images, FAQ items, case studies) without touching code.
- **Hosting:** Netlify
- **Forms:** Netlify Forms
- **Analytics:** Google Analytics 4 (set up the tag, configure basic events: page views, form submissions, outbound link clicks, phone number clicks)

### CMS Considerations
- All page content should be editable via the CMS — headlines, body copy, images, FAQ items, case study entries
- Bookshop components should define clear, well-labeled fields so content can be updated without developer involvement
- Case studies should be a content collection (Astro content collections or markdown files) so new ones can be added via CMS without code changes
- FAQ items should be data-driven (YAML/JSON/markdown) so questions can be added, reordered, or removed via CMS

### Performance Requirements
- We sell fast websites. Our own site better be fast. Target: 90+ on all Lighthouse categories.
- No heavy JavaScript frameworks beyond what Astro requires. Use Astro's partial hydration — only hydrate interactive components (accordion, mobile nav, form validation).
- Optimize all images: WebP format, responsive sizes via `<picture>` element, lazy loading below the fold.
- Minimal external font loading — subset if possible, use `font-display: swap`.
- Inline critical CSS. Defer non-critical styles.

### SEO Baseline
While aggressive SEO isn't the growth strategy (cold outreach is), the site should still follow best practices:
- Unique title tags and meta descriptions per page
- Proper heading hierarchy (one H1 per page)
- Schema markup for local business (LocalBusiness type with service offerings)
- Open Graph and Twitter card meta tags for link sharing (important for cold outreach — links shared in emails and DMs should preview well)
- Sitemap.xml and robots.txt
- Fast load times (covered above)
- Alt text on all images
- Canonical URLs on all pages

### Accessibility Baseline
- Sufficient color contrast ratios (especially orange text on dark backgrounds — test this; orange on navy may need to be adjusted for WCAG AA compliance)
- Keyboard navigable forms and accordion
- Proper ARIA labels on interactive elements (accordion buttons, mobile nav toggle, form fields)
- Skip-to-content link
- Form labels properly associated with inputs (not just placeholder text)
- Focus states visible on all interactive elements

---

## 7. Content Production Notes

### What to Write First
Priority order for copy production:
1. Contact page (it's the conversion endpoint — get it right)
2. Web Design service page (likely the most-linked page from outreach)
3. About page (the trust-builder — important for cold outreach credibility)
4. Local SEO service page
5. Lead Generation service page
6. FAQ page
7. Legal pages (can use templates)

### Copy Review Checklist
Before any page copy is finalized, verify:
- [ ] Does every section tie back to a tangible outcome for the prospect?
- [ ] Is the language free of jargon the prospect wouldn't use?
- [ ] Is there a clear CTA visible without scrolling on mobile?
- [ ] Are we making claims we can back up?
- [ ] Does it pass the "would a roofer send this to his buddy" test? (Meaning: does it feel like it's written for him, not at him?)
- [ ] Have we addressed the most likely objection for this page?
- [ ] Is the hero headline under 10 words and immediately clear?

### Image Sourcing
- Use stock photography of real tradespeople at work (Unsplash, Pexels, or paid stock)
- Prefer action shots over portraits, diverse subjects, modern job sites
- Avoid: generic handshake photos, people pointing at laptops, anyone in a suit
- Icons: simple, solid or line-style, consistent weight across the site. Prefer a single icon library (e.g., Lucide, Phosphor, or Heroicons) for consistency.
- Screenshots: when case studies exist, use real before/after site screenshots

---

## 8. Launch Checklist

Before going live, verify:

- [ ] All pages render correctly on mobile (test on real devices, not just DevTools)
- [ ] Contact form submits successfully and notifications arrive
- [ ] Thank-you state displays correctly after form submission
- [ ] Phone number is tap-to-call on mobile across all pages
- [ ] All internal links work (no 404s)
- [ ] Legal pages are accessible from the footer
- [ ] Analytics tracking is firing (page views, form events, phone clicks)
- [ ] Lighthouse scores are 90+ across the board
- [ ] Favicon and social sharing images are set (critical for cold outreach link previews)
- [ ] Open Graph meta tags render correctly (test with Facebook Debugger and Twitter Card Validator)
- [ ] Meta titles and descriptions are unique per page
- [ ] 404 page exists and is styled (with a CTA back to homepage or contact)
- [ ] SSL certificate is active (Netlify handles this)
- [ ] Sitemap.xml is accessible and submitted to Google Search Console
- [ ] Case studies page is hidden from nav (until content exists)
- [ ] Mobile sticky CTA bar works correctly and doesn't overlap footer or form
- [ ] Accordion FAQ opens/closes correctly, only one open at a time
- [ ] CMS is connected and content is editable (test by making a text change and publishing)
- [ ] All images are optimized (WebP, responsive sizes, lazy loading)
- [ ] Color contrast passes WCAG AA on all text elements
- [ ] Forms are keyboard-accessible and screen-reader friendly

---

## 9. Future Enhancements (Post-Launch)

These are not in scope for the initial build but should be considered in architecture decisions:

- **Automated email sequences** — After form submission, trigger a 2-3 email nurture sequence (via Netlify Functions + email service or Zapier). First email: confirm receipt. Second email (day 2): short value piece relevant to what they selected in the form. Third email (day 5): gentle follow-up with CTA to schedule a call.
- **Calendly integration** — Send scheduling links to qualified leads manually at first, potentially automate later as part of the post-form email sequence for qualified leads.
- **Blog / Resource section** — 3-5 evergreen articles useful as outreach leave-behinds. Suggested first articles: "5 Things Every Plumber's Website Needs," "Why Your Google Business Profile Matters More Than Your Website," "How Much Should a Contractor's Website Cost?" These double as trust signals when shared in cold outreach emails.
- **Live chat widget** — Only if lead volume justifies it. Don't add it just to have it.
- **Case study content** — Populate as projects are completed. Aim for 2-3 before unhiding the page from navigation.
- **A/B testing** — Test hero headlines and CTA copy once there's enough traffic to get meaningful data.
- **Client portal** — Way down the road. Don't build infrastructure you don't need yet.
- **Referral program** — Once you have happy clients, a simple "refer a friend, get $X off" system could be powerful in trades networks where everyone knows everyone.

---

*Last updated: March 2026*
*This document should be provided as context to any agent or developer working on the Done Deal Digital website.*
