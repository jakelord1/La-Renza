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

        public AddressService(IUnitOfWork uow)
        {
            Database = uow;
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
            Database.Addresses.Update(adress);
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
                PhoneNumber = address.PhoneNumber,
                User = address.User.Email
            };
        }


        public async Task<IEnumerable<AddressDTO>> GetAddresses()
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<Address, AddressDTO>()
            .ForMember("User", opt => opt.MapFrom(c => c.User.Email)));
            var mapper = new Mapper(config);
            return mapper.Map<IEnumerable<Address>, IEnumerable<AddressDTO>>(await Database.Addresses.GetAll());
        }

    }
}