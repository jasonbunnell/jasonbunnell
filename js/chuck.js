document.getElementById('jokes').addEventListener('click', getJokes);

function getJokes(e) {
   const number = document.querySelector('input[type="number"]').value;

   const xhr = new XMLHttpRequest();

   // open params get request, get location, true = async
   xhr.open('GET', `http://api.icndb.com/jokes/random/${number}`, true);

   xhr.onload = function() {
      if(this.status === 200) {
         const response = JSON.parse(this.responseText);
         let output = '';

         if(response.type === 'success') {
            response.value.forEach(function(joke){
               output += `<li>${joke.joke}</li>`
            });
         } else {
            output += '<li>ERROR</li>'
         }

         document.querySelector('.jokes').innerHTML = output;
      }
   }

   xhr.send();

   e.preventDefault();
}