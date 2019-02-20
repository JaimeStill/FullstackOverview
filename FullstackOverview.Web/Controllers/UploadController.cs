using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FullstackOverview.Core.Infrastructure;
using FullstackOverview.Data;
using FullstackOverview.Data.Entities;
using FullstackOverview.Data.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace FullstackOverview.Web.Controllers
{
    [Route("api/[controller]")]
    public class UploadController : Controller
    {
        public AppDbContext db;
        public UploadConfig config;

        public UploadController(AppDbContext db, UploadConfig config)
        {
            this.db = db;
            this.config = config;
        }

        [HttpGet("[action]/{id}")]
        public async Task<List<Upload>> GetUserUploads([FromRoute]int id) => await db.GetUserUploads(id);

        [HttpGet("[action]/{search}")]
        public async Task<List<Upload>> SearchUploads([FromRoute]string search) => await db.SearchUploads(search);

        [HttpGet("[action]/{id}")]
        public async Task<Upload> GetUpload([FromRoute]int id) => await db.GetUpload(id);

        [HttpPost("[action]/{id}")]
        [DisableRequestSizeLimit]
        public async Task<List<Upload>> UploadFiles([FromRoute]int id)
        {
            var files = Request.Form.Files;

            if (files.Count < 1)
            {
                throw new Exception("No files provided for upload");
            }

            return await db.UploadFiles(files, config.DirectoryBasePath, config.UrlBasePath, id);
        }

        [HttpPost("[action]/{id}")]
        public async Task<Upload> UploadFile([FromRoute]int id)
        {
            var file = Request.Form.Files.FirstOrDefault();

            if (file == null)
            {
                throw new Exception("No file provided for upload");
            }

            return await db.UploadFile(file, config.DirectoryBasePath, config.UrlBasePath, id);
        }

        [HttpPost("[action]")]
        public async Task DeleteUpload([FromBody]Upload upload) => await db.DeleteUpload(upload);
    }
}