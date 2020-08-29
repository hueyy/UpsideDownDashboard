
module.exports = {
  plugins: [
    `gatsby-plugin-scss-typescript`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Solar Dashboard`,
        short_name: `Solar`,
        start_url: `/`,
        background_color: `#000000`,
        theme_color: `#000000`,
        display: `standalone`,
        icon: `src/assets/sun.png`
      },
    },
  ],
  siteMetadata: {
    title: `UpsideDown Dashboard`
  }
}