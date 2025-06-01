using La_Renza.BLL.DTO;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.BLL.Infrastructure;
using La_Renza.BLL.Interfaces;
using AutoMapper;

namespace La_Renza.BLL.Services
{
    public class UserService: IUserService
    {
        IUnitOfWork Database { get; set; }
        PasswordHasher Hasher { get; set; }
        private readonly IMapper _mapper;
        public UserService(IUnitOfWork uow, PasswordHasher hash, IMapper mapper)
        {
            Database = uow;
            Hasher = hash;
            _mapper = mapper;
        }

        public async Task CreateUser(UserDTO userDto)
        {
            var user = new User
            {
                Id = userDto.Id,
                Email = userDto.Email,
                PhoneNumber = userDto.PhoneNumber,
                FullName = userDto.FullName,
                SurName = userDto.SurName,
                BirthDate = userDto.BirthDate,
                Gender = userDto.Gender,
                Password = Hasher.HashPassword(userDto.Password),
                NewsOn = userDto.NewsOn,
                Addresses = new List<Address>(),
                Invoices = new List<InvoiceInfo>()
                
            };
            await Database.Users.Create(user);
            await Database.Save();
        }

        public async Task UpdateUser(UserDTO userDto)
        {
            var user = new User
            {
                Id = userDto.Id,
                Email = userDto.Email,
                PhoneNumber = userDto.PhoneNumber,
                FullName = userDto.FullName,
                SurName = userDto.SurName,
                BirthDate = userDto.BirthDate,
                Gender = userDto.Gender,
                Password = Hasher.HashPassword(userDto.Password),
                NewsOn = userDto.NewsOn,
                Addresses = _mapper.Map<ICollection<Address>>(userDto.Addresses),
                Invoices = _mapper.Map<ICollection<InvoiceInfo>>(userDto.Invoices)
            };
            Database.Users.Update(user);
            await Database.Save();
        }

        public async Task DeleteUser(int id)
        {
            await Database.Users.Delete(id);
            await Database.Save();
        }

        public async Task<UserDTO> GetUser(int id)
        {
            var user = await Database.Users.Get(id);
            if (user == null)
                throw new ValidationException("Wrong user!", "");

            return new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                SurName = user.SurName,
                BirthDate = user.BirthDate,
                Gender = user.Gender,
                Password = user.Password,
                NewsOn = user.NewsOn,
                LaRenzaPoints = user.LaRenzaPoints,
                Addresses = _mapper.Map<List<AddressDTO>>(user.Addresses),
                Invoices = _mapper.Map<List<InvoiceInfoDTO>>(user.Invoices)
            };
        }

        public async Task<IEnumerable<UserDTO>> GetUsers()
        {
            return _mapper.Map<IEnumerable<User>, IEnumerable<UserDTO>>(await Database.Users.GetAll());
        }

        public async Task<bool> ExistsUser(int id)
        {
            return await Database.Users.Exists(id);
        }

        public async Task<UserDTO> GetUserByLogin(string login)
        {
            var user = await Database.Users.Get(login);
            if (user == null)
                throw new ValidationException("Wrong user!", "");

            return new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                SurName = user.SurName,
                BirthDate = user.BirthDate,
                Gender = user.Gender,
                Password = user.Password,
                NewsOn = user.NewsOn,
                LaRenzaPoints = user.LaRenzaPoints
            };
        }

        public async Task<bool> AnyUsers()
        {
            return await Database.Users.Any();
        }
    }
}
