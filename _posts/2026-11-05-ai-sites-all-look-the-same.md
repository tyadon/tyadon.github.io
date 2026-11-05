---
title: AI-built sites all look the same
description: Why AI-built sites converge on the same design, and what actually moves Claude Code off the defaults.
date: 2026-11-05 10:00:00 -0800
---

Right now, most AI-built sites look like they were all made by the same person. And they kind of were.

There's a name for it: distributional convergence. AI models predict the most statistically likely design choices. That means Inter font, purple gradients, white backgrounds and zero animation.

I've been deep in the weeds researching how to fix this with Claude Code, and the most counterintuitive finding was that more specific prompts often make it worse.

Telling Claude "use #2A3F5B for the background" triggers pattern matching. Saying "atmospheric backgrounds with layered depth" triggers creative reasoning. The difference in output quality is night and day.

A few things that actually move the needle:

- **Ban the defaults explicitly.** Telling it "never use Inter, Roboto, or purple gradients" eliminates the highest-probability generic outputs.
- **Reference feelings, not specs.** "Spotify met a disco ball at a Nordic design conference" communicates more than a hex palette ever will.
- **Lean on typography.** Extreme weight contrasts (100 vs 900) and 3x+ size jumps cause Claude to elevate all its other design decisions.
- **Install Anthropic's frontend-design skill.** It's one file that injects design-thinking context and steers toward bold aesthetic choices instead of the safe middle ground.

You can also use v0 or Lovable for initial visual exploration, then bring those components into Claude Code for production-quality code, accessibility and design system integration.
