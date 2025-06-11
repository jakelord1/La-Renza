using La_Renza.BLL.DTO;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.BLL.Infrastructure;
using La_Renza.BLL.Interfaces;
using AutoMapper;

namespace La_Renza.BLL.Services
{
    public class AddressService : IAddressService
    {
        IUnitOfWork Database { get; set; }
        private readonly IMapper _mapper;

        public AddressService(IUnitOfWork uow, IMapper mapper)
        {
            Database = uow;
            _mapper = mapper;
        }


        public async Task CreateAddress(AddressDTO adressDto)
        {
            var adress = new Address
            {
                Id = adressDto.Id,
                UserId = adressDto.UserId,
                SecondName = adressDto.SecondName,
                FullName = adressDto.FullName,
                Street = adressDto.Street,
                City = adressDto.City,
                HouseNum = adressDto.HouseNum,
                PostIndex = adressDto.PostIndex,
                AdditionalInfo = adressDto.AdditionalInfo,
                PhoneNumber = adressDto.PhoneNumber
            };

            await Database.Addresses.Create(adress);
            await Database.Save();
        }

        public async Task UpdateAddress(AddressDTO adressDto)
        {
            var adress = await Database.Addresses.Get(adressDto.Id);
            if (adress == null)
                throw new Exception("Adress not found");
            adress.Id = adressDto.Id;
            adress.UserId = adressDto.UserId;
            adress.SecondName = adressDto.SecondName;
            adress.FullName = adressDto.FullName;
            adress.Street = adressDto.Street;
            adress.City = adressDto.City;
            adress.HouseNum = adressDto.HouseNum;
            adress.PostIndex = adressDto.PostIndex;
            adress.AdditionalInfo = adressDto.AdditionalInfo;
            adress.PhoneNumber = adressDto.PhoneNumber;




            //var adress = new Address
            //{
            //    Id = adressDto.Id,
            //    UserId = adressDto.UserId,
            //    SecondName = adressDto.SecondName,
            //    FullName = adressDto.FullName,
            //    Street = adressDto.Street,
            //    City = adressDto.City,
            //    HouseNum = adressDto.HouseNum,
            //    PostIndex = adressDto.PostIndex,
            //    AdditionalInfo = adressDto.AdditionalInfo,
            //    PhoneNumber = adressDto.PhoneNumber
            //};
            //Database.Addresses.Update(adress);
            await Database.Save();
        }

        public async Task DeleteAddress(int id)
        {
            await Database.Addresses.Delete(id);
            await Database.Save();
        }

        public async Task<AddressDTO> GetAddress(int id)
        {
            var address = await Database.Addresses.Get(id);
            if (address == null)
                throw new ValidationException("Wrong address!", "");
            return new AddressDTO
            {
                Id = address.Id,
                UserId = address.UserId,
                SecondName = address.SecondName,
                FullName = address.FullName,
                Street = address.Street,
                City = address.City,
                HouseNum = address.HouseNum,
                PostIndex = address.PostIndex,
                AdditionalInfo = address.AdditionalInfo,
                PhoneNumber = address.PhoneNumber
            };
        }
        public async Task<IEnumerable<AddressDTO>> GetAddressesByUserId(int userId)
        {
            var addresses = await Database.Addresses.GetAll();
            var userAddresses = addresses.Where(a => a.UserId == userId);


            return _mapper.Map<IEnumerable<Address>, IEnumerable<AddressDTO>>(userAddresses);
        }



        public async Task<IEnumerable<AddressDTO>> GetAddresses()
        {
        
            return _mapper.Map<IEnumerable<Address>, IEnumerable<AddressDTO>>(await Database.Addresses.GetAll());
        }

        public async Task<bool> ExistsAddress(int id)
        {
            return await Database.Addresses.Exists(id);
        }

    }
}