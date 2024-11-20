# MoreWays Real Estate Platform

# tree -I 'node_modules|.git'

## Local Development Setup

1. **Prerequisites**
   - Node.js 18+ installed
   - npm or yarn package manager
   - Git (optional)

2. **Installation**
   ```bash
   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:3000
   ```

4. **Project Structure**
   ```
   src/
   ├── components/     # Reusable UI components
   ├── contexts/       # React contexts
   ├── hooks/          # Custom React hooks
   ├── lib/           # Utilities and configurations
   ├── pages/         # Page components
   └── services/      # API services
   ```

5. **Available Scripts**
   - `npm run dev` - Start development server
   - `npm run build` - Build for production
   - `npm run preview` - Preview production build
   - `npm run lint` - Run ESLint

6. **Dependencies**
   - React 18
   - React Router 6
   - React Query
   - Tailwind CSS
   - shadcn/ui
   - Lucide Icons

## Development Notes

- The project uses TypeScript for type safety
- Tailwind CSS for styling
- React Query for server state management
- React Router for routing
- shadcn/ui for UI components