// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-gtag'],
  app: {
    head: {
      title: 'Jason Bunnell',
      link: [
        { 
          rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
        }
      ],
      script: [
        {
          innerHTML: `!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2836606159869988');
          fbq('track', 'PageView');`
        }
      ],
      noscript: [
        {
          children: '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2836606159869988&ev=PageView&noscript=1" />'
        }
      ]
    }
  },
  gtag: {
    id: 'G-SYKLL9LJWB'
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  }
})