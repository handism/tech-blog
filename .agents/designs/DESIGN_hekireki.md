---
version: alpha
name: Hekireki
colors:
  primary: "#202124"
  neutral: "#e8eaed"
  accent: "#006bb3"
  on-accent: "#e8eaed"
  code: "#FF9600"
typography:
  body:
    fontFamily: '"Noto Sans JP", "Avenir", "Helvetica Neue", "Helvetica", "Arial", "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "メイリオ", "Meiryo", "游ゴシック", "Yu Gothic", "ＭＳ Ｐゴシック", sans-serif'
    fontSize: 16px
    lineHeight: 1.7
    letterSpacing: 0.05rem
  code:
    fontFamily: 'Consolas, Menlo, Monaco, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", Meiryo, monospace'
    lineHeight: 1.4
  h1:
    fontFamily: '"Noto Sans JP", "Avenir", "Helvetica Neue", "Helvetica", "Arial", "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "メイリオ", "Meiryo", "游ゴシック", "Yu Gothic", "ＭＳ Ｐゴシック", sans-serif'
    fontSize: 24px
    fontWeight: 700
  h2:
    fontFamily: '"Noto Sans JP", "Avenir", "Helvetica Neue", "Helvetica", "Arial", "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "メイリオ", "Meiryo", "游ゴシック", "Yu Gothic", "ＭＳ Ｐゴシック", sans-serif'
    fontSize: 20px
    fontWeight: 700
  h3:
    fontFamily: '"Noto Sans JP", "Avenir", "Helvetica Neue", "Helvetica", "Arial", "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "メイリオ", "Meiryo", "游ゴシック", "Yu Gothic", "ＭＳ Ｐゴシック", sans-serif'
    fontSize: 18px
    fontWeight: 700
  h4:
    fontFamily: '"Noto Sans JP", "Avenir", "Helvetica Neue", "Helvetica", "Arial", "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "メイリオ", "Meiryo", "游ゴシック", "Yu Gothic", "ＭＳ Ｐゴシック", sans-serif'
    fontSize: 16px
    fontWeight: 700
rounded:
  xs: 3px
  sm: 4px
  md: 5px
  lg: 8px
spacing:
  xs: 0.3rem
  sm: 0.5rem
  md: 0.8rem
  lg: 1rem
  xl: 16px
  xxl: 2rem
  xxxl: 3rem
components:
  header:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    padding: "{spacing.lg}"
  footer:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    padding: "{spacing.lg}"
  body:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
  inline-code:
    textColor: "{colors.code}"
  post-card:
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  tag:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.xs}"
    padding: "{spacing.xs}"
  scroll-button:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    padding: 10px
  post-nav-button:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    padding: 0.5rem 1rem
  post-nav-button-hover:
    backgroundColor: "{colors.on-accent}"
    textColor: "{colors.accent}"
---

## Overview

A clean, minimalist digital journal theme focused on layout structure, typographical alignment, and content readability. The visual system features flat design elements, structured borders, and a distinct header-footer visual frame using a bold accent color. Content is presented in a readable, centered single column on articles, and a responsive multi-column grid on lists, using CSS blend modes on image hover to add subtle interactive depth.

The theme natively supports light and dark modes based on system preferences.

## Colors

The theme operates with a five-color color token schema. The core semantic structure is designed to invert cleanly.

- **Primary Text (`{colors.primary}`)**: `#202124` (Charcoal) in light mode. Swaps dynamically to `#e8eaed` (Cool Light Gray) in dark mode via system preference selectors.
- **Neutral Base Background (`{colors.neutral}`)**: `#e8eaed` (Cool Light Gray) in light mode. Swaps dynamically to `#202124` (Charcoal) in dark mode.
- **Accent Theme Color (`{colors.accent}`)**: `#006bb3` (Deep Ocean Blue). Used for top/bottom banners, buttons, text links, tags, and table header background. This remains persistent across both light and dark modes.
- **Contrast Text on Accent Background (`{colors.on-accent}`)**: `#e8eaed` (Cool Light Gray). Used as text color on header/footer banners, button labels, and tags to maintain high readability.
- **Highlight Text/Code (`{colors.code}`)**: `#FF9600` (Vibrant Orange). Used exclusively for inline code block text to contrast sharply with primary body text.

### Mix Blend Mode

Hover animations on thumbnails utilize a responsive CSS mix-blend-mode:
- **Light mode**: `multiply`
- **Dark mode**: `screen`

