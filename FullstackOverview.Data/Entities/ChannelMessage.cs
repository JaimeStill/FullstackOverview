using System;

namespace FullstackOverview.Data.Entities
{
    public class ChannelMessage
    {
        public int Id { get; set; }
        public int ChannelId { get; set; }
        public int? UploadId { get; set; }
        public int UserId { get; set; }
        public string Value { get; set; }
        public bool IsUpload { get; set; }
        public DateTime MessageDate { get; set; }

        public Channel Channel { get; set; }
        public Upload Upload { get; set; }
        public User User { get; set; }
    }
}