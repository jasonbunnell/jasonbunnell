<template>
        <div>
            <section class="section section-showcase">
                <div id="showcase" class="showcase container">
                <div class="row">
                    <div id="bcard">
                        <h3>Jason Bunnell</h3>
                        <hr />
                        <ul>
                            <li class="flex items-center mt-3"><img src="/img/phone-call.png" alt="phone" class="size-4 mr-3"><span class="text-sky-900 font-bold">(214) 649-4477</span></li>
                            <li class="flex items-center mt-2"><img src="/img/email.png" alt="email" class="size-4 mr-3"><span class="text-sky-900 font-bold">jason.bunnell@gmail.com</span></li>
                            <li class="flex items- center mt-2"><img src="/img/email.png" alt="email" class="size-4 mr-3"><span class="text-sky-900 font-bold">jason@flxcompass.com</span></li>
                            <li class="flex items-center mt-2"><img src="/img/pin.png" alt="map pin" class="size-4 mr-3"><span class="text-sky-900 font-bold">PO Box 411, Geneva, NY 14456</span></li>
                        </ul>
                    </div>

                </div>
                </div>
            </section>
        </div>
</template>

<script setup>
definePageMeta({
    layout: 'home'
})
useSeoMeta({
  title: 'Jason Bunnell',  
  description: 'Jason Bunnell\'s personal website.  Made with Nuxt and Tailwind.',
  ogTitle: 'Jason Bunnell\'s personal website.  Made with Nuxt and Tailwind.',
  ogDescription: 'Jason Bunnell\'s personal website.  Made with Nuxt and Tailwind.',
  ogImage: '/img/jason-bunnell.jpg',
  ogUrl: 'jasonbunnell.com',
  twitterTitle: 'Jason Bunnell',
  twitterDescription: 'Jason Bunnell\'s personal website.  Tweets @jasonbunnell',
  twitterImage: '/img/jason-bunnell.jpg',
  twitterCard: 'summary'
})

useHead({
  script: [
    {
      type: 'text/javascript',
      children: `
        var _paq = window._paq = window._paq || [];
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
          var u="//analytics.mountpromo.com/";
          _paq.push(['setTrackerUrl', u+'matomo.php']);
          _paq.push(['setSiteId', '5']);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
        })();
      `
    }
  ]
})

</script>

<style scoped>
h2  {
    margin-bottom: 20px;
    font-size: 36px;
}
p {
    margin: 20px 0;
}
</style>