namespace FullstackOverview.Data.Entities
{
    public class ChannelUser
    {
        public int Id { get; set; }
        public int ChannelId { get; set; }
        public int UserId { get; set; }
        public bool IsAdmin { get; set; }

        public Channel Channel { get; set; }
        public User User { get; set; }
    }
}