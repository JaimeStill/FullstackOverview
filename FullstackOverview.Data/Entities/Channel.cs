using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace FullstackOverview.Data.Entities
{
    public class Channel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsDeleted { get; set; }

        public User User { get; set; }

        public List<ChannelMessage> ChannelMessages { get; set; }
        public List<ChannelUser> ChannelUsers { get; set; }
    }
}