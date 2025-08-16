module.exports = {
  apps: [{
    name: "nuxt-app",
    cwd: "/var/www/vhosts/jasonbunnell.com/httpdocs", // <- adjust if different
    script: ".output/server/index.mjs",
    interpreter: "node",
    env: {
      NODE_ENV: "production",
      NITRO_HOST: "0.0.0.0",
      NITRO_PORT: "3000"
    }
  }]
}