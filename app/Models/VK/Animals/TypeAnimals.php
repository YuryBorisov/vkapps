<?php

namespace App\Models\VK\Animals;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class TypeAnimals extends Model
{
    protected $table = 'vk_type_animals';

    public function getTypes(array $field = ['*'])
    {
        return $this->db()->select($field)->get();
    }

    public function add(array $arr)
    {
        return $this->db()->insert($arr);
    }

    private function db()
    {
        return DB::table($this->table);
    }
}
