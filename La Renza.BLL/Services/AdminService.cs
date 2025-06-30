using La_Renza.BLL.DTO;
using La_Renza.BLL.Entities;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Infrastructure;
using La_Renza.BLL.Interfaces;
using AutoMapper;

namespace La_Renza.BLL.Services
{
    public class AdminService : IAdminService
    {

        private readonly IUnitOfWork Database;
        private readonly IMapper _mapper;

        public AdminService(IUnitOfWork uow, IMapper mapper)
        {
            Database = uow;
            _mapper = mapper;
        }

        public async Task CreateAdmin(AdminDTO adminDto)
        {
            var admin = new Admin
            {
                Id = adminDto.Id,
                Email = adminDto.Email,
                Password =  adminDto.Password,
                Identifier = adminDto.Identifier
            };
            await Database.Admins.Create(admin);
            await Database.Save();
        }

        public async Task UpdateAdmin(AdminDTO adminDto)
        {
            var admin = new Admin
            {
                Id = adminDto.Id,
                Email = adminDto.Email,
                Password =adminDto.Password,
                Identifier = adminDto.Identifier
            };
            Database.Admins.Update(admin);
            await Database.Save();
        }

        public async Task DeleteAdmin(int id)
        {
            await Database.Admins.Delete(id);
            await Database.Save();
        }

        public async Task<AdminDTO> GetAdmin(int id)
        {
            var admin = await Database.Admins.Get(id);
            if (admin == null)
                throw new ValidationException("Wrong admin!", "");
            return new AdminDTO
            {
                Id = admin.Id,
                Email = admin.Email,
                Password = admin.Password,
                Identifier = admin.Identifier
            };
        }

        public async Task<IEnumerable<AdminDTO>> GetAdmins()
        {
             return _mapper.Map<IEnumerable<Admin>, IEnumerable<AdminDTO>>(await Database.Admins.GetAll());
        }
        public async Task<AdminDTO> GetAdminByLogin(string login)
        {
            var user = await Database.Admins.Get(login);
            if (user == null)
                throw new ValidationException("Wrong user!", "");

            return new AdminDTO
            {
                Email = user.Email,
                Identifier = user.Identifier,
                Password = user.Password,
            };
        }

        public async Task<bool> ExistsAdmin(int id)
        {
            return await Database.Admins.Exists(id);
        }
        public async Task<bool> AnyAdmins()
        {
            return await Database.Admins.Any();
        }
    }
}
