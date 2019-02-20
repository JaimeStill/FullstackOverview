using System.Threading.Tasks;
using FullstackOverview.Auth;
using Microsoft.AspNetCore.Mvc;

namespace FullstackOverview.Web.Controllers
{
    public class AuthController : Controller
    {
        [HttpGet]
        public async Task Login() => await HttpContext.MicrosoftLogin();

        [HttpGet]
        public async Task Logout() => await HttpContext.MicrosoftLogout();
    }
}