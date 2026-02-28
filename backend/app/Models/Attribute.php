<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Attribute extends Model {
    protected $fillable = ['character_id', 'name', 'value'];
    public function character() { return $this->belongsTo(Character::class); }
}
