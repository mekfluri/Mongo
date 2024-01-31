using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Mongo.Models;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace Mongo.Controllers
{
    [Route("api/ocena")] 
    [ApiController]
    public class OcenaController : Controller
    {
        private readonly IMongoClient _mongoClient;
        private readonly IMongoCollection<Ocena> _ocenaCollection;
        private readonly IMongoDatabase _mongoDatabase;
        private readonly ILogger<OcenaController> _logger;

        public OcenaController(IMongoClient mongoClient, ILogger<OcenaController> logger)
        {
            _mongoClient = mongoClient;
            _mongoDatabase = _mongoClient.GetDatabase("NovaBaza");
            _ocenaCollection = _mongoDatabase.GetCollection<Ocena>(nameof(Ocena));
            _logger = logger;
        }

        [Route("kreirajOcenu")] 
        [HttpPost]
        public async Task<ActionResult<Ocena>> CreateOcena([FromBody] Ocena ocena) 
        {
            await _ocenaCollection.InsertOneAsync(ocena);
            return Ok("Ocena uspešno dodat"); 
        }

        [Route("vratiOcene")] 
        [HttpGet]
        public async Task<ActionResult<List<Ocena>>> GetOcene()
        {
            return await _ocenaCollection.Find(f => true).ToListAsync();
        }

    }
}
