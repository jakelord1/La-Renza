using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.Interfaces
{
    internal interface IDbInitService
    {
        Task InitializeAsync();
    }
}
