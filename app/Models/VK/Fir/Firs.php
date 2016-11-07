<?php

namespace App\Models\VK\Fir;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Firs extends Model
{

    protected $table = 'vk_firs';

    public function add(array $arr)
    {
        return $this->db()->insert($arr);
    }

    public function getCountUsersFirByDate($date, $skip, $limit)
    {
        return $this->db()->select('vk_id', DB::raw('count(*) as count_firs'))
            ->whereBetween('create', [$date . ' 00:00:00', $date. ' 23:59:00'])
            ->groupBy('vk_id')->orderBy('count_firs', 'desc')->skip($skip)->limit($limit)->get();
    }

    private function db()
    {
        return DB::table($this->table);
    }

}
