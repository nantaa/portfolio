# AGENTS.md - Multi-Agent System Documentation

## 1. Project Overview
This is a **Multi-Agent System** where multiple AI agents collaborate to build a complex application (Laravel backend + Next.js frontend). Each agent has a specific role, knowledge base, and set of responsibilities.

## 2. Agent List

| Agent Name | Role | Primary Technologies | Responsibilities | AI Model |
|------------|------|----------------------|----------------|----------|
| **Dev Agent** | Full-Stack Developer | TypeScript, React, Tailwind CSS | Frontend development, UI implementation, state management | Claude Sonnet 4.5 |
| **Backend Agent** | Backend Architect | PHP, Laravel, PostgreSQL | API design, database schema, server-side logic | Claude Sonnet 4.5 |
| **Data Agent** | Data Scientist | Python, Pandas, scikit-learn, SQL | Data modeling, analysis, ETL pipelines, AI features | Claude Sonnet 4.5 |
| **UX Agent** | UX/UI Designer | Figma, CSS, Animation libraries | Visual design, user experience, accessibility | Claude Sonnet 4.5 |
| **Content Agent** | Content Strategist | Marketing, SEO, Copywriting | Website copy, blog posts, marketing content | Claude Sonnet 4.5 |
| **QA Agent** | Quality Assurance | Testing frameworks, CI/CD | Test planning, automated tests, performance testing | Claude Sonnet 4.5 |
| **Product Agent** | Product Manager | Project management, strategy | Feature prioritization, roadmap, stakeholder communication | Claude Sonnet 4.5 |
| **Ops Agent** | DevOps Engineer | Docker, Kubernetes, AWS | Deployment, infrastructure, CI/CD pipelines | Claude Sonnet 4.5 |
| **Security Agent** | Security Specialist | Security best practices, pentesting | Security architecture, vulnerability assessment | Claude Sonnet 4.5 |
| **Architect Agent** | System Architect | System design, integration | Cross-agent coordination, technology selection | Claude Sonnet 4.5 |

## 3. How They Work Together

### 4. Collaboration Model

**Sequential Collaboration Example (New Feature Development):**

1. **Product Agent**: Defines feature requirements
2. **Architect Agent**: Designs system integration
3. **Backend Agent**: Implements API endpoints & DB schema
4. **Dev Agent**: Builds frontend UI components
5. **UX Agent**: Creates design specifications
6. **Data Agent**: Models any required data
7. **QA Agent**: Develops test cases
8. **Ops Agent**: Prepares deployment plan
9. **Security Agent**: Reviews for vulnerabilities
10. **Content Agent**: Writes marketing copy
11. **All Agents**: Review and integrate changes

## 5. Key Concepts

### 5.1 Workflows
- **Feature Development**: Plan → Design → Implement → Test → Deploy
- **Bug Fix**: Isolate → Fix → Test → Deploy
- **Content Creation**: Research → Write → Review → Publish

## 6. Best Practices

### 6.1 Communication
- Use clear, concise language
- Provide context and requirements upfront
- Reference relevant documentation
- Use code examples where helpful

### 6.2 Documentation
- Keep `AGENTS.md` updated
- Document changes in `CHANGELOG.md`
- Add inline code comments
- Use JSDoc/PHPDoc for complex functions

### 6.3 Error Handling
- Implement proper error handling
- Add retry mechanisms for API calls
- Graceful degradation for external services

## 7. Testing & QA

The QA Agent is responsible for testing, but all agents should follow testing best practices:

### 7.1 Unit Testing
```typescript
// Next.js unit test
describe('Button component', () => {
  it('renders correctly', () => {
    render(<Button />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
});

// Laravel unit test
public function test_user_can_login()
{
    $user = User::factory()->create();
    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);
    $response->assertRedirect('/dashboard');
}
```

### 7.2 Integration Testing
```typescript
// E2E test
it('should create and retrieve a product', async () => {
  // Create product via API
  const product = await createProduct({ name: 'Test', price: 10 });
  
  // Verify in database
  const retrieved = await getProductById(product.id);
  expect(retrieved.name).toBe('Test');
});
```

## 8. Deployment

### 8.1 Frontend (Next.js)
```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy via CI/CD (Ops Agent)
cd frontend && ./deploy.sh
```

### 8.2 Backend (Laravel)
```bash
# Build Docker image
docker build -t laravel-app .

# Deploy to cloud (Ops Agent)
docker-compose up -d

# Run migrations
php artisan migrate --force

# Optimize
php artisan optimize:clear
```

## 9. AI Model Specifications

### 9.1 Dev Agent
**Model**: Claude Sonnet 4.5
**Instructions**: Follow Next.js conventions, use TypeScript, Tailwind CSS
**Context**: `node_modules/next/dist/docs/` for API docs

### 9.2 Backend Agent
**Model**: Claude Sonnet 4.5
**Instructions**: Design clean REST APIs, use Eloquent ORM, secure endpoints
**Context**: Laravel documentation, API design patterns

### 9.3 Data Agent
**Model**: Claude Sonnet 4.5
**Instructions**: Clean data, create models, implement ML features
**Context**: Data science best practices, Python libraries

## 10. Important Notes

### 10.1Breaking Changes
- Frontend uses Next.js 14+ (App Router)
- Backend uses Laravel 11+
- APIs may differ from older versions

### 10.2 Dependencies
- **Frontend**: `package.json` lists all dependencies
- **Backend**: `composer.json` lists all dependencies
- **Data**: `requirements.txt` lists all Python dependencies

### 10.3 Version Control
- Use Git for version control
- Branch naming convention: `feature/feature-name` or `fix/fix-description`
- Pull requests require review from at least one other agent

## 11. Security

- Implement proper authentication and authorization
- Use HTTPS in production
- Sanitize all user inputs
- Implement rate limiting
- Regular security audits (Security Agent)

## 12. Performance

- Optimize database queries
- Implement caching strategies
- Use lazy loading for frontend
- Code splitting for Next.js
- Connection pooling for backend

## 13. Maintenance

- Regular dependency updates
- Database migrations management
- Code refactoring
- Performance monitoring
- Security patches

## 14. Project Structure

### 14.1 Frontend
```
frontend/
├── app/              # Next.js 14+ app directory
├── components/       # React components
├── lib/              # Utility functions
├── styles/           # CSS/Tailwind styles
└── public/           # Static assets
```

### 14.2 Backend
```
backend/
├── app/              # Laravel application
├── database/         # Migrations, seeds, factories
├── routes/           # API routes
└── tests/            # PHPUnit tests
```

### 14.3 Data
```
data/
├── notebooks/        # Jupyter notebooks
├── pipelines/        # ETL pipelines
└── models/           # ML models
```
