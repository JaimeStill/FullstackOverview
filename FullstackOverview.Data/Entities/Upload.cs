using System;
using System.Collections.Generic;

namespace FullstackOverview.Data.Entities
{
    public class Upload
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Url { get; set; }
        public string Path { get; set; }
        public string File { get; set; }
        public string Name { get; set; }
        public DateTime UploadDate { get; set; }

        public User User { get; set; }

        public List<ChannelMessage> ChannelMessages { get; set; }
    }
}