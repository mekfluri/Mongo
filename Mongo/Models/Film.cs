using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.Json.Serialization;

namespace Mongo.Models
{
    public class Film
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        public string Naziv { get; set; } = string.Empty;
        public string VremeTrajanja { get; set; } = string.Empty;
        public string GodinaPremijere {get; set;} = string.Empty;
        public string Opis { get; set; } = string.Empty;
        //da moze da se napravi lista zeljenih filmova 
        //

        [JsonIgnore]
        public MongoDBRef? Zanr { get; set; }

        [JsonIgnore]
        public MongoDBRef? Slika { get; set; } 

        [JsonIgnore]
        public MongoDBRef? Reditelj { get; set; }

        [JsonIgnore]
        public IList<MongoDBRef> Glumci { get; set; }

        [JsonIgnore]
        public IList<MongoDBRef> Ocene {get; set; }  
        //public List<string> Ocene { get; set; } = new List<string>();


        public Film()
        {
            Glumci = new List<MongoDBRef>();
            Ocene = new List<MongoDBRef>();
        }

     }
      
}
