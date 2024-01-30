using Microsoft.AspNetCore.Mvc;
using Mongo.Models;

namespace Mongo.Controllers
{
    [ApiController]
    [Route("api/korisnici")]
    public class KorisnikController : ControllerBase
    {
        public KorisnikController() { }

        [HttpGet]
        [Route("login/{username}/{password}")]
        public ActionResult Login(string username, string password)
        {
            if (username == "admin" && password == "sifra123")
            {
                return Ok();
            }
            return BadRequest();
        }
    }
}
