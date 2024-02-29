/*** Express setup & start ***/


// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Stel het basis endpoint in
const apiUrl = 'https://fdnd.directus.app/items'


/*** Routes & Data***/ 


// Haal alle squads uit de WHOIS API op
// const squadData = await fetchJson('https://fdnd.directus.app/items/squad')

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources
app.use(express.static('public'))

app.use(express.urlencoded({extended:true}))

// messages lege array waar de string bericht wordt doorgestuurd
const messages = []

//////////////////////////////////////////

// Bericht 

//////////////////////////////////////////

// een functie waarbij ik met GET een functie aanmaak vanuit de root waar ik zeg haal data uit directus op en stuur die terug naar mij 
// vervolgens in index.ejs word person en messages gerenderd
app.get('/', function(request, response){
  fetchJson('https://fdnd.directus.app/items/person').then((apiData) => {
    response.render('index', {
      persons: apiData.data,
      messages: messages
    })
  })
})

// met POST is er een functie vanuit de root vraag ik om een request en response dat terug gestuurt moet worden
// in dit geval is het de berich die verstuurd word met consol.log kan ik een test maken door request.body te checken of 
// het bericht werkeleijk word doorgevoerd
app.post('/', function (request, response) {
  console.log(request.body)
  messages.push(request.body.bericht)

  // met response zeg ik voer uit het bericht dat is verstuurd als het is uitgevoerd ga je terug naar de root in dit geval index.ejs http 303 word gebruikt 
  // als redirect status om naar de root te gaan
  response.redirect(303,'/')
})

///////////////////////////////////////////////

// Data dat Opgehaald wordt voor de hexagon

//////////////////////////////////////////////

// Get route functie waarbij er een request wordt gevraagd en de uitvoering moet zijn person:id word terug gestuurd met fetch JSON wordt elke persoon
// opgehaald die in de directus data zit onder person en in mijn index heb ik aangegeven dat ik alleen de avatar uit de personen wil hebben die een avatar hebben.
app.get('/person/:id', function (request, response) {

  fetchJson(apiUrl + '/Person/' + request.params.id).then((data) => {
    // Renderd tot html index.ejs
    response.render('person', data)
  })
})


// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})


