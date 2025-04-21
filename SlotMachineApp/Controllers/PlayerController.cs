using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SlotMachineApp.Data;
using SlotMachineApp.Models;

namespace SlotMachineAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PlayerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/player/validate?studentNumber=C12345
        [HttpGet("validate")]
        public async Task<IActionResult> ValidatePlayer(string studentNumber)
        {
            if (string.IsNullOrEmpty(studentNumber) || !studentNumber.StartsWith("C") || !studentNumber.Substring(1).All(char.IsDigit))
            {
                return BadRequest(new { valid = false, message = "Invalid student number format" });
            }

            var player = await _context.Players.FindAsync(studentNumber);
            if (player == null)
            {
                return NotFound(new { valid = false, message = "Student not found" });
            }

            return Ok(new { valid = true, name = player.FullName });
        }

        // GET: api/player/recent
        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentPlayers()
        {
            var threeHoursAgo = DateTime.UtcNow.AddHours(-3);
            var recentPlayers = await _context.GameResults
                .Where(g => g.DatePlayed >= threeHoursAgo)
                .Select(g => new { g.StudentNumber, g.StudentName, g.DatePlayed })
                .ToListAsync();

            return Ok(recentPlayers);
        }

        // POST: api/player/register
        [HttpPost("register")]
        public async Task<IActionResult> RegisterPlayer(Player player)
        {
            if (string.IsNullOrEmpty(player.StudentNumber) || !player.StudentNumber.StartsWith("C") || !player.StudentNumber.Substring(1).All(char.IsDigit))
            {
                return BadRequest(new { message = "Invalid student number format" });
            }

            var existingPlayer = await _context.Players.FindAsync(player.StudentNumber);
            if (existingPlayer != null)
            {
                return BadRequest(new { message = "Student already registered" });
            }

            _context.Players.Add(player);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Student registered successfully" });
        }
    }
}