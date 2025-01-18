module.exports = {
    darkMode: 'class',
    theme:  {
        screens: {
            sm: '480px',
            md: '768px',
            lg: '976px'
        },
        extend: {
            colors: {

            }
        }
    },
    plugins: [
        require('@tailwindcss/typography')
    ]
}