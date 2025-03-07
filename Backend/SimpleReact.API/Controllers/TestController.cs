using Microsoft.AspNetCore.Mvc;

namespace SimpleReact.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("API is running!");
        }
    }
} 