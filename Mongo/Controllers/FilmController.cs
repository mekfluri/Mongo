
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
    public class FilmController: ControllerBase
    {
        private readonly IMongoClient _mongoClient;
        private readonly IMongoCollection<Film> _filmCollection;
        private readonly IMongoDatabase _mongoDatabase;
      
        public FilmController(IMongoClient mongoClient)
        {
           
            _mongoClient = mongoClient;
            _mongoDatabase = _mongoClient.GetDatabase("NovaBaza");
            _filmCollection = _mongoDatabase.GetCollection<Film>("Filmovi");
         
        }

        [Route("KreirajFilm")]
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<Film>> KreirajFilm([FromBody] Film film)
        {
            if(_mongoClient == null)
            {
                return BadRequest("Greska");
            }
            var filmovi = await _filmCollection.Find(Builders<Film>.Filter.Eq("Naziv", film.Naziv)).ToListAsync();
            if (filmovi.Any())
                return BadRequest("Postoji film sa ovim nazivom");
            await _filmCollection.InsertOneAsync(film);

            return Ok(film);
        }

        [Route("VratiFilmove")]
        [HttpGet]
        public async Task<ActionResult<List<Film>>> GetFilms()
        {
            //var filmCollection = _mongoDatabase.GetCollection<Film>("Films");
            return await _filmCollection.Find(f => true).ToListAsync();
        }

        [Route("DodajRediteljaFilmu/{filmId}/{imeReditelja}/{prezimeReditelja}")]
        [HttpPut]
        public async Task<ActionResult> DodajReditelja(string filmId, string imeReditelja, string prezimeReditelja)
        {


            var movie = await _filmCollection.Find(Builders<Film>.Filter.Eq("Id", filmId)).FirstOrDefaultAsync();

            var _rediteljCollection = _mongoDatabase.GetCollection<Reditelj>("Reditelji");

            FilterDefinition<Reditelj> filter = Builders<Reditelj>.Filter.Eq("Ime", imeReditelja);
            filter &= Builders<Reditelj>.Filter.Eq("Prezime", prezimeReditelja);


            var reditelj = await _rediteljCollection.Find(filter).FirstOrDefaultAsync();

            if (reditelj == null)

            {
                reditelj = new Reditelj();
                reditelj.Ime = imeReditelja;
                reditelj.Prezime = prezimeReditelja;
                await _rediteljCollection.InsertOneAsync(reditelj);
            }



            movie.Reditelj= new MongoDBRef("reditelj", reditelj.Id);

            await _filmCollection.ReplaceOneAsync(Builders<Film>.Filter.Eq("Id", movie.Id), movie);


            return Ok("dodat glumac");

        }


        
        /*[Route("DodajOcenuFilmu/{idFilma}/{ocena}")]
        [HttpPut]
        public async Task<ActionResult> DodajOcenuFilmu(string idFilma, int ocena)
        {
            var movie = await _filmCollection.Find(Builders<Film>.Filter.Eq("Id", idFilma)).FirstOrDefaultAsync();

            var _ocenaCollection = _mongoDatabase.GetCollection<Ocena>("Ocena");

            FilterDefinition<Ocena> filter = Builders<Ocena>.Filter.Eq("brojOcene", ocena);


            var Ocena = await _ocenaCollection.Find(filter).FirstOrDefaultAsync();

            if (Ocena == null)

            {
               return BadRequest("Kreirajte prvo ocenu");
            }

            Console.WriteLine(movie.Ocene);
            foreach (var ocenaRef in movie.Ocene)
            {
                Console.WriteLine($"Tip: {ocenaRef.CollectionName}, ID: {ocenaRef.Id}");
            }
            movie.Ocene.Add(new MongoDBRef("Ocena", Ocena.Id));
            Console.WriteLine("uspesno ste dodali");

            await _filmCollection.ReplaceOneAsync(Builders<Film>.Filter.Eq("Id", movie.Id), movie);
            Console.WriteLine("uspesno ste dodali1");

            return Ok("dodat glumac");
        }*/
        [Route("DodajOcenuFilmu/{idFilma}/{ocena}")]
        [HttpPut]
        public async Task<ActionResult> DodajOcenuFilmu(string idFilma, int ocena)
        {
            var movie = await _filmCollection.Find(Builders<Film>.Filter.Eq("Id", idFilma)).FirstOrDefaultAsync();

            var _ocenaCollection = _mongoDatabase.GetCollection<Ocena>("Ocena");

            FilterDefinition<Ocena> filter = Builders<Ocena>.Filter.Eq("brojOcene", ocena);

            var ocenaDocument = await _ocenaCollection.Find(filter).FirstOrDefaultAsync();

            if (ocenaDocument == null)
            {
                return BadRequest("Kreirajte prvo ocenu");
            }

          
            var bsonArray = new BsonArray(movie.Ocene.Select(oc => new BsonDocument { { "$ref", oc.CollectionName }, { "$id", oc.Id } }));
            bsonArray.Add(new BsonDocument { { "$ref", "Ocena" }, { "$id", ocenaDocument.Id } });

            var updateDocument = new BsonDocument("$set", new BsonDocument("Ocene", bsonArray));

            await _filmCollection.UpdateOneAsync(Builders<Film>.Filter.Eq("Id", movie.Id), updateDocument);

            return Ok("Dodat glumac");
        }



        [Route("DodajZanrFilmu/{idFilma}/{zanr}")]
        [HttpPut]
        public async Task<ActionResult> DodajZanrFilmu(string idFilma, string zanr)
        {

            var movie = await _filmCollection.Find(Builders<Film>.Filter.Eq("Id", idFilma)).FirstOrDefaultAsync();
            var _zanrCollection = _mongoDatabase.GetCollection<Zanr>("Zanrovi");

            var zanrObject = await _zanrCollection.Find(Builders<Zanr>.Filter.Eq("Tip", zanr)).FirstOrDefaultAsync();

            if (zanrObject == null)
            {
                return BadRequest("Ne postoji ovaj zanr!");
            }

            movie.Zanr = new MongoDBRef("zanr", zanrObject.Id);

            await _filmCollection.ReplaceOneAsync(Builders<Film>.Filter.Eq("Id", movie.Id), movie);



            return Ok("dodat zanr");

        }
         /*[Route("DodajGlumcaFilmu/{filmId}/{imeGlumca}/{prezimeGlumca}")]
        [HttpPost]
        public async Task<ActionResult> DodajGlumca(string filmId, string imeGlumca, string prezimeGlumca)
        {


            var movie = await _filmCollection.Find(Builders<Film>.Filter.Eq("Id", filmId)).FirstOrDefaultAsync();
            var _glumciCollection = _mongoDatabase.GetCollection<Glumac>("Glumci");


            FilterDefinition<Glumac> filter = Builders<Glumac>.Filter.Eq("FirstName", imeGlumca);
            filter &= Builders<Glumac>.Filter.Eq("LastName", prezimeGlumca);


            var actor = await _glumciCollection.Find(filter).FirstOrDefaultAsync();
                
            if(actor== null)
            
            {
                actor = new Glumac();
                actor.FirstName = imeGlumca;
                actor.LastName = prezimeGlumca;
                await _glumciCollection.InsertOneAsync(actor);
            }
            
            
            
            movie.Glumci.Add(new MongoDBRef("Glumci", actor.Id));

            await _filmCollection.ReplaceOneAsync(Builders<Film>.Filter.Eq("Id", movie.Id), movie);


            return Ok("dodat glumac");

        }*/
        [Route("DodajGlumcaFilmu/{filmId}/{imeGlumca}/{prezimeGlumca}")]
        [HttpPost]
        public async Task<ActionResult> DodajGlumca(string filmId, string imeGlumca, string prezimeGlumca)
        {
            var movie = await _filmCollection.Find(Builders<Film>.Filter.Eq("Id", filmId)).FirstOrDefaultAsync();
            var _glumciCollection = _mongoDatabase.GetCollection<Glumac>("Glumci");

            FilterDefinition<Glumac> filter = Builders<Glumac>.Filter.Eq("FirstName", imeGlumca);
            filter &= Builders<Glumac>.Filter.Eq("LastName", prezimeGlumca);

            var actor = await _glumciCollection.Find(filter).FirstOrDefaultAsync();

            if (actor == null)
            {
                actor = new Glumac();
                actor.FirstName = imeGlumca;
                actor.LastName = prezimeGlumca;
                await _glumciCollection.InsertOneAsync(actor);
            }

            Console.WriteLine("Trenutni glumci:");

            foreach (var glumacRef in movie.Glumci)
            {
                Console.WriteLine($"Tip: {glumacRef.CollectionName}, ID: {glumacRef.Id}");
            }

            
            var bsonArray = new BsonArray(movie.Glumci.Select(gl => new BsonDocument { { "$ref", gl.CollectionName }, { "$id", gl.Id } }));
            bsonArray.Add(new BsonDocument { { "$ref", "Glumci" }, { "$id", actor.Id } });

            var updateDocument = new BsonDocument("$set", new BsonDocument("Glumci", bsonArray));

            await _filmCollection.UpdateOneAsync(Builders<Film>.Filter.Eq("Id", movie.Id), updateDocument);

            Console.WriteLine("Uspesno ste dodali glumca");

            return Ok("Dodat glumac");
        }

        
        [Route("ObrisiFilm/{filmId}")]
        [HttpDelete]

        public async Task<ActionResult>ObrisiFilm(string filmId)
        {
           // var movie = await _filmCollection.Find(Builders<Film>.Filter.Eq("Id", filmId)).FirstOrDefaultAsync();
            var movie = Builders<Film>.Filter.Eq("Id", filmId);
            await _filmCollection.DeleteOneAsync(movie);
            return Ok();
        }
        [Route("ObrisiGlumcaIzFilma/{filmId}/{glumacId}")]
        [HttpDelete]
        public async Task<ActionResult> ObrisiGlumcaIzFilma(string filmId,string glumacId)
        {
            var movie = await _filmCollection.Find(Builders<Film>.Filter.Eq("Id", filmId)).FirstOrDefaultAsync();
            var _glumciCollection = _mongoDatabase.GetCollection<Glumac>("Glumci");

            //            var actor = await _glumciCollection.Find(Builders<Glumac>.Filter.Eq("Id", glumacId)).FirstOrDefaultAsync();

            movie.Glumci.Remove(movie.Glumci.Where(p => p.Id == glumacId).FirstOrDefault());
            await _filmCollection.ReplaceOneAsync(Builders<Film>.Filter.Eq("Id", movie.Id), movie);
            return Ok();
        }

        [Route("IzmeniFilm/{filmId}")]
        [HttpPut]
        public async Task<ActionResult> IzmeniFilm(string filmId, [FromBody]Film film)
        {


             FilterDefinition<Film> filter = Builders<Film>.Filter.Eq("Naziv", film.Naziv);
             filter &= Builders<Film>.Filter.Ne("Id", filmId);

            var movie = await _filmCollection.Find(filter).FirstOrDefaultAsync();
            if (movie != null)
                return BadRequest("Posoji film sa ovim nazivom!");


            movie = await _filmCollection.Find(Builders<Film>.Filter.Eq("Id", filmId)).FirstOrDefaultAsync();




            movie.Naziv = film.Naziv;
            movie.Opis = film.Opis;
            movie.VremeTrajanja = film.VremeTrajanja;
            movie.GodinaPremijere = film.GodinaPremijere;
            await _filmCollection.ReplaceOneAsync(Builders<Film>.Filter.Eq("Id", movie.Id), movie);
            return Ok();
        }

    }
}
