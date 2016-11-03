<?php

namespace App\Repositories;

use Illuminate\Support\Facades\Cache;

abstract class BaseRepository{

    private static $instances = [];

    public final static function instance() {
        if(!array_key_exists(static::class, self::$instances)){
            self::$instances[static::class] = new static;
        }
        return self::$instances[static::class];
    }

    public final function getInstances(){
        return self::$instances;
    }

    protected function getCacheTags($group, $key){
        return Cache::tags([$group, $key]);
    }

    abstract public function isById($id);

    abstract public function addById($id);

    abstract public function getByIds(array $ids);

    abstract public function addByIds(array $ids);

    abstract public function getById($id);

}