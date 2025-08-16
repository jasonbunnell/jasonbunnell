module.exports = {
  apps: [{
    name: "nuxt-app",
    cwd: "/var/www/vhosts/jasonbunnell.com/httpdocs", // <- adjust if your repo lives elsewhere
    script: ".output/server/index.mjs",
    interpreter: "node",
    env: {
      NODE_ENV: "production",
      HOST: "0.0.0.0",      // or NITRO_HOST
      PORT: "3000"          // or NITRO_PORT
    }
  }]
}