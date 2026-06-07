# Eduardo Cavalcante Portfolio

Premium portfolio and landing page for Eduardo Cavalcante, built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, GSAP ScrollTrigger, Lenis and Spline integration.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Add the Spline scene

Create a `.env.local` file and add:

```bash
NEXT_PUBLIC_SPLINE_SCENE_URL=https://prod.spline.design/your-scene-url/scene.splinecode
```

The integration lives in `src/components/3d/SplineScene.tsx`. When the variable is empty, the site renders a premium CSS fallback based on the "Responsive Matter: Surface 01" direction.

## Edit projects

Project data lives in `src/data/projects.ts`. Replace titles, summaries, tech tags, `demoUrl` and `githubUrl` when real case studies are ready.

## Edit text

Main page sections are in:

- `src/components/sections/Hero3D.tsx`
- `src/components/sections/ScrollNarrative.tsx`
- `src/components/sections/EcosystemSection.tsx`
- `src/components/sections/ProjectsSection.tsx`
- `src/components/sections/SkillsSystem.tsx`
- `src/components/sections/AboutSection.tsx`
- `src/components/sections/ContactCTA.tsx`

## Social links

Update `src/lib/constants.ts` with the final GitHub, LinkedIn, email and domain links.

## Reduce animation

The project already respects `prefers-reduced-motion`. To reduce motion further:

- Remove or simplify the pinned timeline in `src/components/sections/ScrollNarrative.tsx`.
- Lower Lenis duration in `src/components/motion/SmoothScrollProvider.tsx`.
- Keep `NEXT_PUBLIC_SPLINE_SCENE_URL` empty on performance-critical deployments.

## Design notes

The visual system uses a locked dark theme, restrained cadmium accent, editorial spacing, large asymmetrical panels and a 3D surface metaphor. Avoid adding generic cards, purple/blue gradients, decorative particles or floating tech logos.
