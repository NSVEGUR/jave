const config = {
	mode: 'jit',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				dominant: '#121212',
				inverted: '#ffffff',
				accent: '#A2D7F5',
				muted: '#2D2D2D',
				error: '#d74c4c',
				okay: '#2DB00C'
			},
			textColor: {
				skin: {
					base: '#efefef',
					inverted: '#212427',
					'muted-base': '#C7C7C7',
					'muted-inverted': '#7F7D7D',
					error: '#d74c4c',
					okay: '#2DB00C'
				}
			},
			screens: {
				'-2xl': { max: '1535px' },
				'-xl': { max: '1279px' },
				'-lg': { max: '1023px' },
				'-md': { max: '767px' },
				'-sm': { max: '639px' },
				'@md': { min: '640px', max: '767px' },
				'@lg': { min: '768px', max: '1023px' },
				'@xl': { min: '1024px', max: '1279px' },
				'@2xl': { min: '1280px', max: '1535px' }
			},
			animation: {
				scale: 'scale 250ms cubic-bezier(0.64, 0.57, 0.67, 1.53)',
				fade: 'fade 700ms ease-in-out'
			},
			borderColor: {
				base: '#434444'
			}
		}
	},

	plugins: [require('@tailwindcss/line-clamp')]
};

module.exports = config;
