using IMS.Application.DTOs.ManageUser;
using IMS.Application.Interfaces;
using IMS.Application.Interfaces.Repositories;
using IMS.Application.Interfaces.Services;
using IMS.Domain.Common;
using IMS.Domain.Entities;
using IMS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserRepository _userRepo;
        private readonly IEmailService _emailService;
        private readonly AppDbContext _context;

        public UserService
        (
            UserManager<AppUser> userManager,
            AppDbContext context,
            IUserRepository userRepo,
            IEmailService emailService
        )
        {
            _userManager = userManager;
            _context = context;
            _userRepo = userRepo;
            _emailService = emailService;
        }

        public async Task<ServiceResult> CreateInternAsync(
            CreateInternRequest request, 
            string baseUrl, 
            CancellationToken cancellationToken)
        {
            using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

            try
            {
                var user = await CreateUserAsync(request);

                var intern = new Intern
                {
                    UserId = user.Id,
                    ProgramTrackId = request.PositionId,
                    Status = Domain.Enums.InternStatus.Unactivated
                };

                await _userRepo.CreateInternAsync(intern);
                await _userRepo.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync();

                await SendMailToSetPasswordAsync(baseUrl, user);

                return ServiceResult.Ok("Tạo intern thành công");

            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                return ServiceResult.Fail(ex.Message);

            }
        }

        public async Task<ServiceResult> CreateMentorAsync(CreateMentorRequest request, string baseUrl)
        {
            var mentor = await CreateUserAsync(request);

            await SendMailToSetPasswordAsync(baseUrl, mentor);

            return ServiceResult.Ok("Tạo mentor thành công");

        }

        public async Task<IList<MentorResponse>> GetAllMentorsAsync()
        {
            var mentors = await _userManager.GetUsersInRoleAsync("Mentor");

            return mentors
                .Select(m => new MentorResponse
                {
                    Id = m.Id,
                    FullName = m.FullName,
                    Email = m.Email
                }).ToList();
        }

        public async Task<Intern?> GetInternByIdAsync(string userId)
        {
            return await _userRepo.GetInternByIdAsync(userId);
        }

        private async Task<AppUser> CreateUserAsync(CreateUserRequest request)
        {
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
                throw new InvalidOperationException("Email đã tồn tại.");

            var user = new AppUser
            {
                UserName = request.Email,
                Email = request.Email,
                FullName = request.FullName,
                EmailConfirmed = false,
            };

            var result = await _userManager.CreateAsync(user);

            if (!result.Succeeded)
                throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(user, request.Role);

            return user;
        }

        private async Task SendMailToSetPasswordAsync(string baseUrl, AppUser user)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var encodedToken = WebEncoders.Base64UrlEncode(
            Encoding.UTF8.GetBytes(token));

            // Build link
            var link = $"{baseUrl}/api/User/SetPassword" +
                       $"?userId={user.Id}&token={encodedToken}";

            // Email content
            var body = $@"
                    <h3>Xin chào</h3>
                    <p>Tài khoản của bạn đã được tạo</p>
                    <p>Click để đặt mật khẩu:</p>
                    <a href='{link}'>Kích hoạt tài khoản</a>";
            var subject = "KÍCH HOẠT TÀI KHOẢN";

            await _emailService.SendMailAsync(user.Email, subject, body);
        }
    }
}
