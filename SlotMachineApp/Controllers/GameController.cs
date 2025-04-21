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
    public class GameController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GameController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/game?startDate=2023-01-01&endDate=2023-12-31
        [HttpGet]
        public async Task<IActionResult> GetGames([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var query = _context.GameResults.AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(g => g.DatePlayed >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(g => g.DatePlayed <= endDate.Value.AddDays(1));
            }

            var results = await query
                .OrderByDescending(g => g.DatePlayed)
                .ToListAsync();

            return Ok(results);
        }

        // GET: api/game/winners?startDate=2023-01-01&endDate=2023-12-31
        [HttpGet("winners")]
        public async Task<IActionResult> GetWinners([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var query = _context.GameResults
                .Where(g => g.Outcome == "Win");

            if (startDate.HasValue)
            {
                query = query.Where(g => g.DatePlayed >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(g => g.DatePlayed <= endDate.Value.AddDays(1));
            }

            var winners = await query
                .OrderByDescending(g => g.DatePlayed)
                .ToListAsync();

            return Ok(winners);
        }

        // POST: api/game/save
        [HttpPost("save")]
        public async Task<IActionResult> SaveGame(GameResult gameResult)
        {
            if (string.IsNullOrEmpty(gameResult.StudentNumber))
            {
                return BadRequest(new { message = "Student number is required" });
            }

            // Validate that the player exists
            var player = await _context.Players.FindAsync(gameResult.StudentNumber);
            if (player == null)
            {
                return BadRequest(new { message = "Student not found" });
            }

            // Set the date if not provided
            if (gameResult.DatePlayed == default)
            {
                gameResult.DatePlayed = DateTime.UtcNow;
            }

            _context.GameResults.Add(gameResult);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Game result saved successfully" });
        }
    }
}