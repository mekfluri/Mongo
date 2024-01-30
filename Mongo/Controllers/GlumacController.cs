using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Mongo.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mongo.Controllers
{
    [Route("api/glumci")]
    [ApiController]
    public class GlumacController : ControllerBase
    {
        private readonly IMongoClient _mongoClient;
        private readonly IMongoCollection<Glumac> _glumacCollection;
        private readonly IMongoDatabase _mongoDatabase;

        public GlumacController(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
            _mongoDatabase = _mongoClient.GetDatabase("NovaBaza");
            _glumacCollection = _mongoDatabase.GetCollection<Glumac>("Glumci");
        }

        [Route("kreiraj-glumca")]
        [HttpPost]
        public async Task<ActionResult<Glumac>> CreateGlumac([FromBody] Glumac glumac)
        {
            await _glumacCollection.InsertOneAsync(glumac);
            return Ok("Glumac uspešno dodat");
        }

        [Route("vrati-glumce")]
        [HttpGet]
        public async Task<ActionResult<List<Glumac>>> VratiGlumce()
        {
            return await _glumacCollection.Find(g => true).ToListAsync();
        }

        [Route("vrati-glumce-za-film/{filmId}")]
        [HttpGet]
        public async Task<ActionResult<List<Glumac>>> VratiGlumceZaFilm(string filmId)
        {
            var _filmCollection = _mongoDatabase.GetCollection<Film>("Filmovi");
            var movie = await _filmCollection.Find(Builders<Film>.Filter.Eq("Id", filmId)).FirstOrDefaultAsync();

            if (movie == null)
            {
                return NotFound("Film nije pronađen sa zadatim ID-jem!");
            }

            List<Glumac> glumci = new List<Glumac>();
            foreach (var glumacRef in movie.Glumci)
            {
                glumci.Add(await _glumacCollection.Find(Builders<Glumac>.Filter.Eq("Id", glumacRef.Id)).FirstOrDefaultAsync());
            }
            return Ok(glumci);
        }

        [Route("obrisi-glumca/{glumacId}")]
        [HttpDelete]
        public async Task<ActionResult> ObrisiGlumca(string glumacId)
        {
            var _filmCollection = _mongoDatabase.GetCollection<Film>("Filmovi");

            var sviFilmovi = await _filmCollection.Find(f => true).ToListAsync();

            foreach (var film in sviFilmovi)
            {
                foreach (var glumac in film.Glumci)
                {
                    if (glumac.Id == glumacId)
                    {
                        film.Glumci.Remove(glumac);
                    }
                }

                await _filmCollection.ReplaceOneAsync(Builders<Film>.Filter.Eq("Id", film.Id), film);
            }

            var actor = Builders<Glumac>.Filter.Eq("Id", glumacId);
            await _glumacCollection.DeleteOneAsync(actor);
            return Ok();
        }
    }
}
