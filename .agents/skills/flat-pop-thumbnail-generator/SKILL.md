---
name: flat-pop-thumbnail-generator
description: Guides the agent to generate vibrant "flat-pop" style anime illustrations for blog thumbnails, crop them to 16:9 using sips, convert to webp using cwebp, and update post frontmatter.
---

# Flat-Pop Thumbnail Generator Skill

Use this skill when the user requests creating or recreating a blog post thumbnail in a "flat-pop" or "pop-art anime" visual style.

## Workflow

### 1. Image Generation (`generate_image`)
Use the `generate_image` tool to create a 1:1 image. The prompt must incorporate these core elements to achieve the desired "flat-pop" look:
- **Style Keywords**: `superflat pop-art anime`, `vibrant high-saturation palette`, `bold graphic shapes`, `flat color blocking`, `flat shading only`, `hard color boundaries`, `bold black outlines`, `clean line-art`, `clean crisp edges`.
- **Negative Prompts** (using `--no` if supported or via descriptive prompt): No gradients, no shadows, no depth cues, no realistic textures, no 3d rendering, no blurry lines, no text, no watermark.
- **Composition**: Keep the main character or object centered with ample margins around the edges (as we will crop it to 16:9).
- **Background**: Colorful pop-art background filled with geometric shapes, stars, lightning bolts (⚡), comic-book style "ZAP!" bubbles, and black-and-white halftone dots.

#### Prompt Template Example
```text
superflat pop-art anime [character/object description], vibrant high-saturation palette, bold graphic shapes, flat color blocking, [hair/clothing color details], flat shading only, hard color boundaries, stylized anime face, star reflections in the eyes, bright smile, [outfit details] with pop-art patterns, geometric shapes, floral symbols, sticker-like decorations, [gesture details], white background with flat colorful pop-art shapes, bold vector-like graphics, clean crisp edges, poster-style pop-art motifs, clean line-art, ultra-bright colors, masterpiece --no gradients, shadows, depth cues, realistic texture, 3d rendering, messy shading, blurry lines, text, watermark
```

---

### 2. Cropping & Formatting to 16:9 (`sips`)
The generated image is typically square (1024x1024). Crop it to 16:9 (1024x576) using `sips` (macOS standard utility) and convert the internal format to PNG.

```bash
# Crop to 1024x576 (height 576, width 1024) centered
sips --cropToHeightWidth 576 1024 <generated_image_path>.png --out public/images/<filename>-flatpop.png

# Force internal format conversion to PNG (in case the generated format was JPEG disguised as PNG)
sips -s format png public/images/<filename>-flatpop.png --out public/images/<filename>-flatpop.png
```

---

### 3. Converting to WebP (`cwebp`)
Compress and convert the cropped PNG to WebP format using `cwebp` (requires `webp` package installed via Homebrew). Set quality to 85.

```bash
# Convert PNG to WebP (quality 85)
cwebp -q 85 public/images/<filename>-flatpop.png -o public/images/<filename>-flatpop.webp

# Clean up the intermediate PNG file
rm public/images/<filename>-flatpop.png
```

---

### 4. Updating Post Frontmatter
Open the corresponding post markdown file (e.g., `md/<filename>.md`) and update the `image` field in the frontmatter to point to the new `.webp` file.

```yaml
---
title: ...
date: ...
image: <filename>-flatpop.webp
---
```

---

### 5. Verification
Launch the Next.js development server to verify the layout:
```bash
bun run dev
```
Use the browser subagent to check the local URL (e.g., `http://localhost:3000/blog/posts/<slug>`) and take screenshots to ensure the thumbnail renders beautifully on both the article page and the listing card.
