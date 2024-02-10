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
    [Route("api/korisnici")]
    public class KorisnikController : ControllerBase
    {
        private readonly IMongoClient _mongoClient;
        private readonly IMongoCollection<ApplicationUser> _userCollection;
        private readonly IMongoDatabase _mongoDatabase;
        
        public KorisnikController(IMongoClient mongoClient) 
        {
            _mongoClient = mongoClient;
            _mongoDatabase = _mongoClient.GetDatabase("NovaBaza");
            _userCollection = _mongoDatabase.GetCollection<ApplicationUser>("users");
        }

        [HttpPost]
        [Route("DodajFilmGledajKasnije/{idKorisnika}/{nazivFilma}")]
        public async Task<ActionResult> DodajFilmGledajKasnije(string idKorisnika, string nazivFilma)
        {
            var user = await _userCollection.Find(Builders<ApplicationUser>.Filter.Eq("Id", idKorisnika)).FirstOrDefaultAsync();
            var _filmCollection = _mongoDatabase.GetCollection<Film>("Filmovi");

            FilterDefinition<Film> filter = Builders<Film>.Filter.Eq("Naziv", nazivFilma);

            var film = await _filmCollection.Find(filter).FirstOrDefaultAsync();

            if (film == null)
            {
                return BadRequest("Ne postoji film");
            }

            
            var bsonArray = new BsonArray(user.Filmovi.Select(gl => new BsonDocument { { "$ref", gl.CollectionName }, { "$id", gl.Id } }));
            bsonArray.Add(new BsonDocument { { "$ref", "Filmovi" }, { "$id", film.Id } });

            var updateDocument = new BsonDocument("$set", new BsonDocument("Filmovi", bsonArray));

            await _userCollection.UpdateOneAsync(Builders<ApplicationUser>.Filter.Eq("Id", user.Id), updateDocument);

            Console.WriteLine("Uspesno ste dodali glumca");

            return Ok("Dodat glumac");
          
        }
       [HttpGet]
[Route("PregledajFilmoveZaKasnije/{idKorisnika}")]
public async Task<ActionResult<IEnumerable<Film>>> PregledajFilmoveZaKasnije(string idKorisnika)
{
    var user = await _userCollection.Find(Builders<ApplicationUser>.Filter.Eq("Id", idKorisnika)).FirstOrDefaultAsync();
    
    if (user == null)
    {
        return NotFound("Korisnik nije pronađen");
    }
    var  _filmCollection = _mongoDatabase.GetCollection<Film>("Filmovi");
    var filmoviIds = user.Filmovi.Select(f => ObjectId.Parse(f.Id.AsString));

    var filter = Builders<Film>.Filter.In("_id", filmoviIds);

    var filmovi = await _filmCollection.Find(filter).ToListAsync();

    return Ok(filmovi);
}



    }
}
