using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.EF;
using La_Renza.BLL.Entities;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;

namespace La_Renza.BLL.Services
{
    internal class DbInitService : IDbInitService
    {
        private readonly LaRenzaContext _context;

        public DbInitService(LaRenzaContext context)
        {
            _context = context;
        }
        public async Task InitializeAsync()
        {
            await _context.Database.EnsureCreatedAsync();
            if (!await _context.Admins.AnyAsync())
            {
                _context.Admins.Add(new Admin
                {
                    Email = "admin.vo@gmail.com",
                    Password = BCrypt.Net.BCrypt.HashPassword("qqqqqqqq")
                });
            }

            await _context.SaveChangesAsync();
        }
    }
}