## Typography

Typography is designed for maximum clarity, prioritizing modern Japanese sans-serif fonts with clean fallback stacks for English.

- **Body Font (`{typography.body}`)**: Set to `16px` with a line height of `1.7` and letter spacing of `0.05rem`. The stack prioritizes `"Noto Sans JP"` and `"Avenir"` for readable rendering of mixed-language text.
- **Monospace Font (`{typography.code}`)**: Set to a line-height of `1.4` using `Consolas`, `Menlo`, and `Monaco` for code syntax and programming context.
- **Heading Elements**:
  - **h1 (`{typography.h1}`)**: `24px` size, bold weight. Minimal padding with no border decorations.
  - **h2 (`{typography.h2}`)**: `20px` size, bold weight. Features a prominent `solid 5px` left accent border and `solid 1px` bottom border with a top margin of `3rem` for clear section partitioning.
  - **h3 (`{typography.h3}`)**: `18px` size, bold weight. Styled with a `solid 2px` left accent border and a top margin of `3rem`.
  - **h4 (`{typography.h4}`)**: `16px` size, bold weight. Structured with a top margin of `3rem` and no borders.

## Layout

The page structure is optimized to center reading columns and handle cards cleanly.

- **Content Container (`.l-main`)**: Centered layout wrapper with a strict maximum width of `800px` to maintain comfortable line lengths.
- **Margin & Padding Scale**:
  - Inner page padding: `{spacing.md}` (`0.8rem`) for the main content container.
  - Heading separation: `{spacing.xxxl}` (`3rem`) top margins.
  - Code block & tables vertical spacing: `{spacing.xxl}` (`2rem`) margin top/bottom.
- **Grid Layout**: 
  - List pages layout posts using a responsive flex card grid.
  - **Desktop**: Three cards per row with card width calculated as `calc(33.33% - 32px)` and `{spacing.xl}` (`16px`) padding/margins.
  - **Mobile (max-width 767px)**: Cards shift to vertical stack with a width of `90%`.

## Elevation & Depth

The visual system is intentionally flat, opting for high contrast line delimiters instead of shadows.

- **Borders**: 
  - Blockquotes, code pre blocks, and tables use a solid `1px` border using primary text colors.
  - Table headers use `{colors.accent}` background with dashed `1px` cells.
  - Custom block callouts use a dashed `1px` border.
  - Post cards use a light solid border (`1px solid #ccc`).

## Shapes

- **Card Roundedness (`{rounded.lg}`)**: `8px` corner radius for article card containers.
- **Button Roundedness (`{rounded.md}`)**: `5px` corner radius for scroll buttons and next/previous links.
- **Thumbnail Roundedness (`{rounded.sm}`)**: `4px` corner radius for post thumbnails.
- **Tag Roundedness (`{rounded.xs}`)**: `3px` corner radius for tag badges.

## Components

- **Header (`{components.header}`)**: Accent-colored header band with centered title links.
- **Footer (`{components.footer}`)**: Footer band that wraps site-navigation links (`footer-nav`) delimited by vertical line pipes.
- **Post Card (`{components.post-card}`)**: Rectangular wrapper housing article cards. Features subtle transition zoom and mix-blend-mode hover states on the thumbnail image.
- **Tag Badge (`{components.tag}`)**: Compact inline block tag badge displaying `# {tag_name}` with `{colors.accent}` background and `{colors.on-accent}` text.
- **Scroll Button (`{components.scroll-button}`)**: Fixed button positioned at `bottom: 20px` and `right: 20px`, appearing only when scroll exceeds `100px`.
- **Post Nav (`{components.post-nav-button}`)**: Side-by-side previous/next post links at the bottom of articles that transition background and text colors cleanly on hover (`{components.post-nav-button-hover}`).

## Do's and Don'ts

### Do's
- **Do** preserve the structural border styling of `h2` and `h3` headers to maintain the standard section separation.
- **Do** wrap inline code blocks inside `p` or `li` elements, applying `{colors.code}` (orange) directly.
- **Do** rely on system preferences (`prefers-color-scheme`) to toggle light/dark modes automatically.

### Don'ts
- **Don't** apply shadows or elevation filters to cards or page headers; maintain the flat, print-style layout of the site.
- **Don't** modify the accent color or code colors dynamically in dark mode; they are optimized for both light and dark palettes.
