using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using FullstackOverview.Core.Extensions;
using FullstackOverview.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace FullstackOverview.Data.Extensions
{
    public static class UserExtensions
    {
        public static User CastToUser(this ClaimsPrincipal principal)
        {
            var user = new User
            {
                Token = principal.Claims.FirstOrDefault(x => x.Type.Contains("nameidentifier")).Value,
                Email = principal.Claims.FirstOrDefault(x => x.Type.Contains("email")).Value,
                Username = principal.Claims.FirstOrDefault(x => x.Type.EndsWith("/name")).Value.UrlEncode()
            };

            return user;
        }

        public static async Task<User> SyncUser(this AppDbContext db, User user)
        {
            var u = await db.Users.FirstOrDefaultAsync(x => x.Token == user.Token);

            if (u == null)
            {
                u = await db.AddUser(user);
            }

            return u;
        }

        public static async Task<List<User>> GetUsers(this AppDbContext db)
        {
            var users = await db.Users
                .OrderBy(x => x.Username)
                .ToListAsync();

            return users;
        }

        public static async Task<List<User>> SearchUsers(this AppDbContext db, string search)
        {
            search = search.ToLower();

            var users = await db.Users
                .Where(x =>
                    x.Email.ToLower().Contains(search) ||
                    x.Token.ToLower().Contains(search) ||
                    x.Username.ToLower().Contains(search)
                )
                .OrderBy(x => x.Username)
                .ToListAsync();

            return users;
        }

        public static async Task<User> GetUser(this AppDbContext db, int id)
        {
            var user = await db.Users.FindAsync(id);
            return user;
        }

        public static async Task<User> GetUser(this AppDbContext db, string username)
        {
            var user = await db.Users.FirstOrDefaultAsync(x => x.Username == username);
            return user;
        }

        public static async Task<bool> ValidateUsername(this AppDbContext db, User user)
        {
            user.Username = user.Username.UrlEncode();

            var check = await db.Users
                .Where(x => x.Token != user.Token)
                .FirstOrDefaultAsync(x => x.Username.ToLower() == user.Username.ToLower());

            return check == null;
        }

        public static async Task UpdateUser(this AppDbContext db, User user)
        {
            if (await db.ValidateUsername(user))
            {
                db.Users.Update(user);
                await db.SaveChangesAsync();
            }
            else
            {
                throw new Exception("The provided username is already in use");
            }
        }

        private static async Task<User> AddUser(this AppDbContext db, User user)
        {
            user.Username = user.Username.UrlEncode();
            await user.GenerateUniqueUsername(db);
            user.Sidepanel = "thin";
            user.Theme = "dark-green";
            await db.Users.AddAsync(user);
            await db.SaveChangesAsync();
            return user;
        }

        private static async Task GenerateUniqueUsername(this User user, AppDbContext db, int inc = 0)
        {
            var name = user.Username;

            var check = await db.Users
                .Where(x => x.Token != user.Token)
                .FirstOrDefaultAsync(x => x.Username == name);

            if (check != null)
            {
                ++inc;
                user.Username = $"{name}_{inc}";
                await user.GenerateUniqueUsername(db, inc);
            }
        }
    }
}