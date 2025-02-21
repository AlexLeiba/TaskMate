import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontSize: {
  			'9xl': [
  				'5.2rem',
  				{
  					lineHeight: '6.4rem',
  					letterSpacing: '-1.28px'
  				}
  			],
  			'8xl': [
  				'4.4rem',
  				{
  					lineHeight: '5.4rem',
  					letterSpacing: '-0.48px'
  				}
  			],
  			'7xl': [
  				'3.6rem',
  				{
  					lineHeight: '4.8rem',
  					letterSpacing: '-0.4px'
  				}
  			],
  			'6xl': [
  				'3.2rem',
  				{
  					lineHeight: '4.2rem',
  					letterSpacing: '-0.36px'
  				}
  			],
  			'5xl': [
  				'3.6rem',
  				{
  					lineHeight: '4.8rem',
  					letterSpacing: '-0.32px'
  				}
  			],
  			'4xl': [
  				'2.8rem',
  				{
  					lineHeight: '3.8rem',
  					letterSpacing: '-0.3px'
  				}
  			],
  			'3xl': [
  				'2.8rem',
  				{
  					lineHeight: '3.8rem'
  				}
  			],
  			'2xl': [
  				'2.4rem',
  				{
  					lineHeight: '3.2rem'
  				}
  			],
  			xl: [
  				'1.25rem',
  				{
  					lineHeight: '1.875rem'
  				}
  			],
  			l: [
  				'1.125rem',
  				{
  					lineHeight: '1.75rem',
  					letterSpacing: '0.18px'
  				}
  			],
  			base: [
  				'1rem',
  				{
  					lineHeight: '1.5rem',
  					letterSpacing: '0.16px'
  				}
  			],
  			s: [
  				'0.875rem',
  				{
  					lineHeight: '1.375rem',
  					letterSpacing: '0.28px'
  				}
  			],
  			xs: [
  				'0.75rem',
  				{
  					lineHeight: '1.125rem',
  					letterSpacing: '0.24px'
  				}
  			]
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [animate],
} satisfies Config;
