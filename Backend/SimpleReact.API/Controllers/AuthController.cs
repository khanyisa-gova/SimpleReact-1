using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SimpleReact.API.Models;
using SimpleReact.API.Services;

namespace SimpleReact.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var user = new User
            {
                Username = model.Username,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                IsActive = true
            };
            
            var result = await _authService.RegisterUserAsync(user, model.Password);
            
            if (result == null)
                return BadRequest("Username or email already exists");
            
            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var token = await _authService.LoginAsync(model.Username, model.Password);
            
            if (token == null)
                return Unauthorized("Invalid username or password");
            
            return Ok(new { token });
        }
    }

    public class RegisterModel
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
