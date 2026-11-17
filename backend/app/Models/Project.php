<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'category',
        'subtitle',
        'image_url',
        'link',
        'demo_type',
        'demo_url',
        'badge_label',
        'tech_stack',
        'blueprint_theme',
        'year',
        'sort_order',
        'is_featured',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'sort_order'  => 'integer',
    ];
}
