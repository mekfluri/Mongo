using System;
using Microsoft.AspNetCore;
using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.Json.Serialization;


namespace Mongo.Models
{
    [CollectionName("users")]
    public class ApplicationUser : MongoIdentityUser<Guid>
    {
        public string FullName { get; set; } = string.Empty;
        [JsonIgnore]
        public IList<MongoDBRef> Filmovi {get; set; }  

        public ApplicationUser()
        {
            Filmovi = new List<MongoDBRef>();
        }


    }
}