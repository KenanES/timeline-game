# TimeLines Game

A daily historical event sequencing game where players arrange events in chronological order.

## Environments

This project uses a multi-environment setup:

- **Development**: Local development environment
- **Preview/Staging**: Automatically deployed from the `development` branch
- **Production**: Automatically deployed from the `main` branch

## Development Workflow

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Making Changes

1. Create a feature branch from `development`:
   ```bash
   git checkout development
   git pull
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

3. Push your changes:
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. Create a Pull Request to merge into the `development` branch
5. After review and approval, merge into `development`
6. Test on the preview environment
7. When ready for production, create a PR from `development` to `main`
8. After review and approval, merge into `main` to deploy to production

## Environment URLs

- **Development**: [http://localhost:3000](http://localhost:3000)
- **Preview/Staging**: [https://timelines-game-git-development-yourusername.vercel.app](https://timelines-game-git-development-yourusername.vercel.app)
- **Production**: [https://playtimelines.com](https://playtimelines.com)

## Environment Variables

Different environments use different environment variables. In Vercel:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:
   - `NEXT_PUBLIC_APP_ENV`: Set to `development`, `preview`, or `production`

## Deployment

Deployments are handled automatically by Vercel:

- Push to `development` branch → Deploy to preview environment
- Push to `main` branch → Deploy to production environment

## Monitoring

- Check deployment status in the Vercel dashboard
- Monitor application performance and errors in the Vercel dashboard
