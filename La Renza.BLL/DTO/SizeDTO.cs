﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.DTO
{
    public class SizeDTO
    {
        public int Id {  get; set; }
        public int? CategoryId {  get; set; }
        public string Name { get; set; }

        public CategoryDTO Category { get; set; }
    }
}
