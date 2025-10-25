# Axel U. J. Lode | GitHub Pages Profile

A futuristic, cyberpunk-styled portfolio website featuring quantum physics research and blockchain infrastructure work.

## Structure

The site is organized into three main pages:

### 1. **Landing Page** (`index.html`)
- Mission statement and professional overview
- Quick navigation to blockchain and research sections
- CV download and social links
- Key metrics and work highlights

### 2. **Blockchain & Crypto** (`blockchain.html`)
- Oracle architecture and design
- Validator operations and DevOps
- Market data pipelines and quantitative analysis
- Production-grade exporters (Solana, Supra)
- GitHub repository feed

### 3. **Academic Legacy** (`research.html`)
- Two decades of quantum physics research
- Publication record and ORCID profile
- Key contributions (MCTDH-X, UNIQORN, thesis)
- Research domains and expertise
- Links to scholarly resources

## Design Features

### Visual Style
- **Dark cyberpunk theme** with neon cyan (`#00d9ff`) and magenta (`#ff006e`) accents
- **Gradient text** for headings using cyan-to-purple gradients
- **Glowing effects** on interactive elements and highlights
- **Matrix particle animation** in the background (respects `prefers-reduced-motion`)

### Technical Implementation
- **Responsive design** with mobile-first approach
- **Smooth scrolling** and animated navigation underlines
- **Live GitHub API integration** for repository feeds
- **Typed text effect** on landing page
- **Glassmorphism** cards with backdrop blur effects
- **Accessibility-first** markup with ARIA labels and semantic HTML

## Technologies

- **HTML5** with semantic structure
- **CSS3** with custom properties, gradients, and animations
- **Vanilla JavaScript** (no frameworks)
- **GitHub API** for live repository data
- **Google Fonts** (Space Grotesk, Work Sans)

## Deployment

This site is deployed to GitHub Pages at `https://aujl.github.io/Profile-page/`

### To update:
```bash
git add .
git commit -m "Update profile content"
git push origin main
```

## Customization

### Colors
Edit CSS custom properties in `styles.css`:
```css
:root {
  --primary: #00d9ff;      /* Cyan */
  --highlight: #b537f2;    /* Purple */
  --accent: #ff006e;       /* Magenta */
}
```

### Content
- Edit HTML files directly for text content
- Update links in navigation and footer
- Modify GitHub API user in `data-source-user` attributes

### Animations
- Particle effect controlled in `scripts.js` (Matrix background)
- Typed text effect configured via `data-typed-texts` attributes
- CSS animations defined in `styles.css`

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- Respects `prefers-reduced-motion` for accessibility

## License

Personal portfolio. All rights reserved.
