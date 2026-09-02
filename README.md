# Quadrafort Quantum Secure Framework — Landing Page

A cutting-edge, interactive landing page for **Quadrafort Technologies**, showcasing their Post-Quantum Cryptography (PQC) solutions and Quantum Secure Framework. This project features advanced canvas animations, smooth scrolling effects, and a modern cybersecurity-themed design.

## 🔐 Overview

Quadrafort helps global enterprises migrate from classical encryption vulnerabilities to end-to-end quantum resilience through their five-step Quantum Secure Framework: **Discover → Prioritize → Pilot → Migrate → Monitor**.

This landing page presents the critical HNDL (Harvest Now, Decrypt Later) threat and demonstrates how Quadrafort's solutions protect against quantum computing attacks through:
- NIST-aligned PQC algorithms (ML-KEM, ML-DSA, SLH-DSA)
- Crypto Discovery Tool (CDT)
- ChekQ AI monitoring
- Zero-downtime cryptographic migration

## ✨ Features

### Interactive Canvas Animations
- **Hero Canvas**: Dynamic CRQC (Cryptographically Relevant Quantum Computer) threat visualization with:
  - Animated network graph showing quantum attack progression
  - Rotating CRQC core with orbital electrons
  - Shockwave effects and particle systems
  - Scroll-driven animation progress

- **Film Canvas**: 45-second animated story explaining:
  - Present Security (TLS, PKI, RSA/AES)
  - HNDL Attack (Harvest Now, Decrypt Later)
  - Quantum Break (Shor's & Grover's algorithms)
  - Quantum Secure Framework defense

### Modern UI/UX Elements
- Responsive navigation with mobile menu
- Smooth scroll animations with Intersection Observer
- Staggered card reveals with scroll-driven scaling
- Interactive form with real-time validation
- Aurora background effects
- Cyber-themed grid overlays
- Animated timeline visualization

### Sections
1. **Hero** — Quantum countdown with animated shield
2. **HNDL Threat** — Deep dive into harvest-now-decrypt-later attacks
3. **Film Showcase** — Animated visual story of the quantum threat
4. **Crypto Audit** — Traditional framework limitations
5. **Framework** — 5-step Quantum Secure Framework
6. **CBOM** — Cryptographic Bill of Materials
7. **Why Quadrafort** — Certifications, ecosystem, AI stack, competitive advantages
8. **Contact** — Quantum Readiness Assessment form

## 🛠️ Technologies

- **Vanilla JavaScript** — No frameworks, pure ES5-compatible code
- **HTML5 Canvas** — Advanced 2D rendering for animations
- **CSS3** — Modern layouts with Grid, Flexbox, animations
- **Intersection Observer API** — Scroll-triggered animations
- **Custom Fonts** — Inter, JetBrains Mono, Kanit

## 📁 Project Structure

```
QFwebpage code/
├── index.html              # Main HTML structure
├── styles.css              # Complete styling and animations
├── main.js                 # UI interactions and form handling
├── canvas-animations.js    # Hero and film canvas animations
└── public/
    └── brand/
        └── quadrafort-logo.png
```

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Dharmesh2411/QF_WEBPAGE.git
cd QF_WEBPAGE
```

2. Open `index.html` in your browser:
   - Simply double-click the file, or
   - Use a local server (recommended):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (with npx)
   npx serve
   ```

3. Navigate to `http://localhost:8000` in your browser

### Deployment

The site is static and can be deployed to any hosting platform:
- **GitHub Pages**: Already configured
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your repository
- **AWS S3**: Static website hosting

## 🎨 Design Features

### Color Palette
- **Abyss**: `#0C0C0C` (Background)
- **Cyan**: `#00F2FE` (Primary accent)
- **Violet**: `#7F00FF` (Secondary accent)
- **Purple**: `#9D5CFF` (Tertiary accent)
- **Red**: `#FF2D55` (Threat/danger)
- **Gold**: `#FFD166` (CRQC core)
- **Emerald**: `#4FACFE` (Security/protected)

### Typography
- **Headings**: Kanit (Bold, Futuristic)
- **Body**: Inter (Clean, Readable)
- **Mono**: JetBrains Mono (Technical, Code-like)

## 📱 Responsive Design

Fully responsive across all devices:
- **Mobile**: < 768px (Hamburger menu, stacked layout)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (Full experience)

## ⚡ Performance Optimizations

- Canvas rendering limited to 60fps
- Intersection Observer for lazy animation triggering
- Passive scroll listeners
- Optimized particle systems
- Viewport-based visibility detection
- Efficient RAF (requestAnimationFrame) loops

## 🔧 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 📊 Key Metrics

- **100+** Enterprise customers worldwide
- **600+** Dedicated IT Professionals
- **7** Countries of global operations
- **5** NIST-aligned framework steps

## 📄 Certifications Highlighted

- CMMi Level 3
- SOC 2 Type 2
- ISO 9001, 14001, 20001, 27001, 31000
- Salesforce Summit Partner
- Agentforce FDE Certified

## 🎯 Form Features

The contact form includes:
- Real-time field validation
- Honeypot spam protection
- Loading states and error handling
- Success confirmation
- Professional security messaging

## 🌐 API Integration

The form is designed to POST to `/api/leads` with the following payload:
```json
{
  "fullName": "string",
  "corporateEmail": "string",
  "corporateDomain": "string",
  "architecturePriorities": "string",
  "website": "string"
}
```

## 🤝 Contributing

This is a client project for Quadrafort Technologies. For any improvements or bug fixes, please contact the development team.

## 📝 License

© 2026 Quadrafort Quantum. All rights reserved.

## 🔗 Links

- **Website**: [Live Demo](https://dharmesh2411.github.io/QF_WEBPAGE/)
- **Repository**: [GitHub](https://github.com/Dharmesh2411/QF_WEBPAGE)

## 👨‍💻 Developer

Developed by Dharmesh — Creating quantum-secure digital experiences

---

**PQ SECURE · CRYPTO AGILE · QUANTUM READY**