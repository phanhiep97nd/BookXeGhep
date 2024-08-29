using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(BookingCarService.Startup))]
namespace BookingCarService
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}
