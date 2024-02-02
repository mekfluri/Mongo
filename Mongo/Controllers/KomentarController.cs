using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Core;
using MongoDB.Driver.Core.Operations;
using MongoDB.Driver.Core.WireProtocol.Messages.Encoders.JsonEncoders;
using Microsoft.AspNetCore.Authorization;
using Mongo.Models;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Security.Claims;

namespace Mongo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KomentarController: ControllerBase
    {
        private readonly IMongoClient _mongoClient;
        private readonly IMongoCollection<Komentar> _komentarCollection;
        private readonly IMongoDatabase _mongoDatabase;
      
        public KomentarController(IMongoClient mongoClient)
        {
           
            _mongoClient = mongoClient;
            _mongoDatabase = _mongoClient.GetDatabase("NovaBaza");
            _komentarCollection = _mongoDatabase.GetCollection<Komentar>("Komentar");
         
        }

        [Route("DodajKomentar/{idKorisnika}/{idFilma}")]
        [HttpPost]
        public async Task<ActionResult<Komentar>> DodajKomentar([FromBody] Komentar komentar, string idKorisnika, string idFilma)
        {
            var _userCollection = _mongoDatabase.GetCollection<ApplicationUser>("users");
            var _filmCollection = _mongoDatabase.GetCollection<Film>("Filmovi");

           
            var filterKorisnik = Builders<ApplicationUser>.Filter.Eq("Id", idKorisnika);
            var korisnik = await _userCollection.Find(filterKorisnik).FirstOrDefaultAsync();

            if (korisnik == null)
            {
                
                return NotFound($"Korisnik sa ID {idKorisnika} nije pronađen.");
            }

            
            var filterFilm = Builders<Film>.Filter.Eq("Id", idFilma);
            var film = await _filmCollection.Find(filterFilm).FirstOrDefaultAsync();

            if (film == null)
            {
                
                return NotFound($"Film sa ID {idFilma} nije pronađen.");
            }

           
           komentar.Korisnik = new MongoDBRef("users", korisnik.UserName);
           komentar.Film = new MongoDBRef("Filmovi", film.Id);

         
         
            await _komentarCollection.InsertOneAsync(komentar);

        

            return Ok(komentar);
        }
        [Route("AzurirajKomentar/{idKomentara}")]
        [HttpPut]
        public async Task<ActionResult<Komentar>> AzurirajKomentar(string idKomentara, [FromBody] Komentar azuriraniKomentar)
        {
            var filter = Builders<Komentar>.Filter.Eq("Id", idKomentara);
            var stariKomentar = await _komentarCollection.Find(filter).FirstOrDefaultAsync();

            if (stariKomentar == null)
            {
                return NotFound($"Komentar sa ID {idKomentara} nije pronađen.");
            }
            stariKomentar.tekst = azuriraniKomentar.tekst;

            var azuriranFilter = Builders<Komentar>.Filter.Eq("Id", idKomentara);
            var rezultat = await _komentarCollection.ReplaceOneAsync(azuriranFilter, stariKomentar);

            if (rezultat.ModifiedCount > 0)
            {
                return Ok(stariKomentar);
            }

            return BadRequest("Ažuriranje nije uspelo.");
        }
        [Route("ObrisiKomentar/{idKomentara}")]
        [HttpDelete]
        public async Task<ActionResult> ObrisiKomentar(string idKomentara)
        {
            var filter = Builders<Komentar>.Filter.Eq("Id", idKomentara);
            var rezultat = await _komentarCollection.DeleteOneAsync(filter);

            if (rezultat.DeletedCount > 0)
            {
                return Ok("Komentar uspešno obrisan.");
            }

            return NotFound($"Komentar sa ID {idKomentara} nije pronađen.");
        }
        
        [Route("SviKomentari")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Komentar>>> VratiSveKomentare()
        {
            var komentari = await _komentarCollection.Find(_ => true).ToListAsync();
            return Ok(komentari);
        }

        [Route("KomentariZaFilm/{idFilma}")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Komentar>>> VratiKomentareZaFilm(string idFilma)
        {
            var filter = Builders<Komentar>.Filter.Eq("Film.$id", idFilma);
            var komentariZaFilm = await _komentarCollection.Find(filter).ToListAsync();

            return Ok(komentariZaFilm);
        }



    }
    
}