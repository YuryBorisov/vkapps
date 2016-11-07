<?php

namespace App\Models\VK\Animals;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class AnimalsUsers extends Model
{
    protected $table = 'vk_animals_users';

    public function incrementCountAnimals($vkId, $inc = 1)
    {
        return $this->inc($vkId, 'count_animals', $inc);
    }

    public function incrementLevel($vkId, $inc = 1)
    {
        return $this->inc($vkId, 'level', $inc);
    }

    private function inc($vkId, $fields, $inc)
    {
        return $this->db()->where('vk_id', $vkId)->increment($fields, $inc);
    }

    public function add(array $arr)
    {
        return $this->db()->insert($arr);
    }

    public function getUser($vkId, array $fields = ['*'])
    {
        return $this->db()->where('vk_id', $vkId)->first($fields);
    }

    public function getUsersIds(array $vkIds, $skip = 0, $limit = 1, $orderBy = 'asc', array $fields = ['*'])
    {
        return $this->db()->select($fields)->whereIn('vk_id', $vkIds)->skip($skip)->limit($limit)->orderBy('count_animals', $orderBy)->get();
    }

    public function getUsers($skip = 0, $limit = 1, $orderBy = 'asc', array $fields = ['*'])
    {
        return $this->db()->select($fields)->orderBy('count_animals', $orderBy)->skip($skip)->limit($limit)->get();
    }

    private function db()
    {
        return DB::table($this->table);
    }

}
