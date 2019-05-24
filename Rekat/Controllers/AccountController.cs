using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Rekat.Helpers;
using Rekat.Models;



// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Rekat.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;

        private readonly SignInManager<IdentityUser> _signInManager;

        private readonly AppSettings _appSettings;

        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IOptions<AppSettings> appSettings)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _appSettings = appSettings.Value;
        }

        // wywołanie www.example.com/api/account/register
        [HttpPost("[action]")]
        public async Task<IActionResult> Register([FromBody]RegisterViewModel formdata)
        {
            // Will hold all the errors related to registration
            List<string> errorList = new List<string>();

            var user = new IdentityUser
            {
                Email = formdata.Email,
                UserName = formdata.Username,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, formdata.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Customer");

                // Sending Confirmation Email
                //var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                //var callbackUrl = Url.Action("ConfirmEmail", "Account", new { UserId = user.Id, Code = code }, protocol: HttpContext.Request.Scheme);

                //await _emailsender.SendEmailAsync(user.Email, "mhg3d - confirm your email", "Potwierdź swój email klikając w link: <a href=\"" + callbackUrl + "\">click here</a>");

                return Ok(new { username = user.UserName, email = user.Email, status = 1, message = "Rejestracja zakończona pomyślnie" });
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                    errorList.Add(error.Description);
                }
            }
            return BadRequest(new JsonResult(errorList));
        }

        // Login Method
        [HttpPost("[action]")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel formdata)
        {
            // Get the User from Database
            var user = await _userManager.FindByNameAsync(formdata.Username);

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_appSettings.Secret));

            double tokenExpiryTime = Convert.ToDouble(_appSettings.ExpireTime);

            if (user != null && await _userManager.CheckPasswordAsync(user, formdata.Password))
            {
                // then check if email is confirmed

                if (!await _userManager.IsEmailConfirmedAsync(user))
                {
                    ModelState.AddModelError(string.Empty, "Uzytkownik nie potwierdzil email'a");

                    return Unauthorized(new { LoginError = "Zakoncz rejestracje potwierdzajac email" });
                }

                var roles = await _userManager.GetRolesAsync(user);

                var tokenHandler = new JwtSecurityTokenHandler();

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, formdata.Username),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim(ClaimTypes.Role, roles.FirstOrDefault()),
                        new Claim("LoggedOn", DateTime.Now.ToString())
                    }),

                    SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),
                    Issuer = _appSettings.Site,
                    Audience = _appSettings.Audience,
                    Expires = DateTime.UtcNow.AddMinutes(tokenExpiryTime)
                };

                // Generate Token
                var token = tokenHandler.CreateToken(tokenDescriptor);

                return Ok(new { token = tokenHandler.WriteToken(token), expiration = token.ValidTo, username = user.UserName, userRole = roles.FirstOrDefault() });
            }

            // return error
            ModelState.AddModelError("", "Użytkownik lub Hasło nie zostało znalezione");
            return Unauthorized(new { LoginError = "Proszę sprawdzić podany login lub hasło" });
        }
    }
}
