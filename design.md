# Authoring UI Design

This repository’s examiner authoring surfaces use a single visual system across question-bank and exam-builder pages.

## Core Direction

- Light, atmospheric workspace surfaces over a soft blue gradient background
- Dark navy sidebar for navigation and product identity
- Teal used for eyebrows, emphasis, and readiness/success accents
- Rounded glass-like panels with restrained shadows instead of flat cards

## Typography

- Primary UI text uses `"Avenir Next", "Trebuchet MS", sans-serif`
- Codes and compact identifiers use `"IBM Plex Mono", "SFMono-Regular", "Courier New", monospace`
- Large page titles should stay bold and compressed, with short supporting copy

## Color Tokens

- Base text: `#21304f`
- Muted text: `#64728d`
- Sidebar / primary navy: `#14284d`
- Accent teal: `#2e8ca1`
- Surfaces rely on translucent white and pale blue layers, not pure white blocks

## Components

- Shell layout stays split between a fixed sidebar and spacious main workspace
- Primary actions use the shared rounded button treatment
- Metadata chips, difficulty chips, and status pills should reuse the existing token palette
- Read-only detail and editable authoring pages should feel like the same product, not separate themes

## Motion And Spacing

- Entry motion is limited to the existing subtle rise animation on panels and headers
- Gaps stay generous: panels are airy, dense tables are balanced by roomy previews and side rails
- Mobile layouts should collapse cleanly without introducing a second visual language
