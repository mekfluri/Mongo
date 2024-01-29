using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NapredneBazeMongodb.Models
{
    public class Reditelj
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        public string Ime { get; set; } = string.Empty;

        public string Prezime { get; set; } = string.Empty;
        //bio


    }
}
