﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.DAL.Entities
{
    public class Model
    {
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string MaterialInfo { get; set; }
        public DateOnly StartDate { get; set; }

        public double Rate { get; set; }
        public string Bage { get; set; }
        public Product? Product { get; set; }

    }
}
