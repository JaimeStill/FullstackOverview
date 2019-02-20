using System.Linq;
using FullstackOverview.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace FullstackOverview.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Channel> Channels { get; set; }
        public DbSet<ChannelMessage> ChannelMessages { get; set; }
        public DbSet<ChannelUser> ChannelUsers { get; set; }
        public DbSet<Upload> Uploads { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Model
                .GetEntityTypes()
                .ToList()
                .ForEach(x =>
                {
                    modelBuilder
                        .Entity(x.Name)
                        .ToTable(x.Name.Split('.').Last());
                });

            modelBuilder.Entity<User>()
                .HasMany(x => x.UserChannels)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChannelMessage>()
                .HasOne(x => x.User)
                .WithMany(x => x.ChannelMessages)
                .HasForeignKey(x => x.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}