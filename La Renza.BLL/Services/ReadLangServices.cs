
using La_Renza.BLL.Entities;
using La_Renza.BLL.Interfaces;
using Microsoft.Extensions.Configuration;

namespace La_Renza.BLL.Services
{
    // Build Action - Embedded Resource
    // Custom Tool Namespace - Resources.
    // Resource Custom Tool PublicResXFileCodeGenerator
    public class ReadLangServices : ILangRead
    {
        IConfiguration _con;
        List<Language> languageLists;
        public ReadLangServices(IConfiguration con)
        {
            string section = "Lang";
            _con = con;
            IConfigurationSection pointSection = _con.GetSection(section);
            List<Language> lists = new List<Language>();
            foreach (var language in pointSection.AsEnumerable())
            {
                if (language.Value != null)
                    lists.Add(new Language
                    {
                        ShortName = language.Key.Replace(section + ":", ""),
                        Name = language.Value
                    });
            }

            languageLists = lists;
        }

        public List<Language> languageList() => languageLists;
    }
}
