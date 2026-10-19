# Contributing to Nexus Media Downloader

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit with clear messages
7. Push and create a Pull Request

## Development Setup

See [SETUP.md](SETUP.md) for detailed installation instructions.

Quick start:
```bash
npm install
cd api && pip install -r requirements.txt && cd ..
npm run dev  # Terminal 1
npm run api:dev  # Terminal 2
```

## Project Structure

```
Nexus Website/
├── src/
│   ├── app/              # Next.js app directory (pages, layouts)
│   └── components/       # React components
├── api/                  # FastAPI backend
│   ├── main.py          # API server
│   └── requirements.txt
├── public/              # Static assets
└── ...config files
```

## Code Style

### TypeScript/React
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable names

### Python
- Follow PEP 8 style guide
- Use type hints
- Document functions with docstrings
- Keep functions focused and testable

### Formatting
```bash
# Frontend
npm run lint

# Backend
cd api
black .
pylint *.py
```

## Commit Messages

Use conventional commits:
```
feat: add video quality selector
fix: resolve download progress bug
docs: update setup instructions
style: format code with prettier
refactor: simplify API error handling
test: add unit tests for download service
chore: update dependencies
```

## Testing

### Frontend Testing (when added)
```bash
npm test
npm run test:coverage
```

### Backend Testing
```bash
cd api
pytest
pytest --cov
```

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Update CHANGELOG.md**
5. **Request review** from maintainers

### PR Checklist
- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Tested on multiple browsers (frontend changes)
- [ ] Security considerations addressed

## Feature Requests

Open an issue with:
- Clear description of the feature
- Use cases and benefits
- Proposed implementation (optional)
- Mockups or examples (if applicable)

## Bug Reports

Open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, versions)

## Areas for Contribution

### High Priority
- [ ] User authentication system
- [ ] Rate limiting implementation
- [ ] Persistent database integration (PostgreSQL)
- [ ] Job queue with Redis/BullMQ
- [ ] Automated file cleanup
- [ ] Comprehensive test suite
- [ ] API documentation with Swagger/OpenAPI

### Features
- [ ] Playlist batch download UI
- [ ] Download history persistence
- [ ] Favorites/bookmarks system
- [ ] Format selection UI
- [ ] Subtitle language selection
- [ ] Custom output templates
- [ ] Download scheduling
- [ ] Mobile app (React Native)

### Infrastructure
- [ ] CI/CD pipeline
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics integration
- [ ] Load testing
- [ ] Kubernetes deployment configs

### Documentation
- [ ] API usage examples
- [ ] Video tutorials
- [ ] Architecture diagrams
- [ ] Deployment guides for various platforms
- [ ] Troubleshooting guide expansion

## Development Tips

### Hot Reload Issues
If hot reload stops working:
```bash
# Frontend
rm -rf .next node_modules
npm install
npm run dev

# Backend
# Kill the process and restart
npm run api:dev
```

### Debugging

**Frontend:**
- Use React DevTools
- Check browser console
- Use `console.log` or debugger statements
- Check Network tab for API calls

**Backend:**
- Check terminal output
- Add print statements
- Use Python debugger (pdb)
- Check FastAPI auto-docs at `/docs`

### Performance

**Frontend:**
- Use React.memo for expensive components
- Lazy load components with dynamic imports
- Optimize images (use Next.js Image component)
- Minimize bundle size

**Backend:**
- Use async/await properly
- Implement caching where appropriate
- Profile slow endpoints
- Optimize database queries

## Questions?

- Open a Discussion on GitHub
- Check existing Issues
- Review documentation

Thank you for contributing! 🎉
