using System.Text.Json.Serialization;
using System.Text.Json;

namespace La_Renza.DAL.Entities
{

    public class ConfiguratorItem
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
        [JsonPropertyName("type")]
        public string Type { get; set; } = "string"; // string, categoryIds, bannerArray, promoArray и т.д.
        [JsonPropertyName("value")]
        public JsonElement? Value { get; set; }
    }
}
