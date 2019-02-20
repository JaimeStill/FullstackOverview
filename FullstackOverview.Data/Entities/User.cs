using System.Collections.Generic;

namespace FullstackOverview.Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Theme { get; set; }
        public string Sidepanel { get; set; }

        public List<Channel> Channels { get; set; }
        public List<ChannelMessage> ChannelMessages { get; set; }
        public List<Upload> Uploads { get; set; }
        public List<ChannelUser> UserChannels { get; set; }
    }
}