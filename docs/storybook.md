# Storybook Documentation

This project uses Storybook to document and test UI components in isolation, with Chromatic for visual testing and component documentation hosting.

## Getting Started

### Running Storybook

```bash
# Start Storybook in development mode
npm run storybook

# Build Storybook for production
npm run build-storybook

# Publish to Chromatic (requires project token)
npm run chromatic
```

Storybook will be available at `http://localhost:6006` when running in development mode.

## Project Structure

### Configuration Files

- `.storybook/main.ts` - Main Storybook configuration
- `.storybook/preview.ts` - Global decorators and parameters
- `.storybook/vitest.setup.ts` - Vitest setup for testing

### Story Files

Stories are co-located with their components and follow the naming convention:
- `ComponentName.stories.tsx`

## Writing Stories

### Basic Story Structure

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};
```

### Story Types

1. **Component Stories** - Show individual component variants
2. **Composite Stories** - Show components working together
3. **Page Stories** - Show full page layouts

### Best Practices

1. **Use Args** - Make stories interactive with controls
2. **Add Documentation** - Use JSDoc comments for component props
3. **Test Interactions** - Use the `@storybook/addon-vitest` for testing
4. **Accessibility** - Use the `@storybook/addon-a11y` for accessibility testing

## Available Addons

- **@storybook/addon-docs** - Automatic documentation generation
- **@storybook/addon-a11y** - Accessibility testing
- **@storybook/addon-vitest** - Component testing
- **@storybook/addon-onboarding** - Interactive tutorials

## Chromatic Integration

This project is configured with Chromatic for visual testing and component documentation hosting.

### Setup

1. **Get your project token**:
   - Sign up at [chromatic.com](https://www.chromatic.com/start)
   - Create a new project or connect to an existing one
   - Copy your project token from the project settings

2. **Configure the project token**:
   ```bash
   # Option 1: Set environment variable
   export CHROMATIC_PROJECT_TOKEN=your_token_here
   
   # Option 2: Update chromatic.json
   # Replace CHROMATIC_PROJECT_TOKEN with your actual token
   ```

3. **Publish to Chromatic**:
   ```bash
   npm run chromatic
   ```
   
   > **Note**: The Chromatic command is configured with `--exit-zero-on-changes` to ensure CI/CD builds don't fail when visual changes are detected. Changes will still be reported in the Chromatic dashboard for review.

### GitHub Actions

The project includes automated Chromatic publishing via GitHub Actions. To enable this:

1. Add your Chromatic project token as a GitHub secret:
   - Go to your repository settings
   - Navigate to Secrets and variables > Actions
   - Add a new secret named `CHROMATIC_PROJECT_TOKEN`
   - Set the value to your Chromatic project token

2. Push to main or create a pull request to trigger the workflow

### CI/CD Configuration

The project is configured to ensure Chromatic builds always succeed in CI/CD:

- **Package.json script**: Uses `--exit-zero-on-changes` flag
- **GitHub Actions**: Includes `exitZeroOnChanges: true` configuration
- **chromatic.json**: Has `"exitZeroOnChanges": true` setting

This prevents CI/CD failures while still providing visual regression testing feedback.

### Benefits

- **Visual Testing**: Automatic visual regression testing
- **Component Documentation**: Hosted component library
- **Collaboration**: Share component documentation with your team
- **Version Control**: Track component changes over time

## Testing with Vitest

Stories can be tested using Vitest. The `@storybook/addon-vitest` addon is configured to run tests in Storybook.

```bash
# Run tests for Storybook stories
npx vitest --project=storybook
```

## Component Guidelines

### UI Components

- Place stories in the same directory as the component
- Use the `UI/` prefix for basic UI components
- Include all variants and states

### Feature Components

- Use descriptive titles (e.g., `Components/ProjectForm`)
- Mock external dependencies (API calls, router, etc.)
- Test different states (loading, error, success)

### Examples

See the following files for examples:
- `components/ui/button.stories.tsx` - Basic UI component
- `components/ui/card.stories.tsx` - Composite component
- `components/project-form.stories.tsx` - Feature component with mocking

## Troubleshooting

### Common Issues

1. **Path Resolution** - Ensure `@/` alias is properly configured
2. **Styling** - Import global CSS in `.storybook/preview.ts`
3. **Mocking** - Use decorators for complex dependencies

### Performance

- Use `parameters: { layout: 'centered' }` for small components
- Use `parameters: { layout: 'padded' }` for larger components
- Avoid heavy computations in story render functions 