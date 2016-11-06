<?php

namespace App\Models\VK\Fir;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class FirUsers extends Model
{
    protected $table = 'vk_fir_users';

    public function add(array $arr){
        return $this->db()->insert($arr);
    }

    public function getUser($vkId, array $field = ['*']){
        return $this->db()->where('vk_id', $vkId)->first($field);
    }

    public function incrementCountFirs($vkId){
        return $this->db()->where('vk_id', $vkId)->limit(1)->increment('count_firs');
    }

    public function getUsers($skip = 0, $limit = 1, $orderBy = 'asc', array $field = ['*']){
        return $this->db()->select($field)->skip($skip)->limit($limit)->orderBy('count_firs', $orderBy)->get();
    }

    public function getUsersIds(array $vkIds, $skip = 0, $limit = 1, $orderBy = 'asc', array $field = ['*']){
        return $this->db()->select($field)->whereIn('vk_id', $vkIds)->skip($skip)->limit($limit)->orderBy('count_firs', $orderBy)->get();
    }

    private function db(){
        return DB::table($this->table);
    }
}