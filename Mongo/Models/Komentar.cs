using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.Json.Serialization;

namespace Mongo.Models
{
    public class Komentar
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        public string tekst { get; set; } = string.Empty;

        [JsonIgnore]
        public MongoDBRef? Korisnik { get; set; }  

        [JsonIgnore]
        public MongoDBRef? Film { get; set; }  
    }
      
}
