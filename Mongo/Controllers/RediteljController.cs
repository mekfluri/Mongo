using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Mongo.Models;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace Mongo.Controllers
{
    [Route("api/reditelji")] 
    [ApiController]
    public class RediteljController : Controller
    {
        private readonly IMongoClient _mongoClient;
        private readonly IMongoCollection<Reditelj> _rediteljCollection;
        private readonly IMongoDatabase _mongoDatabase;
        private readonly ILogger<RediteljController> _logger;

        public RediteljController(IMongoClient mongoClient, ILogger<RediteljController> logger)
        {
            _mongoClient = mongoClient;
            _mongoDatabase = _mongoClient.GetDatabase("NovaBaza");
            _rediteljCollection = _mongoDatabase.GetCollection<Reditelj>(nameof(Reditelj));
            _logger = logger;
        }

        [Route("kreiraj-reditelja")] 
        [HttpPost]
        public async Task<ActionResult<Reditelj>> CreateReditelj([FromBody] Reditelj reditelj) 
        {
            await _rediteljCollection.InsertOneAsync(reditelj);
            return Ok("Reditelj uspešno dodat"); 
        }

        [Route("vrati-reditelje")] 
        [HttpGet]
        public async Task<ActionResult<List<Reditelj>>> GetReditelji()
        {
            return await _rediteljCollection.Find(f => true).ToListAsync();
        }

        [Route("vrati-reditelja/{filmId}")] 
        [HttpGet]
        public async Task<ActionResult<Reditelj>> VratiReditelja(string filmId)
        {
            var _filmCollection = _mongoDatabase.GetCollection<Film>("Filmovi");
            ObjectId FID;
            if (!ObjectId.TryParse(filmId, out FID))
            {
                return BadRequest("Pogrešan format ID-ja!"); 
            }

            var movie = await _filmCollection.Find(Builders<Film>.Filter.Eq("Id", filmId)).FirstOrDefaultAsync();

            if (movie == null)
            {
                return NotFound("Film nije pronađen sa zadatim ID-jem!"); 
            }

            if (movie.Reditelj == null)
            {
                return BadRequest("Film nema reditelja!");
            }

            MongoDBRef rediteljRef = movie.Reditelj;
            if (rediteljRef != null)
            {
                Reditelj red = await _rediteljCollection.Find(Builders<Reditelj>.Filter.Eq("Id", rediteljRef.Id)).FirstOrDefaultAsync();
                return Ok(red);
            }
            else
            {
                return BadRequest("Film nema reditelja!");
            }
        }

        [Route("obrisi-reditelja/{rediteljId}")] 
        [HttpDelete]
        public async Task<ActionResult> ObrisiReditelja(string rediteljId)
        {
            var reditelj = Builders<Reditelj>.Filter.Eq("Id", rediteljId);
            await _rediteljCollection.DeleteOneAsync(reditelj);
            return Ok();
        }
    }
}
