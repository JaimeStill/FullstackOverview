using System.Collections.Generic;
using System.Threading.Tasks;
using FullstackOverview.Data;
using FullstackOverview.Data.Entities;
using FullstackOverview.Data.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace FullstackOverview.Web.Controllers
{
    [Route("api/[controller]")]
    public class IdentityController : Controller
    {
        private AppDbContext db;

        public IdentityController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action]")]
        public bool CheckAuthentication() => HttpContext.User == null ? false : HttpContext.User.Identity.IsAuthenticated;

        [HttpGet("[action]")]
        public User GetUser() => HttpContext.User.CastToUser();

        [HttpGet("[action]")]
        public async Task<User> SyncUser() => await db.SyncUser(HttpContext.User.CastToUser());

        [HttpGet("[action]")]
        public async Task<List<User>> GetUsers() => await db.GetUsers();

        [HttpGet("[action]/{search}")]
        public async Task<List<User>> SearchUsers([FromRoute]string search) => await db.SearchUsers(search);

        [HttpGet("[action]/{id}")]
        public async Task<User> GetUser([FromRoute]int id) => await db.GetUser(id);

        [HttpGet("[action]/{token}")]
        public async Task<User> GetUserByToken([FromRoute]string token) => await db.GetUser(token);

        [HttpPost("[action]")]
        public async Task<bool> ValidateUsername([FromBody]User user) => await db.ValidateUsername(user);

        [HttpPost("[action]")]
        public async Task UpdateUser([FromBody]User user) => await db.UpdateUser(user);
    }
}