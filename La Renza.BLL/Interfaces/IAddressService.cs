using La_Renza.BLL.DTO;

namespace La_Renza.BLL.Interfaces
{
    public interface IAddressService
    {
        Task CreateAddress(AddressDTO adressDto);
        Task UpdateAddress(AddressDTO adressDto);
        Task DeleteAddress(int id);
        Task<AddressDTO> GetAddress(int id);
        Task<IEnumerable<AddressDTO>> GetAddresses();
    }
}
