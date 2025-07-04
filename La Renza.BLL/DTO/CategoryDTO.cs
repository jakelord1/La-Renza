﻿using La_Renza.BLL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.DTO
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int? ParentCategoryId { get; set; }
        public int? ImageId { get; set; }
        public bool IsGlobal { get; set; }
        public ImageDTO Image { get; set; }
        public ICollection<SizeBase> Sizes { get; set; }
        public ICollection<ModelBase> Models { get; set; }

    }
}
