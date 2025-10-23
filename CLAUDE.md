# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a documentation website for RevoSurge's DataPulse Web Tracker SDK, built with Astro and Vue. The site provides interactive documentation for developers integrating the web tracking SDK into their websites.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **Astro 5.x**: Static site generator with component-based architecture
- **Vue 3**: Used for interactive components (currently minimal usage)
- **TypeScript**: Configured with strict mode

### Project Structure
- `src/pages/index.astro`: Main documentation page with embedded navigation and content sections
- `src/components/`: Vue components (e.g., Counter.vue - example component)
- `public/`: Static assets including the tracker SDK zip file and favicon
- `astro.config.mjs`: Astro configuration with Vue integration

### Key Design Patterns

**Single-Page Documentation**: The entire documentation is contained in `src/pages/index.astro` as a single-page application with client-side navigation. Content sections are toggled via JavaScript rather than using separate pages.

**Content Sections**: Documentation is organized into discrete sections (getting-started, get-sdk, embed-sdk, trigger-events, functional-verification) that are shown/hidden dynamically based on user interaction.

**Navigation System**:
- Sidebar navigation with nested items
- Card-based navigation on overview pages
- Previous/Next navigation buttons at bottom of each section
- All navigation handled via `data-content`, `data-prev`, and `data-next` attributes

**Styling**: Dark theme with CSS custom properties defined in `:root`. Inline styles in the main Astro file rather than separate CSS files.

### TypeScript Configuration
- Uses Astro's strict TypeScript config
- JSX mode set to "preserve" for Vue template intellisense
- Excludes `dist/` directory from compilation

### Content Management
When adding new documentation sections:
1. Create a new content div with id pattern `{section-id}-content`
2. Add corresponding sidebar link with `data-content="{section-id}"`
3. Update navigation buttons on adjacent sections to link to new section
4. Ensure section is initially hidden with `style="display: none;"`
