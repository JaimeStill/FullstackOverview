using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace FullstackOverview.Auth
{
    public static class AuthenticationExtensions
    {
        public static void AddAuthProviders(this IServiceCollection services, string appId, string password)
        {
            services.AddAuthentication(auth =>
            {
                auth.DefaultChallengeScheme = MicrosoftAccountDefaults.AuthenticationScheme;
                auth.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                auth.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
            .AddCookie()
            .AddMicrosoftAccount(options =>
            {
                options.ClientId = appId;
                options.ClientSecret = password;
                options.Events = new Microsoft.AspNetCore.Authentication.OAuth.OAuthEvents
                {
                    OnRemoteFailure = OnAuthenticationFailed                    
                };
            });
        }

        public static async Task MicrosoftLogin(this HttpContext context)
        {
            if (context.User == null || !context.User.Identity.IsAuthenticated)
            {
                await context.ChallengeAsync(MicrosoftAccountDefaults.AuthenticationScheme, new AuthenticationProperties { RedirectUri = "/" });
            }
        }

        public static async Task MicrosoftLogout(this HttpContext context)
        {
            if (context.User != null && context.User.Identity.IsAuthenticated)
            {
                await context.SignOutAsync();
                context.Response.Redirect("/");
            }
        }

        private static Task OnAuthenticationFailed(RemoteFailureContext context) => Task.Run(() =>
        {
            context.HandleResponse();
            context.Response.Redirect($"/Error?message={context.Failure.Message}");
        });
    }
}