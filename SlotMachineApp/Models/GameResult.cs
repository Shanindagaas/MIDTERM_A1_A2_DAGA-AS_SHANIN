using System;
using System.ComponentModel.DataAnnotations;

namespace SlotMachineApp.Models
{
    public class GameResult
    {
        [Key]
        public int Id { get; set; }
        public string StudentNumber { get; set; }
        public string StudentName { get; set; }
        public string Outcome { get; set; }
        public DateTime DatePlayed { get; set; }

        // Navigation property
        public Player Player { get; set; }
    }
}