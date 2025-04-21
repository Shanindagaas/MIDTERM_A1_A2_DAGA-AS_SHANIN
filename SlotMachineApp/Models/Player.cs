using System;
using System.ComponentModel.DataAnnotations;

namespace SlotMachineApp.Models
{
    public class Player
    {
        [Key]
        public string StudentNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName => $"{FirstName} {LastName}";
    }
}