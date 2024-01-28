using System.Text.Json.Serialization;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Text.Json.Serialization;
using Microsoft.OpenApi.Models;



const string connectionUri = "mongodb+srv://susulicj:4ucninzkXfk2cmI5@cluster0.gtz9mac.mongodb.net/";


//const string connectionUri = "mongodb+srv://acokanovic14:<password>@mongo.tdt3640.mongodb.net/?retryWrites=true&w=majority";

var settings = MongoClientSettings.FromConnectionString(connectionUri);

// Set the ServerApi field of the settings object to set the version of the Stable API on the client
settings.ServerApi = new ServerApi(ServerApiVersion.V1);

// Create a new client and connect to the server
var client = new MongoClient(settings);

// Send a ping to confirm a successful connection
try {
  var result = client.GetDatabase("admin").RunCommand<BsonDocument>(new BsonDocument("ping", 1));
  Console.WriteLine("Pinged your deployment. You successfully connected to MongoDB!");
} catch (Exception ex) {
  Console.WriteLine(ex);
}

var builder = WebApplication.CreateBuilder(args);



// Add Swashbuckle services
builder.Services.AddCors(options =>
{
    options.AddPolicy("CORS", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowAnyOrigin(); 
    });
});
builder.Services.AddControllers();
builder.Services.AddSingleton(x => new MongoClient(connectionUri));
builder.Services.AddTransient<IMongoClient, MongoClient>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();


app.UseDeveloperExceptionPage();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API V1");
    });

}


app.Run();


