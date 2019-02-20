using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FullstackOverview.Core.Extensions;
using FullstackOverview.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace FullstackOverview.Data.Extensions
{
    public static class ChannelExtensions
    {
        private static IQueryable<Channel> SetChannelIncludes(this DbSet<Channel> channels) =>
            channels
                .Include(x => x.User);

        private static IQueryable<ChannelMessage> SetChannelMessageIncludes(this DbSet<ChannelMessage> messages) =>
            messages
                .Include(x => x.User);

        private static IQueryable<ChannelUser> SetChannelUserIncludes(this DbSet<ChannelUser> users) =>
            users
                .Include(x => x.Channel)
                .Include(x => x.User);

        public static async Task<List<Channel>> GetChannels(this AppDbContext db)
        {
            var channels = await db.Channels
                .SetChannelIncludes()
                .Where(x => !x.IsDeleted)
                .OrderBy(x => x.Name)
                .ToListAsync();

            return channels;
        }

        public static async Task<List<Channel>> SearchChannels(this AppDbContext db, string search)
        {
            search = search.ToLower();

            var channels = await db.Channels
                .SetChannelIncludes()
                .Where(x => !x.IsDeleted)
                .Where(x =>
                    x.Name.ToLower().Contains(search) ||
                    x.Description.ToLower().Contains(search)
                )
                .OrderBy(x => x.Name)
                .ToListAsync();

            return channels;

        }

        public static async Task<List<Channel>> GetUserCreatedChannels(this AppDbContext db, int userId, bool isDeleted = false)
        {
            var channels = await db.Channels
                .SetChannelIncludes()
                .Where(x =>
                    x.UserId == userId &&
                    x.IsDeleted == isDeleted
                )
                .OrderBy(x => x.Name)
                .ToListAsync();

            return channels;
        }

        public static async Task<List<Channel>> GetUserJoinedChannels(this AppDbContext db, int userId)
        {
            var channels = await db.ChannelUsers
                .SetChannelUserIncludes()
                .Where(x => x.UserId == userId)
                .Select(x => x.Channel)
                .OrderBy(x => x.Name)
                .ToListAsync();

            return channels;
        }

        public static async Task<List<ChannelUser>> GetChannelUsers(this AppDbContext db, int channelId)
        {
            var users = await db.ChannelUsers
                .SetChannelUserIncludes()
                .Include(x => x.User)
                .Where(x =>
                    x.ChannelId == channelId &&
                    !x.IsAdmin
                )
                .OrderBy(x => x.User.Username)
                .ToListAsync();

            return users;
        }

        public static async Task<List<ChannelUser>> GetChannelAdmins(this AppDbContext db, int channelId)
        {
            var users = await db.ChannelUsers
                .SetChannelUserIncludes()
                .Include(x => x.User)
                .Where(x =>
                    x.ChannelId == channelId &&
                    x.IsAdmin
                )
                .OrderBy(x => x.User.Username)
                .ToListAsync();

            return users;
        }

        public static async Task<List<ChannelMessage>> GetChannelMessages(this AppDbContext db, int channelId)
        {
            var messages = await db.ChannelMessages
                .SetChannelMessageIncludes()
                .Where(x => x.ChannelId == channelId)
                .OrderBy(x => x.MessageDate)
                .ToListAsync();

            return messages;
        }

        public static async Task<Channel> GetChannel(this AppDbContext db, string name)
        {
            var channel = await db.Channels
                .SetChannelIncludes()
                .FirstOrDefaultAsync(x => x.Name.ToLower() == name.ToLower());

            return channel;
        }

        public static async Task<ChannelUser> GetChannelUser(this AppDbContext db, int channelId, int userId)
        {
            var user = await db.ChannelUsers
                .SetChannelUserIncludes()
                .FirstOrDefaultAsync(x =>
                    x.ChannelId == channelId &&
                    x.UserId == userId
                );

            return user;
        }

        public static async Task<bool> ValidateChannelName(this AppDbContext db, Channel channel)
        {
            channel.Name = channel.Name.UrlEncode();

            var check = await db.Channels
                .Where(x => x.Id != channel.Id)
                .FirstOrDefaultAsync(x => x.Name.ToLower() == channel.Name.ToLower());

            return check == null;
        }

        public static async Task AddChannel(this AppDbContext db, Channel channel)
        {
            if (await channel.Validate(db))
            {
                channel.CreatedDate = DateTime.Now;
                await db.Channels.AddAsync(channel);
                await db.SaveChangesAsync();

                var channelUser = new ChannelUser
                {
                    ChannelId = channel.Id,
                    UserId = channel.UserId,
                    IsAdmin = true
                };

                await db.AddChannelUser(channelUser);
            }
        }

        public static async Task UpdateChannel(this AppDbContext db, Channel channel)
        {
            if (await channel.Validate(db))
            {
                db.Channels.Update(channel);
                await db.SaveChangesAsync();
            }
        }

        public static async Task ToggleChannelDeleted(this AppDbContext db, Channel channel)
        {
            db.Attach(channel);
            channel.IsDeleted = !channel.IsDeleted;
            await db.SaveChangesAsync();
        }

        public static async Task DeleteChannel(this AppDbContext db, Channel channel)
        {
            db.Channels.Remove(channel);
            await db.SaveChangesAsync();
        }

        public static async Task<ChannelUser> SyncChannelUser(this AppDbContext db, User user, string channelName)
        {
            var channel = await db.GetChannel(channelName);
            var check = await db.GetChannelUser(channel.Id, user.Id);

            if (check == null)
            {
                check = new ChannelUser
                {
                    UserId = user.Id,
                    ChannelId = channel.Id,
                    IsAdmin = false
                };

                await db.AddChannelUser(check);
                check = await db.GetChannelUser(channel.Id, user.Id);
            }

            return check;
        }

        public static async Task AddChannelUser(this AppDbContext db, ChannelUser user)
        {
            await db.ChannelUsers.AddAsync(user);
            await db.SaveChangesAsync();
        }

        public static async Task ToggleChannelAdmin(this AppDbContext db, ChannelUser user)
        {
            db.ChannelUsers.Attach(user);
            user.IsAdmin = !user.IsAdmin;
            await db.SaveChangesAsync();
        }

        public static async Task DeleteChannelUser(this AppDbContext db, ChannelUser user)
        {
            db.ChannelUsers.Remove(user);
            await db.SaveChangesAsync();
        }

        public static async Task AddChannelMessage(this AppDbContext db, ChannelMessage message)
        {
            if (message.Validate())
            {
                message.MessageDate = DateTime.Now;
                await db.ChannelMessages.AddAsync(message);
                await db.SaveChangesAsync();
            }
        }

        public static async Task UpdateChannelMessage(this AppDbContext db, ChannelMessage message)
        {
            if (message.Validate())
            {
                db.ChannelMessages.Update(message);
                await db.SaveChangesAsync();
            }
        }

        public static async Task DeleteChannelMessage(this AppDbContext db, ChannelMessage message)
        {
            var m = await db.ChannelMessages.FirstOrDefaultAsync(x => x.Id == message.Id);
            db.ChannelMessages.Remove(m);
            await db.SaveChangesAsync();
        }

        public static async Task<bool> Validate(this Channel channel, AppDbContext db)
        {
            if (string.IsNullOrEmpty(channel.Name))
            {
                throw new Exception("The provided channel does not have a name");
            }
            
            if (!(await db.ValidateChannelName(channel)))
            {
                throw new Exception("The provided channel name is already in use");
            }
            
            return true;
        }

        public static bool Validate(this ChannelMessage message)
        {
            if (string.IsNullOrEmpty(message.Value))
            {
                throw new Exception("The provided message does not have a value");
            }

            return true;
        }
    }
}