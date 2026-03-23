# Design System: High-End Culinary Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Sommelier"**

This design system is not a utility; it is a curation. Moving away from the cluttered, "utility-first" look of standard food delivery apps, this system treats food as art and the interface as a gallery. We achieve a premium feel through **"Restrained Brutalism"**—using oversized, bold typography paired with vast amounts of negative space and ethereal, layered glass surfaces. 

To break the "template" look, we utilize intentional asymmetry (e.g., hero images bleeding off-canvas) and a strict rejection of traditional structural lines. The interface should feel like a high-end physical menu: heavy, tactile, and expensive.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep obsidian tones, punctuated by a high-viscosity orange that evokes heat and flavor.

### Palette Tokens
*   **Background:** `#0D0D0D` (Deepest Void)
*   **Primary (Accent):** `#E8622A` (Burnt Umber/Orange)
*   **Surface-Lowest:** `#0E0E0E`
*   **Surface-Low:** `#1C1B1B`
*   **Surface-Container:** `#201F1F`
*   **On-Surface (Primary Text):** `#E5E2E1`
*   **On-Surface-Variant (Secondary Text):** `#E0BFB4`

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited for sectioning. Separation must be achieved through:
1.  **Tonal Shifts:** Placing a `surface-container-low` card against the `background` (`#0D0D0D`).
2.  **Negative Space:** Using the Spacing Scale (specifically `10` to `16`) to create distinct content blocks.

### The Glass & Gradient Rule
For floating elements (Navigation bars, floating action buttons), use the **Signature Glass** spec:
*   **Background:** `rgba(255, 255, 255, 0.07)`
*   **Blur:** `backdrop-filter: blur(20px)`
*   **Border:** `1px solid rgba(255, 255, 255, 0.12)`
*   **Shadow:** 15% opacity primary color glow for active states.

---

## 3. Typography: The Editorial Voice
Our typography creates a hierarchy of "Momentum." We use high-contrast weight shifts to guide the eye.

*   **Display & Headlines (Epilogue - Bold):** Use `display-lg` (3.5rem) for dish names. This is our "Editorial Punch."
*   **Accents (Bebas Neue):** Reserved for "English Accents"—metadata, price tags, or uppercase labels (e.g., "PREMIUM SELECTION"). This adds a cinematic, poster-like quality.
*   **Body (Manrope - Light/300):** Use `body-lg` (1rem) for descriptions. The light weight against the dark background ensures the text feels "etched" rather than printed, increasing the premium feel.
*   **Labels (Space Grotesk):** For technical data (calories, prep time). It provides a subtle "tech-luxe" contrast to the organic food photography.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to create depth; we use **Atmospheric Stacking.**

*   **The Layering Principle:** Treat the UI as layers of smoke and glass. 
    *   **Base:** `background` (#0D0D0D).
    *   **Mid-Ground:** `surface-container-low` for large section blocks.
    *   **Foreground:** Glassmorphism containers for interactive cards.
*   **The Ghost Border Fallback:** If a container requires definition against a similar tone, use the `outline-variant` token at **15% opacity**. It should be felt, not seen.
*   **Ambient Glow:** For the most premium items, use a "Dish Glow"—a very large, 60px blur shadow using the `primary` color at 5% opacity to make the product look like it is under a heat lamp.

---

## 5. Components

### Buttons
*   **Primary:** Solid `#E8622A` (Primary) with `on-primary` text. Border radius: `sm` (0.125rem) for a sharp, architectural look.
*   **Secondary (Glass):** The Signature Glass spec. Used for "Add to Cart" or secondary actions.
*   **Tertiary:** Ghost style. No background, `Bebas Neue` uppercase text with a 2px underline in `primary`.

### Cards (The "Gallery" Card)
*   **Style:** No borders. Background is `surface-container-lowest`. 
*   **Imagery:** Images must use a `DEFAULT` (0.25rem) corner radius. Use a subtle gradient overlay (bottom-to-top) to ensure `display-sm` text is readable over food photos.

### Inputs & Search
*   **Style:** Minimalist. Underline only (2px `outline-variant`). 
*   **Active State:** Underline transitions to `primary` (#E8622A). Label moves to `label-sm` in `spaceGrotesk`.

### Lists & Dividers
*   **The Rule:** **Dividers are forbidden.** Use spacing `5` (1.7rem) to separate list items. If a separator is functionally required, use a 1px `surface-variant` line that only spans 60% of the container width, centered, to maintain "breathing room."

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts. Let a photo of a dish take up 70% of the screen width, pushing the text to a 30% column.
*   **Do** use `Bebas Neue` for prices (e.g., $42.00) to make them feel like a design element.
*   **Do** lean into the "Light" weight for body text. It creates a sophisticated, high-fashion aesthetic.

### Don’t:
*   **Don't** use standard 400 or 500 weights for body text; it looks too "Bootstrap" and "Default."
*   **Don't** use rounded corners larger than `lg` (0.5rem). High-end design favors slightly sharper, more intentional edges over "bubbly" mobile defaults.
*   **Don't** use pure white (`#FFFFFF`) for text. Always use `on-surface` (`#E5E2E1`) to prevent eye strain in dark mode.

---

## 7. Signature Interaction: "The Reveal"
When transitioning between screens, use a "Staggered Fade." Elements should not slide in; they should emerge from the `background` (#0D0D0D) using an opacity transition combined with a subtle scale-down (105% to 100%). This mimics the feeling of a waiter revealing a dish by lifting a silver cloche.