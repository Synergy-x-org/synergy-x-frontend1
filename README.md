# AutoShip Pro - Auto Transport Website

A professional, fully responsive auto transport website built with React, TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Hero Carousel**: Auto-rotating images (3 images, 4-second intervals)
- **Quote Calculator**: Interactive form for shipping cost estimation
- **Testimonials Slider**: Customer reviews with auto-slide (5-second intervals)
- **Mobile Menu**: Hamburger navigation for mobile devices
- **Modern UI**: Clean design with smooth animations
- **SEO Optimized**: Meta tags and semantic HTML

## 📦 Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd autoship-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   The site will be available at `http://localhost:8080`

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 Customization

### Replacing Images

All placeholder images are stored in `src/assets/`:

1. **Logo** (`src/assets/logo.png`)
   - Replace with your company logo
   - Import path: `import logo from "@/assets/logo.png"`

2. **Hero Images** (Auto-rotating carousel)
   - `src/assets/hero1.jpg`
   - `src/assets/hero2.jpg`
   - `src/assets/hero3.jpg`
   - Import in `src/components/HeroSection.tsx`

### Updating Colors

Edit the color scheme in `src/index.css`:

```css
:root {
  --primary: 24 95% 53%;  /* Orange accent color */
  --foreground: 220 13% 18%;  /* Dark text */
  --background: 0 0% 100%;  /* White background */
}
```

### Modifying Content

- **Company Name**: Search for "AutoShip Pro" and replace globally
- **Contact Info**: Update in `src/components/Footer.tsx`
- **Services**: Edit arrays in respective component files
- **Testimonials**: Update the `testimonials` array in `src/components/Testimonials.tsx`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Vite and deploy

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

Or connect your Git repository for automatic deployments.

### Manual Deployment

1. Build: `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Configure your server to serve `index.html` for all routes

## 📱 Features Breakdown

### Navigation
- Sticky header with smooth scrolling
- Responsive hamburger menu for mobile
- Quick links to all sections

### Hero Section
- Full-screen hero with rotating background images
- Overlay text with CTAs
- Quote calculator form (right side on desktop, below on mobile)

### Why Choose Us
- 4 feature cards with icons
- Numbered highlights
- Responsive grid layout

### Services
- 3 transport options
- Icon-based cards
- Hover effects

### Testimonials
- Auto-rotating slider (5-second intervals)
- Manual navigation arrows
- Dot indicators
- 5-star ratings

### Footer
- 4-column layout
- Quick links, services, and contact info
- Fully responsive

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is open source and available for commercial use.

## 🤝 Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ using Lovable
