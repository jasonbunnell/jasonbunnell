module.exports = {
  apps: [{
    name: "nuxt-app",
    script: ".output/server/index.mjs",
    interpreter: "node",
    cwd: "/var/www/vhosts/jasonbunnell.com/httpdocs", // <-- adjust if needed
    env: {
      HOST: "0.0.0.0",      // or NITRO_HOST: "0.0.0.0"
      PORT: "3000",         // or NITRO_PORT: "3000"
      NODE_ENV: "production"
    }
  }]
}