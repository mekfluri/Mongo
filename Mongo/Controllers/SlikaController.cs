using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Mongo.Models;
using System.Threading.Tasks;

namespace Mongo.Controllers
{
    [Route("api/slike")]
    [ApiController]
    public class SlikaController : ControllerBase
    {
        private readonly IMongoClient _mongoClient;
        private readonly IMongoCollection<Slika> _slikaCollection;
        private readonly IMongoDatabase _mongoDatabase;

        public SlikaController(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
            _mongoDatabase = _mongoClient.GetDatabase("NovaBaza");
            _slikaCollection = _mongoDatabase.GetCollection<Slika>("Slike");
        }

        [Route("dodaj-sliku/{filmId}")]
        [HttpPost]
        public async Task<ActionResult<Slika>> DodajSliku(string filmId, [FromBody] Slika slikaUrl)
        {
            Slika slika = new Slika();
            slika.Url = slikaUrl.Url;

            await _slikaCollection.InsertOneAsync(slika);

            var _filmCollection = _mongoDatabase.GetCollection<Film>("Filmovi");
            var film = await _filmCollection.Find(Builders<Film>.Filter.Eq("Id", filmId)).FirstOrDefaultAsync();

            film.Slika = new MongoDBRef("slika", slika.Id);
            await _filmCollection.ReplaceOneAsync(Builders<Film>.Filter.Eq("Id", filmId), film);

            return Ok(slika);
        }

        [Route("vrati-sliku/{filmId}")]
        [HttpGet]
        public async Task<ActionResult<Slika>> VratiSliku(string filmId)
        {
            var _filmCollection = _mongoDatabase.GetCollection<Film>("Filmovi");
            var film = await _filmCollection.Find(Builders<Film>.Filter.Eq("Id", filmId)).FirstOrDefaultAsync();
            if (film.Slika == null)
                return BadRequest("Ne postoji slika");

            var slika = await _slikaCollection.Find(Builders<Slika>.Filter.Eq("Id", film.Slika.Id)).FirstOrDefaultAsync();

            if (slika != null)
                return Ok(slika);
            return BadRequest("Ne postoji slika sa ovom referencom!");
        }
    }
}
