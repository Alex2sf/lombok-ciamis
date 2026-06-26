<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'key',
        'label',
        'region',
        'hero_tagline',
        'accent_color',
        'accent_text_color',
        'wa_message',
        'spots',
        'itinerary',
        'packages'
    ];

    protected $casts = [
        'spots' => 'array',
        'itinerary' => 'array',
        'packages' => 'array'
    ];
}
