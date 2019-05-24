using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rekat.Data;
using Rekat.Models;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Rekat.Controllers
{
    [Route("api/[controller]")]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _db;

        public ProductController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET: api/<controller>
        [HttpGet("[action]")]
        [Authorize(Policy = "RequiredLoggedIn")]
        public IActionResult GetProducts()
        {
            return Ok(_db.Products.ToList());
        }

        [HttpPost("[action]")]
        [Authorize(Policy = "RequiredAdministratorRole")]
        public async Task<IActionResult> AddProduct([FromBody] ProductModel formdata)
        {
            var newproduct = new ProductModel
            {
                ImageUrl = formdata.ImageUrl,
                KatNumber = formdata.KatNumber,
                PlatynaWeight = formdata.PlatynaWeight,
                PalladWeight = formdata.PalladWeight,
                RodWeight = formdata.RodWeight,
                KatPrice = formdata.KatPrice,
                KatWeigthPerKg = formdata.KatWeigthPerKg
            };

            await _db.Products.AddAsync(newproduct);
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("Dodałeś nowy produkt"));
        }

        // api/product/1
        [HttpPut("[action]/{id}")]
        //[Authorize(Policy = "RequiredAdministratorRole")]
        public async Task<IActionResult> UpdateProduct([FromRoute] int id, [FromBody] ProductModel formdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findProduct = _db.Products.FirstOrDefault(p => p.KatId == id);

            if (findProduct == null)
            {
                return NotFound();
            }

            // If the product was found
            findProduct.KatNumber = formdata.KatNumber;
            findProduct.ImageUrl = formdata.ImageUrl;
            findProduct.PlatynaWeight = formdata.PlatynaWeight;
            findProduct.PalladWeight = formdata.PalladWeight;
            findProduct.RodWeight = formdata.RodWeight;
            findProduct.KatPrice = formdata.KatPrice;
            findProduct.KatWeigthPerKg = formdata.KatWeigthPerKg;

            _db.Entry(findProduct).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("Katalizator o id " + id + " został zaktualizowany"));
        }

        [HttpDelete("[action]/{id}")]
        //[Authorize(Policy = "RequiredAdministratorRole")]
        public async Task<IActionResult> DeleteProduct([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //find the product
            var findProduct = await _db.Products.FindAsync(id);

            if (findProduct == null)
            {
                return NotFound();
            }

            _db.Products.Remove(findProduct);

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("Katalizator o id " + id + " został usunięty"));
        }

    }
}
