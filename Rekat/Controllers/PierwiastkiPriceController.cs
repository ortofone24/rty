using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rekat.Data;
using Rekat.Models;

namespace Rekat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PierwiastkiPriceController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
                
        public PierwiastkiPriceController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET: api/<controller>
        [HttpGet("[action]")]
        [Authorize(Policy = "RequiredAdministratorRole")]
        public IActionResult GetPrice()
        {
            return Ok(_db.CenyPierwiastkow.ToList());
        }

        [HttpPost("[action]")]
        [Authorize(Policy = "RequiredAdministratorRole")]
        public async Task<IActionResult> AddPrice([FromBody] PierwiastkiPriceModel formdata)
        {
            var findId = _db.CenyPierwiastkow.FirstOrDefault(p => p.PriceId == 1);

            findId.PalladPrice = formdata.PalladPrice;
            findId.PlatynaPrice = formdata.PlatynaPrice;
            findId.RodPrice = formdata.RodPrice;
                        
            _db.Entry(findId).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok();
        }
        
    }
}