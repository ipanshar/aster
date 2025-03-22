<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExchangeRate extends Model
{
    protected $fillable = ['currency_code', 'rate', 'date', 'markup_percentage', 'final_rate'];
}
