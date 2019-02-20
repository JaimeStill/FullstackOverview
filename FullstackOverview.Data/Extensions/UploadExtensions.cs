using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using FullstackOverview.Core.Extensions;
using FullstackOverview.Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace FullstackOverview.Data.Extensions
{
    public static class UploadExtensions
    {
        public static async Task<List<Upload>> GetUserUploads(this AppDbContext db, int userId)
        {
            var uploads = await db.Uploads
                .Where(x => x.UserId == userId)
                .OrderBy(x => x.Name)
                .ToListAsync();

            return uploads;
        }

        public static async Task<List<Upload>> SearchUploads(this AppDbContext db, string search)
        {
            search = search.ToLower();

            var uploads = await db.Uploads
                .Where(x => 
                    x.File.ToLower().Contains(search) ||
                    x.Name.ToLower().Contains(search)
                )
                .OrderBy(x => x.Name)
                .ToListAsync();

            return uploads;
        }

        public static async Task<List<Upload>> SearchUserUploads(this AppDbContext db, string search, int userId)
        {
            search = search.ToLower();

            var uploads = await db.Uploads
                .Where(x => x.UserId == userId)
                .Where(x =>
                    x.File.ToLower().Contains(search) ||
                    x.Name.ToLower().Contains(search)
                )
                .OrderBy(x => x.Name)
                .ToListAsync();

            return uploads;
        }

        public static async Task<Upload> GetUpload(this AppDbContext db, int id)
        {
            var upload = await db.Uploads.FindAsync(id);
            return upload;
        }

        public static async Task<List<Upload>> UploadFiles(this AppDbContext db, IFormFileCollection files, string path, string url, int userId)
        {
            var uploads = new List<Upload>();

            foreach (var file in files)
            {
                uploads.Add(await db.AddUpload(file, path, url, userId));
            }

            return uploads;
        }

        public static async Task<Upload> UploadFile(this AppDbContext db, IFormFile file, string path, string url, int id)
        {
            var upload = await db.AddUpload(file, path, url, id);
            return upload;
        }

        public static async Task DeleteUpload(this AppDbContext db, Upload upload)
        {
            var messages = await db.ChannelMessages
                .Where(x => 
                    x.IsUpload &&
                    x.UploadId == upload.Id
                )
                .ToListAsync();

            db.ChannelMessages.RemoveRange(messages);
            await db.SaveChangesAsync();

            await upload.DeleteFile();
            db.Uploads.Remove(upload);
            await db.SaveChangesAsync();
        }

        static async Task<Upload> AddUpload(this AppDbContext db, IFormFile file, string path, string url, int userId)
        {
            var upload = await file.WriteFile(path, url);
            upload.UserId = userId;
            upload.UploadDate = DateTime.Now;
            await db.Uploads.AddAsync(upload);
            await db.SaveChangesAsync();
            return upload;
        }

        static async Task<Upload> WriteFile(this IFormFile file, string path, string url)
        {
            if (!(Directory.Exists(path)))
            {
                Directory.CreateDirectory(path);
            }

            var upload = await file.CreateUpload(path, url);

            using (var stream = new FileStream(upload.Path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return upload;
        }

        static Task<Upload> CreateUpload(this IFormFile file, string path, string url) => Task.Run(() =>
        {
            var name = file.CreateSafeName(path);

            var upload = new Upload
            {
                File = name,
                Name = file.Name,
                Path = $"{path}{name}",
                Url = $"{url}{name}"
            };

            return upload;
        });

        static string CreateSafeName(this IFormFile file, string path)
        {
            var increment = 0;
            var fileName = file.FileName.UrlEncode();
            var newName = fileName;

            while (File.Exists(path + newName))
            {
                var extension = fileName.Split('.').Last();
                newName = $"{fileName.Replace($".{extension}", "")}_{++increment}.{extension}";
            }

            return newName;
        }

        static Task DeleteFile(this Upload upload) => Task.Run(() =>
        {
            try
            {
                if (File.Exists(upload.Path))
                {
                    File.Delete(upload.Path);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.GetExceptionChain());
            }
        });
    }
}