using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using La_Renza.BLL.Interfaces;

namespace La_Renza.BLL.Services
{
    public class PasswordService : IPassword
    {
        public string GenerateSalt()
        {
            byte[] saltbuf = new byte[16];
            RandomNumberGenerator randomNumberGenerator = RandomNumberGenerator.Create();
            randomNumberGenerator.GetBytes(saltbuf);
            StringBuilder sb = new StringBuilder(16);
            for (int i = 0; i < 16; i++)
                sb.Append(string.Format("{0:X2}", saltbuf[i]));
            return sb.ToString();
        }
        public string HashPassword(string salt, string password)
        {
            byte[] passwordb = Encoding.Unicode.GetBytes(salt + password);

            byte[] byteHash = SHA256.HashData(passwordb);

            StringBuilder hash = new StringBuilder(byteHash.Length);
            for (int i = 0; i < byteHash.Length; i++)
                hash.Append(string.Format("{0:X2}", byteHash[i]));
            return hash.ToString();
        }
        public bool VerifyPassword(string inputPassword, string storedSaltAndHash)
        {
            var parts = storedSaltAndHash.Split(':');
            if (parts.Length != 2) return false;

            var salt = parts[0];
            var hash = parts[1];

            var inputHash = HashPassword(salt, inputPassword);
            return string.Equals(inputHash, hash, StringComparison.OrdinalIgnoreCase);
        }

    }
}
