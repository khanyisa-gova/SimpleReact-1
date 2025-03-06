using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SimpleReact.API.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Username { get; set; }
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }
        
        public string PasswordHash { get; set; }
        
        [StringLength(50)]
        public string FirstName { get; set; }
        
        [StringLength(50)]
        public string LastName { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime UpdatedAt { get; set; }
        
        public bool IsActive { get; set; }
        
        public List<string> Roles { get; set; } = new List<string>();
    }
}
