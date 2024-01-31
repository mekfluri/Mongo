using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.Json.Serialization;

namespace Mongo.Models
{
    public class Komentar
    {

        //ovo mora da se zavrsi kad se napravi korisnik lepo
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        public string tekst { get; set; } = string.Empty;

        [JsonIgnore]
        public MongoDBRef? Korisnik { get; set; }    
    }
      
}
