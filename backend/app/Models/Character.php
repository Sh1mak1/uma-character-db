<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Character extends Model {
    protected $fillable = ['name'];
    public function attributes() { return $this->hasMany(Attribute::class); }
    public function skills() { return $this->belongsToMany(Skill::class, 'character_skill'); }
    protected $with = ['attributes', 'skills'];
}
