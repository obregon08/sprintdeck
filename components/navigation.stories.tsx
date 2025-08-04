import type { Meta, StoryObj } from '@storybook/react';
import { Navigation } from './navigation';

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main navigation component that displays the SprintDeck logo, navigation links, and authentication controls. It adapts based on whether a user is logged in or not.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    session: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigation when user is not logged in. Shows login button and no Projects link.',
      },
    },
  },
};
