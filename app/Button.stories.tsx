import type { Meta, StoryObj } from "@storybook/nextjs-vite";
const Button = () => <button>hi</button>;
const meta: Meta<typeof Button> = { component: Button };
export default meta;
export const Default: StoryObj<typeof Button> = {};
