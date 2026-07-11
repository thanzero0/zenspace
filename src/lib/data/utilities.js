/**
 * Utility card data for the Zenspace dashboard.
 * Each entry maps to a bento grid card.
 *
 * @typedef {Object} Utility
 * @property {string} title - Display name
 * @property {string} description - Short description
 * @property {string} icon - Lucide icon name (PascalCase)
 * @property {string} href - Link to the utility page
 * @property {'productivity'|'finance'|'lifestyle'|'fun'} category
 * @property {'default'|'wide'|'tall'|'large'} [size] - Bento grid size
 */

/** @type {Utility[]} */
export const utilities = [
	{
		title: 'To-Do List',
		description: 'Productivity-focused task manager with drag-and-drop mechanics. Master your daily workflow.',
		icon: 'CheckCircle',
		href: '/Gen 1/Utility-To-Do-List/index.html',
		category: 'productivity',
		size: 'wide'
	},
	{
		title: 'Calendar',
		description: 'Modern, responsive digital calendar with theme customization.',
		icon: 'Calendar',
		href: '/Gen 1/Utility-Calender/index.html',
		category: 'productivity',
		size: 'default'
	},
	{
		title: 'Calculator',
		description: 'Clean scientific calculator with history and premium aesthetics.',
		icon: 'Calculator',
		href: '/Gen 1/Utility-Calculator/index.html',
		category: 'finance',
		size: 'default'
	},
	{
		title: 'Clock',
		description: 'Elegant analog and digital clock with multiple time zones.',
		icon: 'Clock',
		href: '/Gen 1/Utility-Clock/index.html',
		category: 'productivity',
		size: 'default'
	},
	{
		title: 'Notepad',
		description: 'Minimalist markdown-ready notepad for quick thoughts.',
		icon: 'FileText',
		href: '/Gen 1/Utility-Notepad/index.html',
		category: 'productivity',
		size: 'default'
	},
	{
		title: 'Pomodoro',
		description: 'Focus timer designed for deep work sessions.',
		icon: 'Timer',
		href: '/Gen 1/Utility-Pomodoro/index.html',
		category: 'productivity',
		size: 'default'
	},
	{
		title: 'Habit Tracker',
		description: 'Visualize your progress and build consistent routines with beautiful data charts.',
		icon: 'LineChart',
		href: '/Gen 1/Utility-Habit-Tracker/index.html',
		category: 'lifestyle',
		size: 'wide'
	},
	{
		title: 'Daily Journal',
		description: 'A private space for your daily reflections and moods.',
		icon: 'BookOpen',
		href: '/Gen 1/Utility-Journal-Daily/index.html',
		category: 'lifestyle',
		size: 'default'
	},
	{
		title: 'Budget Planner',
		description: 'Manage your finances with intuitive expense tracking.',
		icon: 'Wallet',
		href: '/Gen 2/Utility-Budget-Planner/index.html',
		category: 'finance',
		size: 'default'
	},
	{
		title: 'Weekly Planner',
		description: 'Plan your week ahead with a clean, grid-based interface.',
		icon: 'CalendarDays',
		href: '/Gen 2/Utility-Weekly-Planner/index.html',
		category: 'productivity',
		size: 'default'
	},
	{
		title: 'Goal Tracker',
		description: 'Break down big dreams into actionable milestones.',
		icon: 'Target',
		href: '/Gen 2/Utility-Goal-Tracker/index.html',
		category: 'lifestyle',
		size: 'default'
	},
	{
		title: 'Focus Mode',
		description: 'Ambient sounds and distraction-free workspace.',
		icon: 'Brain',
		href: '/Gen 2/Utility-Focus-Mode/index.html',
		category: 'productivity',
		size: 'default'
	},
	{
		title: 'Quote Generator',
		description: 'Daily inspiration to keep you motivated and centered.',
		icon: 'Quote',
		href: '/Gen 2/Utility-Quote-Generator/index.html',
		category: 'lifestyle',
		size: 'default'
	},
	{
		title: 'Coin Flip',
		description: 'Quick decision maker with realistic 3D animation.',
		icon: 'CircleDot',
		href: '/Gen 2/Utility-Coin-Flip/index.html',
		category: 'fun',
		size: 'default'
	},
	{
		title: 'Button Stressing',
		description: 'Satisfying interactive playground for stress relief.',
		icon: 'MousePointer2',
		href: '/Gen 2/Utility-Button-Stressing/index.html',
		category: 'fun',
		size: 'default'
	},
	{
		title: 'Popup Stressing',
		description: 'Chaotic yet controlled window management challenge.',
		icon: 'Layers',
		href: '/Gen 2/Utility-Popup-Stressing/index.html',
		category: 'fun',
		size: 'default'
	}
];

/** Navigation categories for sidebar filtering */
export const categories = [
	{ id: 'all', label: 'All Utilities', icon: 'LayoutGrid' },
	{ id: 'productivity', label: 'Productivity', icon: 'Briefcase' },
	{ id: 'finance', label: 'Finance', icon: 'Wallet' },
	{ id: 'lifestyle', label: 'Lifestyle', icon: 'Coffee' },
	{ id: 'fun', label: 'Fun & Stress', icon: 'Gamepad2' }
];
