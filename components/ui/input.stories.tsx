import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    placeholder: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number',
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    value: 'This input is disabled',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Pre-filled value',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="input-with-label" className="text-sm font-medium">
        Label
      </label>
      <Input id="input-with-label" placeholder="Input with label" />
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <label className="text-sm font-medium">Text</label>
        <Input placeholder="Text input" />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input type="email" placeholder="Email input" />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input type="password" placeholder="Password input" />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Number</label>
        <Input type="number" placeholder="Number input" />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Search</label>
        <Input type="search" placeholder="Search input" />
      </div>
    </div>
  ),
}; 