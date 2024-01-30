using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Mongo.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mongo.Controllers
{
    [Route("api/zanrovi")]
    [ApiController]
    public class ZanrController : ControllerBase
    {
        private readonly IMongoClient _mongoClient;
        private readonly IMongoCollection<Zanr> _zanrCollection;
        private readonly IMongoDatabase _mongoDatabase;

        public ZanrController(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
            _mongoDatabase = _mongoClient.GetDatabase("NovaBaza");
            _zanrCollection = _mongoDatabase.GetCollection<Zanr>("Zanrovi");
        }

        [Route("kreiraj-zanr")]
        [HttpPost]
        public async Task<ActionResult> CreateZanr([FromBody] Zanr zanr)
        {
            await _zanrCollection.InsertOneAsync(zanr);
            return Ok("Uspesno kreiran zanr!");
        }

        [Route("vrati-zanrove")]
        [HttpGet]
        public async Task<ActionResult<List<Zanr>>> VratiZanrove()
        {
            var zanrovi = await _zanrCollection.Find(z => true).ToListAsync();
            return Ok(zanrovi);
        }

        [Route("vrati-zanr/{filmId}")]
        [HttpGet]
        public async Task<ActionResult<Zanr>> VratiZanr(string filmId)
        {
            var _filmCollection = _mongoDatabase.GetCollection<Film>("Filmovi");
            ObjectId FID;
            if (!ObjectId.TryParse(filmId, out FID))
            {
                return BadRequest("Pogresan format id-ja!");
            }
            var movie = await _filmCollection.Find(Builders<Film>.Filter.Eq("Id", filmId)).FirstOrDefaultAsync();

            if (movie == null)
            {
                return BadRequest("Ne postoji film sa ovim Id-jem!");
            }

            MongoDBRef zanrRef = movie.Zanr;
            Zanr zanr = await _zanrCollection.Find(Builders<Zanr>.Filter.Eq("Id", zanrRef.Id)).FirstOrDefaultAsync();

            return Ok(zanr);
        }
    }
}
