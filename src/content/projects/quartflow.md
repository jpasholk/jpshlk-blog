---
title: QuartFlow
description: 'A tool that allocates quart sized units from bulk totes, with live sliders and real time math. Built to speed up bulk product planning at my day job.'
url: https://quartflow.jpshlk.com
linkLabel: quartflow.jpshlk.com
image: ../../assets/quartflow.png
imageAlt: 'The QuartFlow tote allocation tool in dark mode on a MacBook and an iPhone.'
featured: true
order: 2
---

QuartFlow is the tool I wish I had on my first week at the day job. We plan bulk product in big totes, then split it down into smaller retail sizes, and working out how many of each you can get was always a bit of a guessing game. This does the guessing for me.

## What it does

You tell it how many totes you have and how many cubic feet each one holds. From there, sliders split that volume across 8, 16, and 24 quart units, and the math updates live as you drag. Move one slider and the rest rebalance, so you can see the tradeoffs in real time instead of running the numbers by hand.

## Built with

No framework here, just plain JavaScript doing the math behind the sliders. It is open source under the MIT license, so borrow whatever is useful. You can try it at [quartflow.jpshlk.com](https://quartflow.jpshlk.com/).
