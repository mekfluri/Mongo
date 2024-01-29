
using Microsoft.AspNetCore.Mvc;
using NapredneBazeMongodb.Models;

namespace NapredneBazeMongodb.Controllers
{
    [ApiController]
    [Route("[controller]")]
    
    public class KorisnikController : Controller
    {

        public KorisnikController() { }


        [HttpGet]
        [Route("Login/{username}/{password}")]
        public ActionResult Login( string username, string password)
        {
            if (username=="admin" && password=="sifra123")
            {
                return Ok();
            }
            return BadRequest();
        }


    }
}
