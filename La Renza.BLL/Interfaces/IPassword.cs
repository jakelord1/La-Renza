using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.Interfaces
{
    public interface IPassword
    {
        string GenerateSalt();
        string HashPassword(string salt, string password);
        public bool VerifyPassword(string inputPassword, string storedSaltAndHash);
    }
}
