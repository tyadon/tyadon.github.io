# Trey's LinkedIn posts (source text for starter blog posts)

Copied verbatim from linkedin.com/in/ryadon on 2026-11-05. Adapt lightly for the blog;
add no new claims. Strip OpSpring sales calls-to-action.

## 1. AI design convergence (about 8 months before 2026-11-05)

Right now, most AI-built sites look like they were all made by the same person. And they kind of were...

It's because of something called distributional convergence: AI models predict the most statistically likely design choices. That means Inter font, purple gradients, white backgrounds, and zero animation.

I've been deep in the weeds researching how to actually fix this with Claude Code, and the most counterintuitive finding?

More specific prompts often make it worse.

Telling Claude "use #2A3F5B for the background" triggers pattern matching. But saying "atmospheric backgrounds with layered depth" triggers creative reasoning. The difference in output quality is night and day.

A few things that actually move the needle:

→ Explicitly ban the defaults. Telling it "never use Inter, Roboto, or purple gradients" eliminates the highest-probability generic outputs
→ Reference feelings, not specs. "Spotify met a disco ball at a Nordic design conference" communicates more than a hex palette ever will
→ Typography alone changes everything. Extreme weight contrasts (100 vs 900) and 3x+ size jumps cause Claude to elevate ALL its other design decisions
→ Install Anthropic's frontend-design skill. One file that injects design-thinking context and steers toward bold aesthetic choices instead of safe middle ground

You can also use v0 or Lovable for initial visual exploration, then bring those components into Claude Code for production-quality code, accessibility, and design system integration.

## 2. Work with a ceiling (about 9 months before 2026-11-05)

Something I keep noticing with the founders I work with:

They often spend the same energy on an internal email as they do on a sales call. Same perfectionism, same amount of time.

But some work has a ceiling. Formatting decks, internal status emails, cleaning data. You can spend 20 minutes or 2 hours, the outcome has a capped potential.

Some work has no ceiling. Product positioning, key customer conversations, hiring. A small improvement here changes everything.

The smartest operators I know use AI exclusively on the first category so they can obsess over the second. Try not to use AI to replace your thinking on the things that matter. Use it to eliminate the things that don't.

## 3. AI fluency (about 8 months before 2026-11-05)

Anthropic just published a study on ~10,000 AI conversations and found something counterintuitive.

When people use AI to actually build things (code, apps, documents), they put MORE effort into directing it upfront but LESS effort into evaluating what comes back. They're more specific about what they want. But less likely to question the reasoning, check facts, or catch what's missing.

It makes sense. If the code runs or the document looks clean, your brain moves on. You don't dig into whether the logic actually holds up. But this is backwards. The stuff you're building and shipping is exactly the stuff that deserves the most scrutiny, not the least.

A few things that have changed how I work with AI:
- I treat every first output as a rough draft, even when it looks finished. Especially when it looks finished.
- I front-load instructions like "flag what you're uncertain about" and "push back if my assumptions are wrong." This completely changes the dynamic. Only 30% of users do this according to the research.

When I'm building something, I force myself to ask "what's wrong with this" before I ask "how do I ship this."

Source link in the original post: Anthropic Education Report, "The AI Fluency Index" (anthropic.com).
