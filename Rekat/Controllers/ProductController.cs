using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rekat.Data;
using Rekat.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Collections.Generic;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Rekat.Controllers
{
    [Route("api/[controller]")]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _db;

        private readonly IHostingEnvironment _env;

        private readonly IHttpContextAccessor _accessor;

        public ProductController(ApplicationDbContext db, IHostingEnvironment env, IHttpContextAccessor accessor)
        {
            _db = db;
            _env = env;
            _accessor = accessor;
        }

        // GET: api/<controller>
        [HttpGet("[action]")]
        [Authorize(Policy = "RequiredLoggedIn")]
        public IActionResult GetProducts()
        {
            return Ok(_db.Products.ToList());
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> UploadImage()
        {
            string imageName = null;
            string url = "http://www.rekat.pl/pictureskat/";
            var httpRequest = _accessor.HttpContext.Request;
            var webRoot = _env.WebRootPath;
            var findTempImage = _db.ImagesTempUrl.FirstOrDefault(p => p.ImageId == 1);

            //Upload Image
            var postedFile = httpRequest.Form.Files["Image"];

            //Create Custom filename
            imageName = new String(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(5).ToArray()).Replace(" ", "-");
            imageName += DateTime.Now.ToString("yymmssfff") + Path.GetExtension(postedFile.FileName);

            var filePath = Path.Combine(webRoot + "\\" + "picturesKat\\" + imageName);
            var fileToDisplayPath = Path.Combine(url, imageName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await postedFile.CopyToAsync(stream);
            };

            var image = new ImageModel()
            {
                ImageTempUrl = fileToDisplayPath
            };

            //findTempImage.ImageId = image.ImageId;
            findTempImage.ImageTempUrl = image.ImageTempUrl;

            _db.Entry(findTempImage).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok(100);
        }


        public List<double> GetActualPrices()
        {
            var list = new List<double>();
            var dbItems = _db.CenyPierwiastkow.FirstOrDefault(p => p.PriceId == 1);

            list.Add(dbItems.PlatynaPrice);      //0
            list.Add(dbItems.PalladPrice);       //1
            list.Add(dbItems.RodPrice);          //2
            list.Add(dbItems.EuroExchangeRate);  //3

            return list;
        }

        [HttpPost("[action]")]
        [Authorize(Policy = "RequiredAdministratorRole")]
        public async Task<IActionResult> AddProduct([FromBody] ProductModel formdata)
        {
            var findTempImage2 = _db.ImagesTempUrl.FirstOrDefault(p => p.ImageId == 1);
            string imageUrl = findTempImage2.ImageTempUrl;

            var newproduct = new ProductModel
            {
                ImageUrl = imageUrl,
                KatNumber = formdata.KatNumber,
                PlatynaWeight = formdata.PlatynaWeight,
                PalladWeight = formdata.PalladWeight,
                RodWeight = formdata.RodWeight,
                KatWeigthPerKg = formdata.KatWeigthPerKg,
                KatPrice = ((GetActualPrices().ElementAt(0) * (double)formdata.PlatynaWeight) +
                          (GetActualPrices().ElementAt(1) * (double)formdata.PalladWeight) +
                           (GetActualPrices().ElementAt(2) * (double)formdata.RodWeight)) * (double)formdata.KatWeigthPerKg,
                KatPricePLN = (((GetActualPrices().ElementAt(0) * (double)formdata.PlatynaWeight) +
                           (GetActualPrices().ElementAt(1) * (double)formdata.PalladWeight) +
                           (GetActualPrices().ElementAt(2) * (double)formdata.RodWeight)) * (double)formdata.KatWeigthPerKg) * GetActualPrices().ElementAt(3),
            };

            await _db.Products.AddAsync(newproduct);
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("Dodałeś nowy produkt"));
        }

        // api/product/1
        [HttpPut("[action]/{id}")]
        [Authorize(Policy = "RequiredAdministratorRole")]
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
            findProduct.KatWeigthPerKg = formdata.KatWeigthPerKg;
            findProduct.KatPrice = ((GetActualPrices().ElementAt(0) * (double)formdata.PlatynaWeight) +
                         (GetActualPrices().ElementAt(1) * (double)formdata.PalladWeight) +
                          (GetActualPrices().ElementAt(2) * (double)formdata.RodWeight)) * (double)formdata.KatWeigthPerKg;
            findProduct.KatPricePLN = (((GetActualPrices().ElementAt(0) * (double)formdata.PlatynaWeight) +
                           (GetActualPrices().ElementAt(1) * (double)formdata.PalladWeight) +
                           (GetActualPrices().ElementAt(2) * (double)formdata.RodWeight)) * (double)formdata.KatWeigthPerKg) * GetActualPrices().ElementAt(3);


            _db.Entry(findProduct).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("Katalizator o id " + id + " został zaktualizowany"));
        }

        [HttpPost("[action]")]
        [Authorize(Policy = "RequiredAdministratorRole")]
        public async Task<IActionResult> UpdateProductPrice()
        {
            var products = _db.Products.ToList();

            var course = GetActualPrices().ElementAt(3);

            foreach (var prod in products)
            {
                var newPrice = prod.KatPrice * course;
                prod.KatPricePLN = newPrice;
                _db.Entry(prod).State = EntityState.Modified;
            }

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("Zaktualizowales ceny"));
        }



        [HttpDelete("[action]/{id}")]
        [Authorize(Policy = "RequiredAdministratorRole")]
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
