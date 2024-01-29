using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NapredneBazeMongodb.Models
{
    public class Korisnik
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        public string Username { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;



    }
}
