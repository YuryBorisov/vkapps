<?php

namespace App\Models\VK\Animals;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CaughtAnimalsUser extends Model
{

    protected $table = 'vk_caught_animals_users';

    public function add(array $arr){
        return $this->db()->insert($arr);
    }

    public function getCountUsersFirByDate($date, $skip, $limit){
        return $this->db()->select('vk_id', DB::raw('count(*) as count_animals'))
            ->whereBetween('create', [$date . ' 00:00:00', $date. ' 23:59:00'])
            ->groupBy('vk_id')->orderBy('count_animals', 'desc')->skip($skip)->limit($limit)->get();
    }

    private function db(){
        return DB::table($this->table);
    }
}
