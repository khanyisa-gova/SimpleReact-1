using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SimpleReact.API.Models;
using SimpleReact.API.Repositories;
using Microsoft.Extensions.Logging;

namespace SimpleReact.API.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IUserRepository userRepository, IConfiguration configuration, ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<User> RegisterUserAsync(User user, string password)
        {
            try
            {
                // Check if user already exists
                var existingUser = await _userRepository.GetUserByUsernameAsync(user.Username);
                if (existingUser != null)
                {
                    _logger.LogWarning("Registration failed: User with username {Username} already exists.", user.Username);
                    return null;
                }
                
                existingUser = await _userRepository.GetUserByEmailAsync(user.Email);
                if (existingUser != null)
                {
                    _logger.LogWarning("Registration failed: User with email {Email} already exists.", user.Email);
                    return null;
                }
                
                // Hash password
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
                
                // Check if this is the first user (to assign Admin role)
                var allUsers = await _userRepository.GetAllUsersAsync();
                bool isFirstUser = allUsers.Count() == 0;
                
                // Set default role if none provided
                if (user.Roles == null || user.Roles.Count == 0)
                {
                    user.Roles = isFirstUser 
                        ? new List<string> { "Admin", "User" } 
                        : new List<string> { "User" };
                }
                
                // Create user
                return await _userRepository.CreateUserAsync(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during registration for user {Username}", user.Username);
                return null;
            }
        }

        public async Task<string> LoginAsync(string username, string password)
        {
            Console.WriteLine($"Login attempt for user: {username}");
            
            var user = await _userRepository.GetUserByUsernameAsync(username);
            
            if (user == null)
            {
                Console.WriteLine($"User not found: {username}");
                return null;
            }
            
            bool passwordValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            Console.WriteLine($"Password validation result: {passwordValid}");
            
            if (!passwordValid)
                return null;
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };
            
            foreach (var role in user.Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(1);
            
            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: expires,
                signingCredentials: creds
            );
            
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
