<?php

namespace App\Models\VK\Animals;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class AnimalsLevel extends Model
{
    protected $table = 'vk_animals_levels';

    public function add(array $arr)
    {
        return $this->db()->insert($arr);
    }

    public function getLevels(array $field = ['*'])
    {
        return $this->db()->select($field)->get();
    }

    public function getLevelById($levelId, array $field = ['*'])
    {
        return $this->db()->where('level_id', $levelId)->first($field);
    }

    private function db()
    {
        return DB::table($this->table);
    }
}
